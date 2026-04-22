(function () {
    const JSON_URL = "/assets/cards.json";
    const MOBILE_BREAKPOINT = 640;

    const highlightsRoot = document.querySelector(".highlights");
    const viewport = document.querySelector(".highlights-viewport");
    const track = document.getElementById("highlights-track");
    const dotsContainer = document.getElementById("highlights-dots");
    const prevBtn = document.querySelector(".highlights-prev");
    const nextBtn = document.querySelector(".highlights-next");

    if (!highlightsRoot || !viewport || !track || !dotsContainer || !prevBtn || !nextBtn) {
        return;
    }

    // Inline renderer that supports:
    //   `code`             -> <code>code</code>
    //   [text](url)        -> <a href="url">text</a>  (same-page anchors open <details> on click)
    // Emits into the given parent element; text nodes for everything else.
    const INLINE_PATTERN = /(`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
    const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

    const openDetailsAncestors = (el) => {
        let cur = el;
        while (cur && cur !== document.body) {
            if (cur.tagName === "DETAILS" && !cur.open) {
                cur.open = true;
            }
            cur = cur.parentElement;
        }
    };

    const openDetailsForHash = (hash) => {
        if (!hash || hash === "#") return;
        let target = null;
        try {
            target = document.querySelector(hash);
        } catch (_) {
            return;
        }
        if (target) {
            openDetailsAncestors(target);
        }
    };

    const renderInline = (text, parent) => {
        if (!text) return;
        const parts = String(text).split(INLINE_PATTERN);
        parts.forEach((part) => {
            if (!part) return;

            if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
                const code = document.createElement("code");
                code.textContent = part.slice(1, -1);
                parent.appendChild(code);
                return;
            }

            const linkMatch = part.match(LINK_PATTERN);
            if (linkMatch) {
                const label = linkMatch[1];
                const href = linkMatch[2];
                const a = document.createElement("a");
                a.href = href;
                a.className = "highlight-link";
                // For in-page anchors, open any collapsed <details> we're jumping into.
                if (href.startsWith("#")) {
                    a.addEventListener("click", () => {
                        openDetailsForHash(href);
                    });
                } else if (/^https?:\/\//.test(href)) {
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                }
                a.textContent = label;
                parent.appendChild(a);
                return;
            }

            parent.appendChild(document.createTextNode(part));
        });
    };

    const state = {
        cards: [],
        currentPage: 0,
        cardsPerPage: 2
    };

    const computeCardsPerPage = () => (window.innerWidth <= MOBILE_BREAKPOINT ? 1 : 2);

    const totalPages = () => {
        if (!state.cards.length) {
            return 0;
        }
        return Math.ceil(state.cards.length / state.cardsPerPage);
    };

    const applyTransform = () => {
        track.style.transform = `translateX(${-100 * state.currentPage}%)`;
    };

    const renderDots = () => {
        dotsContainer.innerHTML = "";
        const pages = totalPages();

        for (let i = 0; i < pages; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "highlights-dot";
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-label", `Highlight page ${i + 1}`);
            if (i === state.currentPage) {
                dot.classList.add("is-active");
                dot.setAttribute("aria-selected", "true");
            } else {
                dot.setAttribute("aria-selected", "false");
            }

            // Inner fill bar; only animated when the dot carries .is-next.
            const fill = document.createElement("span");
            fill.className = "highlights-dot-fill";
            dot.appendChild(fill);

            dot.addEventListener("click", () => {
                goTo(i);
            });
            dotsContainer.appendChild(dot);
        }

        const hidden = pages <= 1;
        prevBtn.style.visibility = hidden ? "hidden" : "";
        nextBtn.style.visibility = hidden ? "hidden" : "";

        // Mark the dot after the current one as the one to fill. renderDots
        // recreates every dot, so the CSS animation naturally starts from 0 on
        // every manual navigation (prev/next/dot click).
        if (pages > 1) {
            const nextIdx = (state.currentPage + 1) % pages;
            const nextDot = dotsContainer.children[nextIdx];
            if (nextDot) {
                nextDot.classList.add("is-next");
            }
        }
    };

    const goTo = (page) => {
        const pages = totalPages();
        if (pages === 0) {
            return;
        }
        state.currentPage = ((page % pages) + pages) % pages;
        applyTransform();
        renderDots();
    };

    const buildPages = () => {
        track.innerHTML = "";
        const pages = totalPages();

        for (let p = 0; p < pages; p++) {
            const page = document.createElement("div");
            page.className = "highlights-page";

            const start = p * state.cardsPerPage;
            const end = Math.min(start + state.cardsPerPage, state.cards.length);

            for (let i = start; i < end; i++) {
                const c = state.cards[i] || {};
                const card = document.createElement("article");
                card.className = "highlight-card";

                const title = document.createElement("h3");
                renderInline(c.title || "", title);
                card.appendChild(title);

                const desc = document.createElement("p");
                renderInline(c.description || "", desc);
                card.appendChild(desc);

                page.appendChild(card);
            }

            track.appendChild(page);
        }
    };

    const rebuild = ({ preserveCardIndex = true } = {}) => {
        const approxCardIndex = preserveCardIndex
            ? state.currentPage * state.cardsPerPage
            : 0;

        state.cardsPerPage = computeCardsPerPage();
        buildPages();

        const pages = totalPages();
        if (pages === 0) {
            state.currentPage = 0;
        } else {
            state.currentPage = Math.min(
                Math.floor(approxCardIndex / state.cardsPerPage),
                pages - 1
            );
        }

        applyTransform();
        renderDots();
    };

    prevBtn.addEventListener("click", () => goTo(state.currentPage - 1));
    nextBtn.addEventListener("click", () => goTo(state.currentPage + 1));

    // Auto-advance: the CSS fill-animation on the "next" dot runs for 15s.
    // When it finishes we simply advance one page; renderDots then resets the
    // animation on the new next dot. Pause is purely CSS (animation-play-state)
    // driven by the .is-paused class on the highlights root.
    dotsContainer.addEventListener("animationend", (event) => {
        const target = event.target;
        if (!target || !target.classList || !target.classList.contains("highlights-dot-fill")) {
            return;
        }
        if (event.animationName !== "highlights-dot-fill") {
            return;
        }
        if (highlightsRoot.classList.contains("is-paused")) {
            return;
        }
        goTo(state.currentPage + 1);
    });

    viewport.addEventListener("mouseenter", () => {
        highlightsRoot.classList.add("is-paused");
    });
    viewport.addEventListener("mouseleave", () => {
        highlightsRoot.classList.remove("is-paused");
    });

    // Open details if the page was loaded with a deep-link hash or the user
    // navigates via a hash change (e.g. browser back/forward).
    window.addEventListener("hashchange", () => openDetailsForHash(window.location.hash));
    openDetailsForHash(window.location.hash);

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const next = computeCardsPerPage();
            if (next !== state.cardsPerPage) {
                rebuild({ preserveCardIndex: true });
            }
        }, 120);
    });

    fetch(JSON_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${JSON_URL}`);
            }
            return response.json();
        })
        .then((data) => {
            const cards = Array.isArray(data)
                ? data
                : Array.isArray(data && data.cards)
                    ? data.cards
                    : [];
            state.cards = cards;
            rebuild({ preserveCardIndex: false });
        })
        .catch(() => {
            track.innerHTML = '<p style="padding: 12px;">Unable to load highlights.</p>';
            prevBtn.style.visibility = "hidden";
            nextBtn.style.visibility = "hidden";
        });
})();
