
export function initContact(container) {
    container.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar animate-fade-in">
        <div class="container nav-content">
            <div class="logo-group" onclick="window.navigate('dashboard')" style="cursor:pointer">
                <div class="logo">FORMATLY</div>
                <div class="logo-tagline">Automated Academic Document Formatting</div>
            </div>
            <div class="nav-links">
                <a href="#" onclick="window.navigate('dashboard')">Home</a>
                <a href="#" onclick="window.navigate('features')">Features</a>
                <a href="#" onclick="window.navigate('about')">About</a>
                <a href="#" class="active">Contact</a>
            </div>
        </div>
    </nav>

    <div class="contact-page">
        <div class="container contact-container">
            <header class="contact-header">
                <h1 class="animate-slide-up">Get in <span class="gradient-text">Touch</span></h1>
                <p class="contact-subtitle animate-slide-up delay-100">Have a question, feedback, or suggestion? We'd love to hear from you.</p>
            </header>

            <div class="contact-grid">
                <!-- Contact Form -->
                <div class="contact-form-card animate-slide-up delay-200">
                    <h3>Send us a Message</h3>
                    <form id="contact-form" onsubmit="return false;">
                        <div class="contact-form-group">
                            <label for="contact-name">Full Name</label>
                            <input type="text" id="contact-name" placeholder="e.g. John Doe" required>
                        </div>
                        <div class="contact-form-group">
                            <label for="contact-email">Email Address</label>
                            <input type="email" id="contact-email" placeholder="e.g. john@university.edu" required>
                        </div>
                        <div class="contact-form-group">
                            <label for="contact-subject">Subject</label>
                            <select id="contact-subject">
                                <option value="">Select a topic...</option>
                                <option value="feedback">General Feedback</option>
                                <option value="bug">Report a Bug</option>
                                <option value="feature">Feature Request</option>
                                <option value="support">Technical Support</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="contact-form-group">
                            <label for="contact-message">Message</label>
                            <textarea id="contact-message" rows="5" placeholder="Write your message here..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-full contact-submit-btn" id="contact-submit">
                            Send Message
                        </button>
                    </form>
                    <div id="contact-success" class="contact-success" style="display:none;">
                        <div class="success-icon">✅</div>
                        <h4>Message Sent!</h4>
                        <p>Thank you for reaching out. We'll get back to you shortly.</p>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="contact-info-card animate-slide-up delay-300">
                    <div class="contact-info-item">
                        <div class="contact-info-icon">🌐</div>
                        <div>
                            <h4>Platform</h4>
                            <p>Free &amp; open-source web tool. No sign-up required.</p>
                        </div>
                    </div>

                    <div class="contact-info-item">
                        <div class="contact-info-icon">💬</div>
                        <div>
                            <h4>Social</h4>
                            <p><a href="https://www.linktr.ee/nannddhhu" target="_blank" style="color:var(--primary); text-decoration:none;">linktr.ee/nannddhhu</a></p>
                        </div>
                    </div>

                    <div class="contact-info-item">
                        <div class="contact-info-icon">🕐</div>
                        <div>
                            <h4>Response Time</h4>
                            <p>We typically respond within 24–48 hours.</p>
                        </div>
                    </div>

                    <div class="contact-faq">
                        <h4>Frequently Asked</h4>
                        <details class="faq-item">
                            <summary>Is Formatly free to use?</summary>
                            <p>Yes! Formatly is completely free. All document generators and exports are available at no cost.</p>
                        </details>
                        <details class="faq-item">
                            <summary>Can I export to Word (.docx)?</summary>
                            <p>Absolutely. All generators support one-click .docx export with proper formatting retained.</p>
                        </details>
                        <details class="faq-item">
                            <summary>Is my data saved?</summary>
                            <p>Your data stays in your browser's local storage. We don't store any personal data on servers.</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-brand">
                <div class="footer-logo">FORMATLY</div>
                <div class="footer-tagline">Automated Academic Document Formatting</div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Formatly. All Rights Reserved.</p>
                <p class="footer-note">Built for Academic Excellence.</p>
                <p style="margin-top:0.5rem;"><a href="#" onclick="window.navigate('privacy')" style="color:var(--primary); text-decoration:none; font-size:0.8rem;">Privacy Policy</a></p>
            </div>
        </div>
    </footer>
    `;

    // Form submission handler
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit');
    const successMsg = document.getElementById('contact-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Simulate sending
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                form.style.display = 'none';
                successMsg.style.display = 'block';
            }, 1200);
        });
    }
}
