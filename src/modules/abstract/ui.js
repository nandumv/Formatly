
import { generateDocx } from './generator.js';
import './abstract.css';

// State for the abstract module
let state = {
    title: '',
    abstract: '',
    domain: '',
    keywords: '',
    members: [
        { name: '', reg: '' }
    ],
    guide: {
        name: '',
        dept: '',
        college: ''
    },
    showBorder: true
};

export function initAbstract(container) {
    container.innerHTML = `
        <div class="abstract-layout">
            <!-- Sidebar Form -->
            <div class="abstract-form-container">
                <div class="d-flex justify-between align-center mb-4">
                    <h2>Details</h2>
                    <button class="btn btn-sm" onclick="window.navigate('dashboard')">Back</button>
                </div>
                
                <div class="abstract-form-group">
                    <label>Project Headline</label>
                    <textarea id="projTitle" rows="2" placeholder="Enter your project title...">${state.title}</textarea>
                </div>

                <div class="abstract-form-group">
                    <label>Project Domain</label>
                    <input type="text" id="projDomain" value="${state.domain}" placeholder="e.g. Machine Learning, IoT, Web Development">
                </div>

                <div class="abstract-form-group">
                    <label>Abstract Content <span id="wordCount" style="float:right; font-size:0.75rem; color:#64748b;">0 words</span></label>
                    <textarea id="projAbstract" rows="8" placeholder="Paste your abstract here...">${state.abstract}</textarea>
                </div>

                <div class="abstract-form-group">
                    <label>Keywords</label>
                    <input type="text" id="projKeywords" value="${state.keywords}" placeholder="e.g. Image Processing, Neural Networks (comma separated)">
                </div>

                <div class="abstract-form-group">
                    <label>Group Members (Name - Reg No)</label>
                    <div id="membersContainer"></div>
                    <button class="btn btn-sm btn-outline mt-2" id="addMemberBtn">+ Add Member</button>
                </div>

                <div class="abstract-form-group">
                    <label>Guide Name</label>
                    <input type="text" id="guideName" value="${state.guide.name}">
                </div>

                <div class="abstract-form-group">
                    <label>Guide Designation & Dept</label>
                    <input type="text" id="guideDept" value="${state.guide.dept}" placeholder="e.g. Asst. Prof, CSE">
                </div>

                <div class="abstract-form-group">
                    <label>Guide College</label>
                    <input type="text" id="guideCollege" value="${state.guide.college}" placeholder="College Name">
                </div>

                <div class="abstract-form-group">
                    <label>
                        <input type="checkbox" id="borderCheck" ${state.showBorder ? 'checked' : ''}> Show Border
                    </label>
                </div>

                <div class="d-flex gap-2 mt-4">
                    <button class="btn btn-primary w-full" id="downloadPdf">Download PDF</button>
                    <button class="btn btn-outline w-full" id="downloadDocx">Download Word</button>
                </div>
            </div>

            <!-- Preview Area -->
            <div class="abstract-preview-container">
                <div id="previewPaper" class="abstract-paper">
                    ${renderPreviewContent()}
                </div>
            </div>
        </div>
    `;

    // Initialize Event Listeners
    attachListeners();
    renderMembersInputs();
}

function renderPreviewContent() {
    const borderClass = state.showBorder ? 'border-outer' : '';
    const innerClass = state.showBorder ? 'border-inner' : '';

    // --- DYNAMIC LIMIT CALCULATION ---
    // A4 Page (1 inch margin) holds approx 30-40 lines of text total.
    // Each member takes up vertical space. We must reduce the text limits based on members.
    const BASE_CHARS_PAGE_1 = 1800; // Text only
    const CHARS_PER_MEMBER = 150; // Heuristic cost per member (name + reg + spacing)
    const GUIDE_COST = 400; // Guide section cost similar to 2-3 members

    // Calculate total signature cost
    const signatureCost = (state.members.length * CHARS_PER_MEMBER) + GUIDE_COST;

    // Safe limit for Page 1 text
    const CHARS_PER_PAGE_1 = Math.max(500, BASE_CHARS_PAGE_1 - signatureCost);
    const CHARS_PER_PAGE_N = 2800; // Full page text

    let remainingText = state.abstract;
    let pages = [];
    let pageNum = 1;

    // --- PAGE 1 ---
    let splitIndex = remainingText.length > CHARS_PER_PAGE_1 ? findSplitIndex(remainingText, CHARS_PER_PAGE_1) : remainingText.length;
    let page1Text = remainingText.substring(0, splitIndex).replace(/\n/g, '<br>');
    remainingText = remainingText.substring(splitIndex);

    let page1Content = `
        <div class="${borderClass}" style="min-height: 297mm; height: 297mm; overflow: hidden;">
            <div class="${innerClass}">
                <div class="project-title">
                    ${state.title}
                    ${state.domain ? `<div class="project-domain" style="font-size: 12pt; font-weight: normal; margin-top: 0.5rem; text-transform: none;">(${state.domain})</div>` : ''}
                </div>
                
                <div class="abstract-heading">ABSTRACT</div>
                
                <div class="abstract-content">
                    ${page1Text}
                </div>
                
                ${remainingText.length === 0 ? renderSignatureAndKeywords() : ''}
            </div>
        </div>
    `;
    pages.push(page1Content);

    // --- SUBSEQUENT PAGES ---
    while (remainingText.length > 0) {
        pageNum++;
        let limit = CHARS_PER_PAGE_N;

        // If this is likely the last page, check if signature fits
        // If valid text < limit but adding signature exceeds limit, we might need another page
        // For simplicity, just fill text.

        splitIndex = remainingText.length > limit ? findSplitIndex(remainingText, limit) : remainingText.length;
        let pageText = remainingText.substring(0, splitIndex).replace(/\n/g, '<br>');
        remainingText = remainingText.substring(splitIndex);

        let isLastPage = remainingText.length === 0;

        let pageContent = `
            <div class="${borderClass}" style="min-height: 297mm; height: 297mm; overflow: hidden; margin-top: 2rem;">
                <div class="${innerClass}">
                    <div class="abstract-content" style="margin-top: 0;">
                        ${pageText}
                    </div>
                    ${isLastPage ? renderSignatureAndKeywords() : ''}
                </div>
            </div>
        `;
        pages.push(pageContent);
    }

    return pages.join('');
}

function findSplitIndex(text, limit) {
    // Look for a period or space near the limit to avoid cutting words
    let lookback = 100;
    let stub = text.substring(limit - lookback, limit);
    let lastPeriod = stub.lastIndexOf('.');

    if (lastPeriod !== -1) {
        return limit - lookback + lastPeriod + 1;
    }

    let lastSpace = stub.lastIndexOf(' ');
    if (lastSpace !== -1) {
        return limit - lookback + lastSpace + 1;
    }

    return limit;
}

function renderSignatureAndKeywords() {
    return `
        ${state.keywords ? `
        <div class="keywords-section" style="margin-top: 1rem; font-size: 12pt;">
            <strong>Keywords:</strong> ${state.keywords}
        </div>` : ''}

        <div class="signature-section">
            <div class="group-members">
                <div class="section-label">GROUP MEMBERS</div>
                <ul class="member-list">
                    ${state.members.map(m => `<li class="member-item">${m.name} ${m.reg ? `(${m.reg})` : ''}</li>`).join('')}
                </ul>
            </div>

            <div class="guide-details">
                <div class="section-label">GUIDE</div>
                <div class="guide-name" style="font-weight:bold">${state.guide.name}</div>
                <div class="guide-dept">${state.guide.dept}</div>
                <div class="guide-college">${state.guide.college}</div>
            </div>
        </div>
    `;
}

function renderMembersInputs() {
    const container = document.getElementById('membersContainer');
    if (!container) return;

    container.innerHTML = state.members.map((m, index) => `
        <div class="member-row">
            <input type="text" placeholder="Name" value="${m.name}" onchange="updateMember(${index}, 'name', this.value)">
            <input type="text" placeholder="Reg No" value="${m.reg}" style="width: 60px" onchange="updateMember(${index}, 'reg', this.value)">
            <button class="text-red-500" onclick="removeMember(${index})">×</button>
        </div>
    `).join('');
}

// Expose internal functions to window for inline onclicks (careful with module scope)
window.updateMember = (index, field, value) => {
    state.members[index][field] = value;
    updatePreview();
};

window.removeMember = (index) => {
    state.members.splice(index, 1);
    renderMembersInputs();
    updatePreview();
};

function attachListeners() {
    document.getElementById('projTitle').addEventListener('input', (e) => {
        state.title = e.target.value;
        updatePreview();
    });

    document.getElementById('projAbstract').addEventListener('input', (e) => {
        state.abstract = e.target.value;
        updateWordCount(e.target.value);
        updatePreview();
    });

    document.getElementById('projDomain').addEventListener('input', (e) => {
        state.domain = e.target.value;
        updatePreview();
    });

    document.getElementById('projKeywords').addEventListener('input', (e) => {
        state.keywords = e.target.value;
        updatePreview();
    });

    document.getElementById('guideName').addEventListener('input', (e) => {
        state.guide.name = e.target.value;
        updatePreview();
    });

    document.getElementById('guideDept').addEventListener('input', (e) => {
        state.guide.dept = e.target.value;
        updatePreview();
    });

    document.getElementById('guideCollege').addEventListener('input', (e) => {
        state.guide.college = e.target.value;
        updatePreview();
    });

    document.getElementById('borderCheck').addEventListener('change', (e) => {
        state.showBorder = e.target.checked;
        updatePreview();
    });

    document.getElementById('addMemberBtn').addEventListener('click', () => {
        state.members.push({ name: '', reg: '' });
        renderMembersInputs();
        updatePreview();
    });

    document.getElementById('downloadPdf').addEventListener('click', () => {
        // Only select the first page wrapper? No, we likely want all pages.
        // But html2pdf takes one element. We need to wrap all pages in a container if they aren't already.
        // Fortunately 'previewPaper' is the container, and we append pages to it.
        // BUT, 'previewPaper' currently has .abstract-paper class which gives it the white BG shadow.
        // We should change that structure. 'previewPaper' should be a transparent container, 
        // and inner divs should be the papers.

        const element = document.getElementById('previewPaper');
        const opt = {
            margin: [0, 0, 0, 0], // No marging as we handle it in CSS
            filename: 'abstract.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // strict page break
        };
        // Ensure html2pdf is available globally or imported
        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            // Lazy load if needed or alert
            import('html2pdf.js').then(module => {
                module.default().set(opt).from(element).save();
            });
        }
    });

    document.getElementById('downloadDocx').addEventListener('click', () => {
        generateDocx(state);
    });
}

function updatePreview() {
    const paper = document.getElementById('previewPaper');
    if (paper) {
        paper.innerHTML = renderPreviewContent();
    }
}

function updateWordCount(text) {
    const count = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const el = document.getElementById('wordCount');
    if (el) el.textContent = `${count} words`;
}
