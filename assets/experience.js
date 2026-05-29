(function () {
    const timelineContainer = document.getElementById('experience-timeline');
    const educationContainer = document.getElementById('experience-education');
    const certsContainer = document.getElementById('experience-certs');

    if (!timelineContainer || !educationContainer || !certsContainer)
        return;

    fetch('/assets/experience.json')
        .then(response => response.ok ? response.json() : null)
        .then(data => {
            if (!data)
                return;

            // Render timeline
            const timeline = document.createElement('div');
            timeline.className = 'timeline';
            (data.jobs || []).forEach(job => {
                const entry = document.createElement('div');
                entry.className = 'timeline-entry';

                const dash = document.createElement('div');
                dash.className = 'timeline-dash';
                entry.appendChild(dash);

                const content = document.createElement('div');
                content.className = 'timeline-content';

                if (job.logo) {
                    const header = document.createElement('div');
                    header.className = 'timeline-header';

                    const title = document.createElement('h4');
                    title.className = 'timeline-title';
                    title.textContent = job.title;
                    header.appendChild(title);

                    const logo = document.createElement('img');
                    logo.src = job.logo;
                    logo.alt = job.company;
                    logo.className = 'timeline-logo';
                    header.appendChild(logo);

                    content.appendChild(header);
                } else {
                    const title = document.createElement('h4');
                    title.className = 'timeline-title';
                    title.textContent = job.title;
                    content.appendChild(title);
                }

                if (job.company) {
                    const company = document.createElement('p');
                    company.className = 'timeline-company';
                    company.textContent = job.type
                        ? `${job.company} - ${job.type}`
                        : job.company;
                    content.appendChild(company);
                }

                const date = document.createElement('p');
                date.className = 'timeline-date';
                date.textContent = job.date;
                content.appendChild(date);

                if (job.bullets && job.bullets.length) {
                    const list = document.createElement('ul');
                    list.className = 'timeline-bullets';
                    job.bullets.forEach(text => {
                        const li = document.createElement('li');
                        li.textContent = text;
                        list.appendChild(li);
                    });
                    content.appendChild(list);
                }

                entry.appendChild(content);
                timeline.appendChild(entry);
            });
            timelineContainer.appendChild(timeline);

            // Render education
            const eduPanel = document.createElement('div');
            eduPanel.className = 'panel';
            eduPanel.innerHTML =
                `<p style="margin: 0 0 4px 0;"><strong>${data.education.institution}</strong></p>` +
                `<p style="margin: 0 0 4px 0; color: var(--fg-muted);">${data.education.degree}</p>` +
                `<p style="margin: 0; color: var(--fg-dim); font-size: 13px;">Expected Graduation: ${data.education.expectedGraduation}</p>`;
            educationContainer.appendChild(eduPanel);

            // Render certifications
            const certsPanel = document.createElement('div');
            certsPanel.className = 'panel';
            const table = document.createElement('table');
            table.className = 'cert-table';
            const tbody = document.createElement('tbody');
            (data.certifications || []).forEach(cert => {
                const tr = document.createElement('tr');
                const issuerClass = `cert-${cert.issuer.toLowerCase()}`;
                tr.innerHTML = `<td class="${issuerClass}">${cert.issuer}</td><td>${cert.name}</td>`;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            certsPanel.appendChild(table);
            certsContainer.appendChild(certsPanel);
        })
        .catch(() => {
            timelineContainer.innerHTML = '<p class="subtle">Unable to load experience.</p>';
        });
})();
