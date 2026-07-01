# Generates project cards for Projects tab page from assets/projects.json.
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

BRAND_COLORS = {
    "d": "#B03931",
    "c": "#A8B9CC",
    "csharp": "#512BD4",
    "javascript": "#F7DF1E",
    "python": "#3776AB",
    "ruby": "#CC342D",
    "cpp": "#00599C",
    "rust": "#D34516",
}

STATE_COLORS = {
    "active": "var(--accent)",
    "inactive": "var(--fg-muted)",
    "archived": "#e8772e",
}

GITHUB_PATH = (
    "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38"
    " 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94"
    "-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21"
    " 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95"
    " 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82"
    ".64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82"
    ".44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75"
    "-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46"
    ".55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
)

with open(os.path.join(BASE, "assets/projects.json"), "r") as f:
    data = json.load(f)

langMap = {lang["id"]: lang for lang in data["languages"]}
stateMap = {state["id"]: state for state in data["states"]}
projects = sorted(data["projects"], key=lambda p: p["sortOrder"])


def makeLangIcon(langId, size="small"):
    lang = langMap[langId]
    color = BRAND_COLORS.get(langId, "currentColor")
    return (
        f'<span class="icon-square-{size}" title="{lang["label"]}">'
        f'<svg viewBox="{lang["icon"]["viewBox"]}" fill="{color}">'
        f'<path d="{lang["icon"]["path"]}"/>'
        f'</svg></span>'
    )


def makeStateIcon(stateId):
    state = stateMap[stateId]
    color = STATE_COLORS.get(stateId, "currentColor")
    return (
        f'<span class="icon-square-small" title="{state["label"]}">'
        f'<svg viewBox="0 0 16 16" fill="{color}">'
        f'<path d="{state["path"]}"/>'
        f'</svg></span>'
    )


def makeGithubLink(url):
    return (
        f'<a href="{url}" target="_blank" rel="noopener" '
        f'style="display:inline-flex;align-items:center;" '
        f'title="View on GitHub">'
        f'<span class="icon-square-small">'
        f'<svg viewBox="0 0 16 16" fill="currentColor">'
        f'<path d="{GITHUB_PATH}"/>'
        f'</svg></span></a>'
    )


def makeCard(project, highlighted):
    classes = "card"
    if highlighted:
        classes += " accent-left"

    lines = [f'<div class="{classes}">']

    primaryLang = project["languages"][0]
    lines.append('<div class="card-header">')
    lines.append(makeLangIcon(primaryLang, "small"))
    titleText = project["title"]
    if "org" in project:
        titleText = f'{project["org"]} — {titleText}'
    lines.append(f'<h3>{titleText}</h3>')
    if project.get("forked"):
        lines.append(
            '<span style="color:var(--fg-dim);font-size:13px;">fork</span>'
        )
    if "year" in project:
        lines.append(
            f'<span style="color:var(--fg-dim);font-size:13px;'
            f'margin-left:auto;">{project["year"]}</span>'
        )
    lines.append('</div>')

    desc = project["description"]
    if isinstance(desc, str):
        desc = [desc]
    for paragraph in desc:
        lines.append(f'<p>{paragraph}</p>')

    if "demo" in project:
        demo = project["demo"].lstrip("/")
        if demo.endswith(".mp4"):
            lines.append(f'<video src="{demo}" controls></video>')
        elif demo.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
            lines.append(f'<img src="{demo}" alt="{project["title"]} demo" />')

    lines.append('<div class="card-footer">')
    for langId in project["languages"][1:]:
        lines.append(makeLangIcon(langId, "small"))
    lines.append('<div class="card-footer-end">')
    lines.append(makeStateIcon(project["state"]))
    if "github" in project:
        lines.append(makeGithubLink(project["github"]))
    lines.append('</div>')
    lines.append('</div>')

    lines.append('</div>')
    return "\n            ".join(lines)


cards = [makeCard(p, i < 8) for i, p in enumerate(projects)]

with open(os.path.join(BASE, "tabs/projects.html"), "r") as f:
    template = f.read()

template = template.replace("../", "")

pattern = r'<!-- PROJECT INSERTION POINT -->.*?(?=\s*</div>\s*</main>)'
replacement = (
    "<!-- PROJECT INSERTION POINT -->\n            "
    + "\n            ".join(cards)
    + "\n        "
)
result = re.sub(pattern, replacement, template, flags=re.DOTALL)

with open(os.path.join(BASE, "gen_projects.html"), "w") as f:
    f.write(result)

print(f"Generated {len(projects)} project cards -> gen_projects.html")
