let splashShown = false;

export function initDashboard(container) {
    const showSplash = !splashShown;
    splashShown = true;

    container.innerHTML = `
    <!-- Splash Screen -->
    ${showSplash ? `
    <div class="splash-screen" id="splash">
        <!-- Animated background particles -->
        <div class="splash-particles">
            <div class="particle p1"></div>
            <div class="particle p2"></div>
            <div class="particle p3"></div>
            <div class="particle p4"></div>
            <div class="particle p5"></div>
            <div class="particle p6"></div>
            <div class="particle p7"></div>
            <div class="particle p8"></div>
        </div>

        <!-- Orbital rings -->
        <div class="splash-orbit orbit-1"></div>
        <div class="splash-orbit orbit-2"></div>

        <!-- Main content -->
        <div class="splash-content">
            <div class="splash-logo-wrapper">
                <div class="splash-glow"></div>
                <h1 class="splash-logo">FORMATLY</h1>
            </div>
            <div class="splash-line"></div>
            <p class="splash-sub">Automated Academic Document Formatting</p>
            <div class="splash-loader-bar">
                <div class="splash-loader-fill"></div>
            </div>
        </div>
    </div>` : ''}

    <!-- Navbar -->
    <nav class="navbar animate-fade-in delay-200">
        <div class="container nav-content">
            <div class="logo-group" onclick="window.navigate('dashboard')" style="cursor:pointer">
                <div class="logo">FORMATLY</div>
                <div class="logo-tagline">Automated Academic Document Formatting</div>
            </div>
            <div class="nav-links">
                <a href="#" class="active" onclick="window.navigate('dashboard')">Home</a>
                <a href="#" onclick="window.navigate('features')">Features</a>
                <a href="#" onclick="window.navigate('about')">About</a>
                <a href="#" onclick="window.navigate('contact')">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
        <div class="container hero-content">
            <h1 class="hero-title animate-slide-up">Create University-Ready <br><span class="gradient-text animated-gradient">Documents</span> Instantly.</h1>
            <p class="hero-subtitle animate-slide-up delay-100">Automated Academic Document Formatting.<br><span style="font-weight:500;">Structured for Real University Standards.</span></p>
            <div class="hero-actions animate-slide-up delay-200">
                <button class="btn btn-primary btn-lg glow-effect scale-hover" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">Start Building</button>
            </div>
        </div>
        <div class="hero-background">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
        </div>
    </header>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <div class="features-grid three-col">
                
                <!-- Card 1: Resume Builder (Active) -->
                <div class="feature-card active-card" onclick="window.navigate('builder')">
                    <div class="icon-box">📄</div>
                    <h3>ATS Resume Builder</h3>
                    <p>Create ATS-friendly resumes and <strong>download editable .docx files</strong> instantly.</p>
                    <button class="btn btn-sm btn-primary mt-4">Create Now</button>
                </div>

                <!-- Card 2: Project Report Generator -->
                <div class="feature-card active-card" onclick="window.navigate('report')">
                    <div class="icon-box">📊</div>
                    <h3>Project Report Generator</h3>
                    <p>Automatically structured academic project reports.</p>
                    <button class="btn btn-sm btn-primary mt-4">Create Now</button>
                </div>

                <!-- Card 3: Abstract Generator -->
                <div class="feature-card active-card" onclick="window.navigate('abstract')">
                    <div class="icon-box">📝</div>
                    <h3>Abstract Generator</h3>
                    <p>Generate properly formatted abstracts instantly.</p>
                    <button class="btn btn-sm btn-primary mt-4">Create Now</button>
                </div>

            </div>
        </div>
    </section>

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

    // Splash Screen Logic (3s to let all animations complete) — only on first visit
    if (showSplash) {
        setTimeout(() => {
            const splash = document.getElementById('splash');
            if (splash) {
                splash.classList.add('fade-out');
                setTimeout(() => splash.remove(), 800);
            }
        }, 3000);
    }
}
