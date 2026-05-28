(function () {
    const INLINE_PATTERN = /(`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
    const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

    window.renderInline = (text, parent) => {
        if (!text)
            return;
        const parts = String(text).split(INLINE_PATTERN);
        parts.forEach(part => {
            if (!part)
                return;
            if (part.length >= 2 && part.startsWith('`') && part.endsWith('`')) {
                const code = document.createElement('code');
                code.textContent = part.slice(1, -1);
                parent.appendChild(code);
                return;
            }
            const match = part.match(LINK_PATTERN);
            if (match) {
                const link = document.createElement('a');
                link.href = match[2];
                link.textContent = match[1];
                if (/^https?:\/\//.test(match[2])) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
                parent.appendChild(link);
                return;
            }
            parent.appendChild(document.createTextNode(part));
        });
    };

    window.renderIcon = (icon) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('role', 'img');
        svg.setAttribute('viewBox', icon.viewBox || '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = icon.title || 'Icon';
        svg.appendChild(title);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.path);
        svg.appendChild(path);
        return svg;
    };

    const ICONS = {
        d: {
            color: '#B03931',
            viewBox: '0 0 24 24',
            path: 'M22.635 3.883a1.364 1.25 0 0 0-1.363 1.25 1.364 1.25 0 0 0 1.363 1.25A1.364 1.25 0 0 0 24 5.133a1.364 1.25 0 0 0-1.365-1.25zm-16.004.418-6.027.008c-.026 0-.051-.003-.076 0-.296.036-.527.273-.528.558l.018 14.574c0 .22.06.676.682.676l5.58-.021c1.595-.003 2.664-.031 3.3-.112h.016a11.43 11.43 0 0 0 1.955-.469c1.22-.38 2.3-.944 3.23-1.697a7.854 7.854 0 0 0 2.114-2.562 6.716 6.716 0 0 0 .646-1.987 4.244 3.89 0 0 0 .26.028 4.244 3.89 0 0 0 4.244-3.89 4.244 3.89 0 0 0-4.244-3.89 4.244 3.89 0 0 0-2.9 1.082 8.838 8.838 0 0 0-2.25-1.355c-1.536-.65-3.536-.948-6.02-.943zm-.262 3.004c1.215-.003 2.079.034 2.569.101a7.32 7.32 0 0 1 1.617.436c.57.218 1.068.483 1.496.814 1.177.915 1.732 1.999 1.734 3.432.003 1.468-.534 2.611-1.68 3.57a5.582 5.582 0 0 1-1.177.742c-.409.19-.942.355-1.615.496-.636.128-1.6.2-2.856.202l-2.673.004-.012-9.793 2.598-.004z'
        },
        c: {
            color: '#A8B9CC',
            viewBox: '0 0 24 24',
            path: 'M16.5921 9.1962s-.354-3.298-3.627-3.39c-3.2741-.09-4.9552 2.474-4.9552 6.14 0 3.6651 1.858 6.5972 5.0451 6.5972 3.184 0 3.5381-3.665 3.5381-3.665l6.1041.365s.36 3.31-2.196 5.836c-2.552 2.5241-5.6901 2.9371-7.8762 2.9201-2.19-.017-5.2261.034-8.1602-2.97-2.938-3.0101-3.436-5.9302-3.436-8.8002 0-2.8701.556-6.6702 4.047-9.5502C7.444.72 9.849 0 12.254 0c10.0422 0 10.7172 9.2602 10.7172 9.2602z'
        },
        csharp: {
            color: '#512BD4',
            viewBox: '0 0 24 24',
            path: 'M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a2.896 2.896 0 0 1-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024c-.04-.233-.06-.629-.06-1.185V7.529h1.372zm-8.703-.693a.868.829 0 0 1-.869.829.868.829 0 0 1-.868-.83.868.829 0 0 1 .868-.828.868.829 0 0 1 .869.829Z'
        },
        javascript: {
            color: '#F7DF1E',
            viewBox: '0 0 24 24',
            path: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z'
        },
        python: {
            color: '#3776AB',
            viewBox: '0 0 24 24',
            path: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2.36.15.36.1.35.07.32.04.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z'
        },
        ruby: {
            color: '#e62923',
            viewBox: '0 0 24 24',
            path: 'M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503 1.172 2.805-9.144-.03.007.016-.03 9.255 2.956-1.396-5.431-.99-3.9 8.82-.569-.615-.51L16.5 2.114 20.159.073l-.003.01zM0 19.089zM5.13 5.073c3.561-3.533 8.157-5.621 9.922-3.84 1.762 1.777-.105 6.105-3.673 9.636-3.563 3.532-8.103 5.734-9.864 3.957-1.766-1.777.045-6.217 3.612-9.75l.003-.003z'
        },
        cpp: {
            color: '#00599C',
            viewBox: '0 0 24 24',
            path: 'M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 0 1 6.156 3.553l-3.076 1.78a3.567 3.567 0 0 0-3.08-1.78A3.56 3.56 0 0 0 8.444 12 3.56 3.56 0 0 0 12 15.555a3.57 3.57 0 0 0 3.08-1.778l3.078 1.78A7.135 7.135 0 0 1 12 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z'
        },
        rust: {
            color: '#D34516',
            viewBox: '0 0 24 24',
            path: 'M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z'
        }
    };

    const iconGitHub = {
        title: 'GitHub',
        color: '#FFFFFF',
        viewBox: '0 0 24 24',
        path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
    };

    const iconFork = {
        title: 'Fork',
        viewBox: '0 0 16 16',
        path: 'M11.5 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2m2.5-1a2.5 2.5 0 0 1-1.872 2.42A3.5 3.5 0 0 1 8.75 8.5h-1.5a2 2 0 0 0-1.965 1.626a2.501 2.501 0 1 1-1.535-.011v-4.23a2.501 2.501 0 1 1 1.5 0v1.742a3.5 3.5 0 0 1 2-.627h1.5a2 2 0 0 0 1.823-1.177A2.5 2.5 0 1 1 14 3.5m-8.5 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-9a1 1 0 1 1-2 0a1 1 0 0 1 2 0'
    };

    const projectsList = document.getElementById('projects-list');
    const langDropdown = document.getElementById('lang-dropdown');
    const langTrigger = document.getElementById('lang-dropdown-trigger');
    const langTriggerIcon = document.getElementById('lang-trigger-icon');
    const langTriggerLabel = document.getElementById('lang-trigger-label');
    const langMenu = document.getElementById('lang-dropdown-menu');

    let allProjects = [];
    let allLanguages = [];
    let activeLangId = 'all';
    let showStarredOnly = true;
    const starToggle = document.getElementById('star-toggle');

    const closeDropdown = () => {
        langMenu.classList.remove('open');
        langTrigger.setAttribute('aria-expanded', 'false');
    };

    const openDropdown = () => {
        langMenu.classList.add('open');
        langTrigger.setAttribute('aria-expanded', 'true');
    };

    const toggleDropdown = () => {
        if (langMenu.classList.contains('open'))
            closeDropdown();
        else
            openDropdown();
    };

    langTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', (event) => {
        if (!langDropdown.contains(event.target))
            closeDropdown();
    });

    const selectLang = (language) => {
        activeLangId = language.id;
        langTriggerLabel.textContent = language.id === 'all' ? 'All Languages' : language.label;
        langTriggerIcon.innerHTML = '';
        if (ICONS[language.id])
            langTriggerIcon.appendChild(renderIcon(ICONS[language.id]));
        langTrigger.style.color = ICONS[language.id]?.color || '';
        closeDropdown();
        renderProjects();
    };

    const buildDropdown = () => {
        if (!langMenu)
            return;
        langMenu.innerHTML = '';

        const allOption = { id: 'all', label: 'All Languages' };
        [allOption, ...allLanguages].forEach(language => {
            const button = document.createElement('button');
            button.className = 'lang-dropdown-option';
            button.type = 'button';
            button.setAttribute('role', 'menuitem');
            button.style.color = ICONS[language.id]?.color || 'var(--fg-muted)';
            if (ICONS[language.id]) {
                button.appendChild(renderIcon(ICONS[language.id]));
            } else {
                const spacer = document.createElement('span');
                spacer.style.width = '16px';
                spacer.style.display = 'inline-block';
                button.appendChild(spacer);
            }
            const label = document.createElement('span');
            label.textContent = language.label;
            button.appendChild(label);
            button.addEventListener('click', () => selectLang(language));
            langMenu.appendChild(button);
        });
    };

    const renderProjects = () => {
        if (!projectsList)
            return;
        projectsList.innerHTML = '';
        let filtered = activeLangId === 'all'
            ? allProjects
            : allProjects.filter(project => (project.languages || []).includes(activeLangId));
        if (showStarredOnly)
            filtered = filtered.filter(project => project.starred);
        filtered.sort((a, b) => {
            if (a.starred && !b.starred)
                return -1;
            if (!a.starred && b.starred)
                return 1;
            return (a.sortOrder || 0) - (b.sortOrder || 0);
        });
        if (!filtered.length) {
            projectsList.innerHTML = '<p class="subtle">No projects match this filter.</p>';
            return;
        }
        filtered.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card' + (project.starred ? ' starred' : '');

            const hasDemo = !!(project.demoImage?.url || project.demoVideo?.url);
            if (hasDemo)
                card.classList.add('has-demo');

            const info = document.createElement('div');
            info.className = 'project-info';

            const heading = document.createElement('h3');

            const titleGroup = document.createElement('span');
            titleGroup.className = 'project-title-group';

            if (project.forked) {
                const forkBadge = document.createElement('span');
                forkBadge.className = 'project-fork';
                forkBadge.setAttribute('aria-label', 'Forked project');
                forkBadge.setAttribute('title', 'Forked project');
                forkBadge.appendChild(renderIcon(iconFork));
                titleGroup.appendChild(forkBadge);
            }

            const titleSpan = document.createElement('span');
            titleSpan.textContent = project.title || '';
            titleGroup.appendChild(titleSpan);
            heading.appendChild(titleGroup);

            if (project.year) {
                const yearSpan = document.createElement('span');
                yearSpan.className = 'project-year';
                yearSpan.textContent = project.year;
                heading.appendChild(yearSpan);
            }
            info.appendChild(heading);

            const desc = document.createElement('p');
            const text = Array.isArray(project.description)
                ? project.description.join(' ')
                : (project.description || '');
            renderInline(text, desc);
            info.appendChild(desc);

            const icons = document.createElement('div');
            icons.className = 'project-icons';
            (project.languages || []).forEach(langId => {
                if (!ICONS[langId])
                    return;
                const language = allLanguages.find(l => l.id === langId);
                const link = document.createElement('a');
                link.href = language?.url || '#';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.setAttribute('aria-label', language?.label || langId);
                link.style.color = ICONS[langId].color || 'var(--fg-dim)';
                link.appendChild(renderIcon(ICONS[langId]));
                icons.appendChild(link);
            });
            if (project.github) {
                const link = document.createElement('a');
                link.href = project.github;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.setAttribute('aria-label', `${project.title || 'Project'} GitHub`);
                link.classList.add('github');
                link.appendChild(renderIcon(iconGitHub));
                icons.appendChild(link);
            }
            if (icons.childNodes.length) {
                card.classList.add('has-icons');
                if (hasDemo)
                    info.appendChild(icons);
                else
                    card.appendChild(icons);
            }

            card.appendChild(info);

            if (hasDemo) {
                const demo = document.createElement('div');
                demo.className = 'project-demo';

                if (project.demoImage && project.demoImage.url) {
                    const image = document.createElement('img');
                    image.src = project.demoImage.url;
                    image.alt = project.demoImage.alt || `${project.title} demo`;
                    image.loading = 'lazy';
                    demo.appendChild(image);
                } else if (project.demoVideo && project.demoVideo.url) {
                    const video = document.createElement('video');
                    video.controls = true;
                    video.src = project.demoVideo.url;
                    demo.appendChild(video);
                }

                card.appendChild(demo);
            }

            projectsList.appendChild(card);
        });
    };

    const updateStarToggle = () => {
        if (!starToggle)
            return;
        if (showStarredOnly) {
            starToggle.classList.add('is-active');
            starToggle.setAttribute('aria-pressed', 'true');
            starToggle.setAttribute('aria-label', 'Show starred projects only');
            starToggle.setAttribute('title', 'Show starred projects only');
        } else {
            starToggle.classList.remove('is-active');
            starToggle.setAttribute('aria-pressed', 'false');
            starToggle.setAttribute('aria-label', 'Show all projects');
            starToggle.setAttribute('title', 'Show all projects');
        }
    };

    if (starToggle) {
        starToggle.addEventListener('click', () => {
            showStarredOnly = !showStarredOnly;
            updateStarToggle();
            renderProjects();
        });
    }

    fetch('/assets/projects.json')
        .then(response => response.ok ? response.json() : null)
        .then(data => {
            allProjects = (data && Array.isArray(data.projects)) ? data.projects : [];
            allLanguages = (data && Array.isArray(data.languages)) ? data.languages : [];
            buildDropdown();
            updateStarToggle();
            renderProjects();
        })
        .catch(() => {
            if (projectsList)
                projectsList.innerHTML = '<p class="subtle">Unable to load projects.</p>';
        });

    const TAG_TO_ICON = { 'D': 'd', 'Ruby': 'ruby', 'C#': 'csharp' };

    document.querySelectorAll('.article-entry').forEach(entry => {
        const tagsContainer = entry.querySelector('.article-tags');
        if (!tagsContainer)
            return;

        const tags = Array.from(tagsContainer.querySelectorAll('.article-tag'));
        for (const tag of tags) {
            const id = TAG_TO_ICON[tag.textContent.trim()];
            if (id && ICONS[id]) {
                const svg = renderIcon(ICONS[id]);
                svg.classList.add('article-lang-icon');
                svg.style.color = ICONS[id].color;
                entry.prepend(svg);
                tag.remove();
                break;
            }
        }
    });
})();
