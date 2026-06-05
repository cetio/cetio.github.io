(function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    const activateTab = (target) => {
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        const btn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
        if (btn)
            btn.classList.add('active');
        const panel = document.getElementById('tab-' + target);
        if (panel)
            panel.classList.add('active');
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tab;
            activateTab(target);
            window.location.hash = target;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeNavMenu();
        });
    });

    const routeFromHash = () => {
        const hashTab = window.location.hash.replace('#', '');
        if (hashTab && document.getElementById('tab-' + hashTab))
            activateTab(hashTab);
    };
    routeFromHash();
    window.addEventListener('hashchange', routeFromHash);

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    const closeNavMenu = () => {
        if (!navMenu || !navToggle)
            return;
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const openNavMenu = () => {
        if (!navMenu || !navToggle)
            return;
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
    };

    const toggleNavMenu = () => {
        if (!navMenu || !navToggle)
            return;
        if (navMenu.classList.contains('is-open'))
            closeNavMenu();
        else
            openNavMenu();
    };

    if (navToggle)
        navToggle.addEventListener('click', toggleNavMenu);

    document.addEventListener('click', (event) => {
        if (!navMenu || !navToggle)
            return;
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target))
            closeNavMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape')
            closeNavMenu();
    });

    document.querySelectorAll('.skill-badge, .quick-link-btn').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tabTarget;
            activateTab(target);
            window.location.hash = target;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
})();
