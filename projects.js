(function () {
    const JSON_URL = "/assets/projects.json";

    const languageGrid = document.getElementById("language-grid");
    const projectsList = document.getElementById("projects-list");

    if (!languageGrid || !projectsList) {
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
        activeLanguageId: "all"
    };

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

    const render = (data) => {
        const languages = safeArray(data.languages);
        const projects = safeArray(data.projects);
        const languageMap = new Map(languages.map((language) => [language.id, language]));

        const filteredProjects = () => {
            const base = state.activeLanguageId === "all"
                ? projects.slice()
                : projects.filter((project) => safeArray(project.languages).includes(state.activeLanguageId));

            return base.sort((a, b) => {
                const aStar = a.starred ? 1 : 0;
                const bStar = b.starred ? 1 : 0;
                return bStar - aStar;
            });
        };

        const renderLanguageTiles = () => {
            languageGrid.innerHTML = "";

            const tiles = [
                {
                    id: "all",
                    label: `All (${projects.length})`,
                    icon: iconGrid
                },
                ...languages.map((language) => {
                    const count = projects.filter((project) => safeArray(project.languages).includes(language.id)).length;
                    return {
                        id: language.id,
                        label: `${language.label} (${count})`,
                        icon: language.icon
                    };
                })
            ];

            tiles.forEach((tile) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "language-tile";

                if (tile.id === state.activeLanguageId) {
                    button.classList.add("is-active");
                }

                button.appendChild(createIcon(tile.icon, "#1d2021"));

                const label = document.createElement("span");
                label.textContent = tile.label;
                button.appendChild(label);

                button.addEventListener("click", () => {
                    state.activeLanguageId = tile.id;
                    renderLanguageTiles();
                    renderProjectCards();
                });

                languageGrid.appendChild(button);
            });
        };

        const renderProjectCards = () => {
            const projectsToRender = filteredProjects();
            projectsList.innerHTML = "";

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

        renderLanguageTiles();
        renderProjectCards();
    };

    fetch(JSON_URL)
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
