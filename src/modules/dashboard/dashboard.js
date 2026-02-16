export function initDashboard(container) {
    container.innerHTML = `
    <!-- Splash Screen -->
    <div class="splash-screen" id="splash">
        <div class="splash-shapes">
            <div class="splash-blob blob-a"></div>
            <div class="splash-blob blob-b"></div>
            <div class="splash-blob blob-c"></div>
        </div>
        <div class="splash-content">
            <h1 class="splash-logo animate-zoom-in">FORMATLY</h1>
            <p class="splash-sub animate-fade-in delay-200">Professional Documents. Zero Complexity.</p>
        </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar animate-fade-in delay-200">
        <div class="container nav-content">
            <div class="logo">FORMATLY</div>
            <div class="nav-links">
                <a href="#" class="active" onclick="window.navigate('dashboard')">Home</a>
                <a href="#" onclick="window.navigate('features')">Features</a>
                <a href="#" onclick="window.navigate('about')">About</a>
            </div>
            <!-- Contact removed as requested -->
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
        <div class="container hero-content">
            <h1 class="hero-title animate-slide-up">Create Perfect <br><span class="gradient-text animated-gradient">Documents</span> Instantly.</h1>
            <p class="hero-subtitle animate-slide-up delay-100">Professional formatting. <span style="color:#2563eb; font-weight:600;">Download directly as .docx or .pdf</span></p>
            <div class="hero-actions animate-slide-up delay-200">
                <button class="btn btn-primary btn-lg glow-effect scale-hover" onclick="window.open('https://www.linktr.ee/nannddhhu', '_blank')">Suggest a Feature</button>
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
        <div class="container">
            <p>&copy; 2026 Formatly.</p>
        </div>
    </footer>
    `;

    // Splash Screen Logic (1.8s duration)
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 800); // Wait for fade out transition
        }
    }, 1800);
}
