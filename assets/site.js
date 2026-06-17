(function () {
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
})();
