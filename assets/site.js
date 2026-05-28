(function () {
    // ── Tabs ──
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    const activateTab = (target) => {
        tabButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => p.classList.remove('active'));
        const btn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        }
        const panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            activateTab(target);
            window.location.hash = target;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeNavMenu();
        });
    });

    const hashTab = window.location.hash.replace('#', '');
    if (hashTab && document.getElementById('tab-' + hashTab)) {
        activateTab(hashTab);
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    const closeNavMenu = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const openNavMenu = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
    };

    const toggleNavMenu = () => {
        if (!navMenu || !navToggle) return;
        if (navMenu.classList.contains('is-open')) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    };

    if (navToggle) {
        navToggle.addEventListener('click', toggleNavMenu);
    }

    document.addEventListener('click', (event) => {
        if (!navMenu || !navToggle) return;
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            closeNavMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNavMenu();
        }
    });

    // ── Inline renderer ──
    const INLINE_PATTERN = /(`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
    const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

    const renderInline = (text, parent) => {
        if (!text) return;
        const parts = String(text).split(INLINE_PATTERN);
        parts.forEach(part => {
            if (!part) return;
            if (part.length >= 2 && part.startsWith('`') && part.endsWith('`')) {
                const code = document.createElement('code');
                code.textContent = part.slice(1, -1);
                parent.appendChild(code);
                return;
            }
            const m = part.match(LINK_PATTERN);
            if (m) {
                const a = document.createElement('a');
                a.href = m[2];
                a.textContent = m[1];
                if (/^https?:\/\//.test(m[2])) {
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
                parent.appendChild(a);
                return;
            }
            parent.appendChild(document.createTextNode(part));
        });
    };

    // ── Skill badges ──
    document.querySelectorAll('.skill-badge').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tabTarget;
            activateTab(target);
            window.location.hash = target;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ── Highlights Carousel ──
    const highlightsRoot = document.querySelector('.highlights');
    const track = document.getElementById('highlights-track');
    const dotsContainer = document.getElementById('highlights-dots');
    const prevBtn = document.querySelector('.highlights-prev');
    const nextBtn = document.querySelector('.highlights-next');

    const MOBILE_BREAKPOINT = 640;

    const carouselState = {
        cards: [],
        currentPage: 0,
        cardsPerPage: 2
    };

    const computeCardsPerPage = () => (window.innerWidth <= MOBILE_BREAKPOINT ? 1 : 2);

    const totalPages = () => {
        if (!carouselState.cards.length) return 0;
        return Math.ceil(carouselState.cards.length / carouselState.cardsPerPage);
    };

    const applyTransform = () => {
        track.style.transform = `translateX(${-100 * carouselState.currentPage}%)`;
    };

    const renderDots = () => {
        dotsContainer.innerHTML = '';
        const pages = totalPages();

        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'highlights-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Highlight page ${i + 1}`);
            if (i === carouselState.currentPage) {
                dot.classList.add('is-active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.setAttribute('aria-selected', 'false');
            }

            const fill = document.createElement('span');
            fill.className = 'highlights-dot-fill';
            dot.appendChild(fill);

            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        const hidden = pages <= 1;
        prevBtn.style.visibility = hidden ? 'hidden' : '';
        nextBtn.style.visibility = hidden ? 'hidden' : '';

        if (pages > 1) {
            const nextIdx = (carouselState.currentPage + 1) % pages;
            const nextDot = dotsContainer.children[nextIdx];
            if (nextDot) nextDot.classList.add('is-next');
        }
    };

    const goTo = (page) => {
        const pages = totalPages();
        if (pages === 0) return;
        carouselState.currentPage = ((page % pages) + pages) % pages;
        applyTransform();
        renderDots();
    };

    const buildPages = () => {
        track.innerHTML = '';
        const pages = totalPages();

        for (let p = 0; p < pages; p++) {
            const pageEl = document.createElement('div');
            pageEl.className = 'highlights-page';

            const start = p * carouselState.cardsPerPage;
            const end = Math.min(start + carouselState.cardsPerPage, carouselState.cards.length);

            for (let i = start; i < end; i++) {
                const c = carouselState.cards[i] || {};
                const card = document.createElement('article');
                card.className = 'highlight-card';

                const title = document.createElement('h3');
                renderInline(c.title || '', title);
                card.appendChild(title);

                const desc = document.createElement('p');
                renderInline(c.description || '', desc);
                card.appendChild(desc);

                pageEl.appendChild(card);
            }

            track.appendChild(pageEl);
        }
    };

    const rebuildCarousel = ({ preserveCardIndex = true } = {}) => {
        const approxCardIndex = preserveCardIndex
            ? carouselState.currentPage * carouselState.cardsPerPage
            : 0;

        carouselState.cardsPerPage = computeCardsPerPage();
        buildPages();

        const pages = totalPages();
        if (pages === 0) {
            carouselState.currentPage = 0;
        } else {
            carouselState.currentPage = Math.min(
                Math.floor(approxCardIndex / carouselState.cardsPerPage),
                pages - 1
            );
        }

        applyTransform();
        renderDots();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(carouselState.currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(carouselState.currentPage + 1));

    dotsContainer.addEventListener('animationend', (event) => {
        const target = event.target;
        if (!target || !target.classList || !target.classList.contains('highlights-dot-fill')) return;
        if (event.animationName !== 'highlights-dot-fill') return;
        if (highlightsRoot.classList.contains('is-paused')) return;
        goTo(carouselState.currentPage + 1);
    });

    const viewport = document.querySelector('.highlights-viewport');
    if (viewport) {
        viewport.addEventListener('mouseenter', () => highlightsRoot.classList.add('is-paused'));
        viewport.addEventListener('mouseleave', () => highlightsRoot.classList.remove('is-paused'));
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const next = computeCardsPerPage();
            if (next !== carouselState.cardsPerPage) {
                rebuildCarousel({ preserveCardIndex: true });
            }
        }, 120);
    });

    fetch('/assets/cards.json')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            const cards = Array.isArray(data) ? data : (data && Array.isArray(data.cards) ? data.cards : []);
            carouselState.cards = cards;
            rebuildCarousel({ preserveCardIndex: false });
        })
        .catch(() => {
            track.innerHTML = '<p style="padding: 12px;">Unable to load highlights.</p>';
            prevBtn.style.visibility = 'hidden';
            nextBtn.style.visibility = 'hidden';
        });

    // ── Projects & Language Dropdown ──
    const projectsList = document.getElementById('projects-list');
    const langDropdown = document.getElementById('lang-dropdown');
    const langTrigger = document.getElementById('lang-dropdown-trigger');
    const langTriggerIcon = document.getElementById('lang-trigger-icon');
    const langTriggerLabel = document.getElementById('lang-trigger-label');
    const langMenu = document.getElementById('lang-dropdown-menu');

    let allProjects = [];
    let allLanguages = [];
    let activeLangId = 'all';

    const makeIconSvg = (icon) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('role', 'img');
        svg.setAttribute('viewBox', icon.viewBox || '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.path);
        svg.appendChild(path);
        return svg;
    };

    const closeDropdown = () => {
        langMenu.classList.remove('open');
        langTrigger.setAttribute('aria-expanded', 'false');
    };

    const openDropdown = () => {
        langMenu.classList.add('open');
        langTrigger.setAttribute('aria-expanded', 'true');
    };

    const toggleDropdown = () => {
        if (langMenu.classList.contains('open')) closeDropdown();
        else openDropdown();
    };

    langTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) closeDropdown();
    });

    const selectLang = (lang) => {
        activeLangId = lang.id;
        langTriggerLabel.textContent = lang.id === 'all' ? 'All Languages' : lang.label;
        langTriggerIcon.innerHTML = '';
        if (ICONS[lang.id]) {
            langTriggerIcon.appendChild(makeIconSvg(ICONS[lang.id]));
        }
        langTrigger.style.color = ICONS[lang.id]?.color || '';
        closeDropdown();
        renderProjects();
    };

    const buildDropdown = () => {
        if (!langMenu) return;
        langMenu.innerHTML = '';

        const allOption = { id: 'all', label: 'All Languages' };
        [allOption, ...allLanguages].forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'lang-dropdown-option';
            btn.type = 'button';
            btn.setAttribute('role', 'menuitem');
            btn.style.color = ICONS[lang.id]?.color || 'var(--fg-muted)';
            if (ICONS[lang.id]) {
                btn.appendChild(makeIconSvg(ICONS[lang.id]));
            } else {
                const spacer = document.createElement('span');
                spacer.style.width = '16px';
                spacer.style.display = 'inline-block';
                btn.appendChild(spacer);
            }
            const label = document.createElement('span');
            label.textContent = lang.label;
            btn.appendChild(label);
            btn.addEventListener('click', () => selectLang(lang));
            langMenu.appendChild(btn);
        });
    };

    const iconGitHub = {
        title: 'GitHub',
        color: '#FFFFFF',
        viewBox: '0 0 24 24',
        path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
    };

    const ICONS = {
        d: { color: '#B03931', viewBox: '0 0 24 24', path: 'M22.635 3.883a1.364 1.25 0 0 0-1.363 1.25 1.364 1.25 0 0 0 1.363 1.25A1.364 1.25 0 0 0 24 5.133a1.364 1.25 0 0 0-1.365-1.25zm-16.004.418-6.027.008c-.026 0-.051-.003-.076 0-.296.036-.527.273-.528.558l.018 14.574c0 .22.06.676.682.676l5.58-.021c1.595-.003 2.664-.031 3.3-.112h.016a11.43 11.43 0 0 0 1.955-.469c1.22-.38 2.3-.944 3.23-1.697a7.854 7.854 0 0 0 2.114-2.562 6.716 6.716 0 0 0 .646-1.987 4.244 3.89 0 0 0 .26.028 4.244 3.89 0 0 0 4.244-3.89 4.244 3.89 0 0 0-4.244-3.89 4.244 3.89 0 0 0-2.9 1.082 8.838 8.838 0 0 0-2.25-1.355c-1.536-.65-3.536-.948-6.02-.943zm-.262 3.004c1.215-.003 2.079.034 2.569.101a7.32 7.32 0 0 1 1.617.436c.57.218 1.068.483 1.496.814 1.177.915 1.732 1.999 1.734 3.432.003 1.468-.534 2.611-1.68 3.57a5.582 5.582 0 0 1-1.177.742c-.409.19-.942.355-1.615.496-.636.128-1.6.2-2.856.202l-2.673.004-.012-9.793 2.598-.004z' },
        c: { color: '#A8B9CC', viewBox: '0 0 24 24', path: 'M16.5921 9.1962s-.354-3.298-3.627-3.39c-3.2741-.09-4.9552 2.474-4.9552 6.14 0 3.6651 1.858 6.5972 5.0451 6.5972 3.184 0 3.5381-3.665 3.5381-3.665l6.1041.365s.36 3.31-2.196 5.836c-2.552 2.5241-5.6901 2.9371-7.8762 2.9201-2.19-.017-5.2261.034-8.1602-2.97-2.938-3.0101-3.436-5.9302-3.436-8.8002 0-2.8701.556-6.6702 4.047-9.5502C7.444.72 9.849 0 12.254 0c10.0422 0 10.7172 9.2602 10.7172 9.2602z' },
        csharp: { color: '#512BD4', viewBox: '0 0 24 24', path: 'M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a2.896 2.896 0 0 1-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024c-.04-.233-.06-.629-.06-1.185V7.529h1.372zm-8.703-.693a.868.829 0 0 1-.869.829.868.829 0 0 1-.868-.83.868.829 0 0 1 .868-.828.868.829 0 0 1 .869.829Z' },
        javascript: { color: '#F7DF1E', viewBox: '0 0 24 24', path: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z' },
        python: { color: '#3776AB', viewBox: '0 0 24 24', path: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2.36.15.36.1.35.07.32.04.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z' },
        ruby: { color: '#e62923', viewBox: '0 0 24 24', path: 'M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503 1.172 2.805-9.144-.03.007.016-.03 9.255 2.956-1.396-5.431-.99-3.9 8.82-.569-.615-.51L16.5 2.114 20.159.073l-.003.01zM0 19.089zM5.13 5.073c3.561-3.533 8.157-5.621 9.922-3.84 1.762 1.777-.105 6.105-3.673 9.636-3.563 3.532-8.103 5.734-9.864 3.957-1.766-1.777.045-6.217 3.612-9.75l.003-.003z' },
        cpp: { color: '#00599C', viewBox: '0 0 24 24', path: 'M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 0 1 6.156 3.553l-3.076 1.78a3.567 3.567 0 0 0-3.08-1.78A3.56 3.56 0 0 0 8.444 12 3.56 3.56 0 0 0 12 15.555a3.57 3.57 0 0 0 3.08-1.778l3.078 1.78A7.135 7.135 0 0 1 12 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z' },
        rust: { color: '#D34516', viewBox: '0 0 24 24', path: 'M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.3006.155l1.1845-.0415a6.7444 6.7444 0 00.1873.2268l-.2723 1.153a.3472.3472 0 00.417.4172l1.1532-.2724c.075.0628.151.1255.2278.1873l-.0415 1.1845a.3442.3442 0 00.49.328l1.076-.491c.0872.0476.1742.0952.2623.1407l.1903 1.1663a.3483.3483 0 00.5447.2257l.9587-.6904c.0962.0273.1903.0567.2855.086l.4141 1.1065a.3462.3462 0 00.578.1155l.8069-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3462.3462 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8079.8656a.3483.3483 0 00.5781-.1155l.414-1.1065c.0951-.0293.1893-.0587.2855-.086l.9587.6904a.3452.3452 0 00.5446-.2257l.1903-1.1663c.0881-.0455.1751-.0921.2623-.1407l1.076.491a.3462.3462 0 00.49-.328l-.0415-1.1845c.0769-.0618.1528-.1235.2278-.1873l1.1532.2724a.3472.3472 0 00.417-.4172l-.2723-1.153a6.7444 6.7444 0 00.1873-.2268l1.1845.0415a.3462.3462 0 00.328-.49l-.491-1.0761a9.167 9.167 0 00.1407-.2622l1.1662-.1894a.3483.3483 0 00.2258-.5446l-.6904-.9587c.0303-.0941.0597-.1893.087-.2855l1.1065-.4141a.3483.3483 0 00.1155-.578l-.8656-.8079c.0101-.0972.0203-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892l-1.0073-.6236a9.2936 9.2936 0 00-.0283-.2935l.8656-.807a.3462.3462 0 00-.1155-.5781l-1.1065-.414a13.303 13.303 0 00-.087-.2855l.6904-.9587a.3452.3452 0 00-.2268-.5447l-1.1662-.1893a9.3574 9.3574 0 00-.1407-.2622l.491-1.0762a.3462.3462 0 00-.328-.49l-1.1834.0415a7.9826 7.9826 0 00-.1873-.2277l.2713-1.1541a.3462.3462 0 00-.4171-.4161l-1.153.2713a9.3574 9.3574 0 00-.2278-.1863l.0415-1.1845a.3442.3442 0 00-.49-.327l-1.0761.49a9.167 9.167 0 00-.2622-.1407l-.1903-1.1662a.3483.3483 0 00-.5447-.2268l-.9587.6904a8.4958 8.4958 0 00-.2855-.087l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8079.8656c-.0972-.0111-.1954-.0203-.2936-.0294l-.6236-1.0073a.3462.3462 0 00-.5892 0l-.6236 1.0073a9.2936 9.2936 0 00-.2936.0284l-.8079-.8656a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086l-.9587-.6904a.3483.3483 0 00-.5447.2268l-.1903 1.1662c-.087.0486-.1741.0951-.2622.1407l-1.076-.491a.3462.3462 0 00-.49.328l.0415 1.1845c-.0618.0769-.1235.1528-.1873.2277l-1.153-.2713a.3472.3472 0 00-.4172.4172l.2724 1.1532a6.7444 6.7444 0 00-.1873.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2936l-1.0073.6236a.3442.3442 0 000 .5892z' }
    };

    const renderIcon = (icon) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('role', 'img');
        svg.setAttribute('viewBox', icon.viewBox || '0 0 24 24');
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = icon.title || 'Icon';
        svg.appendChild(title);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.path);
        svg.appendChild(path);
        return svg;
    };

    const renderProjects = () => {
        if (!projectsList) return;
        projectsList.innerHTML = '';
        const filtered = activeLangId === 'all'
            ? allProjects
            : allProjects.filter(p => (p.languages || []).includes(activeLangId));
        if (!filtered.length) {
            projectsList.innerHTML = '<p class="subtle">No projects match this filter.</p>';
            return;
        }
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const h3 = document.createElement('h3');
            if (p.github || p.url) {
                const a = document.createElement('a');
                a.href = p.github || p.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = p.title || '';
                h3.appendChild(a);
            } else {
                h3.textContent = p.title || '';
            }
            card.appendChild(h3);

            const desc = document.createElement('p');
            const text = Array.isArray(p.description) ? p.description.join(' ') : (p.description || '');
            renderInline(text, desc);
            card.appendChild(desc);

            const icons = document.createElement('div');
            icons.className = 'project-icons';
            (p.languages || []).forEach(langId => {
                if (!ICONS[langId]) return;
                const a = document.createElement('a');
                a.href = (allLanguages.find(l => l.id === langId)?.url) || '#';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.setAttribute('aria-label', (allLanguages.find(l => l.id === langId)?.label) || langId);
                a.style.color = ICONS[langId].color || 'var(--fg-dim)';
                a.appendChild(renderIcon(ICONS[langId]));
                icons.appendChild(a);
            });
            if (p.github) {
                const a = document.createElement('a');
                a.href = p.github;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.setAttribute('aria-label', `${p.title || 'Project'} GitHub`);
                a.classList.add('github');
                a.appendChild(renderIcon(iconGitHub));
                icons.appendChild(a);
            }
            if (icons.childNodes.length) {
                card.classList.add('has-icons');
                card.appendChild(icons);
            }

            projectsList.appendChild(card);
        });
    };

    fetch('/assets/projects.json')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            allProjects = (data && Array.isArray(data.projects)) ? data.projects : [];
            allLanguages = (data && Array.isArray(data.languages)) ? data.languages : [];
            buildDropdown();
            renderProjects();
        })
        .catch(() => {
            if (projectsList) projectsList.innerHTML = '<p class="subtle">Unable to load projects.</p>';
        });

    // ── Article language icons ──
    const TAG_TO_ICON = { 'D': 'd', 'Ruby': 'ruby', 'C#': 'csharp' };

    document.querySelectorAll('.article-entry').forEach(entry => {
        const tagsContainer = entry.querySelector('.article-tags');
        if (!tagsContainer) return;

        const tags = Array.from(tagsContainer.querySelectorAll('.article-tag'));
        for (const tag of tags) {
            const id = TAG_TO_ICON[tag.textContent.trim()];
            if (id && ICONS[id]) {
                tag.remove();

                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('role', 'img');
                svg.setAttribute('viewBox', ICONS[id].viewBox);
                svg.setAttribute('aria-label', tag.textContent.trim());
                svg.classList.add('article-lang-icon');
                svg.style.color = ICONS[id].color;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', ICONS[id].path);
                svg.appendChild(path);

                entry.appendChild(svg);
                break;
            }
        }
    });

    // ── Timezone label (EST/EDT) ──
    const isEasternDst = (date) => {
        const year = date.getFullYear();
        const secondSunday = (m) => {
            const d = new Date(year, m, 1);
            return 1 + (7 - d.getDay()) % 7 + 7;
        };
        const firstSunday = (m) => {
            const d = new Date(year, m, 1);
            return 1 + (7 - d.getDay()) % 7;
        };
        const start = new Date(year, 2, secondSunday(2), 2, 0, 0);
        const end = new Date(year, 10, firstSunday(10), 2, 0, 0);
        return date >= start && date < end;
    };
    const tzLabel = document.getElementById('tz-label');
    if (tzLabel) tzLabel.textContent = isEasternDst(new Date()) ? 'EDT' : 'EST';
})();
