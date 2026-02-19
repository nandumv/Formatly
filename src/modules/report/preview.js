// Project Report Generator — Live Preview Renderer
import { reportState } from './state.js';

// Constants for A4 Page Layout
// 96 DPI: 1mm approx 3.78px
// A4 Height: 297mm ~ 1122px
// Margins: Top 1" (96px), Bottom 1" (96px)
// Writable Height: 1122 - 192 = 930px (approx)
const PAGE_HEIGHT_PX = 1122;
const MARGIN_TOP_PX = 96;
const MARGIN_BOTTOM_PX = 96;
const WRITABLE_HEIGHT = PAGE_HEIGHT_PX - MARGIN_TOP_PX - MARGIN_BOTTOM_PX;

export function renderFullPreview(container) {
    if (!container) return;
    container.innerHTML = ''; // Clear previous preview

    const s = reportState.get();

    // 1. Cover Page (Always separate)
    container.appendChild(createPage(renderCoverPageHTML(s)));

    // 2. Front Matter (Certificate, Decl, Ack, Abstract)
    // These typically start on new pages.
    if (s.certificateText || s.guideName) {
        container.appendChild(createPage(renderCertificatePageHTML(s)));
    }

    if (s.declarationText || s.members.some(m => m.name)) {
        container.appendChild(createPage(renderFrontMatterPageHTML('Declaration', s.declarationText || generateDeclText(s), s)));
    }

    // Always render Acknowledgement as it is now auto-generated
    container.appendChild(createPage(renderFrontMatterPageHTML('Acknowledgement', '', s)));

    if (s.abstract) {
        container.appendChild(createPage(renderFrontMatterPageHTML('Abstract', s.abstract, s)));
    }

    // 3. TOC (For now, single page assumed, but could paginate if needed)
    container.appendChild(createPage(renderTOCHTML(s)));

    // 4. Chapters (Pagination Logic)
    let pageNum = 1;

    // Helper to process chapters
    // We render into a "virtual" column and check heights

    s.chapters.forEach((ch, ci) => {
        // Start a new page for each chapter
        let currentPage = createPage();
        container.appendChild(currentPage);
        addPageNumber(currentPage, pageNum);

        let contentArea = currentPage.querySelector('.page-content');

        // Chapter Heading
        const headingHTML = `<div class="chapter-heading">Chapter ${ci + 1}<br>${escH(ch.title)}</div>`;
        appendOrPaginate(container, currentPage, contentArea, headingHTML, () => {
            pageNum++;
            currentPage = createPage();
            container.appendChild(currentPage);
            addPageNumber(currentPage, pageNum);
            return currentPage.querySelector('.page-content');
        });

        // Subsections
        ch.subsections.forEach((sub, si) => {
            // Diagram
            if (sub.image) {
                let figCount = 0; // Need global fig count logic if we want perfect numbering, passing for now
                const html = `
                <div class="figure-container" style="margin-bottom: 2rem;">
                    <img src="${sub.image}" alt="${escH(sub.caption)}" style="width: ${sub.width || 75}%; max-width: 100%; display:block; margin: 0 auto;" />
                    <div class="figure-caption" style="text-align:center; margin-top:0.5rem; font-style:italic;">Figure ${ci + 1}.${si + 1}: ${escH(sub.caption)}</div>
                </div>`;

                contentArea = appendOrPaginate(container, currentPage, contentArea, html, () => {
                    pageNum++;
                    currentPage = createPage();
                    container.appendChild(currentPage);
                    addPageNumber(currentPage, pageNum);
                    return currentPage.querySelector('.page-content');
                });
                return;
            }

            // Text Heading
            if (sub.title) {
                const html = `<div class="chapter-subheading" style="font-weight:bold; margin-top:1rem; margin-bottom:0.5rem;">${ci + 1}.${si + 1} ${escH(sub.title)}</div>`;
                contentArea = appendOrPaginate(container, currentPage, contentArea, html, () => {
                    pageNum++;
                    currentPage = createPage();
                    container.appendChild(currentPage);
                    addPageNumber(currentPage, pageNum);
                    return currentPage.querySelector('.page-content');
                });
            }

            // Text Content
            if (sub.content) {
                const paras = sub.content.split('\n').filter(p => p.trim());
                paras.forEach(p => {
                    const html = `<p style="text-align:justify; margin-bottom:0.8rem;">${escH(p)}</p>`;
                    contentArea = appendOrPaginate(container, currentPage, contentArea, html, () => {
                        pageNum++;
                        currentPage = createPage();
                        container.appendChild(currentPage);
                        addPageNumber(currentPage, pageNum);
                        return currentPage.querySelector('.page-content');
                    });
                });
            }
        });

        pageNum++; // Increment for the start of next chapter or section
    });

    // 5. References
    if (s.references && s.references.trim()) {
        const refs = s.references.split('\n').filter(r => r.trim());
        let currentPage = createPage();
        container.appendChild(currentPage);
        addPageNumber(currentPage, pageNum);
        let contentArea = currentPage.querySelector('.page-content');

        appendOrPaginate(container, currentPage, contentArea, `<div class="chapter-heading">References</div>`, () => {
            pageNum++;
            currentPage = createPage();
            container.appendChild(currentPage);
            addPageNumber(currentPage, pageNum);
            return currentPage.querySelector('.page-content');
        });

        refs.forEach((r, i) => {
            const html = `<p style="text-indent:0; margin-bottom:0.5rem;">[${i + 1}] ${escH(r)}</p>`;
            contentArea = appendOrPaginate(container, currentPage, contentArea, html, () => {
                pageNum++;
                currentPage = createPage();
                container.appendChild(currentPage);
                addPageNumber(currentPage, pageNum);
                return currentPage.querySelector('.page-content');
            });
        });
    }
}

// --- Pagination Helpers ---

function createPage(initialHTML = '') {
    const page = document.createElement('div');
    page.className = 'report-paper';
    // We use a content wrapper to enforce writable area
    // The padding is on .report-paper, so this div fills the inner area
    page.innerHTML = `<div class="page-content" style="height:100%; width:100%;">
        ${initialHTML}
    </div>`;
    return page;
}

function addPageNumber(page, num) {
    const div = document.createElement('div');
    div.className = 'page-number';
    div.innerText = num;
    div.style.position = 'absolute';
    div.style.bottom = '1rem';
    div.style.left = '0';
    div.style.right = '0';
    div.style.textAlign = 'center';
    page.appendChild(div);
}

// Appends HTML to contentArea. If it overflows, calls onNewPage(), gets new contentArea, and appends there.
// Returns the active contentArea (which might be the new one).
function appendOrPaginate(container, page, contentArea, html, onNewPage) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // We need to append to measure. 
    // Optimization: Loop through children if it's a block of stuff, but here we usually pass single blocks.
    const element = tempDiv.firstElementChild;
    if (!element) return contentArea;

    contentArea.appendChild(element);

    // Measure
    // .report-paper has explicit height/padding. 
    // We can check if contentArea.scrollHeight > contentArea.clientHeight
    // However, contentArea height is 100% of parent minus padding.
    // Simpler: getBoundingClientRect

    // Check if element bottom is past the writable area
    // The visual "bottom" of the writable area within the page
    // We know valid height is approx WRITABLE_HEIGHT. 
    // But better: check if the ScrollHeight of page-content exceeds its clientHeight? 
    // The page-content div (height:100%) will be limited by .report-paper min-height.
    // But .report-paper actually expands if min-height is exceeded? 
    // CSS says "min-height: 297mm". If we just overflow, it looks bad. We want to stop.

    // Let's assume fixed writable height per page for "triggering" a break.
    // 297mm = 1122px. Padding top+bottom = 2in = 192px. Writable = 930px.

    // Calculate current used height
    const totalUsed = Array.from(contentArea.children).reduce((acc, el) => acc + el.offsetHeight + getMarginBottom(el), 0);

    // If we exceeded correct height (~930px for A4 minus 2" v-margins)
    if (totalUsed > 930) {
        // Move element to new page
        contentArea.removeChild(element);
        const newContentArea = onNewPage();
        newContentArea.appendChild(element);
        return newContentArea;
    }

    return contentArea;
}

function getMarginBottom(el) {
    const style = window.getComputedStyle(el);
    return parseFloat(style.marginBottom) || 0;
}

// --- HTML Generators (returning strings) ---

function renderCoverPageHTML(s) {
    const memberLines = s.members.filter(m => m.name).map(m =>
        `<div style="font-size:14pt;font-weight:bold;text-transform:uppercase; margin-bottom: 0.25rem;">${escH(m.name)}${m.regNo ? ` (${escH(m.regNo)})` : ''}</div>`
    ).join('');

    return `
        <div class="cover-page" style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:space-between; text-align:center; padding: 2rem 0;">
             <div class="cover-project-title" style="margin-top:2rem; font-size:18pt; font-weight:bold; text-transform:uppercase;">
                ${s.projectTitle ? s.projectTitle.toUpperCase() : '<span class="placeholder-text">PROJECT TITLE</span>'}
            </div>
            
             <div style="font-size:16pt;font-weight:bold;text-transform:uppercase;">
                ${s.reportType || 'MINI PROJECT REPORT'}
            </div>

            <div>
                <div style="font-size:12pt;font-style:italic; margin-bottom: 1rem;">Submitted by</div>
                ${memberLines || '<span class="placeholder-text">Member Names</span>'}
            </div>

            <div>
                <div style="font-size:12pt;font-style:italic; margin-bottom: 0.5rem;">Under the guidance of</div>
                <div style="font-size:16pt;font-weight:bold;text-transform:uppercase; margin-bottom: 0.25rem;">
                    ${s.guideName || '<span class="placeholder-text">Guide Name</span>'}
                </div>
                ${s.guideDesignation ? `<div style="font-size:12pt;font-style:italic;">${escH(s.guideDesignation)}</div>` : ''}
                ${s.departmentName ? `<div style="font-size:12pt;font-weight:bold;font-style:italic;">Department of ${escH(s.departmentName)}</div>` : ''}
                ${s.collegeName ? `<div style="font-size:12pt;font-weight:bold;font-style:italic;">${escH(s.collegeName)}</div>` : ''}
            </div>

            <div style="font-size:12pt;">to</div>

            ${s.universityName ? `<div style="font-size:14pt;font-weight:bold;">the ${escH(s.universityName)}${s.collegeAddress ? `, ${escH(s.collegeAddress)}` : ''}</div>` : ''}

            <div>
                <div style="font-size:12pt;">in partial fulfillment of the requirements for the award of</div>
                <div style="font-size:14pt; font-weight:bold;">
                    ${s.degreeName || s.course || '<span class="placeholder-text">Degree Name</span>'}
                </div>
            </div>

            ${s.universityLogo ? `<img src="${s.universityLogo}" style="max-width:140px;max-height:140px;object-fit:contain;" alt="Logo" />` : ''}
            
             <div style="margin-top:1rem;">
                ${s.departmentName ? `<div style="font-size:14pt;font-weight:bold;">Department of ${escH(s.departmentName)}</div>` : ''}
                ${s.collegeName ? `<div style="font-size:12pt;">${escH(s.collegeName)}${s.collegeAddress ? `, ${escH(s.collegeAddress)}` : ''}</div>` : ''}
            </div>
        </div>`;
}

function renderFrontMatterPageHTML(title, content, s) {
    let innerHTML = '';

    if (title === 'Declaration') {
        const s = reportState.get(); // Access state directly if needed, or rely on passed content if it was pre-formatted. 
        // Better to re-generate the declaration HTML here to ensure it matches the specific requirements
        const declMemberNames = s.members.filter(m => m.name).map(m => m.name.toUpperCase()).join(', ');

        innerHTML = `
            <p style="text-align:justify; margin-bottom:0.8rem; font-size: 14pt; line-height: 1.6;">
                We hereby certify that the work which is being presented in the Project stage Entitled "<b>${escH((s.projectTitle || '').toUpperCase())}</b>" by <b>${escH(declMemberNames)}</b> in partial fulfilment of requirements for the award of degree of ${escH(s.degreeName || 'B. Tech')} in the Department of ${escH(s.departmentName || 'Computer Science')} at <b>${escH((s.collegeName || 'COLLEGE NAME').toUpperCase())}</b> under <b>${escH((s.universityName || 'UNIVERSITY NAME').toUpperCase())}</b> is an authentic record of our own work carried out during a period ${escH(s.academicYear || '202X-202X')}. The matter presented in this project has not been submitted by us or anybody else in any other University / Institute for the award of ${escH(s.degreeName || 'B. Tech')} Degree.
            </p>
            <div style="margin-top: 5rem; display: flex; justify-content: space-between; font-size: 14pt;">
                <div>Date :</div>
                <div>Signature :</div>
            </div>
        `;
    } else if (title === 'Acknowledgement') {
        // s is guaranteed to be passed now
        if (!s) s = reportState.get();

        innerHTML = `
            <p style="text-align:justify; margin-bottom:1.5rem; font-size: 14pt; line-height: 1.6;">
                First and foremost, we sincerely thank the Almighty for his grace for the successful and timely completion of the stage of our project "<b>${escH((s.projectTitle || '').toUpperCase())}</b>". We are greatly indebted to all those who helped us to make this project successful.
            </p>
            <p style="text-align:justify; margin-bottom:1.5rem; font-size: 14pt; line-height: 1.6;">
                We are also grateful to <b>${escH(s.principalName || '[Principal Name]')}</b>, Principal, ${escH(s.collegeName || '[College Name]')}, for providing us with the best facilities and atmosphere for our project development. We also wish to express our gratitude to <b>${escH(s.hodName || '[HOD Name]')}</b>, ${escH(s.hodDesignation || 'Head of Department')}, Department of ${escH(s.departmentName || '[Department]')}. We owe special thanks to our Project Guide <b>${escH(s.guideName || '[Guide Name]')}</b>, ${escH(s.guideDesignation || 'Assistant Professor')}, Department of ${escH(s.guideDepartment || s.departmentName || '[Department]')} and our coordinators <b>${escH(s.coordinator1Name || '[Coordinator 1]')}</b> and <b>${escH(s.coordinator2Name || '[Coordinator 2]')}</b>, ${escH(s.coordinator1Designation || 'Assistant Professors')}, Department of ${escH(s.departmentName || '[Department]')}, for their corrections, valuable and countless suggestions, support and timely guidance.
            </p>
            <p style="text-align:justify; margin-bottom:1.5rem; font-size: 14pt; line-height: 1.6;">
                Finally, but not least we would like to acknowledge our friends who were inevitable for the successful completion of this project.
            </p>
        `;
    } else {
        innerHTML = content ? content.split('\n').filter(p => p.trim()).map(p => `<p style="text-align:justify; margin-bottom:0.8rem;">${escH(p)}</p>`).join('') : '';
    }

    return `
        <div class="front-matter-page">
            <h2 style="text-align:center; text-transform:uppercase; margin-bottom:3rem; font-size: 16pt; font-weight: bold;">${title}</h2>
            ${innerHTML || `<p class="placeholder-text">No content yet...</p>`}
        </div>`;
}

function renderTOCHTML(s) {
    let entries = '';
    const frontItems = ['Certificate', 'Declaration', 'Acknowledgement', 'Abstract'];
    frontItems.forEach(item => {
        entries += `<div class="toc-entry" style="display:flex; justify-content:space-between; margin-bottom:0.5rem;"><span>${item}</span><span>—</span></div>`;
    });

    s.chapters.forEach((ch, ci) => {
        entries += `<div class="toc-entry chapter-entry" style="display:flex; justify-content:space-between; margin-top:1rem; font-weight:bold;"><span>Chapter ${ci + 1}: ${escH(ch.title)}</span><span>${ci + 1}</span></div>`;
        ch.subsections.forEach((sub, si) => {
            if (sub.title) {
                entries += `<div class="toc-entry" style="display:flex; justify-content:space-between; padding-left:1.5rem; font-size:11pt;"><span>${ci + 1}.${si + 1} ${escH(sub.title)}</span><span>${ci + 1}</span></div>`;
            }
        });
    });

    if (s.references && s.references.trim()) {
        entries += `<div class="toc-entry chapter-entry" style="display:flex; justify-content:space-between; margin-top:1rem; font-weight:bold;"><span>References</span><span>${s.chapters.length + 1}</span></div>`;
    }

    return `
        <div class="front-matter-page">
            <h2 style="text-align:center; text-transform:uppercase; margin-bottom:2rem;">Table of Contents</h2>
            ${entries}
        </div>`;
}

function renderCertificatePageHTML(s) {
    const certText = s.certificateText || generateCertText(s);

    function sigBlock(name, role, designation, dept, college) {
        if (!name) return '';
        return `
        <div style="flex:1;min-width:45%; text-align:left; font-size: 14pt; line-height: 1.5;">
            <div style="font-weight:bold;margin-bottom:2px;">${escH(name)}</div>
            ${role ? `<div style="">(${escH(role)})</div>` : ''}
            ${designation ? `<div style="">${escH(designation)}</div>` : ''}
            ${dept ? `<div style="">Department of ${escH(dept)},</div>` : ''}
            ${college ? `<div style="">${escH(college)}</div>` : ''}
        </div>`;
    }

    const row1Left = sigBlock(s.guideName, 'Project Guide', s.guideDesignation, s.guideDepartment || s.departmentName, s.collegeName);
    const row1Right = sigBlock(s.coordinator1Name, 'Project Coordinator', s.coordinator1Designation, s.coordinator1Department || s.departmentName, s.collegeName);
    const row2Left = sigBlock(s.coordinator2Name, 'Project Coordinator', s.coordinator2Designation, s.coordinator2Department || s.departmentName, s.collegeName);
    const row2Right = sigBlock(s.hodName, s.hodDesignation || 'HOD', s.hodDesignation ? '' : '', s.hodDepartment || s.departmentName, s.collegeName);

    return `
        <div class="front-matter-page" style="display:flex;flex-direction:column; height:100%; padding: 1rem 0;">
             <div style="text-align:center;margin-bottom:2rem;">
                <div style="font-size:16pt;font-weight:bold;text-transform:uppercase; margin-bottom: 0.5rem;">${escH(s.collegeName) || 'College Name'}${s.collegeAddress ? `, ${escH(s.collegeAddress)}` : ''}</div>
                <div style="font-size:14pt;font-weight:bold;text-transform:uppercase;">${s.departmentName ? `DEPARTMENT OF ${s.departmentName.toUpperCase()}` : 'DEPARTMENT'}</div>
            </div>

            ${(s.certificateLogo || s.universityLogo) ? `<div style="text-align:center;margin:1rem 0 2rem;"><img src="${s.certificateLogo || s.universityLogo}" style="max-width:140px;max-height:140px;object-fit:contain;" alt="Logo" /></div>` : ''}

            <h2 style="text-align:center;font-size:20pt;font-weight:bold;text-transform:uppercase;margin:1rem 0 3rem;text-decoration:none;letter-spacing:2px;color:#000;">Certificate</h2>

            <p style="text-align:justify;line-height:1.6;font-size:14pt;margin-bottom:auto;">${certText}</p>

             <div style="margin-top:3rem;">
                ${(row1Left || row1Right) ? `<div style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:3rem;">${row1Left}${row1Right}</div>` : ''}
                ${(row2Left || row2Right) ? `<div style="display:flex;justify-content:space-between;gap:1rem;">${row2Left}${row2Right}</div>` : ''}
            </div>
        </div>`;
}

// Helpers
function escH(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateCertText(s) {
    const memberList = s.members.filter(m => m.name).map(m => `${m.name.toUpperCase()}${m.regNo ? ` (${m.regNo})` : ''}`).join(', ') || '[Member Names]';
    return `Certified that this report entitled '${s.projectTitle || '[Project Title]'}' is the report of ${(s.reportType || 'mini project').toLowerCase()} presented by ${memberList} during the year (${s.academicYear || '[Year]'}) in partial fulfilment of the requirements for the award of the Degree of ${s.degreeName || s.course || '[Degree]'} of the ${s.universityName || '[University Name]'}${s.collegeAddress ? `, ${s.collegeAddress}` : ''}.`;
}

function generateDeclText(s) {
    const names = s.members.filter(m => m.name).map(m => m.name).join(', ') || '[Member Names]';
    return `We, ${names}, hereby declare that the project entitled "${s.projectTitle || '[Project Title]'}" submitted in partial fulfillment for the award of the degree is a record of original work done by us under the guidance of ${s.guideName || '[Guide Name]'}.`;
}
