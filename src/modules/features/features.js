
export function initFeatures(container) {
    container.innerHTML = `
    <!-- Navbar (Reuse or specific for sub-page) -->
    <nav class="navbar animate-fade-in">
        <div class="container nav-content">
            <div class="logo-group" onclick="window.navigate('dashboard')" style="cursor:pointer">
                <div class="logo">FORMATLY</div>
                <div class="logo-tagline">Automated Academic Document Formatting</div>
            </div>
            <div class="nav-links">
                <a href="#" onclick="window.navigate('dashboard')">Home</a>
                <a href="#" class="active">Features</a>
                <a href="#" onclick="window.navigate('about')">About</a>
            </div>
        </div>
    </nav>

    <div class="features-page">
        <!-- Header -->
        <header class="features-header">
            <h1 class="animate-slide-up">
                Powerful Features. <br>
                <span class="feat-gradient-text">Unmatched Simplicity.</span>
            </h1>
            <p class="animate-slide-up delay-100">
                Everything you need to create professional academic documents in minutes.
            </p>
        </header>

        <!-- Feature Grid -->
        <div class="features-container">
            <div class="features-grid-layout">
                
                <!-- 1 -->
                <div class="feat-card animate-slide-up delay-200">
                    <div class="feat-icon">🎯</div>
                    <h3>ATS-Friendly Builder</h3>
                    <ul>
                        <li>Structured formatting for automated systems</li>
                        <li>Clean, professional layout</li>
                        <li>Standardized fonts & margins</li>
                    </ul>
                </div>

                <!-- 2 -->
                <div class="feat-card animate-slide-up delay-300">
                    <div class="feat-icon">👁️</div>
                    <h3>Live Preview</h3>
                    <ul>
                        <li>See changes as you type</li>
                        <li>Accurate document representation</li>
                        <li>Instant visual feedback</li>
                    </ul>
                </div>

                <!-- 3 -->
                <div class="feat-card animate-slide-up delay-400">
                    <div class="feat-icon">📑</div>
                    <h3>Structured Sections</h3>
                    <ul>
                        <li>Comprehensive Experience & Education</li>
                        <li>Dedicated Skills & Summary areas</li>
                        <li>Easy-to-add custom sections</li>
                    </ul>
                </div>

                <!-- 4 -->
                <div class="feat-card animate-slide-up delay-500">
                    <div class="feat-icon">✨</div>
                    <h3>Automated Formatting</h3>
                    <ul>
                        <li>Perfect spacing & alignment</li>
                        <li>Consistent typography</li>
                        <li>Smart page breaks (Coming Soon)</li>
                    </ul>
                </div>

                <!-- 5 -->
                <div class="feat-card animate-slide-up delay-600">
                    <div class="feat-icon">⬇️</div>
                    <h3>One-Click Export</h3>
                    <ul>
                        <li>Instant .DOCX download</li>
                        <li>Edit directly in Word/Google Docs</li>
                        <li>Retention of all styling</li>
                    </ul>
                </div>

                 <!-- 6 (Upcoming) -->
                <div class="feat-card coming-soon animate-slide-up delay-700">
                    <div class="feat-icon">🚀</div>
                    <h3>Coming Soon</h3>
                    <ul>
                        <li>Project Report Generator</li>
                        <li>Abstract Generator</li>
                        <li>AI Content Writing Assistant</li>
                    </ul>
                </div>

            </div>
            
            <div class="feat-cta animate-slide-up delay-700">
                <button class="btn btn-primary btn-lg glow-effect scale-hover" onclick="window.navigate('builder')">Try It Yourself</button>
            </div>
        </div>
    </div>
    `;
}
