/*
* app.js - Logic to populate the Bento Box Grid
*/

const App = {
    init: function() {
        console.log("Bento Grid Initialized");
        this.renderTech();
        this.renderProjects();
    },

    renderTech: function() {
        const container = document.getElementById('bento-tech');
        if (!container || typeof resumeData === 'undefined') return;
        
        container.innerHTML = resumeData.resume.skills.map(skill => `
            <div class="skill-item">
                <div class="skill-info">
                    <span>${skill.name}</span>
                    <span class="percent">${skill.level}</span>
                </div>
                <div class="skill-track">
                    <div class="skill-fill" style="width: ${skill.level}"></div>
                </div>
            </div>
        `).join('');
    },

    renderProjects: function() {
        const container = document.getElementById('projects-container');
        if (!container || typeof resumeData === 'undefined') return;

        container.innerHTML = resumeData.portfolio.projects.map(project => `
            <div class="project-tile" onclick="window.open('${project.url}', '_blank')">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                    <span class="btn-link">View GitHub</span>
                </div>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
