
export function initPrivacy(container) {
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
                <a href="#" onclick="window.navigate('contact')">Contact</a>
            </div>
        </div>
    </nav>

    <div class="privacy-page">
        <div class="container privacy-container">
            <header class="privacy-header">
                <h1 class="animate-slide-up">Privacy <span class="gradient-text">Policy</span></h1>
                <p class="privacy-date animate-slide-up delay-100">Last updated: February 2026</p>
            </header>

            <div class="privacy-content animate-slide-up delay-200">

                <section class="privacy-section">
                    <h2>1. Overview</h2>
                    <p>Formatly is a free, browser-based academic document formatting tool. We are committed to protecting your privacy. This policy explains what data we collect (if any), how it is used, and your rights.</p>
                </section>

                <section class="privacy-section">
                    <h2>2. Data We Collect</h2>
                    <p><strong>We do not collect, store, or transmit any personal data to our servers.</strong></p>
                    <p>All information you enter into Formatly — including names, text content, uploaded images, and form data — is processed entirely within your browser using local storage. No data is sent to any external server or third party.</p>
                </section>

                <section class="privacy-section">
                    <h2>3. Local Storage</h2>
                    <p>Formatly uses your browser's local storage to save your work-in-progress so you can return to it later. This data:</p>
                    <ul>
                        <li>Stays on your device only</li>
                        <li>Is never transmitted over the internet</li>
                        <li>Can be cleared at any time through your browser settings</li>
                        <li>Is automatically removed when you clear browser data</li>
                    </ul>
                </section>

                <section class="privacy-section">
                    <h2>4. Cookies</h2>
                    <p>Formatly does not use cookies for tracking, analytics, or advertising. No third-party cookies are set by this application.</p>
                </section>

                <section class="privacy-section">
                    <h2>5. Third-Party Services</h2>
                    <p>Formatly uses the following third-party services:</p>
                    <ul>
                        <li><strong>Google Fonts</strong> — for typography (Inter, Outfit). Google may collect anonymized usage data per their <a href="https://policies.google.com/privacy" target="_blank" style="color:var(--primary)">privacy policy</a>.</li>
                        <li><strong>GitHub Pages</strong> — for hosting the application. GitHub may collect server logs per their <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" style="color:var(--primary)">privacy statement</a>.</li>
                    </ul>
                </section>

                <section class="privacy-section">
                    <h2>6. AI Features</h2>
                    <p>If you use AI-powered features (such as summary generation or skill suggestions), text prompts may be sent to a third-party AI API for processing. No personal identifiable information is included beyond the content you explicitly provide for enhancement.</p>
                </section>

                <section class="privacy-section">
                    <h2>7. Data Security</h2>
                    <p>Since all data remains in your browser, the security of your information depends on your device and browser security. We recommend:</p>
                    <ul>
                        <li>Keeping your browser up to date</li>
                        <li>Avoiding shared or public computers for sensitive documents</li>
                        <li>Clearing local storage if using a shared device</li>
                    </ul>
                </section>

                <section class="privacy-section">
                    <h2>8. Children's Privacy</h2>
                    <p>Formatly does not knowingly collect information from children under 13. The application is designed for university students and academic professionals.</p>
                </section>

                <section class="privacy-section">
                    <h2>9. Changes to This Policy</h2>
                    <p>We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.</p>
                </section>

                <section class="privacy-section">
                    <h2>10. Contact</h2>
                    <p>If you have questions about this privacy policy, please reach out via our <a href="#" onclick="window.navigate('contact')" style="color:var(--primary)">Contact page</a>.</p>
                </section>

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
            </div>
        </div>
    </footer>
    `;
}
