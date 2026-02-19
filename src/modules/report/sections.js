// Project Report Generator — Section Renderers
// Each function returns HTML for a sidebar section's form

import { reportState } from './state.js';

// ─── 1. Project Details ────────────────────────────
export function renderProjectDetails() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">📋 Project Details</h2>
        <p class="report-section-desc">Enter your project and institution information.</p>

        <div class="rpt-field">
            <label>Project Title *</label>
            <input type="text" id="rpt-projectTitle" value="${esc(s.projectTitle)}" placeholder="Enter your project title" />
        </div>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>Academic Year *</label>
                <input type="text" id="rpt-academicYear" value="${esc(s.academicYear)}" placeholder="e.g. 2025-2026" />
            </div>
            <div class="rpt-field">
                <label>Course *</label>
                <input type="text" id="rpt-course" value="${esc(s.course)}" placeholder="e.g. B.Tech CSE" />
            </div>
        </div>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>Report Type</label>
                <select id="rpt-reportType">
                    ${['MINI PROJECT REPORT', 'MAIN PROJECT REPORT', 'PROJECT REPORT', 'MAJOR PROJECT REPORT', 'MINOR PROJECT REPORT']
            .map(r => `<option value="${r}" ${s.reportType === r ? 'selected' : ''}>${r}</option>`).join('')}
                </select>
            </div>
            <div class="rpt-field">
                <label>Degree Name</label>
                <input type="text" id="rpt-degreeName" value="${esc(s.degreeName)}" placeholder="e.g. B. Tech Degree in Computer Science" />
            </div>
        </div>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>Semester *</label>
                <input type="text" id="rpt-semester" value="${esc(s.semester)}" placeholder="e.g. 6th Semester" />
            </div>
            <div class="rpt-field">
                <label>Department Name *</label>
                <input type="text" id="rpt-departmentName" value="${esc(s.departmentName)}" placeholder="e.g. Computer Science" />
            </div>
        </div>
        <div class="rpt-field">
            <label>College Name *</label>
            <input type="text" id="rpt-collegeName" value="${esc(s.collegeName)}" placeholder="Enter college name" />
        </div>
        <div class="rpt-field">
            <label>College Address</label>
            <input type="text" id="rpt-collegeAddress" value="${esc(s.collegeAddress)}" placeholder="City, State" />
        </div>
        <div class="rpt-field">
            <label>University Name *</label>
            <input type="text" id="rpt-universityName" value="${esc(s.universityName)}" placeholder="Enter university name" />
        </div>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>Month of Submission</label>
                <select id="rpt-submissionMonth">
                    ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            .map(m => `<option value="${m}" ${s.submissionMonth === m ? 'selected' : ''}>${m}</option>`).join('')}
                </select>
            </div>
            <div class="rpt-field">
                <label>Year of Submission</label>
                <input type="text" id="rpt-submissionYear" value="${esc(s.submissionYear)}" placeholder="2026" />
            </div>
        </div>
    </div>`;
}

// ─── 2. Members & Guide ────────────────────────────
export function renderMembersGuide() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">👥 Members & Guide</h2>
        <p class="report-section-desc">Add team members and project guide details.</p>

        <label style="font-size:0.8rem;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:0.5rem;display:block;">Team Members</label>

        ${s.members.map((m, i) => `
        <div class="member-card">
            <div class="member-card-header">
                <span class="member-card-title">Member ${i + 1}</span>
                ${s.members.length > 1 ? `<button class="member-remove-btn" data-action="remove-member" data-index="${i}" title="Remove">✕</button>` : ''}
            </div>
            <div class="rpt-field-row">
                <div class="rpt-field">
                    <label>Name</label>
                    <input type="text" data-field="member-name" data-index="${i}" value="${esc(m.name)}" placeholder="Full Name" />
                </div>
                <div class="rpt-field">
                    <label>Register Number</label>
                    <input type="text" data-field="member-reg" data-index="${i}" value="${esc(m.regNo)}" placeholder="e.g. 2022XXXX" />
                </div>
            </div>
        </div>`).join('')}

        <button class="rpt-add-btn" data-action="add-member">＋ Add Member</button>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;">

        <label style="font-size:0.8rem;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:0.5rem;display:block;">Principal</label>
        <div class="rpt-field">
            <label>Principal Name</label>
            <input type="text" id="rpt-principalName" value="${esc(s.principalName)}" placeholder="Dr. Name" />
        </div>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;">

        <label style="font-size:0.8rem;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:0.5rem;display:block;">Project Guide</label>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>Guide Name</label>
                <input type="text" id="rpt-guideName" value="${esc(s.guideName)}" placeholder="Prof. Name" />
            </div>
            <div class="rpt-field">
                <label>Designation</label>
                <input type="text" id="rpt-guideDesignation" value="${esc(s.guideDesignation)}" placeholder="e.g. Assistant Professor" />
            </div>
        </div>
        <div class="rpt-field">
            <label>Guide Department</label>
            <input type="text" id="rpt-guideDepartment" value="${esc(s.guideDepartment)}" placeholder="Leave empty to use main department" />
        </div>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;">

        <label style="font-size:0.8rem;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:0.5rem;display:block;">Project Coordinators (Optional)</label>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>Coordinator 1 Name</label>
                <input type="text" id="rpt-coordinator1Name" value="${esc(s.coordinator1Name)}" placeholder="Name" />
            </div>
            <div class="rpt-field">
                <label>Designation</label>
                <input type="text" id="rpt-coordinator1Designation" value="${esc(s.coordinator1Designation)}" placeholder="e.g. Assistant Professor" />
            </div>
        </div>
        <div class="rpt-field">
            <label>Coordinator 1 Department</label>
            <input type="text" id="rpt-coordinator1Department" value="${esc(s.coordinator1Department)}" placeholder="Leave empty to use main department" />
        </div>

        <div class="rpt-field-row" style="margin-top:1rem;">
            <div class="rpt-field">
                <label>Coordinator 2 Name</label>
                <input type="text" id="rpt-coordinator2Name" value="${esc(s.coordinator2Name)}" placeholder="Name (optional)" />
            </div>
            <div class="rpt-field">
                <label>Designation</label>
                <input type="text" id="rpt-coordinator2Designation" value="${esc(s.coordinator2Designation)}" placeholder="e.g. Assistant Professor" />
            </div>
        </div>
        <div class="rpt-field">
            <label>Coordinator 2 Department</label>
            <input type="text" id="rpt-coordinator2Department" value="${esc(s.coordinator2Department)}" placeholder="Leave empty to use main department" />
        </div>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;">

        <label style="font-size:0.8rem;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:0.5rem;display:block;">Head of Department</label>
        <div class="rpt-field-row">
            <div class="rpt-field">
                <label>HOD Name</label>
                <input type="text" id="rpt-hodName" value="${esc(s.hodName)}" placeholder="HOD Name" />
            </div>
            <div class="rpt-field">
                <label>HOD Designation</label>
                <input type="text" id="rpt-hodDesignation" value="${esc(s.hodDesignation)}" placeholder="e.g. Associate Professor & HOD" />
            </div>
        </div>
        <div class="rpt-field">
            <label>HOD Department</label>
            <input type="text" id="rpt-hodDepartment" value="${esc(s.hodDepartment)}" placeholder="Leave empty to use main department" />
        </div>
    </div>`;
}

// ─── 3. Cover Page Settings ─────────────────────────
export function renderCoverPageSettings() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">🎨 Cover Page Settings</h2>
        <p class="report-section-desc">Upload logos and customize the cover page.</p>

        <label style="font-size:0.8rem;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:0.75rem;display:block;">Logos</label>
        <div class="logo-upload-area">
            <div class="logo-upload-box ${s.universityLogo ? 'has-logo' : ''}" data-action="upload-university-logo">
                ${s.universityLogo
            ? `<img src="${s.universityLogo}" alt="University Logo" /><button class="logo-remove-btn" data-action="remove-university-logo">✕</button>`
            : `<div class="logo-upload-placeholder"><span class="upload-icon">🎓</span>University Logo *<br><small>Click to upload</small></div>`}
                <input type="file" accept="image/*" data-field="university-logo" style="display:none;" />
            </div>
            <div class="logo-upload-box ${s.collegeLogo ? 'has-logo' : ''}" data-action="upload-college-logo">
                ${s.collegeLogo
            ? `<img src="${s.collegeLogo}" alt="College Logo" /><button class="logo-remove-btn" data-action="remove-college-logo">✕</button>`
            : `<div class="logo-upload-placeholder"><span class="upload-icon">🏫</span>College Logo<br><small>(Optional)</small></div>`}
                <input type="file" accept="image/*" data-field="college-logo" style="display:none;" />
            </div>
            <div class="logo-upload-box ${s.certificateLogo ? 'has-logo' : ''}" data-action="upload-certificate-logo">
                ${s.certificateLogo
            ? `<img src="${s.certificateLogo}" alt="Certificate Logo" /><button class="logo-remove-btn" data-action="remove-certificate-logo">✕</button>`
            : `<div class="logo-upload-placeholder"><span class="upload-icon">📜</span>Certificate Logo<br><small>(Defaults to Univ)</small></div>`}
                <input type="file" accept="image/*" data-field="certificate-logo" style="display:none;" />
            </div>
        </div>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;">

        <div class="rpt-toggle-row">
            <span class="rpt-toggle-label">Show cover page border</span>
            <div class="rpt-toggle ${s.showBorder ? 'active' : ''}" data-action="toggle-border"></div>
        </div>
    </div>`;
}

// ─── 4. Certificate ─────────────────────────────────
export function renderCertificate() {
    const s = reportState.get();
    const defaultCert = generateCertificateText(s);
    return `
    <div class="report-section">
        <h2 class="report-section-title">📜 Certificate</h2>
        <p class="report-section-desc">Auto-generated certificate. Edit if needed.</p>
        <div class="rpt-field">
            <label>Certificate Text</label>
            <textarea id="rpt-certificateText" rows="12" placeholder="Certificate text will be auto-generated...">${esc(s.certificateText || defaultCert)}</textarea>
        </div>
        <button class="rpt-btn rpt-btn-secondary" data-action="regenerate-certificate" style="margin-top:0.5rem;">🔄 Regenerate from Details</button>
    </div>`;
}

// ─── 5. Declaration ─────────────────────────────────
export function renderDeclaration() {
    const s = reportState.get();
    const defaultDecl = generateDeclarationText(s);
    return `
    <div class="report-section">
        <h2 class="report-section-title">✍️ Declaration</h2>
        <p class="report-section-desc">Auto-generated declaration. Edit if needed.</p>
        <div class="rpt-field">
            <label>Declaration Text</label>
            <textarea id="rpt-declarationText" rows="10" placeholder="Declaration text will be auto-generated...">${esc(s.declarationText || defaultDecl)}</textarea>
        </div>
        <button class="rpt-btn rpt-btn-secondary" data-action="regenerate-declaration" style="margin-top:0.5rem;">🔄 Regenerate from Details</button>
    </div>`;
}

// ─── 6. Acknowledgement ─────────────────────────────
export function renderAcknowledgement() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">🙏 Acknowledgement</h2>
        <p class="report-section-desc">Write your acknowledgement section.</p>
        <div class="rpt-field">
            <label>Acknowledgement</label>
            <textarea id="rpt-acknowledgement" rows="14" placeholder="We would like to express our sincere gratitude to...">${esc(s.acknowledgement)}</textarea>
        </div>
    </div>`;
}

// ─── 7. Abstract ────────────────────────────────────
export function renderAbstract() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">📄 Abstract</h2>
        <p class="report-section-desc">Provide a concise summary of your project.</p>
        <div class="rpt-field">
            <label>Abstract</label>
            <textarea id="rpt-abstract" rows="14" placeholder="This project aims to...">${esc(s.abstract)}</textarea>
        </div>
    </div>`;
}

// ─── 8. Chapters ────────────────────────────────────
// ─── 8. Chapters ────────────────────────────────────
export function renderChapters() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">📚 Chapters</h2>
        <p class="report-section-desc">Create and manage your report chapters. You can add text sections or diagrams in any order.</p>

        ${s.chapters.map((ch, ci) => `
        <div class="chapter-card ${ci === 0 ? 'expanded' : ''}" data-chapter="${ci}">
            <div class="chapter-card-header" data-action="toggle-chapter" data-index="${ci}">
                <span class="chapter-card-title">
                    <span class="chapter-num">CH ${ci + 1}</span>
                    <input type="text" data-field="chapter-title" data-index="${ci}" value="${esc(ch.title)}"
                        class="chapter-title-input"
                        placeholder="Chapter Title" onclick="event.stopPropagation()" />
                </span>
                <div class="chapter-card-actions">
                    ${s.chapters.length > 1 ? `<button class="chapter-btn delete" data-action="remove-chapter" data-index="${ci}" title="Delete chapter">🗑</button>` : ''}
                    <span class="chapter-toggle-icon">▼</span>
                </div>
            </div>
            <div class="chapter-card-body">
                ${(() => {
            let textCount = 0;
            let figCount = 0;
            return ch.subsections.map((sub, si) => {
                let label = '';
                if (sub.image) {
                    figCount++;
                    label = `🖼️ Figure ${ci + 1}.${figCount}`;
                } else {
                    textCount++;
                    label = `📄 Section ${ci + 1}.${textCount}`;
                }
                return `
                        <div class="subsection-item ${sub.image ? 'diagram-item' : 'text-item'}">
                            <div class="subsection-header">
                                <span class="subsection-label">${label}</span>
                                <button class="member-remove-btn" data-action="remove-subsection" data-chapter="${ci}" data-index="${si}" title="Remove item">✕</button>
                            </div>
                            
                            ${sub.image !== undefined ? `
                            <!-- Diagram Block -->
                            <div class="rpt-field">
                                <label>Figure Caption</label>
                                <input type="text" data-field="subsection-caption" data-chapter="${ci}" data-index="${si}" value="${esc(sub.caption || '')}" placeholder="e.g. System Architecture" />
                            </div>
                            <div class="rpt-field">
                                <label>Size: <span id="disp-width-${ci}-${si}">${sub.width || 75}%</span></label>
                                <input type="range" class="width-slider" data-field="subsection-width" data-chapter="${ci}" data-index="${si}" 
                                    min="30" max="100" step="5" value="${sub.width || 75}" 
                                    oninput="document.getElementById('disp-width-${ci}-${si}').innerText = this.value + '%'"
                                    style="width: 100%;" />
                            </div>
                            <div class="logo-upload-box" data-action="upload-subsection-diagram" data-chapter="${ci}" data-index="${si}">
                                ${sub.image ? `<img src="${sub.image}" alt="Diagram" /><div class="overlay">Change Diagram</div>` : `<span class="icon">Example: 📤</span><span>Click to upload diagram</span>`}
                                <input type="file" accept="image/*" hidden />
                            </div>
                            ` : `
                            <!-- Text Block -->
                            <div class="rpt-field">
                                <label>Subheading</label>
                                <input type="text" data-field="subsection-title" data-chapter="${ci}" data-index="${si}" value="${esc(sub.title)}" placeholder="Section heading" />
                            </div>
                            <div class="rpt-field">
                                <label>Content</label>
                                <textarea data-field="subsection-content" data-chapter="${ci}" data-index="${si}" rows="6" placeholder="Write section content...">${esc(sub.content)}</textarea>
                            </div>
                            `}
                        </div>`;
            }).join('');
        })()}
                
                <div class="chapter-actions-row" style="display:flex;gap:10px;margin-top:10px;">
                    <button class="rpt-btn-secondary" data-action="add-subsection-text" data-chapter="${ci}" style="flex:1;">＋ Add Text</button>
                    <button class="rpt-btn-secondary" data-action="add-subsection-diagram" data-chapter="${ci}" style="flex:1;">🖼️ Add Diagram</button>
                </div>
            </div>
        </div>`).join('')}

        <button class="rpt-add-btn" data-action="add-chapter" style="margin-top:1.5rem;">＋ Add New Chapter</button>
    </div>`;
}

// ─── 9. Diagrams ────────────────────────────────────
export function renderDiagrams() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">🖼️ Diagrams</h2>
        <p class="report-section-desc">Upload diagrams and assign them to chapters.</p>

        ${s.diagrams.map((d, i) => `
        <div class="diagram-upload-card">
            <div class="member-card-header">
                <span class="member-card-title">Figure ${d.chapterIndex + 1}.${i + 1}</span>
                <button class="member-remove-btn" data-action="remove-diagram" data-index="${i}">✕</button>
            </div>
            <div class="rpt-field-row">
                <div class="rpt-field">
                    <label>Chapter</label>
                    <select data-field="diagram-chapter" data-index="${i}">
                        ${s.chapters.map((ch, ci) => `<option value="${ci}" ${d.chapterIndex === ci ? 'selected' : ''}>Chapter ${ci + 1}: ${esc(ch.title)}</option>`).join('')}
                    </select>
                </div>
                <div class="rpt-field">
                    <label>Caption</label>
                    <input type="text" data-field="diagram-caption" data-index="${i}" value="${esc(d.caption)}" placeholder="Diagram description" />
                </div>
            </div>
            ${d.file ? `<img src="${d.file}" class="diagram-preview" alt="${esc(d.caption)}" />` : ''}
        </div>`).join('')}

        <div class="logo-upload-box" data-action="upload-diagram" style="margin-top:0.5rem;">
            <div class="logo-upload-placeholder"><span class="upload-icon">📊</span>Click to add a diagram<br><small>PNG, JPG supported</small></div>
            <input type="file" accept="image/*" data-field="diagram-file" style="display:none;" />
        </div>
    </div>`;
}

// ─── 10. References ─────────────────────────────────
export function renderReferences() {
    const s = reportState.get();
    return `
    <div class="report-section">
        <h2 class="report-section-title">📖 References</h2>
        <p class="report-section-desc">Enter one reference per line. They will be auto-numbered.</p>
        <div class="rpt-field">
            <label>References</label>
            <textarea id="rpt-references" rows="16" placeholder="Enter references, one per line...">${esc(s.references)}</textarea>
        </div>
    </div>`;
}

// ─── 11. Preview & Export ───────────────────────────
export function renderPreviewExport() {
    return `
    <div class="report-section">
        <h2 class="report-section-title">🚀 Preview & Export</h2>
        <p class="report-section-desc">Review your report in the preview panel, then download.</p>

        <div style="background:linear-gradient(135deg,rgba(99,102,241,0.05),rgba(139,92,246,0.05));border-radius:14px;padding:1.5rem;margin-bottom:1.5rem;border:1.5px solid #e2e8f0;">
            <h3 style="font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:0.5rem;">📐 Format Summary</h3>
            <div style="font-size:0.82rem;color:#64748b;line-height:1.8;">
                <div>Font: Times New Roman, 12pt body</div>
                <div>Headings: 16pt bold (centered)</div>
                <div>Subheadings: 14pt bold (left-aligned)</div>
                <div>Line spacing: 1.5</div>
                <div>Margins: 1.5" left, 1" others</div>
                <div>Page numbers: Start from Introduction</div>
            </div>
        </div>

        <button class="rpt-btn-export docx" data-action="export-docx">
            📥 Download DOCX
        </button>
        <button class="rpt-btn-export pdf" data-action="export-pdf">
            📥 Download PDF
        </button>
    </div>`;
}

// ─── Helpers ────────────────────────────────────────

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function generateCertificateText(s) {
    const memberList = s.members.filter(m => m.name).map(m => `${m.name.toUpperCase()}${m.regNo ? ` (${m.regNo})` : ''}`).join(', ') || '[Member Names]';
    return `Certified that this report entitled '${s.projectTitle || '[Project Title]'}' is the report of ${(s.reportType || 'mini project').toLowerCase()} presented by ${memberList} during the year (${s.academicYear || '[Year]'}) in partial fulfilment of the requirements for the award of the Degree of ${s.degreeName || s.course || '[Degree]'} of the ${s.universityName || '[University Name]'}${s.collegeAddress ? `, ${s.collegeAddress}` : ''}.`;
}

export function generateDeclarationText(s) {
    const memberNames = s.members.filter(m => m.name).map(m => m.name.toUpperCase()).join(', ') || '[MEMBER NAMES]';
    return `We hereby certify that the work which is being presented in the Project stage Entitled "${(s.projectTitle || '[PROJECT TITLE]').toUpperCase()}" by ${memberNames} in partial fulfilment of requirements for the award of degree of ${s.degreeName || s.course || '[DEGREE]'} in the Department of ${(s.departmentName || '[DEPARTMENT]').toUpperCase()} at ${(s.collegeName || '[COLLEGE NAME]').toUpperCase()} under ${(s.universityName || '[UNIVERSITY NAME]').toUpperCase()} is an authentic record of our own work carried out during a period ${(s.academicYear || '[YEAR]')}. The matter presented in this project has not been submitted by us or anybody else in any other University / Institute for the award of ${s.degreeName || s.course || '[DEGREE]'}.`;
}
