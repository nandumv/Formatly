
export function initAbout(container) {
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
                <a href="#" class="active">About</a>
                <a href="#" onclick="window.navigate('contact')">Contact</a>
            </div>
        </div>
    </nav>

    <div class="about-page">
        <div class="container about-container">
            <header class="about-header">
                <h1 class="animate-slide-up">About <span class="gradient-text">Formatly</span></h1>
            </header>
            
            <div class="about-content">
                <div class="about-card animate-slide-up delay-100">
                    <p class="lead-text">
                        Formatly is a modern document creation platform built to simplify professional formatting. Our goal is to help users create clean, structured, and properly aligned documents without struggling with complex formatting tools.
                    </p>
                </div>

                <div class="about-card animate-slide-up delay-200">
                    <p>
                        Many people find it difficult and time-consuming to format resumes and academic documents in traditional word processors. Margins, alignment, spacing, fonts, and section structure often become confusing and inconsistent. <strong>Formatly removes that complexity by automating the entire formatting process.</strong>
                    </p>
                </div>

                <div class="about-card animate-slide-up delay-300">
                    <p>
                        With a structured workflow and live preview system, users can focus on their content while Formatly handles the layout, spacing, and organization behind the scenes.
                    </p>
                </div>

                <div class="mission-box animate-zoom-in delay-400">
                    <h3>Our mission is simple:</h3>
                    <p class="mission-statement">Make professional document creation fast, structured, and effortless.</p>
                </div>

                <div class="about-footer animate-slide-up delay-500">
                    <p>
                        We are continuously expanding Formatly to include additional tools such as project report generators and academic document builders — all designed with the same focus on clarity, structure, and ease of use.
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;
}
