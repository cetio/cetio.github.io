# Generates timeline entries, education panel, and certifications table
# for the Experience tab page from assets/experience.json.
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, "assets/experience.json"), "r") as f:
    data = json.load(f)


def makeJobEntry(job):
    lines = ['<div class="timeline-entry">', '<div class="timeline-dash"></div>', '<div class="timeline-content">']

    if job.get("logo"):
        lines.append('<div class="timeline-header">')
        lines.append(f'<h4 class="timeline-title">{job["title"]}</h4>')
        lines.append(f'<img src="{job["logo"]}" alt="{job["company"]}" class="timeline-logo">')
        lines.append('</div>')
    else:
        lines.append(f'<h4 class="timeline-title">{job["title"]}</h4>')

    if job.get("company"):
        companyText = f'{job["company"]} - {job["type"]}' if job.get("type") else job["company"]
        lines.append(f'<p class="timeline-company">{companyText}</p>')

    lines.append(f'<p class="timeline-date">{job["date"]}</p>')

    if job.get("bullets"):
        lines.append('<ul class="timeline-bullets">')
        for bullet in job["bullets"]:
            lines.append(f'<li>{bullet}</li>')
        lines.append('</ul>')

    lines.append('</div>')
    lines.append('</div>')
    return "\n                ".join(lines)


def makeTimeline(jobs):
    entries = "\n                ".join(makeJobEntry(job) for job in jobs)
    return f'<div class="timeline">\n                {entries}\n            </div>'


def makeEducationPanel(education):
    lines = [
        '<div class="panel">',
        f'<p class="bright">{education["institution"]}</p>',
        f'<p>{education["degree"]}</p>',
        f'<p class="subtle">Expected Graduation: {education["expectedGraduation"]}</p>',
        '</div>',
    ]
    return "\n                ".join(lines)


def makeCertsPanel(certifications):
    lines = ['<div class="panel">', '<table class="cert-table">', '<tbody>']
    for cert in certifications:
        issuerClass = f'cert-{cert["issuer"].lower()}'
        lines.append(f'<tr><td class="{issuerClass}">{cert["issuer"]}</td><td>{cert["name"]}</td></tr>')
    lines.append('</tbody>')
    lines.append('</table>')
    lines.append('</div>')
    return "\n                ".join(lines)


timelineHtml = makeTimeline(data["jobs"])
educationHtml = makeEducationPanel(data["education"])
certsHtml = makeCertsPanel(data["certifications"])

with open(os.path.join(BASE, "tabs/experience.html"), "r") as f:
    template = f.read()

template = template.replace("../", "")
template = template.replace("<!-- EXPERIENCE INSERTION POINT -->", timelineHtml)
template = template.replace("<!-- EDUCATION INSERTION POINT -->", educationHtml)
template = template.replace("<!-- CERTS INSERTION POINT -->", certsHtml)

with open(os.path.join(BASE, "gen_experience.html"), "w") as f:
    f.write(template)

print(f"Generated {len(data['jobs'])} experience entries -> gen_experience.html")
