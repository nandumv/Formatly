
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

function sanitizeState() {
    // Fix: Prevent URL injection bug (browser autofill/clipboard loop)
    const currentURL = window.location.href.toLowerCase();
    const origin = window.location.origin.toLowerCase();

    // Helper to check for unwanted strings case-insensitively
    const invalid = (text) => {
        if (!text) return false;
        const s = text.toLowerCase();
        return s.includes(currentURL) ||
            s.includes(origin) ||
            s.includes("localhost") ||
            s.includes("127.0.0.1") ||
            s.includes("http") ||
            s.includes("startup error") ||
            s.includes("error loading");
    };

    if (invalid(state.title)) {
        console.warn("Sanitized state.title containing garbage/URL");
        state.title = '';
    }

    if (invalid(state.abstract)) {
        console.warn("Sanitized state.abstract containing garbage/URL");
        state.abstract = '';
    }
}

export function initAbstract(container) {
    sanitizeState();

    container.innerHTML = `
        <div class="abstract-layout">
            <!-- Sidebar Form -->
            <div class="abstract-form-container">
                <div class="d-flex justify-between align-center mb-4">
                    <div class="d-flex align-center gap-2">
                        <button onclick="window.routeTo('dashboard')" title="Back to Home" style="background:none; border:none; cursor:pointer; color:#64748b; padding:0.4rem; border-radius:50%; transition:all 0.2s; display:flex; align-items:center;" onmouseover="this.style.background='#f1f5f9'; this.style.color='#4f46e5'" onmouseout="this.style.background='transparent'; this.style.color='#64748b'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h2>Details</h2>
                    </div>
                    <button class="btn btn-sm btn-outline" id="resetFormBtn" title="Clear all fields">Reset</button>
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
                <div id="previewPaper">
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
    const BASE_CHARS_PAGE_1 = 3450; // Increased to 3450 to fill more vertical space (0.5" margin)

    // Check for valid members (not default empty strings)
    const validMembers = state.members ? state.members.filter(m => m.name.trim() || m.reg.trim()) : [];
    const validGuide = state.guide && (state.guide.name.trim() || state.guide.dept.trim() || state.guide.college.trim());
    const hasKeywords = state.keywords ? state.keywords.trim() : '';

    const KEYWORD_COST = hasKeywords ? 100 : 0;
    const MEMBER_HEADER_COST = validMembers.length > 0 ? 100 : 0;
    const MEMBER_ITEM_COST = 60; // 1 line per member
    const GUIDE_COST = validGuide ? 300 : 0; // Guide header + 3 lines

    // Calculate total signature cost (Only if valid)
    const signatureCost = KEYWORD_COST + MEMBER_HEADER_COST + (validMembers.length * MEMBER_ITEM_COST) + GUIDE_COST;

    // Safe limit for Page 1 text (Recover space if signature empty)
    const CHARS_PER_PAGE_1 = Math.max(500, BASE_CHARS_PAGE_1 - signatureCost);
    const CHARS_PER_PAGE_N = 3400; // Full page text (0.5" margin)

    let remainingText = state.abstract || '';
    let pages = [];
    let pageNum = 1;

    // --- PAGE 1 ---
    let splitIndex = remainingText.length > CHARS_PER_PAGE_1 ? findSplitIndex(remainingText, CHARS_PER_PAGE_1) : remainingText.length;
    let page1Text = remainingText.substring(0, splitIndex).replace(/\n/g, '<br>');
    remainingText = remainingText.substring(splitIndex);

    let page1Content = `
        <div class="abstract-page">
            <div class="${borderClass}" style="flex: 1; display: flex; flex-direction: column;">
                <div class="${innerClass}" style="flex: 1; display: flex; flex-direction: column;">
                    <div class="project-title">
                        ${state.title}
                        ${state.domain ? `<div class="project-domain" style="font-size: 12pt; font-weight: normal; margin-top: 0.5rem; text-transform: none;">(${state.domain})</div>` : ''}
                    </div>
                    
                    <div class="abstract-heading">ABSTRACT</div>
                    
                    <div class="abstract-content">
                        ${page1Text}
                    </div>
                    
                    ${remainingText.length === 0 ? renderSignatureAndKeywords(validMembers, validGuide, hasKeywords) : ''}
                </div>
            </div>
        </div>
    `;
    pages.push(page1Content);

    // --- SUBSEQUENT PAGES ---
    let loopGuard = 0;
    while (remainingText.length > 0 && loopGuard < 50) {
        loopGuard++;
        pageNum++;
        let limit = CHARS_PER_PAGE_N;

        splitIndex = remainingText.length > limit ? findSplitIndex(remainingText, limit) : remainingText.length;
        if (splitIndex <= 0) splitIndex = limit; // Force progress if split fails

        let pageText = remainingText.substring(0, splitIndex).replace(/\n/g, '<br>');
        remainingText = remainingText.substring(splitIndex);

        let isLastPage = remainingText.length === 0;

        let pageContent = `
            <div class="abstract-page">
                <div class="${borderClass}" style="flex: 1; display: flex; flex-direction: column;">
                    <div class="${innerClass}" style="flex: 1; display: flex; flex-direction: column;">
                        <div class="abstract-content continuation">
                            ${pageText}
                        </div>
                        ${isLastPage ? renderSignatureAndKeywords(validMembers, validGuide, hasKeywords) : ''}
                    </div>
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

function renderSignatureAndKeywords(validMembers, validGuide, hasKeywords) {
    // Only render what exists
    const keywordHTML = hasKeywords ? `
        <div class="keywords-section" style="margin-top: 1rem; font-size: 12pt;">
            <strong>Keywords:</strong> ${state.keywords}
        </div>` : '';

    const membersHTML = validMembers && validMembers.length > 0 ? `
        <div class="group-members">
            <div class="section-label">GROUP MEMBERS</div>
            <ul class="member-list">
                ${validMembers.map(m => `<li class="member-item">${m.name} ${m.reg ? `(${m.reg})` : ''}</li>`).join('')}
            </ul>
        </div>` : '';

    const guideHTML = validGuide ? `
        <div class="guide-details">
            <div class="section-label">GUIDE</div>
            <div class="guide-name" style="font-weight:bold">${state.guide.name}</div>
            <div class="guide-dept">${state.guide.dept}</div>
            <div class="guide-college">${state.guide.college}</div>
        </div>` : '';

    // If no signature info, return empty slightly faster but structure matters
    if (!keywordHTML && !membersHTML && !guideHTML) return '';

    return `
        ${keywordHTML}
        <div class="signature-section">
            ${membersHTML}
            ${guideHTML}
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
        const element = document.getElementById('previewPaper');
        if (!element) return;

        const timestamp = new Date().toISOString().slice(0, 10);
        const pages = element.querySelectorAll('.abstract-page');
        const originalPageStyles = [];

        // 1. Prepare for Export (Trim Height, Remove Gaps)
        pages.forEach((page, i) => {
            originalPageStyles.push({
                marginBottom: page.style.marginBottom,
                boxShadow: page.style.boxShadow,
                minHeight: page.style.minHeight,
                maxHeight: page.style.maxHeight,
                overflow: page.style.overflow,
                border: page.style.border
            });

            // Enforce Strict A4 Export
            page.style.minHeight = '294mm'; // 3mm safety trim
            page.style.maxHeight = '294mm';
            page.style.overflow = 'hidden';
            page.style.marginBottom = '0';
            page.style.boxShadow = 'none';
            page.style.border = 'none'; // Remove visual debug borders if any

            // Remove break from last page
            if (i === pages.length - 1) {
                page.style.pageBreakAfter = 'auto';
            }
        });

        const opt = {
            margin: 0,
            filename: `Abstract_${timestamp}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const restoreStyles = () => {
            pages.forEach((page, i) => {
                if (originalPageStyles[i]) {
                    page.style.marginBottom = originalPageStyles[i].marginBottom;
                    page.style.boxShadow = originalPageStyles[i].boxShadow;
                    page.style.minHeight = originalPageStyles[i].minHeight;
                    page.style.maxHeight = originalPageStyles[i].maxHeight;
                    page.style.overflow = originalPageStyles[i].overflow;
                    page.style.border = originalPageStyles[i].border;
                    page.style.pageBreakAfter = ''; // Clear inline
                }
            });
        };

        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save().then(restoreStyles).catch(restoreStyles);
        } else {
            import('html2pdf.js').then(module => {
                module.default().set(opt).from(element).save().then(restoreStyles).catch(restoreStyles);
            });
        }
    });

    document.getElementById('resetFormBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the form?')) {
            state.title = '';
            state.abstract = '';
            state.domain = '';
            state.keywords = '';
            state.members = [{ name: '', reg: '' }];
            state.guide = { name: '', dept: '', college: '' };
            initAbstract(document.querySelector('#app')); // Re-init to update inputs
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
