
import { store } from '../core/store.js';

export function updatePreview() {
    const container = document.getElementById('resume-preview');
    if (!container) return;

    const r = store.get().resume;
    const hasPic = !!r.personal.profilePic;

    // --- 1. BUILD CONTENT BLOCKS ---
    const blocks = [];

    // Header
    // Dynamic Header Style
    // If photo exists: more space to clear it.
    // If no photo: compact.
    const headerStyle = `
        position: relative;
        min-height: ${hasPic ? '120px' : 'auto'}; 
        border-bottom: 2px solid #333; 
        padding-bottom: ${hasPic ? '20pt' : '5pt'}; 
        margin-bottom: ${hasPic ? '15pt' : '10pt'};
    `;

    const headerHtml = `
        <div style="${headerStyle}">
             ${hasPic ? `
            <div style="position: absolute; right: 0; top: 0;">
                <img src="${r.personal.profilePic}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; display: block;">
            </div>
            ` : ''}

            <div style="width: 100%; text-align: center;">
                <div style="font-size: 16pt; font-weight: bold; text-transform: uppercase; color: #111; line-height: 1.1;">
                    ${(r.personal.firstName + ' ' + r.personal.lastName).toUpperCase()}
                </div>
                <div style="font-size: 12pt; color: #555; margin-top: 4pt; font-weight: 500; letter-spacing: 1px;">
                    ${(r.personal.jobTitle || '').toUpperCase()}
                </div>
                
                <div style="font-size: 10pt; margin-top: 6pt; line-height: 1.15; color: #444;">
                    <div>${[r.personal.city, r.personal.country].filter(Boolean).join(', ')}</div>
                    <div>${[r.personal.email, r.personal.phone].filter(Boolean).join(' | ')}</div>
                    <div>${[r.personal.linkedin, r.personal.address].filter(Boolean).join(' | ')}</div>
                    <div>${(r.socials.map(s => s.url).join(' | '))}</div>
                </div>
            </div>
        </div>
    `;
    blocks.push(headerHtml);

    // Common Styles
    const sectionTitleStyle = `
        background-color: #f3f4f6; 
        font-size: 12pt; 
        font-weight: bold; 
        text-transform: uppercase; 
        padding: 4pt 8pt;
        margin-top: 12pt;
        margin-bottom: 8pt;
        letter-spacing: 0.5pt;
        border-left: 4px solid #333;
    `;

    const entryHeaderStyle = `
        display: flex; 
        justify-content: space-between; 
        align-items: baseline;
        font-size: 11pt;
        margin-top: 6pt;
        font-weight: bold;
    `;

    const subHeaderStyle = `
        display: flex; 
        justify-content: space-between; 
        align-items: baseline;
        font-size: 11pt;
        font-style: italic;
        margin-bottom: 4pt;
    `;

    // Helper: Split Long Text into Smaller Chunks
    const createTextBlocks = (text, style, itemStyle = '') => {
        if (!text) return [];
        const chunks = [];
        const rawLines = text.split('\n');

        rawLines.forEach(line => {
            line = line.trim();
            if (!line) return;

            const isBullet = itemStyle.includes('padding-left');

            // Prepare style for Flexbox if bullet
            let finalStyle = style;
            if (isBullet) {
                finalStyle = finalStyle.replace(/padding-left:\s*[\d\w]+;?/g, '').replace(/position:\s*relative;?/g, '') + ' display: flex;';
            }

            // If line is very long (> 200 chars), try split by sentences
            if (line.length > 200) {
                // Split by '. ' but keep the dot
                const sentences = line.match(/[^.!?]+[.!?]+(\s|$)/g) || [line];
                sentences.forEach((dev, idx) => {
                    const isLast = idx === sentences.length - 1;
                    // Remove top margin for continuations
                    let sStyle = idx === 0 ? finalStyle : finalStyle.replace(/margin-top:\s*[\d\w]+;?/, 'margin-top:0;').replace(/padding-top:\s*[\d\w]+;?/, 'padding-top:0;');

                    if (!isLast) sStyle += ' margin-bottom: 0;';

                    const contentText = `<div style="text-align: justify; flex: 1;">${dev.trim()}</div>`;

                    if (isBullet) {
                        const bullet = idx === 0 ? '<div style="min-width: 20px; user-select: none;">•</div>' : '<div style="min-width: 20px; user-select: none;"></div>';
                        chunks.push(`<div style="${sStyle}">${bullet}${contentText}</div>`);
                    } else {
                        chunks.push(`<div style="${sStyle}">${contentText}</div>`);
                    }
                });
            } else {
                const contentText = `<div style="text-align: justify; flex: 1;">${line}</div>`;
                if (isBullet) {
                    chunks.push(`<div style="${finalStyle}"><div style="min-width: 20px; user-select: none;">•</div>${contentText}</div>`);
                } else {
                    chunks.push(`<div style="${finalStyle}">${contentText}</div>`);
                }
            }
        });
        return chunks;
    };

    // Summary
    if (r.summary && r.summary.trim()) {
        blocks.push(`<div style="${sectionTitleStyle}">Professional Summary</div>`);
        const subBlocks = createTextBlocks(r.summary, 'font-size: 11pt; line-height: 1.15; margin-bottom: 6pt;');
        blocks.push(...subBlocks);
    }

    // Experience
    if (r.experience.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Experience</div>`);
        r.experience.forEach(e => {
            blocks.push(`
                <div style="${entryHeaderStyle}">
                    <span>${e.jobTitle}</span>
                    <span>${e.startDate} – ${e.endDate}</span>
                </div>
            `);
            blocks.push(`
                <div style="${subHeaderStyle}">
                    <span>${e.employer}</span>
                    <span>${e.city}</span>
                </div>
            `);
            if (e.desc) {
                const subBlocks = createTextBlocks(e.desc, 'padding-left: 20px; position: relative; margin-bottom: 2pt; font-size: 11pt;', 'padding-left');
                blocks.push(...subBlocks);
            }
            blocks.push(`<div style="height: 8pt;"></div>`);
        });
    }

    // Education
    if (r.education.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Education</div>`);
        r.education.forEach(e => {
            blocks.push(`
                <div style="${entryHeaderStyle}">
                    <span>${e.institution}</span>
                    <span>${e.startDate} – ${e.endDate}</span>
                </div>
            `);
            blocks.push(`
                <div style="${subHeaderStyle}">
                    <span>${e.degree}</span>
                    <span>${e.city}</span>
                </div>
            `);
            if (e.desc) {
                const subBlocks = createTextBlocks(e.desc, 'padding-left: 20px; position: relative; margin-bottom: 2pt; font-size: 11pt;', 'padding-left');
                blocks.push(...subBlocks);
            }
            blocks.push(`<div style="height: 8pt;"></div>`);
        });
    }

    // Skills
    if (r.skills.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Skills</div>`);
        const skillItems = r.skills.map(s => `
            <div style="display:flex; align-items:center;">
                <span style="font-weight:bold; margin-right:6px;">• ${s.name}</span>
            </div>
        `).join('');
        blocks.push(`<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6pt; font-size: 11pt;">${skillItems}</div>`);
    }

    // Languages
    if (r.languages.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Languages</div>`);
        const langHtml = r.languages.map(l => {
            const proficiency = l.proficiency && l.proficiency.trim() ? ` (${l.proficiency})` : '';
            return `<div>${l.language}${proficiency}</div>`;
        }).join('');
        blocks.push(`<div style="font-size: 11pt;">${langHtml}</div>`);
    }

    // Projects
    if (r.projects.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Projects</div>`);
        r.projects.forEach(p => {
            blocks.push(`<div style="font-weight:bold; font-size:11pt; margin-bottom: 2pt;">${p.title}</div>`);
            if (p.desc) {
                const subBlocks = createTextBlocks(p.desc, 'padding-left: 20px; position: relative; margin-bottom: 2pt; font-size: 11pt;', 'padding-left');
                blocks.push(...subBlocks);
            }
            blocks.push(`<div style="height: 8pt;"></div>`);
        });
    }

    // Certifications
    if (r.certifications.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Certifications</div>`);
        const certHtml = r.certifications.map(c => `<li>${c.name}</li>`).join('');
        blocks.push(`<ul style="font-size: 11pt; margin: 0; padding-left: 20px;">${certHtml}</ul>`);
    }

    // Awards
    if (r.awards.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">Awards</div>`);
        r.awards.forEach(a => {
            blocks.push(`
                <div style="margin-bottom: 6pt; font-size: 11pt;">
                    <strong>${a.name}</strong> ${a.desc ? `- ${a.desc}` : ''}
                </div>
            `);
        });
    }

    // Interests
    if (r.interests && r.interests.trim()) {
        blocks.push(`<div style="${sectionTitleStyle}">Interests</div>`);
        const subBlocks = createTextBlocks(r.interests, 'font-size: 11pt; margin-bottom: 4pt;');
        blocks.push(...subBlocks);
    }

    // References
    if (r.references.length > 0) {
        blocks.push(`<div style="${sectionTitleStyle}">References</div>`);
        r.references.forEach(ref => {
            blocks.push(`<div style="font-size: 11pt;">${ref.name} (${ref.contact})</div>`);
        });
    }

    // Custom
    if (r.custom.length > 0) {
        r.custom.forEach(c => {
            blocks.push(`<div style="${sectionTitleStyle}">${c.title}</div>`);
            const subBlocks = createTextBlocks(c.content, 'font-size: 11pt; margin-bottom: 4pt;');
            blocks.push(...subBlocks);
        });
    }

    // --- 2. PAGINATE ---
    paginateBlocks(container, blocks);
}

// Helper: Pagination Logic
function paginateBlocks(container, blocks) {
    container.innerHTML = '';

    // A4 Dimensions: 210mm x 297mm
    // Padding: 25.4mm (1 inch) all sides
    // Content Width = 210 - 50.8 = 159.2mm
    // Content Height = 297 - 50.8 = 246.2mm
    // @96DPI: 1mm = 3.78px
    // Content Height in px ~= 930px
    // First Page Height (0.5 cushion) ~= 1026px
    // Page 1: Top 0.5" (12.7mm), Bottom 1" (25.4mm) -> Height: 258.9mm (~978px)
    // Page 2+: Top 1.2" (30.5mm), Bottom 1" (25.4mm) -> Height: 241.1mm (~911px)
    const PAGE_1_HEIGHT = 960; // Maximize Content (Approaching 1 inch bottom limit)
    const PAGE_2_HEIGHT = 960; // Maximize Content (Approaching 1 inch bottom limit)

    // Start with Page 1
    let currentPageIndex = 0;
    let currentMaxHeight = PAGE_1_HEIGHT;

    let currentPage = createPage();
    let currentContentArea = currentPage.querySelector('.page-content');
    container.appendChild(currentPage);

    let currentHeight = 0;

    blocks.forEach(blockHtml => {
        // Measure
        // To measure accurately, we must append to the *same environment* (width, styles)
        const tempDiv = document.createElement('div');
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'relative'; // Keep in flow to measure margins
        tempDiv.innerHTML = blockHtml;
        currentContentArea.appendChild(tempDiv);

        const style = window.getComputedStyle(tempDiv.firstElementChild || tempDiv);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const h = tempDiv.offsetHeight + marginTop + marginBottom;

        currentContentArea.removeChild(tempDiv);

        if (currentHeight + h > currentMaxHeight && currentHeight > 50) {
            // New Page
            currentPage = createPage();
            currentContentArea = currentPage.querySelector('.page-content');
            container.appendChild(currentPage);
            currentHeight = 0;

            // Switch to Page 2+ Height constraint
            currentPageIndex++;
            currentMaxHeight = PAGE_2_HEIGHT;
        }

        const div = document.createElement('div');
        div.innerHTML = blockHtml;
        currentContentArea.appendChild(div);
        currentHeight += h;
    });
}

function createPage() {
    const page = document.createElement('div');
    page.className = 'resume-page';
    page.innerHTML = '<div class="page-content" style="height:100%;"></div>';
    return page;
}
