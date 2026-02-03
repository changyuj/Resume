/*
* app.js - Logic to populate the resume website
*/

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
});

function loadData() {
    if (typeof resumeData === 'undefined') {
        console.error("Data file not loaded!");
        return;
    }

    const main = resumeData.main;
    const resume = resumeData.resume;
    const portfolio = resumeData.portfolio;
    const testimonials = resumeData.testimonials;

    /* ------------------------------------------------------------------ */
    /*	Header & About
    /* ------------------------------------------------------------------ */
    setText('header-name', main.name);
    setText('header-description', main.description);
    setText('about-bio', main.bio);

    // Contact Details in About Section
    setText('contact-name', main.name);
    setText('contact-address', `${main.address.city} ${main.address.state}, ${main.address.zip}`);
    setText('contact-phone', main.phone);
    setText('contact-email', main.email);

    // Profile Pic
    const profilePic = document.getElementById('about-pic');
    if (profilePic) profilePic.src = main.image;

    // Download Button
    const downloadBtn = document.getElementById('resume-download');
    if (downloadBtn) downloadBtn.href = main.resumedownload;

    // Header Social
    const headerSocial = document.getElementById('header-social');
    if (headerSocial) {
        headerSocial.innerHTML = main.social.map(s =>
            `<li><a href="${s.url}"><i class="${s.className}"></i></a></li>`
        ).join('');
    }

    /* ------------------------------------------------------------------ */
    /*	Resume Section
    /* ------------------------------------------------------------------ */

    // Education
    const educationList = document.getElementById('education-list');
    if (educationList) {
        educationList.innerHTML = resume.education.map(edu => `
            <div class="row item">
                <div class="twelve columns">
                    <h3>${edu.school}</h3>
                    <p class="info">${edu.degree} <span>&bull;</span> <em class="date">${edu.graduated}</em></p>
                    <p>${edu.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Work
    const workList = document.getElementById('work-list');
    if (workList) {
        workList.innerHTML = resume.work.map(job => `
            <div class="row item">
                <div class="twelve columns">
                    <h3>${job.company}</h3>
                    <p class="info">${job.title} <span>&bull;</span> <em class="date">${job.years}</em></p>
                    <p>${job.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Skills
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        skillsList.innerHTML = resume.skills.map(skill => `
            <li>
                <span class="bar-expand" style="width:${skill.level};"></span>
                <em>${skill.name}</em>
            </li>
        `).join('');
    }

    /* ------------------------------------------------------------------ */
    /*	Portfolio Section
    /* ------------------------------------------------------------------ */
    const portfolioWrapper = document.getElementById('portfolio-wrapper');
    if (portfolioWrapper) {
        portfolioWrapper.innerHTML = portfolio.projects.map(project => `
            <div class="columns portfolio-item">
                <div class="item-wrap">
                    <div class="project-image" style="background-image: url('${project.image || 'assets/images/secure-workflow.png'}');"></div>
                    <div class="card-content">
                        <h5>${project.title}</h5>
                        <p class="project-category">${project.category}</p>
                        <a href="${project.url}" class="github-button" target="_blank">
                            <i class="fa fa-github"></i> View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        // Seamless Carousel Logic
        const items = Array.from(portfolioWrapper.querySelectorAll('.portfolio-item'));
        const totalRealItems = items.length;
        if (totalRealItems === 0) return;

        // Clone items for seamless effect
        // We'll clone enough to fill the view at both ends
        const clonesToCreate = 3; 
        for (let i = 0; i < clonesToCreate; i++) {
            const firstClone = items[i].cloneNode(true);
            const lastClone = items[totalRealItems - 1 - i].cloneNode(true);
            portfolioWrapper.appendChild(firstClone);
            portfolioWrapper.insertBefore(lastClone, portfolioWrapper.firstChild);
        }

        const allItems = portfolioWrapper.querySelectorAll('.portfolio-item');
        const dotsContainer = document.getElementById('portfolio-dots');
        let currentIndex = clonesToCreate; // Start at the first "real" item
        let isTransitioning = false;
        let autoScrollInterval;
        let resumeTimeout;

        function startAutoScroll() {
            stopAutoScroll(); // Clear any existing
            autoScrollInterval = setInterval(() => {
                nextBtn.click();
            }, 5000); // Scroll every 5 seconds
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
            clearTimeout(resumeTimeout);
        }

        function handleManualInteraction() {
            stopAutoScroll();
            resumeTimeout = setTimeout(startAutoScroll, 5000); // Resume after 5 seconds of inactivity
        }

        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalRealItems; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    handleManualInteraction();
                    currentIndex = i + clonesToCreate;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Calculate active index relative to real items
            let activeIndex = (currentIndex - clonesToCreate) % totalRealItems;
            if (activeIndex < 0) activeIndex = totalRealItems + activeIndex;
            
            if (dots[activeIndex]) {
                dots[activeIndex].classList.add('active');
            }
        }

        function updateCarousel(instant = false) {
            const itemWidth = allItems[0].offsetWidth;
            const offset = -currentIndex * itemWidth;
            
            if (instant) {
                portfolioWrapper.style.transition = 'none';
            } else {
                portfolioWrapper.style.transition = 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)';
            }
            
            portfolioWrapper.style.transform = `translateX(${offset}px)`;
            updateDots();
        }

        function handleJump() {
            isTransitioning = false;
            if (currentIndex <= clonesToCreate - 1) {
                currentIndex = totalRealItems + currentIndex;
                updateCarousel(true);
            } else if (currentIndex >= totalRealItems + clonesToCreate) {
                currentIndex = currentIndex - totalRealItems;
                updateCarousel(true);
            }
        }

        portfolioWrapper.addEventListener('transitionend', handleJump);

        const prevBtn = document.getElementById('portfolio-prev');
        const nextBtn = document.getElementById('portfolio-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                if (isTransitioning) return;
                if (e.isTrusted) handleManualInteraction(); // Only reset if user clicked
                isTransitioning = true;
                currentIndex--;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                if (isTransitioning) return;
                if (e.isTrusted) handleManualInteraction(); // Only reset if user clicked
                isTransitioning = true;
                currentIndex++;
                updateCarousel();
            });
        }

        // Initialize and handle resize
        setTimeout(() => {
            updateCarousel(true);
            startAutoScroll();
        }, 100); 
        window.addEventListener('resize', () => updateCarousel(true));
    }

    /* ------------------------------------------------------------------ */
    /*	Contact
    /* ------------------------------------------------------------------ */
    setText('contact-message', main.contactmessage);

    // Footer Details
    setText('footer-name', main.name);
    setText('footer-address', `${main.address.city} ${main.address.state}, ${main.address.zip}`);
    setText('footer-phone', main.phone);
    setText('footer-email', main.email);

    // Footer Social
    const footerSocial = document.getElementById('footer-social');
    if (footerSocial) {
        footerSocial.innerHTML = main.social.map(s =>
            `<li><a href="${s.url}"><i class="${s.className}"></i></a></li>`
        ).join('');
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setupNavigation() {
    // Mobile Navigation Toggle
    const navBtn = document.querySelector('.mobile-btn'); // Selects the first one (Show)
    const nav = document.getElementById('nav');

    // A simple toggle implementation - in a real scenario we'd bind specific open/close
    // But since the CSS uses a simple media query setup, we'll just toggle a class
    if (navBtn && nav) {
        navBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nav.classList.toggle('mobile-active');

            // Toggle between "Show" and "Hide" text/icon logic if needed
            // For now, simpler is better
        });
    }

    // Smooth Scrolling
    const sections = document.querySelectorAll('section, header');
    const navLis = document.querySelectorAll('#nav li');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLis.forEach(li => {
            li.classList.remove('current');
            const a = li.querySelector('a');
            if (a.getAttribute('href').includes(current)) {
                li.classList.add('current');
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
