(function () {
    const highlightsRoot = document.querySelector('.highlights');
    const track = document.getElementById('highlights-track');
    const dotsContainer = document.getElementById('highlights-dots');
    const prevBtn = document.querySelector('.highlights-prev');
    const nextBtn = document.querySelector('.highlights-next');

    if (!track || !dotsContainer || !prevBtn || !nextBtn)
        return;

    const MOBILE_BREAKPOINT = 640;

    const carouselState = {
        cards: [],
        currentPage: 0,
        cardsPerPage: 2
    };

    const computeCardsPerPage = () => window.innerWidth <= MOBILE_BREAKPOINT ? 1 : 2;

    const totalPages = () => {
        if (!carouselState.cards.length)
            return 0;
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
            if (nextDot)
                nextDot.classList.add('is-next');
        }
    };

    const goTo = (page) => {
        const pages = totalPages();
        if (pages === 0)
            return;
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
                const data = carouselState.cards[i] || {};
                const card = document.createElement('article');
                card.className = 'highlight-card';

                const title = document.createElement('h3');
                window.renderInline(data.title || '', title);
                card.appendChild(title);

                const desc = document.createElement('p');
                window.renderInline(data.description || '', desc);
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

    prevBtn.addEventListener('click', () => goTo(carouselState.currentPage - 1));
    nextBtn.addEventListener('click', () => goTo(carouselState.currentPage + 1));

    dotsContainer.addEventListener('animationend', (event) => {
        const target = event.target;
        if (!target || !target.classList || !target.classList.contains('highlights-dot-fill'))
            return;
        if (event.animationName !== 'highlights-dot-fill')
            return;
        if (highlightsRoot && highlightsRoot.classList.contains('is-paused'))
            return;
        goTo(carouselState.currentPage + 1);
    });

    const viewport = document.querySelector('.highlights-viewport');
    if (viewport) {
        viewport.addEventListener('mouseenter', () => {
            if (highlightsRoot)
                highlightsRoot.classList.add('is-paused');
        });
        viewport.addEventListener('mouseleave', () => {
            if (highlightsRoot)
                highlightsRoot.classList.remove('is-paused');
        });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const next = computeCardsPerPage();
            if (next !== carouselState.cardsPerPage)
                rebuildCarousel({ preserveCardIndex: true });
        }, 120);
    });

    fetch('/assets/cards.json')
        .then(response => response.ok ? response.json() : null)
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
})();
