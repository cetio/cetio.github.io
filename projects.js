(function () {
    const JSON_URL = "/assets/projects.json";

    const projectFilters = document.getElementById("project-filters");
    const projectsList = document.getElementById("projects-list");
    const domainOrder = [
        "AI / LLM Integration",
        "API & SDK Engineering",
        "Workflow Automation",
        "Browser Automation",
        "Data Parsing / Retrieval",
        "Tooling & Applications",
        "Systems Internals",
        "Networking & Protocols",
        "Performance Engineering",
        "Code Generation",
        "Reverse Engineering",
        "Security Research",
        "Media & File Formats"
    ];
    const domainPalette = {
        "Reverse Engineering": { border: "#d65d0e", fill: "rgba(214, 93, 14, 0.16)", text: "#fabd2f" },
        "Systems Internals": { border: "#cc241d", fill: "rgba(204, 36, 29, 0.14)", text: "#fb4934" },
        "Kernel-mode": { border: "#9d0006", fill: "rgba(157, 0, 6, 0.16)", text: "#ff6b6b" },
        "Security Research": { border: "#b16286", fill: "rgba(177, 98, 134, 0.16)", text: "#ff9ff3" },
        "Cryptography": { border: "#8f3f71", fill: "rgba(143, 63, 113, 0.16)", text: "#f5c2e7" },
        "Performance Engineering": { border: "#d79921", fill: "rgba(215, 153, 33, 0.16)", text: "#ffe08a" },
        "Profiling": { border: "#e9b143", fill: "rgba(233, 177, 67, 0.15)", text: "#ffd580" },
        "Code Generation": { border: "#b8bb26", fill: "rgba(184, 187, 38, 0.16)", text: "#f1fa8c" },
        "API & SDK Engineering": { border: "#689d6a", fill: "rgba(104, 157, 106, 0.16)", text: "#b8f7a1" },
        "Workflow Automation": { border: "#5a8f3d", fill: "rgba(90, 143, 61, 0.16)", text: "#c8f77b" },
        "Browser Automation": { border: "#3c8d5a", fill: "rgba(60, 141, 90, 0.16)", text: "#8ee6a7" },
        "Data Parsing / Retrieval": { border: "#458588", fill: "rgba(69, 133, 136, 0.16)", text: "#8bd5ca" },
        "Networking & Protocols": { border: "#076678", fill: "rgba(7, 102, 120, 0.16)", text: "#7dcfff" },
        "Tooling & Applications": { border: "#3b6ea8", fill: "rgba(59, 110, 168, 0.16)", text: "#89b4fa" },
        "AI / LLM Integration": { border: "#7c6fbe", fill: "rgba(124, 111, 190, 0.16)", text: "#c4b5fd" },
        "Media & File Formats": { border: "#a879b8", fill: "rgba(168, 121, 184, 0.16)", text: "#f0abfc" }
    };

    if (!projectFilters || !projectsList) {
        return;
    }

    const iconGitHub = {
        title: "GitHub",
        viewBox: "0 0 24 24",
        path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    };

    const iconGrid = {
        title: "All",
        viewBox: "0 0 24 24",
        path: "M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"
    };

    const iconExternal = {
        title: "Link",
        viewBox: "0 0 24 24",
        path: "M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zm5 16V12h2v9H3V3h9v2H5v14h14z"
    };

    const iconStar = {
        title: "Starred",
        viewBox: "0 0 24 24",
        path: "M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.6L2 9.6l7.1-.7z"
    };

    const iconLock = {
        title: "Private repository",
        viewBox: "0 0 16 16",
        path: "M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"
    };

    const createIcon = (icon, fillColor) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("role", "img");
        svg.setAttribute("viewBox", icon.viewBox || "0 0 24 24");
        svg.style.fill = fillColor;

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = icon.title || "Icon";
        svg.appendChild(title);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", icon.path);
        svg.appendChild(path);

        return svg;
    };

    const state = {
        activeLanguageId: "all",
        activeDomainId: "all",
        openDropdown: null
    };
    let refreshFilters = () => {};

    const safeArray = (value) => (Array.isArray(value) ? value : []);

    const slugify = (text) => String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const renderInlineMarkup = (text, parent) => {
        if (!text) {
            return;
        }

        const parts = String(text).split(/(`[^`\n]+`)/g);
        parts.forEach((part) => {
            if (!part) {
                return;
            }

            if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
                const code = document.createElement("code");
                code.textContent = part.slice(1, -1);
                parent.appendChild(code);
            } else {
                parent.appendChild(document.createTextNode(part));
            }
        });
    };

    const applyDomainTheme = (element, domainName) => {
        const theme = domainPalette[domainName];
        if (!theme) {
            return;
        }

        element.classList.add("is-domain");
        element.style.setProperty("--domain-border", theme.border);
        element.style.setProperty("--domain-fill", theme.fill);
        element.style.setProperty("--domain-text", theme.text);
    };

    const themeDomainSkillChips = () => {
        const domainHeadings = Array.from(document.querySelectorAll(".skills-grid dt"));
        const domainsHeading = domainHeadings.find((heading) => heading.textContent.trim() === "Domains");
        if (!domainsHeading || !domainsHeading.nextElementSibling) {
            return;
        }

        domainsHeading.nextElementSibling.querySelectorAll(".skill-chip").forEach((chip) => {
            applyDomainTheme(chip, chip.textContent.trim());
        });
    };

    document.addEventListener("click", (event) => {
        if (state.openDropdown && !projectFilters.contains(event.target)) {
            state.openDropdown = null;
            refreshFilters();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && state.openDropdown) {
            state.openDropdown = null;
            refreshFilters();
        }
    });

    const render = (data) => {
        const languages = safeArray(data.languages);
        const projects = safeArray(data.projects);
        const languageMap = new Map(languages.map((language) => [language.id, language]));
        const domains = Array.from(new Set(projects.flatMap((project) => safeArray(project.badges))));
        const orderedDomains = [
            ...domainOrder.filter((domain) => domains.includes(domain)),
            ...domains
                .filter((domain) => !domainOrder.includes(domain))
                .sort((a, b) => a.localeCompare(b))
        ];

        const matchesLanguage = (project, languageId = state.activeLanguageId) => (
            languageId === "all" || safeArray(project.languages).includes(languageId)
        );

        const matchesDomain = (project, domainId = state.activeDomainId) => (
            domainId === "all" || safeArray(project.badges).includes(domainId)
        );

        const sortProjects = (projectSet) => projectSet.slice().sort((a, b) => {
            const aStar = a.starred ? 1 : 0;
            const bStar = b.starred ? 1 : 0;
            return bStar - aStar;
        });

        const getLanguageOptions = () => [
            {
                id: "all",
                label: "All Languages",
                count: projects.filter((project) => matchesDomain(project)).length,
                icon: iconGrid
            },
            ...languages.map((language) => {
                const count = projects.filter((project) => matchesDomain(project) && safeArray(project.languages).includes(language.id)).length;
                return {
                    id: language.id,
                    label: language.label,
                    count,
                    icon: language.icon
                };
            })
        ];

        const getDomainOptions = () => [
            {
                id: "all",
                label: "All Domains",
                count: projects.filter((project) => matchesLanguage(project)).length
            },
            ...orderedDomains.map((domain) => ({
                id: domain,
                label: domain,
                count: projects.filter((project) => matchesLanguage(project) && safeArray(project.badges).includes(domain)).length
            }))
        ];

        const getActiveOption = (options, activeId) => options.find((option) => option.id === activeId) || options[0];

        const createDropdownContent = (option, includeIcon) => {
            const content = document.createElement("span");
            content.className = "project-dropdown-content";

            if (includeIcon && option.icon) {
                content.appendChild(createIcon(option.icon, "currentColor"));
            }

            const label = document.createElement("span");
            label.className = "project-dropdown-label";
            label.textContent = option.label;
            content.appendChild(label);

            const count = document.createElement("span");
            count.className = "project-dropdown-count";
            count.textContent = `[${option.count}]`;
            content.appendChild(count);

            return content;
        };

        const filteredProjects = () => sortProjects(
            projects.filter((project) => matchesLanguage(project) && matchesDomain(project))
        );

        const renderFilterGroup = ({ filterId, label, options, activeId, includeIcon }) => {
            const group = document.createElement("div");
            group.className = "project-filter-group";

            const groupLabel = document.createElement("span");
            groupLabel.className = "project-filter-label";
            groupLabel.textContent = label;
            group.appendChild(groupLabel);

            const dropdown = document.createElement("div");
            dropdown.className = "project-dropdown";

            const activeOption = getActiveOption(options, activeId);
            const trigger = document.createElement("button");
            trigger.type = "button";
            trigger.className = "project-dropdown-trigger";
            trigger.setAttribute("aria-haspopup", "listbox");
            trigger.setAttribute("aria-expanded", state.openDropdown === filterId ? "true" : "false");
            trigger.setAttribute("aria-label", label);
            trigger.appendChild(createDropdownContent(activeOption, includeIcon));

            const caret = document.createElement("span");
            caret.className = "project-dropdown-caret";
            caret.setAttribute("aria-hidden", "true");
            trigger.appendChild(caret);

            trigger.addEventListener("click", (event) => {
                event.stopPropagation();
                state.openDropdown = state.openDropdown === filterId ? null : filterId;
                refreshFilters();
            });

            dropdown.appendChild(trigger);

            if (state.openDropdown === filterId) {
                const menu = document.createElement("div");
                menu.className = "project-dropdown-menu";
                menu.setAttribute("role", "listbox");
                menu.setAttribute("aria-label", `${label} options`);

                options.forEach((option) => {
                    const item = document.createElement("button");
                    item.type = "button";
                    item.className = "project-dropdown-option";
                    item.setAttribute("role", "option");
                    item.setAttribute("aria-selected", option.id === activeId ? "true" : "false");

                    const isActive = option.id === activeId;
                    const isDisabled = option.count === 0 && !isActive;

                    if (isActive) {
                        item.classList.add("is-active");
                    }
                    if (isDisabled) {
                        item.classList.add("is-disabled");
                        item.disabled = true;
                    }

                    item.appendChild(createDropdownContent(option, includeIcon));
                    item.addEventListener("click", (event) => {
                        event.stopPropagation();
                        if (filterId === "language") {
                            state.activeLanguageId = option.id;
                        } else {
                            state.activeDomainId = option.id;
                        }
                        state.openDropdown = null;
                        refreshFilters();
                        renderProjectCards();
                    });

                    menu.appendChild(item);
                });

                dropdown.appendChild(menu);
            }

            group.appendChild(dropdown);
            return group;
        };

        const renderFilters = () => {
            projectFilters.innerHTML = "";
            projectFilters.appendChild(renderFilterGroup({
                filterId: "language",
                label: "Filter by Language",
                options: getLanguageOptions(),
                activeId: state.activeLanguageId,
                includeIcon: true
            }));
            projectFilters.appendChild(renderFilterGroup({
                filterId: "domain",
                label: "Filter by Domain",
                options: getDomainOptions(),
                activeId: state.activeDomainId,
                includeIcon: false
            }));
        };

        const renderProjectCards = () => {
            const projectsToRender = filteredProjects();
            projectsList.innerHTML = "";

            if (projectsToRender.length === 0) {
                projectsList.innerHTML = "<p>No projects match the selected filters.</p>";
                return;
            }

            projectsToRender.forEach((project) => {
                const card = document.createElement("article");
                card.className = "project-card";
                const slug = slugify(project.title);
                if (slug) {
                    card.id = `project-${slug}`;
                }

                const top = document.createElement("div");
                top.className = "project-top";

                const title = document.createElement("h3");
                title.style.margin = "0";
                title.style.display = "flex";
                title.style.alignItems = "center";
                title.style.gap = "6px";

                const titleText = document.createElement("span");
                titleText.className = "project-title-text";
                titleText.textContent = project.title || "Untitled";
                title.appendChild(titleText);

                if (project.starred) {
                    const star = createIcon(iconStar, "#fbf1c7");
                    star.classList.add("project-star");
                    title.appendChild(star);
                }

                const links = document.createElement("div");
                links.className = "project-link-row";

                safeArray(project.languages).forEach((languageId) => {
                    const language = languageMap.get(languageId);
                    if (!language || !language.url || !language.icon) {
                        return;
                    }

                    const anchor = document.createElement("a");
                    anchor.href = language.url;
                    anchor.target = "_blank";
                    anchor.rel = "noopener noreferrer";
                    anchor.setAttribute("aria-label", `${language.label} website`);
                    anchor.appendChild(createIcon(language.icon, "#fbf1c7"));
                    links.appendChild(anchor);
                });

                if (project.github) {
                    const githubLink = document.createElement("a");
                    githubLink.href = project.github;
                    githubLink.target = "_blank";
                    githubLink.rel = "noopener noreferrer";
                    githubLink.setAttribute("aria-label", `${project.title} GitHub`);
                    githubLink.appendChild(createIcon(iconGitHub, "#fbf1c7"));
                    links.appendChild(githubLink);
                } else {
                    const lockIcon = createIcon(iconLock, "#fbf1c7");
                    links.appendChild(lockIcon);
                }

                safeArray(project.links).forEach((projectLink) => {
                    if (!projectLink || !projectLink.url) {
                        return;
                    }

                    const extraLink = document.createElement("a");
                    extraLink.href = projectLink.url;
                    extraLink.target = "_blank";
                    extraLink.rel = "noopener noreferrer";
                    extraLink.setAttribute("aria-label", projectLink.label || "External link");
                    extraLink.appendChild(createIcon(iconExternal, "#fbf1c7"));
                    links.appendChild(extraLink);
                });

                top.appendChild(title);
                top.appendChild(links);
                card.appendChild(top);

                if (safeArray(project.badges).length > 0) {
                    const badges = document.createElement("div");
                    badges.className = "project-badges";

                    project.badges.forEach((badgeText) => {
                        const badge = document.createElement("span");
                        badge.className = "project-badge";
                        badge.textContent = badgeText;
                        applyDomainTheme(badge, badgeText);
                        badges.appendChild(badge);
                    });

                    card.appendChild(badges);
                }

                const descriptionContent = project.description;
                const descriptionParagraphs = Array.isArray(descriptionContent)
                    ? descriptionContent
                    : (descriptionContent ? [descriptionContent] : []);

                descriptionParagraphs.forEach((paragraph, index) => {
                    const p = document.createElement("p");
                    p.className = "project-description";
                    if (index > 0) {
                        p.classList.add("project-description-continued");
                    }
                    renderInlineMarkup(paragraph, p);
                    card.appendChild(p);
                });

                if (project.note) {
                    const note = document.createElement("p");
                    note.className = "project-note";
                    note.textContent = `Note: ${project.note}`;
                    card.appendChild(note);
                }

                if (project.demoVideo && project.demoVideo.url) {
                    const videoContainer = document.createElement("div");
                    videoContainer.className = "project-video";

                    if (project.demoVideo.type === "video") {
                        const video = document.createElement("video");
                        video.controls = true;
                        video.src = project.demoVideo.url;
                        videoContainer.appendChild(video);
                    } else {
                        const iframe = document.createElement("iframe");
                        iframe.src = project.demoVideo.url;
                        iframe.loading = "lazy";
                        iframe.allowFullscreen = true;
                        iframe.referrerPolicy = "no-referrer";
                        videoContainer.appendChild(iframe);
                    }

                    card.appendChild(videoContainer);
                }

                projectsList.appendChild(card);
            });
        };

        refreshFilters = () => {
            renderFilters();
        };

        themeDomainSkillChips();
        renderFilters();
        renderProjectCards();
    };

    fetch(JSON_URL, { cache: "no-store" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${JSON_URL}`);
            }
            return response.json();
        })
        .then((data) => render(data))
        .catch(() => {
            projectsList.innerHTML = "<p>Unable to load project data.</p>";
        });
})();
