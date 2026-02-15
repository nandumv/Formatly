
import { store } from '../core/store.js';
import { updatePreview } from './preview.js';
import { generateDOCX } from './generator.js';
import { calculateProgress } from './state.js';
import { AIService } from './ai-service.js';
import html2pdf from 'html2pdf.js';

let appContainer = null;

export function initResumeBuilder(container) {
    appContainer = container;
    renderBuilderLayout();
    bindEvents();
    updatePreview();
    updateScore();
}

function renderBuilderLayout() {
    appContainer.innerHTML = `
        <div class="builder-layout animate-fade-in">
            <!-- Left Pane: Editor -->
            <aside class="editor-pane">
                <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <div style="width:24px; height:24px; background:var(--grad-primary); border-radius:4px;"></div>
                    <h2 style="font-family:'Outfit', sans-serif; font-weight:700; font-size:1.25rem;">Formatly</h2>
                </div>
                <button onclick="window.navigate('dashboard')" title="Back to Home" style="background:none; border:none; cursor:pointer; color:#64748b; padding:0.5rem; border-radius:50%; transition:all 0.2s;" onmouseover="this.style.background='#f1f5f9'; this.style.color='#4f46e5'" onmouseout="this.style.background='transparent'; this.style.color='#64748b'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </button>
            </div>
            
            <!-- Step Progress Bar -->
            <div class="step-progress-wrapper" style="width: 100%; height: 4px; background: #f1f5f9; position: relative;">
                <div id="step-progress-fill" style="width: 14%; height: 100%; background: linear-gradient(90deg, #4f46e5, #9333ea); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);"></div>
            </div>
                <nav class="step-nav">
                    ${['Contacts', 'Experience', 'Education', 'Skills', 'Summary', 'Add-ons', 'Finalize'].map((step, i) => `
                        <div class="step-tab ${i === 0 ? 'active' : ''}" data-step="${i + 1}">
                            <div class="step-indicator">${i + 1}</div>
                            <span>${step}</span>
                        </div>
                    `).join('')}
                </nav>

                <div class="form-container">
                    <!-- Step 1: Contacts -->
                    <div id="step-1" class="form-step-content">
                        <div class="section-header">
                            <h2>Personal Details</h2>
                            <p>Get started with the basics.</p>
                        </div>
                        
                        <div class="input-group">
                            <label>Profile Picture</label>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <input type="file" id="profile-pic-upload" accept="image/*" style="display:none;">
                                <button class="btn btn-secondary" onclick="document.getElementById('profile-pic-upload').click()">Upload Photo</button>
                                <button id="remove-pic-btn" class="btn btn-danger" style="display:none;">Remove</button>
                                <span id="pic-status" style="font-size:0.8rem; color: #64748b;">No photo selected</span>
                            </div>
                        </div>
                        <div class="flex-row">
                            <div class="input-group w-full">
                                <label>First Name</label>
                                <input type="text" data-path="resume.personal.firstName" placeholder="e.g. John">
                            </div>
                            <div class="input-group w-full">
                                <label>Last Name</label>
                                <input type="text" data-path="resume.personal.lastName" placeholder="e.g. Doe">
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Job Title</label>
                            <input type="text" data-path="resume.personal.jobTitle" placeholder="e.g. Senior Software Engineer">
                        </div>
                        <div class="input-group">
                            <label>Email</label>
                            <input type="email" data-path="resume.personal.email" placeholder="e.g. john@example.com">
                        </div>
                        <div class="input-group">
                            <label>Phone</label>
                            <input type="tel" data-path="resume.personal.phone" placeholder="e.g. +1 555 123 4567">
                        </div>
                        
                        <h4 class="mt-4 mb-2">Location</h4>
                        <div class="flex-row">
                            <div class="input-group w-full">
                                <label>City</label>
                                <input type="text" data-path="resume.personal.city" placeholder="e.g. New York">
                            </div>
                            <div class="input-group w-full">
                                <label>Country</label>
                                <input type="text" data-path="resume.personal.country" placeholder="e.g. USA">
                            </div>
                        </div>
                         <div class="flex-row">
                            <div class="input-group w-full">
                                <label>Address</label>
                                <input type="text" data-path="resume.personal.address" placeholder="e.g. 123 Main St">
                            </div>
                             <div class="input-group w-full">
                                <label>Postal Code</label>
                                <input type="text" data-path="resume.personal.postalCode" placeholder="e.g. 10001">
                            </div>
                        </div>

                        <button class="btn btn-primary w-full mt-4" onclick="window.nextStep()">Next: Experience</button>
                    </div>

                    <!-- Step 2: Experience -->
                    <div id="step-2" class="form-step-content hidden">
                        <div class="section-header">
                            <h2>Experience</h2>
                            <p>Add your work history. (Most recent first)</p>
                        </div>
                        <div id="experience-list"></div>
                        <button class="btn btn-secondary add-btn" id="add-exp-btn">+ Add Experience</button>
                        <div class="flex-row mt-4">
                             <button class="btn btn-secondary" onclick="window.prevStep()">Back</button>
                             <button class="btn btn-primary" onclick="window.nextStep()">Next: Education</button>
                        </div>
                    </div>

                    <!-- Step 3: Education -->
                    <div id="step-3" class="form-step-content hidden">
                         <div class="section-header">
                            <h2>Education</h2>
                            <p>Your academic background.</p>
                        </div>
                        <div id="education-list"></div>
                        <button class="btn btn-secondary add-btn" id="add-edu-btn">+ Add Education</button>
                         <div class="flex-row mt-4">
                             <button class="btn btn-secondary" onclick="window.prevStep()">Back</button>
                             <button class="btn btn-primary" onclick="window.nextStep()">Next: Skills</button>
                        </div>
                    </div>

                    <!-- Step 4: Skills -->
                    <div id="step-4" class="form-step-content hidden">
                        <div class="section-header">
                            <h2>Skills</h2>
                            <p>Technical & Soft Skills.</p>
                        </div>
                        <div id="skills-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;"></div>
                        
                        <div id="ai-skills-suggestions" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:10px; margin-bottom:10px;"></div>
                        
                        <div class="flex-row" style="gap:10px;">
                            <button class="btn-ai" id="ai-suggest-skills">✨ Suggest Skills</button>
                            <button class="btn btn-secondary add-btn" id="add-skill-btn">+ Add Skill</button>
                        </div>
                         <div class="flex-row mt-4">
                             <button class="btn btn-secondary" onclick="window.prevStep()">Back</button>
                             <button class="btn btn-primary" onclick="window.nextStep()">Next: Summary</button>
                        </div>
                    </div>

                    <!-- Step 5: Summary -->
                    <div id="step-5" class="form-step-content hidden">
                         <div class="section-header">
                            <h2>Professional Summary</h2>
                            <p>Summarize your career highlights.</p>
                        </div>
                        <div class="input-group">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                                <label>Professional Summary</label>
                                <button type="button" class="btn-ai" id="ai-generate-summary">✨ Turn Pro</button>
                            </div>
                            <textarea rows="6" data-path="resume.summary" placeholder="e.g. Experienced Project Manager..."></textarea>
                        </div>
                         <div class="flex-row mt-4">
                             <button class="btn btn-secondary" onclick="window.prevStep()">Back</button>
                             <button class="btn btn-primary" onclick="window.nextStep()">Next: Add-ons</button>
                        </div>
                    </div>

                    <!-- Step 6: Add-ons (Projects / Langs / Certs) -->
                    <div id="step-6" class="form-step-content hidden">
                         <div class="section-header">
                            <h2>Additional Sections</h2>
                            <p>Add Projects, Languages, Certifications, etc.</p>
                        </div>
                        
                        <!-- Projects Accordion -->
                        <details class="card-entry" open>
                            <summary class="card-header" style="cursor:pointer; list-style:none;"><b>📂 Projects</b></summary>
                            <div id="projects-list"></div>
                            <button class="btn btn-secondary add-btn" id="add-proj-btn">+ Add Project</button>
                        </details>

                        <!-- Languages Accordion -->
                        <details class="card-entry">
                             <summary class="card-header" style="cursor:pointer; list-style:none;"><b>🗣 Languages</b></summary>
                             <div id="languages-list"></div>
                             <button class="btn btn-secondary add-btn" id="add-lang-btn">+ Add Language</button>
                        </details>

                        <!-- Certifications Accordion -->
                        <details class="card-entry">
                             <summary class="card-header" style="cursor:pointer; list-style:none;"><b>🏆 Certifications</b></summary>
                             <div id="certs-list"></div>
                             <button class="btn btn-secondary add-btn" id="add-cert-btn">+ Add Certification</button>
                        </details>

                        <!-- Awards Accordion -->
                        <details class="card-entry">
                             <summary class="card-header" style="cursor:pointer; list-style:none;"><b>🎖 Awards</b></summary>
                             <div id="awards-list"></div>
                             <button class="btn btn-secondary add-btn" id="add-award-btn">+ Add Award</button>
                        </details>

                        <!-- Socials Accordion -->
                        <details class="card-entry">
                             <summary class="card-header" style="cursor:pointer; list-style:none;"><b>🔗 Socials / Websites</b></summary>
                             <div id="socials-list"></div>
                             <button class="btn btn-secondary add-btn" id="add-social-btn">+ Add Link</button>
                        </details>

                        <!-- References Accordion -->
                        <details class="card-entry">
                             <summary class="card-header" style="cursor:pointer; list-style:none;"><b>👥 References</b></summary>
                             <div id="refs-list"></div>
                             <button class="btn btn-secondary add-btn" id="add-ref-btn">+ Add Reference</button>
                        </details>
                        
                        <!-- Interests -->
                         <div class="input-group mt-4">
                            <label>Hobbies & Interests</label>
                            <textarea rows="3" data-path="resume.interests" placeholder="e.g. Photography, Marathon Running..."></textarea>
                        </div>

                        <!-- Custom Section -->
                        <details class="card-entry">
                             <summary class="card-header" style="cursor:pointer; list-style:none;"><b>➕ Custom Section</b></summary>
                             <div id="custom-list"></div>
                             <button class="btn btn-secondary add-btn" id="add-custom-btn">+ Add Custom Entry</button>
                        </details>



                        <div class="flex-row mt-4">
                             <button class="btn btn-secondary" onclick="window.prevStep()">Back</button>
                             <button class="btn btn-primary" onclick="window.nextStep()">Next: Finalize</button>
                        </div>
                    </div>

                    <!-- Step 7: Finalize -->
                    <div id="step-7" class="form-step-content hidden">
                         <div class="section-header">
                            <h2>Finalize & Export</h2>
                            <p>Review and download.</p>
                        </div>
                        


                        <div class="card-entry" style="background: #f0fdf4; border-color: #bbf7d0;">
                            <h4>✅ Checklist</h4>
                            <ul style="padding-left:1.2rem; font-size:0.9rem; color: #166534; margin-top:0.5rem;">
                                <li>Check for spelling errors.</li>
                                <li>Ensure contact details are correct.</li>
                                <li>Verify dates in experience.</li>
                            </ul>
                        </div>

                        <!-- Job Analysis -->
                        <div class="card-entry" style="border-color: #818cf8; background: #eef2ff;">
                            <h4 style="color:#4338ca;">🎯 Job Match Analysis</h4>
                            <p style="font-size:0.9rem; color:#6366f1; margin-bottom:0.5rem;">Paste the job description to see how well you match.</p>
                            <textarea id="job-desc-input" rows="4" placeholder="Paste Job Description here..." style="width:100%; border:1px solid #c7d2fe; padding:0.5rem; border-radius:0.3rem;"></textarea>
                            <button class="btn-ai w-full mt-2" id="ai-analyze-job">✨ Analyze Match</button>
                            
                            <div id="ai-job-result" style="margin-top:1rem; display:none;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <b>Match Score:</b>
                                    <span id="ai-match-score" style="font-size:1.2rem; font-weight:bold; color:#4338ca;">0%</span>
                                </div>
                                <div id="ai-missing-keywords" style="margin-top:0.5rem; font-size:0.9rem;"></div>
                            </div>
                        </div>

                         <div class="flex-row mt-4">
                             <button class="btn btn-secondary" onclick="window.prevStep()">Back</button>
                             <button class="btn btn-primary" id="download-btn">Download .DOCX</button>
                             <button class="btn btn-primary" id="download-pdf-btn" style="background-color: var(--danger); border-color: var(--danger);">Download .PDF</button>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Right Pane: Preview -->
            <main class="preview-pane">
                <div class="ats-score-bar">
                    <span>ATS Score</span>
                    <div class="score-ring-container">
                        <svg class="score-ring" width="40" height="40">
                            <circle class="score-ring-bg" stroke="#e2e8f0" stroke-width="4" fill="transparent" r="16" cx="20" cy="20" />
                            <circle class="score-ring-progress" stroke="var(--primary)" stroke-width="4" fill="transparent" r="16" cx="20" cy="20" />
                        </svg>
                        <span id="score-text">0%</span>
                    </div>
                </div>
                <div id="resume-preview" class="resume-paper"></div>
            </main>
        </div>
    `;

    hydrateInputs();
}

function bindEvents() {
    appContainer.addEventListener('input', (e) => {
        if (e.target.dataset.path) {
            store.update(e.target.dataset.path, e.target.value);
            updatePreview();
            updateScore();
        }
    });

    const borderToggle = document.getElementById('border-toggle');
    if (borderToggle) {
        borderToggle.addEventListener('change', (e) => {
            store.update('resume.meta.border', e.target.checked);
            updatePreview();
        });
    }

    // Profile Pic Logic
    const picUpload = document.getElementById('profile-pic-upload');
    const removePicBtn = document.getElementById('remove-pic-btn');
    const picStatus = document.getElementById('pic-status');

    if (picUpload) {
        picUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    store.update('resume.personal.profilePic', evt.target.result);
                    updatePreview();
                    picStatus.textContent = 'Photo added';
                    removePicBtn.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removePicBtn) {
        removePicBtn.addEventListener('click', () => {
            store.update('resume.personal.profilePic', null);
            picUpload.value = '';
            updatePreview();
            picStatus.textContent = 'No photo selected';
            removePicBtn.style.display = 'none';
        });
    }

    // Navigation
    window.currentStep = 1;
    window.nextStep = () => createStepNav(window.currentStep + 1);
    window.prevStep = () => createStepNav(window.currentStep - 1);

    appContainer.querySelectorAll('.step-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const step = parseInt(tab.dataset.step);
            createStepNav(step);
        });
    });

    // Add Buttons
    const setupAddBtn = (id, path, template, renderFn) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => {
            store.addItem(path, { id: Date.now(), ...template });
            renderFn();
        });
    };

    setupAddBtn('add-exp-btn', 'resume.experience', { jobTitle: '', employer: '', city: '', startDate: '', endDate: '', desc: '' }, renderExperienceList);
    setupAddBtn('add-edu-btn', 'resume.education', { institution: '', degree: '', city: '', startDate: '', endDate: '', desc: '' }, renderEducationList);
    setupAddBtn('add-skill-btn', 'resume.skills', { name: '', level: '' }, renderSkillsList);
    setupAddBtn('add-proj-btn', 'resume.projects', { title: '', link: '', desc: '' }, renderProjectsList);
    setupAddBtn('add-lang-btn', 'resume.languages', { language: '', proficiency: '' }, renderLanguagesList);
    setupAddBtn('add-cert-btn', 'resume.certifications', { name: '', issuer: '', date: '' }, renderCertsList);
    setupAddBtn('add-award-btn', 'resume.awards', { name: '', date: '', desc: '' }, renderAwardsList);
    setupAddBtn('add-social-btn', 'resume.socials', { network: '', url: '' }, renderSocialsList);
    setupAddBtn('add-ref-btn', 'resume.references', { name: '', contact: '' }, renderRefsList);
    setupAddBtn('add-custom-btn', 'resume.custom', { title: '', content: '' }, renderCustomList);

    // AI Event Listeners
    setupAIListeners();

    // Download
    document.getElementById('download-btn').addEventListener('click', () => {
        generateDOCX();
    });

    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        generatePDF();
    });
}

function createStepNav(step) {
    if (step < 1 || step > 7) return;
    window.currentStep = step;
    renderStep(step);
}

// --- RENDER ---
function renderStep(stepIndex) {
    const steps = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7']; // Assuming these are the IDs for steps
    const allContent = document.querySelectorAll('.form-step-content');
    allContent.forEach(el => el.classList.add('hidden'));

    const currentEl = document.getElementById(steps[stepIndex - 1]); // Adjust for 0-based array index
    if (currentEl) {
        currentEl.classList.remove('hidden');
        // Reset animation
        currentEl.style.animation = 'none';
        currentEl.offsetHeight; /* trigger reflow */
        currentEl.style.animation = 'slideInRight 0.3s ease';
    }

    document.querySelectorAll('.step-tab').forEach((t, i) => {
        if (i === (stepIndex - 1)) t.classList.add('active'); // Adjust for 0-based array index
        else t.classList.remove('active');
    });

    // Update Progress Wrapper
    const pFill = document.getElementById('step-progress-fill');
    if (pFill) {
        pFill.style.width = `${(stepIndex / 7) * 100}%`;
    }
}

// --- Renderers ---

function renderAccordionItem(item, title, path, contentFn, removeType) {
    return `
    <details class="card-entry" open>
        <summary class="card-header" style="cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;">
            <b>${title || '(New Entry)'}</b>
            <button class="btn btn-danger" style="padding:2px 8px;" onclick="window.removeGlItem('${path}', ${item.id}, '${removeType}')">x</button>
        </summary>
        ${contentFn(item)}
    </details>`;
}

function renderExperienceList() {
    const items = store.get().resume.experience;
    document.getElementById('experience-list').innerHTML = items.map(item => renderAccordionItem(item, item.jobTitle, 'resume.experience', (i) => `
        <div class="input-group"><input type="text" value="${i.jobTitle}" placeholder="Job Title" oninput="window.updateGlItem('resume.experience', ${i.id}, 'jobTitle', this.value)"></div>
        <div class="input-group"><input type="text" value="${i.employer}" placeholder="Employer" oninput="window.updateGlItem('resume.experience', ${i.id}, 'employer', this.value)"></div>
        <div class="flex-row">
            <div class="input-group w-full"><input type="text" value="${i.startDate}" placeholder="Start Date" oninput="window.validateDateInput(this); window.updateGlItem('resume.experience', ${i.id}, 'startDate', this.value)"></div>
            <div class="input-group w-full"><input type="text" value="${i.endDate}" placeholder="End Date" oninput="window.validateDateInput(this); window.updateGlItem('resume.experience', ${i.id}, 'endDate', this.value)"></div>
        </div>
         <div class="input-group"><input type="text" value="${i.city}" placeholder="City, Country" oninput="window.updateGlItem('resume.experience', ${i.id}, 'city', this.value)"></div>
        <div class="input-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.2rem;">
                 <label>Description</label> 
                 <button class="btn-ai" style="font-size:0.7rem; padding:0.2rem 0.5rem;" onclick="window.improveExperience(${i.id})">✨ Improve</button>
            </div>
            <textarea id="exp-desc-${i.id}" placeholder="Description (Bullet points)" oninput="window.updateGlItem('resume.experience', ${i.id}, 'desc', this.value)">${i.desc}</textarea>
        </div>
    `, 'exp')).join('');
}

function renderEducationList() {
    const items = store.get().resume.education;
    document.getElementById('education-list').innerHTML = items.map(item => renderAccordionItem(item, item.institution, 'resume.education', (i) => `
        <div class="input-group"><input type="text" value="${i.institution}" placeholder="School / University" oninput="window.updateGlItem('resume.education', ${i.id}, 'institution', this.value)"></div>
        <div class="input-group"><input type="text" value="${i.degree}" placeholder="Degree / Course" oninput="window.updateGlItem('resume.education', ${i.id}, 'degree', this.value)"></div>
        <div class="flex-row">
            <div class="input-group w-full"><input type="text" value="${i.startDate}" placeholder="Start Date" oninput="window.validateDateInput(this); window.updateGlItem('resume.education', ${i.id}, 'startDate', this.value)"></div>
            <div class="input-group w-full"><input type="text" value="${i.endDate}" placeholder="End Date" oninput="window.validateDateInput(this); window.updateGlItem('resume.education', ${i.id}, 'endDate', this.value)"></div>
        </div>
        <div class="input-group"><textarea placeholder="Description (Optional)" oninput="window.updateGlItem('resume.education', ${i.id}, 'desc', this.value)">${i.desc}</textarea></div>
    `, 'edu')).join('');
}

function renderSkillsList() {
    const items = store.get().resume.skills;
    document.getElementById('skills-list').innerHTML = items.map(item => `
        <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; display:flex; gap:5px;">
             <input type="text" value="${item.name}" placeholder="Skill" oninput="window.updateGlItem('resume.skills', ${item.id}, 'name', this.value)">
             <button class="btn btn-danger" onclick="window.removeGlItem('resume.skills', ${item.id}, 'skill')">x</button>
        </div>
    `).join('');
}

function renderProjectsList() {
    const items = store.get().resume.projects;
    document.getElementById('projects-list').innerHTML = items.map(item => renderAccordionItem(item, item.title, 'resume.projects', (i) => `
        <div class="input-group"><input type="text" value="${i.title}" placeholder="Project Title" oninput="window.updateGlItem('resume.projects', ${i.id}, 'title', this.value)"></div>
        <div class="input-group"><textarea placeholder="Description" oninput="window.updateGlItem('resume.projects', ${i.id}, 'desc', this.value)">${i.desc}</textarea></div>
    `, 'proj')).join('');
}

function renderLanguagesList() {
    const items = store.get().resume.languages;
    document.getElementById('languages-list').innerHTML = items.map(item => `
        <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; display:flex; gap:5px; margin-bottom:10px;">
             <input type="text" value="${item.language}" placeholder="Language" oninput="window.updateGlItem('resume.languages', ${item.id}, 'language', this.value)">
             <input type="text" value="${item.proficiency}" placeholder="Proficiency (e.g. Native)" oninput="window.updateGlItem('resume.languages', ${item.id}, 'proficiency', this.value)">
             <button class="btn btn-danger" onclick="window.removeGlItem('resume.languages', ${item.id}, 'lang')">x</button>
        </div>
    `).join('');
}

function renderCertsList() {
    const items = store.get().resume.certifications;
    document.getElementById('certs-list').innerHTML = items.map(item => `
        <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin-bottom:10px;">
             <div style="display:flex; justify-content:space-between;"><b>Certification</b> <button class="btn btn-danger" onclick="window.removeGlItem('resume.certifications', ${item.id}, 'cert')">x</button></div>
             <input type="text" value="${item.name}" placeholder="Name" class="mt-4" oninput="window.updateGlItem('resume.certifications', ${item.id}, 'name', this.value)">
        </div>
    `).join('');
}

function renderAwardsList() {
    const items = store.get().resume.awards;
    document.getElementById('awards-list').innerHTML = items.map(item => `
        <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin-bottom:10px;">
             <div style="display:flex; justify-content:space-between;"><b>Award</b> <button class="btn btn-danger" onclick="window.removeGlItem('resume.awards', ${item.id}, 'award')">x</button></div>
             <input type="text" value="${item.name}" placeholder="Award Name" class="mt-4" oninput="window.updateGlItem('resume.awards', ${item.id}, 'name', this.value)">
             <input type="text" value="${item.desc}" placeholder="Description" class="mt-4" oninput="window.updateGlItem('resume.awards', ${item.id}, 'desc', this.value)">
        </div>
    `).join('');
}

function renderSocialsList() {
    const items = store.get().resume.socials;
    document.getElementById('socials-list').innerHTML = items.map(item => `
        <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin-bottom:10px;">
             <div style="display:flex; justify-content:space-between;"><b>Link</b> <button class="btn btn-danger" onclick="window.removeGlItem('resume.socials', ${item.id}, 'social')">x</button></div>
             <input type="text" value="${item.network}" placeholder="Platform (e.g. GitHub)" class="mt-4" oninput="window.updateGlItem('resume.socials', ${item.id}, 'network', this.value)">
             <input type="text" value="${item.url}" placeholder="URL" class="mt-4" oninput="window.updateGlItem('resume.socials', ${item.id}, 'url', this.value)">
        </div>
    `).join('');
}

function renderRefsList() {
    const items = store.get().resume.references;
    document.getElementById('refs-list').innerHTML = items.map(item => `
        <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin-bottom:10px;">
             <div style="display:flex; justify-content:space-between;"><b>Reference</b> <button class="btn btn-danger" onclick="window.removeGlItem('resume.references', ${item.id}, 'ref')">x</button></div>
             <input type="text" value="${item.name}" placeholder="Name" class="mt-4" oninput="window.updateGlItem('resume.references', ${item.id}, 'name', this.value)">
             <input type="text" value="${item.contact}" placeholder="Contact Info" class="mt-4" oninput="window.updateGlItem('resume.references', ${item.id}, 'contact', this.value)">
        </div>
    `).join('');
}



function renderCustomList() {
    const items = store.get().resume.custom;
    document.getElementById('custom-list').innerHTML = items.map(item => renderAccordionItem(item, item.title, 'resume.custom', (i) => `
        <div class="input-group"><input type="text" value="${i.title}" placeholder="Section Title" oninput="window.updateGlItem('resume.custom', ${i.id}, 'title', this.value)"></div>
        <div class="input-group"><textarea placeholder="Content" oninput="window.updateGlItem('resume.custom', ${i.id}, 'content', this.value)">${i.content}</textarea></div>
`, 'custom')).join('');
}


// Global Helpers
window.validateDateInput = (el) => {
    // Remove any character that is not a digit, hyphen, or forward slash
    el.value = el.value.replace(/[^0-9\/\-]/g, '');
};

window.updateGlItem = (path, id, field, value) => {
    const keys = path.split('.');
    let target = store.get();
    for (let k of keys) target = target[k];
    const item = target.find(i => i.id === id);
    if (item) {
        item[field] = value;
        store.update(path, target);
        updatePreview();
        updateScore();
    }
};

window.removeGlItem = (path, id, type) => {
    store.removeItem(path, id);
    if (type === 'exp') renderExperienceList();
    if (type === 'edu') renderEducationList();
    if (type === 'skill') renderSkillsList();
    if (type === 'proj') renderProjectsList();
    if (type === 'lang') renderLanguagesList();
    if (type === 'cert') renderCertsList();
    if (type === 'award') renderAwardsList();
    if (type === 'social') renderSocialsList();
    if (type === 'ref') renderRefsList();
    if (type === 'custom') renderCustomList();
    updatePreview();
    updateScore();
};

function hydrateInputs() {
    const r = store.get().resume;
    document.querySelectorAll('input[data-path]').forEach(input => {
        const keys = input.dataset.path.split('.');
        let val = r;
        for (let k of keys.slice(1)) val = val[k];
        input.value = val || '';
    });
    renderExperienceList();
    renderEducationList();
    renderSkillsList();
    renderProjectsList();
    renderLanguagesList();
    renderCertsList();
    renderAwardsList();
    renderSocialsList();
    renderRefsList();
    renderCustomList();
}

// AI Functions
function checkAILimit(type) {
    const state = store.get();
    const usage = state.aiUsage[type];
    const limit = state.limits.free;

    if (usage >= limit) {
        alert(`You have reached the free limit for ${type} generations (${limit}/${limit}). Upgrade to Premium for unlimited AI.`);
        return false;
    }

    // Increment
    state.aiUsage[type]++;
    // In a real app we would dispatch an action, here we just mutate for simplicity (nested object update quirks)
    store.update(`aiUsage.${type}`, state.aiUsage[type]);
    return true;
}

function setLoading(btn, isLoading) {
    if (isLoading) {
        btn.dataset.text = btn.innerText;
        btn.innerHTML = '<span class="loading-spinner"></span> Generating...';
        btn.disabled = true;
    } else {
        btn.innerHTML = btn.dataset.text;
        btn.disabled = false;
    }
}

window.improveExperience = async (id) => {
    if (!checkAILimit('experience')) return;

    const r = store.get().resume;
    const item = r.experience.find(i => i.id === id);
    if (!item) return;

    const btn = document.querySelector(`button[onclick="window.improveExperience(${id})"]`);
    setLoading(btn, true);

    try {
        const enhanced = await AIService.improveExperience(item.jobTitle, item.employer, item.desc);
        window.updateGlItem('resume.experience', id, 'desc', enhanced);
        // Textarea update handled by render update in updateGlItem commonly, but here we might need to force re-render or update val
        const el = document.getElementById(`exp-desc-${id}`);
        if (el) el.value = enhanced;
    } catch (e) {
        alert('AI Error: ' + e.message);
    } finally {
        setLoading(btn, false);
    }
};

function setupAIListeners() {
    // Summary
    const btnSummary = document.getElementById('ai-generate-summary');
    if (btnSummary) {
        btnSummary.addEventListener('click', async () => {
            if (!checkAILimit('summary')) return;
            setLoading(btnSummary, true);
            try {
                const r = store.get().resume;
                const summary = await AIService.generateSummary(r.personal.jobTitle, r.skills);
                store.update('resume.summary', summary);
                document.querySelector('textarea[data-path="resume.summary"]').value = summary;
                updatePreview();
                updateScore();
            } catch (e) {
                alert(e.message);
            } finally {
                setLoading(btnSummary, false);
            }
        });
    }

    // Skills
    const btnSkills = document.getElementById('ai-suggest-skills');
    if (btnSkills) {
        btnSkills.addEventListener('click', async () => {
            if (!checkAILimit('skills')) return;
            setLoading(btnSkills, true);
            try {
                const current = store.get().resume.skills;
                const suggestions = await AIService.suggestSkills(current);
                const container = document.getElementById('ai-skills-suggestions');
                container.innerHTML = suggestions.map(s => `
                    <div class="suggestion-chip" onclick="window.addSuggestedSkill('${s}')">+ ${s}</div>
                 `).join('');
            } catch (e) {
                alert(e.message);
            } finally {
                setLoading(btnSkills, false);
            }
        });
    }

    // Job Match
    const btnJob = document.getElementById('ai-analyze-job');
    if (btnJob) {
        btnJob.addEventListener('click', async () => {
            if (!checkAILimit('jobMatch')) return;
            const jd = document.getElementById('job-desc-input').value;
            if (!jd.trim()) { alert('Please paste a job description first.'); return; }

            setLoading(btnJob, true);
            try {
                const result = await AIService.analyzeJobMatch(store.get().resume, jd);
                document.getElementById('ai-job-result').style.display = 'block';
                document.getElementById('ai-match-score').innerText = result.score + '%';

                const color = result.score > 75 ? 'green' : (result.score > 50 ? 'orange' : 'red');
                document.getElementById('ai-match-score').style.color = color;

                document.getElementById('ai-missing-keywords').innerHTML = `
                    <p><b>Missing Keywords:</b> ${result.missingKeywords.join(', ') || 'None found!'}</p>
                    <ul style="margin-top:5px; padding-left:15px; color:#555;">
                        ${result.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                 `;
            } catch (e) {
                alert(e.message);
            } finally {
                setLoading(btnJob, false);
            }
        });
    }
}

window.addSuggestedSkill = (name) => {
    store.addItem('resume.skills', { id: Date.now(), name: name, level: 'Intermediate' });
    renderSkillsList();
    // Remove from suggestions
    const chips = document.querySelectorAll('.suggestion-chip');
    chips.forEach(c => {
        if (c.innerText.includes(name)) c.remove();
    });
};

function updateScore() {
    const score = calculateProgress();
    const text = document.getElementById('score-text');
    const ring = document.querySelector('.score-ring-progress');

    if (!ring) return;

    // Ring Calc
    const radius = ring.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (score / 100) * circumference;
    ring.style.strokeDashoffset = offset;

    // Text Animation
    const targetScore = Math.round(score);
    let currentScore = 0;
    try { currentScore = parseInt(text.innerText) || 0; } catch (e) { }

    // Simple counter
    text.innerText = targetScore + '%';

    // Color Logic
    let color = '#4f46e5'; // Primary
    if (score < 50) color = '#ef4444'; // Red
    else if (score < 80) color = '#f59e0b'; // Orange
    else color = '#22c55e'; // Green

    ring.style.stroke = color;
    text.style.color = color;
}

function generatePDF() {
    const element = document.getElementById('resume-preview');
    const r = store.get().resume;
    const resumeName = (r.personal.firstName + '_' + r.personal.lastName).replace(/\s+/g, '_') || 'Resume';
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const opt = {
        margin: 0, // No extra PDF margin (Rely on 960px limit for visual margin)
        filename: `${resumeName}_${timestamp}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // 1. Temporarily Optimize Styling for Print
    const originalTransform = element.style.transform;
    element.style.transform = 'none'; // Reset zoom

    // Remove visual gaps/shadows from pages for clean export
    const pages = element.querySelectorAll('.resume-page');
    const originalPageStyles = [];
    pages.forEach((page, i) => {
        originalPageStyles.push({
            marginBottom: page.style.marginBottom,
            boxShadow: page.style.boxShadow,
            margin: page.style.margin,
            borderRadius: page.style.borderRadius
        });
        page.style.margin = '0'; // Remove centering/gaps
        page.style.marginBottom = '0'; // Strict
        page.style.minHeight = '296mm'; // Prevent >297mm (1mm safety)
        page.style.maxHeight = '296mm'; // Prevent overflow
        page.style.overflow = 'hidden'; // Clip content strictly
        page.style.background = 'white';
        page.style.boxShadow = 'none';
        page.style.borderRadius = '0';

        // Remove break from last page to avoid trailing blank page
        if (i === pages.length - 1) {
            page.style.pageBreakAfter = 'auto';
        }
    });

    // 2. Generate PDF
    html2pdf().set(opt).from(element).save().then(() => {
        // 3. Restore Styling
        element.style.transform = originalTransform;
        pages.forEach((page, i) => {
            if (originalPageStyles[i]) {
                page.style.margin = originalPageStyles[i].margin;
                page.style.marginBottom = originalPageStyles[i].marginBottom;
                page.style.boxShadow = originalPageStyles[i].boxShadow;
                page.style.borderRadius = originalPageStyles[i].borderRadius; // Restore if any
            }
        });
    }).catch(err => {
        console.error("PDF Fail:", err);
        // Ensure restore happens even on error
        element.style.transform = originalTransform;
        pages.forEach((page, i) => {
            if (originalPageStyles[i]) {
                page.style.margin = originalPageStyles[i].margin;
                page.style.marginBottom = originalPageStyles[i].marginBottom;
                page.style.boxShadow = originalPageStyles[i].boxShadow;
                page.style.borderRadius = originalPageStyles[i].borderRadius;
            }
        });
        alert("PDF Generation Failed. Please try again.");
    });
}

