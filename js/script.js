/* ==========================================================================
   ADVANCED PORTFOLIO INTERACTION SCRIPT (script.js)
   Features: Particles Canvas, Typewriter Loop, CLI Console (with backend APIs),
   Project Filter, Intersection Observer (Reveal), Navigation highlights, Theme Toggle.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. INTERACTIVE CANVAS PARTICLE SYSTEM
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 65;
    
    // Mouse properties
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    
    // Particle Blueprints
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        // Update coordinates
        update() {
            // Bounce on boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            
            this.draw();
        }
    }

    // Initialize particle array
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = Math.min(maxParticles, (canvas.width * canvas.height) / 14000);
        
        // Color mapping matching current CSS accents
        const isLightTheme = document.body.classList.contains('light-theme');
        const color = isLightTheme ? 'rgba(123, 44, 191, 0.25)' : 'rgba(0, 242, 254, 0.25)';
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2.5) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - size * 2)) + size * 2;
            let y = (Math.random() * ((canvas.height - size * 2) - size * 2)) + size * 2;
            let directionX = (Math.random() * 0.6) - 0.3;
            let directionY = (Math.random() * 0.6) - 0.3;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect node points
    function connect() {
        const isLightTheme = document.body.classList.contains('light-theme');
        const lineColor = isLightTheme ? 'rgba(123, 44, 191, 0.05)' : 'rgba(0, 242, 254, 0.05)';
        const mouseLineColor = isLightTheme ? 'rgba(123, 44, 191, 0.15)' : 'rgba(0, 242, 254, 0.15)';
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) 
                             + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                
                if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            
            // Connect to mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                let mouseDistance = ((particlesArray[a].x - mouse.x) ** 2) 
                                  + ((particlesArray[a].y - mouse.y) ** 2);
                
                if (mouseDistance < mouse.radius * mouse.radius) {
                    ctx.strokeStyle = mouseLineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Run animation frames
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animateParticles);
    }

    // Run particles setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animateParticles();

    /* --------------------------------------------------------------------------
       2. TYPEWRITER EFFECT
       -------------------------------------------------------------------------- */
    const typewriterEl = document.getElementById('typewriter');
    const roles = ['.NET Developer.', 'C# Programmer.', 'Full Stack Developer.', 'MCA Graduate.'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typewriterEl) {
        setTimeout(typeEffect, 1000);
    }

    /* Terminal Logic Removed */

    /* --------------------------------------------------------------------------
       4. DYNAMIC PROJECTS FILTERING
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
       5. REVEAL-ON-SCROLL & SKILL BAR ACTIVATOR (INTERSECTION OBSERVER)
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillFills = document.querySelectorAll('.skill-fill');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                if (entry.target.classList.contains('skill-fill')) {
                    const targetWidth = entry.target.getAttribute('data-width');
                    entry.target.style.width = targetWidth;
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    skillFills.forEach(fill => revealObserver.observe(fill));

    /* --------------------------------------------------------------------------
       6. NAVIGATION HIGHLIGHT SCROLL OBSERVER
       -------------------------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function highlightNavigation() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', highlightNavigation);

    // Scroll to top handler for Home navigation, Logo, and footer Back to Top links
    const homeLinks = document.querySelectorAll('a[href="#home"]');
    if (homeLinks) {
        homeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Toggle active navbar status
                navLinks.forEach(nav => nav.classList.remove('active'));
                const homeNav = document.querySelector('a[href="#home"].nav-link');
                if (homeNav) homeNav.classList.add('active');
            });
        });
    }

    // Name field validation: prevent user from typing numbers or special symbols
    const nameInput = document.getElementById('formName');
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* Theme Toggle Option Disabled */

    /* --------------------------------------------------------------------------
       8. MOBILE MENU TOGGLE
       -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        const isActive = mobileNavOverlay.classList.toggle('active');
        
        if (isActive) {
            mobileMenuBtn.querySelector('.menu-open').style.display = 'none';
            mobileMenuBtn.querySelector('.menu-close').style.display = 'block';
        } else {
            mobileMenuBtn.querySelector('.menu-open').style.display = 'block';
            mobileMenuBtn.querySelector('.menu-close').style.display = 'none';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });

    /* --------------------------------------------------------------------------
       9. CONTACT FORM INTERACTION (NATIVE C# BACKEND POST ENDPOINT)
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    // Modal Selectors
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Close modal listener
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
        
        // Hide if clicking outside the modal card
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Clean trimmed validation
            const emailInput = document.getElementById('formEmail');
            const cleanEmail = emailInput ? emailInput.value.trim() : '';
            if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please enter a valid email address.';
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Submitting...';
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            
            // Build form data
            const formData = new FormData(contactForm);
            const accessKey = formData.get('access_key') || 'fe5573af-d680-428b-ac2e-c5b1fc838632';
            const name = (formData.get('name') || formData.get('Name') || 'Visitor').toString().trim();
            const email = cleanEmail;
            const message = (formData.get('message') || formData.get('Message') || '').toString().trim();
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: accessKey,
                        name: name,
                        email: email,
                        message: message,
                        from_name: 'Portfolio Website',
                        subject: `New Portfolio Message from ${name}`
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    contactForm.reset();
                    if (successModal) {
                        successModal.classList.add('active');
                    } else {
                        formStatus.className = 'form-status success';
                        formStatus.textContent = 'Thank you! Your message was sent successfully.';
                    }
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            }
            catch (err) {
                console.error('Contact form submission error:', err);
                formStatus.className = 'form-status error';
                formStatus.textContent = `Submission note: ${err.message || 'Please check connection'}`;
            }
            finally {
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Submit now';
            }
        });
    }

    /* --------------------------------------------------------------------------
       10. GLOWING CURSOR TRAIL INTERACTION
       -------------------------------------------------------------------------- */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0; // Target coordinates
        let currentX = 0, currentY = 0; // Current delayed coordinates
        const ease = 0.12; // Easing value (smaller = slower follow)

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });

        function animateCursorGlow() {
            // Apply spring calculation
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;

            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;

            requestAnimationFrame(animateCursorGlow);
        }
        requestAnimationFrame(animateCursorGlow);
    }

    /* --------------------------------------------------------------------------
       13. DETAILED PROJECT FEATURE MODALS
       -------------------------------------------------------------------------- */
    const projectModal = document.getElementById('projectModal');
    const projectModalContent = document.getElementById('projectModalContent');
    const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
    const readMoreButtons = document.querySelectorAll('.btn-read-more');

    // Projects Content Specifications Database
    const projectsData = {
        criczone: {
            title: "CricZone - Ultimate Cricket Hub",
            image: "images/criczone_mockup.jpg",
            category: "ASP.NET Core MVC / C# / Entity Framework",
            desc: "CricZone is a comprehensive tournament and match schedule management hub. Built on top of the MVC design pattern, CricZone decouples visual representations from repository queries, making team organization completely frictionless.",
            features: [
                "**Tournament Brackets Grid**: Automated generation of round-robin and knockout tournament matches.",
                "**Team & Player Stats**: Dynamic statistics reporting engine for active runs, wickets, and play history.",
                "**SQL Server Schema**: Clean schema structures utilizing tables joins and indexing for rapid search responses.",
                "**Entity Framework Repositories**: Secured CRUD actions preventing direct SQL injections."
            ],
            techStack: ["C#", "ASP.NET Core 10.0", "Entity Framework Core", "SQL Server", "Razor Views", "Vanilla CSS"]
        },
        kolhapuri: {
            title: "Kolhapuri Footwear Online Shopping",
            image: "images/kolhapuri_mockup.jpg",
            category: "PHP / MySQL / HTML5 / CSS3",
            desc: "Kolhapuri Footwear is a highly responsive e-commerce shopping platform built to showcase and vend traditional leather sandals. It implements modern cart storage and user profiles using backend state engines.",
            features: [
                "**Responsive Catalog**: Sleek glassmorphic card deck wrapping product options and descriptions.",
                "**Secure Member Accounts**: User authentication loops with encrypted password verification.",
                "**Structured Cart Engines**: Dynamic shopping cart state tracking and total calculation.",
                "**MySQL Database**: Relational schema tables matching orders with customer profile IDs."
            ],
            techStack: ["PHP 8.2", "MySQL", "JavaScript (ES6)", "HTML5 Semantic Tags", "CSS3 Grid & Flexbox"]
        },
        onlinevoting: {
            title: "Online Voting System",
            image: "images/onlinevoting_mockup.jpg",
            category: "ASP.NET Core MVC / C# / Entity Framework",
            desc: "A secure, modern, and user-friendly web application for managing elections and voting. Features administrator panels for candidate whitelisting, election trackers, and double-voting prevention.",
            features: [
                "**Whitelist-Only Registration**: Only voters pre-approved by the administrator (matched by Mobile, Birthdate, and Aadhar number) can register.",
                "**Double-Voting Prevention**: Core validation layer to ensure each voter can cast only one ballot.",
                "**Real-Time Tracker**: Administrative dashboard reporting real-time percentages of total votes cast.",
                "**Win Calculation**: Automatically compiles vote tallies for all candidates and determines the winner."
            ],
            techStack: ["C#", "ASP.NET Core 9.0/10.0", "Entity Framework Core", "SQL Server LocalDB", "Cookie Authentication", "jQuery"]
        }
    };

    if (readMoreButtons && projectModal && projectModalContent) {
        readMoreButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.getAttribute('data-project');
                const project = projectsData[projectId];

                if (!project) return;

                // Build rich HTML contents for modal
                let featuresHtml = project.features.map(f => {
                    // Quick bolding replacements
                    const bolded = f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return `<li>${bolded}</li>`;
                }).join('');

                let techHtml = project.techStack.map(t => `<span>${t}</span>`).join('');

                projectModalContent.innerHTML = `
                    <div class="project-modal-grid">
                        <div class="project-modal-visual">
                            <img src="${project.image}" alt="${project.title}">
                        </div>
                        <div class="project-modal-info">
                            <span class="project-modal-tag">${project.category}</span>
                            <h2>${project.title}</h2>
                            <p class="project-modal-desc">${project.desc}</p>
                            
                            <h3>Key Engineering Features:</h3>
                            <ul class="project-modal-features-list">
                                ${featuresHtml}
                            </ul>

                            <h3>Technologies & Tools:</h3>
                            <div class="project-modal-tech-badges">
                                ${techHtml}
                            </div>
                        </div>
                    </div>
                `;

                projectModal.classList.add('active');
            });
        });
    }

    if (closeProjectModalBtn && projectModal) {
        closeProjectModalBtn.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }
});
