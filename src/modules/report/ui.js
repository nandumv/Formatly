// Project Report Generator — Main UI Entry
import { reportState } from './state.js';
import {
    renderProjectDetails, renderMembersGuide, renderCoverPageSettings,
    renderCertificate, renderDeclaration, renderAcknowledgement,
    renderAbstract, renderChapters, renderDiagrams, renderReferences,
    renderPreviewExport, generateCertificateText, generateDeclarationText
} from './sections.js';
import { renderFullPreview } from './preview.js';
import './report.css';

const SECTIONS = [
    { id: 'details', icon: '📋', label: 'Project Details', render: renderProjectDetails },
    { id: 'members', icon: '👥', label: 'Members & Guide', render: renderMembersGuide },
    { id: 'cover', icon: '🎨', label: 'Cover Page', render: renderCoverPageSettings },
    { id: 'certificate', icon: '📜', label: 'Certificate', render: renderCertificate },
    { id: 'declaration', icon: '✍️', label: 'Declaration', render: renderDeclaration },
    { id: 'acknowledgement', icon: '🙏', label: 'Acknowledgement', render: renderAcknowledgement },
    { id: 'abstract', icon: '📄', label: 'Abstract', render: renderAbstract },
    { id: 'chapters', icon: '📚', label: 'Chapters', render: renderChapters },
    { id: 'diagrams', icon: '🖼️', label: 'Diagrams', render: renderDiagrams },
    { id: 'references', icon: '📖', label: 'References', render: renderReferences },
    { id: 'export', icon: '🚀', label: 'Preview & Export', render: renderPreviewExport },
];

let currentSection = 0;
let previewDebounce = null;

export function initReport(container) {
    currentSection = reportState.get().activeSection || 0;
    container.innerHTML = buildLayout();
    attachEventDelegation(container);
    renderSection();
    updatePreview();

    // Subscribe to state changes for live preview
    reportState.subscribe(() => {
        clearTimeout(previewDebounce);
        previewDebounce = setTimeout(() => updatePreview(), 300);
    });
}

function buildLayout() {
    return `
    <div class="report-layout">
        <!-- Sidebar -->
        <aside class="report-sidebar">
            <div class="sidebar-header">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <button onclick="window.navigate('dashboard')" title="Back to Home" style="background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.6); padding:0.4rem; border-radius:50%; transition:all 0.2s; display:flex; align-items:center;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#818cf8'" onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.6)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <a class="sidebar-brand" onclick="window.navigate('dashboard')">
                        <span class="sidebar-brand-icon">📊</span>
                        <span class="sidebar-brand-text">REPORT GEN</span>
                    </a>
                </div>
            </div>
            <div class="sidebar-progress">
                <div class="progress-label">
                    <span>Progress</span>
                    <span id="progress-pct">0%</span>
                </div>
                <div class="progress-bar-track">
                    <div class="progress-bar-fill" id="progress-fill" style="width:0%"></div>
                </div>
            </div>
            <nav class="sidebar-nav" id="sidebar-nav">
                ${SECTIONS.map((sec, i) => `
                <div class="sidebar-nav-item ${i === currentSection ? 'active' : ''}" data-section="${i}">
                    <span class="nav-icon">${sec.icon}</span>
                    <span>${sec.label}</span>
                    <span class="nav-step-number">${i + 1}</span>
                    <span class="nav-check">✓</span>
                </div>`).join('')}
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="report-main">
            <!-- Form Panel -->
            <div class="report-form-panel" id="report-form">
                <!-- Sections rendered here -->
            </div>
            <!-- Preview Panel -->
            <div class="report-preview-panel" id="report-preview">
                <!-- Live preview rendered here -->
            </div>
        </div>
    </div>`;
}

function renderSection() {
    const formEl = document.getElementById('report-form');
    if (!formEl) return;

    const sec = SECTIONS[currentSection];
    formEl.innerHTML = sec.render() + renderNavButtons();

    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentSection);
    });

    // Update progress
    updateProgress();

    // Scroll form to top
    formEl.scrollTop = 0;
}

function renderNavButtons() {
    const isFirst = currentSection === 0;
    const isLast = currentSection === SECTIONS.length - 1;
    return `
    <div class="section-nav-buttons">
        ${!isFirst ? `<button class="rpt-btn rpt-btn-secondary" data-action="prev-section">← Previous</button>` : '<div></div>'}
        ${!isLast ? `<button class="rpt-btn rpt-btn-primary" data-action="next-section">Next →</button>` : ''}
    </div>`;
}

function updatePreview() {
    const previewEl = document.getElementById('report-preview');
    if (!previewEl) return;
    renderFullPreview(previewEl);
}

function updateProgress() {
    const s = reportState.get();
    let filled = 0;
    let total = 9; // key fields

    if (s.projectTitle) filled++;
    if (s.collegeName) filled++;
    if (s.universityName) filled++;
    if (s.members.some(m => m.name)) filled++;
    if (s.guideName) filled++;
    if (s.acknowledgement) filled++;
    if (s.abstract) filled++;
    if (s.chapters.some(c => c.subsections.some(sub => sub.content))) filled++;
    if (s.references) filled++;

    const pct = Math.round((filled / total) * 100);
    const pctEl = document.getElementById('progress-pct');
    const fillEl = document.getElementById('progress-fill');
    if (pctEl) pctEl.textContent = pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
}

function goToSection(index) {
    if (index < 0 || index >= SECTIONS.length) return;
    currentSection = index;
    reportState.set('activeSection', index);
    renderSection();
}

// ─── Event Delegation ──────────────────────────────
function attachEventDelegation(container) {
    container.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]') || e.target.closest('[data-section]');
        if (!target) return;

        const action = target.dataset.action;
        const section = target.dataset.section;

        if (section !== undefined) {
            goToSection(parseInt(section));
            return;
        }

        const s = reportState.get();

        switch (action) {
            case 'next-section':
                goToSection(currentSection + 1);
                break;
            case 'prev-section':
                goToSection(currentSection - 1);
                break;
            case 'add-member':
                s.members.push({ name: '', regNo: '' });
                reportState._notify();
                renderSection();
                break;
            case 'remove-member': {
                const idx = parseInt(target.dataset.index);
                s.members.splice(idx, 1);
                reportState._notify();
                renderSection();
                break;
            }
            case 'toggle-border':
                reportState.set('showBorder', !s.showBorder);
                renderSection();
                break;
            case 'upload-college-logo': {
                const input = target.querySelector('input[type="file"]') || target.closest('.logo-upload-box').querySelector('input[type="file"]');
                if (input) input.click();
                break;
            }
            case 'upload-university-logo': {
                const input = target.querySelector('input[type="file"]') || target.closest('.logo-upload-box').querySelector('input[type="file"]');
                if (input) input.click();
                break;
            }
            case 'remove-college-logo':
                e.stopPropagation();
                reportState.set('collegeLogo', null);
                renderSection();
                break;
            case 'remove-university-logo':
                e.stopPropagation();
                reportState.set('universityLogo', null);
                renderSection();
                break;
            case 'upload-certificate-logo': {
                const input = target.querySelector('input[type="file"]') || target.closest('.logo-upload-box').querySelector('input[type="file"]');
                if (input) input.click();
                break;
            }
            case 'remove-certificate-logo':
                e.stopPropagation();
                reportState.set('certificateLogo', null);
                renderSection();
                break;
            case 'regenerate-certificate':
                reportState.set('certificateText', generateCertificateText(s));
                renderSection();
                break;
            case 'regenerate-declaration':
                reportState.set('declarationText', generateDeclarationText(s));
                renderSection();
                break;
            case 'add-chapter':
                s.chapters.push({ title: '', subsections: [{ title: '', content: '' }] });
                reportState._notify();
                renderSection();
                break;
            case 'remove-chapter': {
                const idx = parseInt(target.dataset.index);
                s.chapters.splice(idx, 1);
                reportState._notify();
                renderSection();
                break;
            }
            case 'toggle-chapter': {
                const idx = parseInt(target.dataset.index);
                const card = target.closest('.chapter-card');
                if (card) card.classList.toggle('expanded');
                break;
            }
            case 'add-subsection-text': {
                const ci = parseInt(target.dataset.chapter);
                s.chapters[ci].subsections.push({ title: '', content: '' });
                reportState._notify();
                renderSection();
                break;
            }
            case 'add-subsection-diagram': {
                const ci = parseInt(target.dataset.chapter);
                s.chapters[ci].subsections.push({ image: null, caption: '' });
                reportState._notify();
                renderSection();
                break;
            }
            case 'remove-subsection': {
                const ci = parseInt(target.dataset.chapter);
                const si = parseInt(target.dataset.index);
                s.chapters[ci].subsections.splice(si, 1);
                reportState._notify();
                renderSection();
                break;
            }
            case 'upload-subsection-diagram': {
                const input = target.querySelector('input[type="file"]') || target.closest('.logo-upload-box').querySelector('input[type="file"]');
                if (input) input.click();
                break;
            }
            case 'remove-diagram': {
                const idx = parseInt(target.dataset.index);
                s.diagrams.splice(idx, 1);
                reportState._notify();
                renderSection();
                break;
            }
            case 'export-docx':
                exportDocx();
                break;
            case 'export-pdf':
                exportPdf();
                break;
        }
    });

    // Input change delegation
    container.addEventListener('input', (e) => {
        const target = e.target;
        const field = target.dataset.field;
        const s = reportState.get();

        // Simple ID-based fields
        if (target.id && target.id.startsWith('rpt-')) {
            const key = target.id.replace('rpt-', '');
            reportState.set(key, target.value);
            return;
        }

        // Member fields
        if (field === 'member-name') {
            const idx = parseInt(target.dataset.index);
            s.members[idx].name = target.value;
            reportState._notify();
        } else if (field === 'member-reg') {
            const idx = parseInt(target.dataset.index);
            s.members[idx].regNo = target.value;
            reportState._notify();
        }

        // Chapter fields
        if (field === 'chapter-title') {
            const idx = parseInt(target.dataset.index);
            s.chapters[idx].title = target.value;
            reportState._notify();
        } else if (field === 'subsection-title') {
            const ci = parseInt(target.dataset.chapter);
            const si = parseInt(target.dataset.index);
            s.chapters[ci].subsections[si].title = target.value;
            reportState._notify();
        } else if (field === 'subsection-content') {
            const ci = parseInt(target.dataset.chapter);
            const si = parseInt(target.dataset.index);
            s.chapters[ci].subsections[si].content = target.value;
            reportState._notify();
        } else if (field === 'subsection-caption') {
            const ci = parseInt(target.dataset.chapter);
            const si = parseInt(target.dataset.index);
            s.chapters[ci].subsections[si].caption = target.value;
            reportState._notify();
        } else if (field === 'subsection-width') {
            const ci = parseInt(target.dataset.chapter);
            const si = parseInt(target.dataset.index);
            s.chapters[ci].subsections[si].width = parseInt(target.value);
            reportState._notify();
        }

        // Diagram fields (Legacy)
        if (field === 'diagram-caption') {
            const idx = parseInt(target.dataset.index);
            s.diagrams[idx].caption = target.value;
            reportState._notify();
        } else if (field === 'diagram-chapter') {
            const idx = parseInt(target.dataset.index);
            s.diagrams[idx].chapterIndex = parseInt(target.value);
            reportState._notify();
        }
    });

    // File input handling
    container.addEventListener('change', (e) => {
        const target = e.target;
        if (target.type !== 'file' || !target.files[0]) return;

        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            const field = target.dataset.field; // This might be undefined for delegation click

            // Check parent or previous target context
            // Actually, we need to find which handler triggered it.
            // But since the event bubbles from input, the target IS the input.
            // We need to check the closest container to know context.

            const uploadBox = target.closest('.logo-upload-box');

            if (uploadBox && uploadBox.dataset.action === 'upload-subsection-diagram') {
                const ci = parseInt(uploadBox.dataset.chapter);
                const si = parseInt(uploadBox.dataset.index);
                const s = reportState.get();

                // create an image to get dimensions
                const img = new Image();
                img.onload = () => {
                    s.chapters[ci].subsections[si].image = dataUrl;
                    s.chapters[ci].subsections[si].imgWidth = img.naturalWidth;
                    s.chapters[ci].subsections[si].imgHeight = img.naturalHeight;

                    if (!s.chapters[ci].subsections[si].caption) {
                        s.chapters[ci].subsections[si].caption = file.name.replace(/\.[^.]+$/, '');
                    }
                    reportState._notify();
                    renderSection();
                };
                img.src = dataUrl;

                return;
            }

            if (field === 'college-logo') {
                reportState.set('collegeLogo', dataUrl);
                renderSection();
            } else if (field === 'university-logo') {
                reportState.set('universityLogo', dataUrl);
                renderSection();
            } else if (field === 'certificate-logo') {
                reportState.set('certificateLogo', dataUrl);
                renderSection();
            } else if (field === 'diagram-file') {
                const s = reportState.get();
                s.diagrams.push({
                    chapterIndex: 0,
                    file: dataUrl,
                    caption: file.name.replace(/\.[^.]+$/, '')
                });
                reportState._notify();
                renderSection();
            }
        };

        reader.readAsDataURL(file);
    });
}

// ─── Export Stubs ──────────────────────────────────
async function exportDocx() {
    try {
        const { generateReportDocx } = await import('./generator.js');
        generateReportDocx(reportState.get());
    } catch (err) {
        console.error('DOCX export error:', err);
        alert('DOCX export is being set up. Please check back soon.');
    }
}

async function exportPdf() {
    try {
        const previewEl = document.getElementById('report-preview');
        if (!previewEl) return;

        const html2pdf = (await import('html2pdf.js')).default;
        const papers = previewEl.querySelectorAll('.report-paper');

        // Create a temp wrapper inside the preview (in the DOM for proper layout)
        const wrapper = document.createElement('div');
        wrapper.style.background = '#fff';
        previewEl.appendChild(wrapper);

        // Move papers into wrapper and reset styles for capture
        const origStyles = [];
        papers.forEach(p => {
            origStyles.push({
                transform: p.style.transform,
                marginBottom: p.style.marginBottom,
                boxShadow: p.style.boxShadow
            });
            p.style.transform = 'none';
            p.style.margin = '0';
            p.style.boxShadow = 'none';
            wrapper.appendChild(p);
        });

        await new Promise(r => setTimeout(r, 50));

        await html2pdf().set({
            margin: 0,
            filename: `${reportState.get().projectTitle || 'Project_Report'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], avoid: ['.chapter-heading', '.chapter-subheading', '.figure-container'] }
        }).from(wrapper).save();

        // Restore: move papers back and reset styles
        papers.forEach((p, i) => {
            p.style.transform = origStyles[i].transform;
            p.style.marginBottom = origStyles[i].marginBottom;
            p.style.boxShadow = origStyles[i].boxShadow;
            previewEl.appendChild(p);
        });
        wrapper.remove();
    } catch (err) {
        console.error('PDF export error:', err);
        alert('PDF export failed. Please try again.');
    }
}
