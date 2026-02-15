export const AIService = {
    // Simulator settings
    LATENCY: 1500, // ms

    // 1. Experience Generator
    improveExperience: async (role, company, desc) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const bulletPoints = [
                    `Spearheaded key initiatives at ${company || 'the company'}, driving operational efficiency and process improvements.`,
                    `Collaborated with cross-functional teams to deliver high-quality solutions for ${role || 'various projects'}, ensuring timely execution.`,
                    `Analyzed complex data sets to identify trends and optimize performance metrics, resulting in measurable growth.`,
                    `Mentored junior team members and fostered a culture of continuous learning and professional development.`
                ];
                resolve(bulletPoints.join('\n'));
            }, AIService.LATENCY);
        });
    },

    // 2. Summary Generator
    generateSummary: async (jobTitle, skills) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const summary = `Results-oriented ${jobTitle || 'Professional'} with a proven track record. ` +
                    `Skilled in ${skills.slice(0, 3).map(s => s.name).join(', ') || 'various technologies'} and dedicated to driving organizational success. ` +
                    `Adept at problem-solving and leveraging data-driven insights to achieve strategic goals. ` +
                    `Committed to delivering excellence and continuously expanding professional expertise.`;
                resolve(summary);
            }, AIService.LATENCY);
        });
    },

    // 3. Skill Suggestions
    suggestSkills: async (currentSkills) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const techStack = ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'Python', 'SQL', 'Git', 'Agile', 'Figma'];
                // Filter out existing skills
                const existingNames = currentSkills.map(s => s.name.toLowerCase());
                const suggestions = techStack.filter(s => !existingNames.includes(s.toLowerCase()));
                resolve(suggestions.slice(0, 5));
            }, AIService.LATENCY);
        });
    },

    // 4. Job Match Analysis
    analyzeJobMatch: async (resume, jobDesc) => {
        return new Promise(resolve => {
            setTimeout(() => {
                // Simple mock logic: check for common keywords in JD not in Resume
                const commonKeywords = ['leadership', 'communication', 'python', 'javascript', 'project management', 'agile', 'data analysis'];
                const jdLower = jobDesc.toLowerCase();
                const resumeText = JSON.stringify(resume).toLowerCase();

                const missing = commonKeywords.filter(k => jdLower.includes(k) && !resumeText.includes(k));
                const score = Math.max(10, Math.min(95, 100 - (missing.length * 10)));

                resolve({
                    score: score,
                    missingKeywords: missing,
                    suggestions: missing.length > 0
                        ? [`Consider adding keywords like "${missing[0]}" and "${missing[1] || 'others'}" to your resume to match the job description.`]
                        : ['Great match! Your resume aligns well with the job description.']
                });
            }, AIService.LATENCY);
        });
    }
};
