
import { store } from '../core/store.js';

export function updatePreview() {
    const container = document.getElementById('resume-preview');
    if (!container) return;

    const r = store.get().resume;

    // Border Handling
    container.style.border = r.meta.border ? '1.5pt solid black' : 'none';

    // Header Styles
    const headerStyle = `
        text-align: center;
        margin-bottom: 10pt;
        border-bottom: 1px solid black;
        padding-bottom: 5pt;
    `;

    // Section Header Style (Grey Background)
    const sectionStyle = `
        background-color: #e5e7eb; 
        font-size: 14pt; 
        font-weight: bold; 
        text-transform: uppercase; 
        padding: 2pt 4pt;
        margin-top: 10pt;
        margin-bottom: 6pt;
    `;

    // Entry Style (Flexbox for Right Align)
    const entryHeaderStyle = `
        display: flex; 
        justify-content: space-between; 
        align-items: baseline;
        font-size: 12pt;
        margin-top: 6pt;
    `;

    // HTML Generator
    let html = `
        <div style="${headerStyle}">
            <div style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">${(r.personal.firstName + ' ' + r.personal.lastName).toUpperCase() || 'YOUR NAME'}</div>
            <div style="font-size: 11pt; margin-top: 2pt;">${(r.personal.jobTitle || '').toUpperCase()}</div>
            <div style="font-size: 10pt; margin-top: 4pt;">
                ${[r.personal.city, r.personal.country].filter(Boolean).join(', ')}
            </div>
            <div style="font-size: 10pt;">
                ${[r.personal.email, r.personal.phone].filter(Boolean).join(' | ')}
            </div>
             <div style="font-size: 10pt;">
                ${[r.personal.linkedin, r.personal.address].filter(Boolean).join(' | ')}
            </div>
             <div style="font-size: 10pt;">
                 ${(r.socials.map(s => s.url).join(' | '))}
            </div>
        </div>
    `;

    // Summary
    if (r.summary && r.summary.trim()) {
        html += `
            <div style="${sectionStyle}">Professional Summary</div>
            <div class="preview-body" style="text-align: justify;">${r.summary}</div>
        `;
    }

    // Experience
    if (r.experience.length > 0) {
        html += `<div style="${sectionStyle}">Experience</div>`;
        r.experience.forEach(e => {
            html += `
                <div>
                    <div style="${entryHeaderStyle}">
                        <div style="font-weight: bold;">${e.jobTitle}</div>
                        <div style="font-weight: bold;">${e.startDate} – ${e.endDate}</div>
                    </div>
                    <div style="${entryHeaderStyle}; margin-top: 0;">
                        <div style="font-style: italic;">${e.employer}</div>
                        <div style="font-style: italic;">${e.city}</div>
                    </div>
                    <div class="preview-body" style="margin-top: 4pt;">${e.desc ? '• ' + e.desc.replaceAll('\n', '<br>• ') : ''}</div>
                </div>
            `;
        });
    }

    // Education
    if (r.education.length > 0) {
        html += `<div style="${sectionStyle}">Education</div>`;
        r.education.forEach(e => {
            html += `
                 <div>
                    <div style="${entryHeaderStyle}">
                        <div style="font-weight: bold;">${e.institution}</div>
                        <div style="font-weight: bold;">${e.startDate} – ${e.endDate}</div>
                    </div>
                    <div style="${entryHeaderStyle}; margin-top: 0;">
                        <div style="font-style: italic;">${e.degree}</div>
                        <div style="font-style: italic;">${e.city}</div>
                    </div>
                    <div class="preview-body" style="margin-top: 2pt;">${e.desc}</div>
                </div>
            `;
        });
    }

    // Skills (2 Column Grid)
    if (r.skills.length > 0) {
        html += `<div style="${sectionStyle}">Skills</div>`;
        html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12pt;">`;
        r.skills.forEach(s => {
            html += `<div>• <span style="font-weight: bold;">${s.name}</span></div>`;
        });
        html += `</div>`;
    }

    // Languages
    if (r.languages.length > 0) {
        html += `<div style="${sectionStyle}">Languages</div>`;
        html += `<div style="display: flex; gap: 15px; flex-wrap: wrap;">`;
        r.languages.forEach(l => {
            const proficiencyText = l.proficiency ? `: ${l.proficiency}` : '';
            html += `<div style="font-size: 12pt;">• <b>${l.language}</b>${proficiencyText}</div>`;
        });
        html += `</div>`;
    }

    // Projects
    if (r.projects.length > 0) {
        html += `<div style="${sectionStyle}">Projects</div>`;
        r.projects.forEach(p => {
            html += `
                <div style="margin-bottom: 6pt;">
                    <div style="font-weight: bold; font-size: 12pt;">${p.title}</div>
                    <div class="preview-body">${p.desc}</div>
                </div>
            `;
        });
    }

    // Certifications
    if (r.certifications.length > 0) {
        html += `<div style="${sectionStyle}">Certifications</div><ul>`;
        r.certifications.forEach(c => {
            html += `<li class="preview-body">${c.name}</li>`;
        });
        html += `</ul>`;
    }

    // Awards
    if (r.awards.length > 0) {
        html += `<div style="${sectionStyle}">Awards</div><ul>`;
        r.awards.forEach(a => {
            html += `<li class="preview-body"><b>${a.name}</b> ${a.desc ? '- ' + a.desc : ''}</li>`;
        });
        html += `</ul>`;
    }

    // Interests
    if (r.interests) {
        html += `<div style="${sectionStyle}">Interests</div>`;
        html += `<div class="preview-body">${r.interests}</div>`;
    }

    // References
    if (r.references.length > 0) {
        html += `<div style="${sectionStyle}">References</div>`;
        r.references.forEach(ref => {
            html += `<div class="preview-body">• <b>${ref.name}</b> (${ref.contact})</div>`;
        });
    }

    // Custom
    if (r.custom.length > 0) {
        r.custom.forEach(c => {
            html += `<div style="${sectionStyle}">${c.title}</div>`;
            html += `<div class="preview-body">${c.content}</div>`;
        });
    }

    container.innerHTML = html;

    container.innerHTML = html;

    container.innerHTML = html;

    // Subtle flash effect on update
    container.animate([
        { opacity: 0.8, transform: 'scale(0.998)' },
        { opacity: 1, transform: 'scale(1)' }
    ], { duration: 200, easing: 'ease-out' });
}
