(function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navPane = document.getElementById('nav-pane');

    const closeNavPane = () => {
        if (!navPane || !navToggle)
            return;
        navPane.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const openNavPane = () => {
        if (!navPane || !navToggle)
            return;
        navPane.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
    };

    const toggleNavPane = () => {
        if (!navPane || !navToggle)
            return;
        if (navPane.classList.contains('is-open'))
            closeNavPane();
        else
            openNavPane();
    };

    if (navToggle)
        navToggle.addEventListener('click', toggleNavPane);

    document.addEventListener('click', (event) => {
        if (!navPane || !navToggle)
            return;
        if (!navPane.contains(event.target) && !navToggle.contains(event.target))
            closeNavPane();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape')
            closeNavPane();
    });
})();
