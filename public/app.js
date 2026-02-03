/*
* app.js - Logic to populate the Bento Box Grid
*/

const App = {
    init: function() {
        this.renderHero();
        this.renderTech();
        this.renderProjects();
        this.renderContact();
        this.renderSocials();
    },

    renderHero: function() {
        if (typeof resumeData === 'undefined') return;
        const main = resumeData.main;
        
        const vibe = document.getElementById('bento-vibe');
        if (vibe) vibe.innerHTML = main.bio;

        const name = document.getElementById('bento-name');
        if (name) name.innerHTML = main.name;

        const title = document.querySelector('.hero-title');
        if (title) title.innerHTML = main.title;
    },

    renderContact: function() {
        if (typeof resumeData === 'undefined') return;
        const main = resumeData.main;

        const email = document.getElementById('bento-email');
        if (email) {
            email.href = `mailto:${main.email}`;
            email.innerHTML = main.email;
        }

        const phone = document.getElementById('bento-phone');
        if (phone) phone.innerHTML = main.phone;
    },

    renderTech: function() {
        const container = document.getElementById('bento-tech');
        if (!container || typeof resumeData === 'undefined') return;
        
        // Slice to top 4 skills to save vertical space
        container.innerHTML = resumeData.resume.skills.slice(0, 4).map(skill => `
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
    },

    renderSocials: function() {
        const container = document.getElementById('bento-socials');
        if (!container || typeof resumeData === 'undefined') return;

        const social = resumeData.main.social;
        container.innerHTML = social.map(item => `
            <li>
                <a href="${item.url.startsWith('http') ? item.url : 'https://' + item.url}" target="_blank" title="${item.name}">
                    <i class="${item.className}"></i>
                </a>
            </li>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
