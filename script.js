/* ═══════════════════════════════════════════════════════════
   TERMINAL.FOLIO — Interactive Engine
   Author: Hamza | 2026
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── DOM References ──
    const DOM = {
        bootScreen: document.getElementById('boot-screen'),
        bootLines: document.getElementById('boot-lines'),
        bootProgress: document.getElementById('boot-progress-bar'),
        bootStatus: document.getElementById('boot-status'),
        appShell: document.getElementById('app-shell'),
        sidebar: document.getElementById('sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        sidebarNav: document.getElementById('sidebar-nav'),
        sidebarTime: document.getElementById('sidebar-time'),
        contentScroll: document.getElementById('content-scroll'),
        topbarBreadcrumb: document.getElementById('topbar-breadcrumb'),
        topbarTab: document.querySelector('.topbar-tab'),
        typewriter: document.getElementById('typewriter'),
        particlesCanvas: document.getElementById('particles-canvas'),
        geoCanvas: document.getElementById('geo-canvas'),
        contactForm: document.getElementById('contact-form'),
        contactSuccess: document.getElementById('contact-success'),
    };

    // ── Config ──
    const TYPEWRITER_WORDS = [
        'Computer Engineer',
        'AI Systems Builder',
        'Full-Stack Developer',
        'Problem Solver',
        'Creative Technologist',
    ];

    const BOOT_MESSAGES = [
        { text: '[BIOS] Initializing hardware check...', delay: 100 },
        { text: '[OK] CPU: Multi-core detected', delay: 200, status: 'ok' },
        { text: '[OK] RAM: 16GB allocated', delay: 150, status: 'ok' },
        { text: '[OK] GPU: Hardware acceleration enabled', delay: 180, status: 'ok' },
        { text: '[SYS] Loading kernel modules...', delay: 250 },
        { text: '[OK] Network adapter: Online', delay: 120, status: 'ok' },
        { text: '[OK] Portfolio filesystem mounted', delay: 200, status: 'ok' },
        { text: '[SYS] Starting display server...', delay: 300 },
        { text: '[OK] Rendering engine initialized', delay: 150, status: 'ok' },
        { text: '[OK] Design system loaded', delay: 100, status: 'ok' },
        { text: '[SYS] Compiling identity modules...', delay: 250 },
        { text: '[OK] All systems operational', delay: 200, status: 'ok' },
    ];

    const SECTION_FILES = {
        home: 'home.tsx',
        about: 'about.tsx',
        skills: 'skills.json',
        projects: 'projects.md',
        experience: 'experience.log',
        contact: 'contact.sh',
    };


    // ═══════════════════════════════════════════
    // BOOT SEQUENCE
    // ═══════════════════════════════════════════
    async function runBootSequence() {
        let progress = 0;
        const totalMessages = BOOT_MESSAGES.length;

        for (let i = 0; i < totalMessages; i++) {
            const msg = BOOT_MESSAGES[i];
            await sleep(msg.delay);

            const line = document.createElement('div');
            line.className = 'boot-line';

            if (msg.status === 'ok') {
                line.innerHTML = `<span class="ok">[OK]</span> ${msg.text.replace('[OK] ', '')}`;
            } else if (msg.status === 'warn') {
                line.innerHTML = `<span class="warn">[WARN]</span> ${msg.text.replace('[WARN] ', '')}`;
            } else {
                line.textContent = msg.text;
            }

            DOM.bootLines.appendChild(line);

            // Auto-scroll boot lines
            DOM.bootLines.scrollTop = DOM.bootLines.scrollHeight;

            progress = Math.round(((i + 1) / totalMessages) * 100);
            DOM.bootProgress.style.width = progress + '%';
            DOM.bootStatus.textContent = msg.text;
        }

        await sleep(400);
        DOM.bootStatus.textContent = 'System ready. Launching interface...';

        await sleep(600);

        // Fade out boot, show app
        DOM.bootScreen.classList.add('fade-out');
        DOM.appShell.classList.remove('hidden');

        await sleep(700);
        DOM.bootScreen.style.display = 'none';

        // Start post-boot features
        initTypewriter();
        initParticles();
        initGeoVisualization();
        animateCounters();
    }


    // ═══════════════════════════════════════════
    // TYPEWRITER
    // ═══════════════════════════════════════════
    function initTypewriter() {
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentWord = '';

        function type() {
            currentWord = TYPEWRITER_WORDS[wordIndex];

            if (isDeleting) {
                DOM.typewriter.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                DOM.typewriter.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentWord.length) {
                speed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % TYPEWRITER_WORDS.length;
                speed = 400;
            }

            setTimeout(type, speed);
        }

        type();
    }


    // ═══════════════════════════════════════════
    // PARTICLES
    // ═══════════════════════════════════════════
    function initParticles() {
        const canvas = DOM.particlesCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;
        let mouseX = 0, mouseY = 0;

        function resize() {
            const section = canvas.parentElement;
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.5 + 0.1,
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Mouse interaction
                const mdx = p.x - mouseX;
                const mdy = p.y - mouseY;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < 150) {
                    const force = (150 - mDist) / 150;
                    p.vx += (mdx / mDist) * force * 0.02;
                    p.vy += (mdy / mDist) * force * 0.02;
                }

                // Dampen velocity
                p.vx *= 0.99;
                p.vy *= 0.99;
            });

            animId = requestAnimationFrame(drawParticles);
        }

        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });

        resize();
        createParticles();
        drawParticles();
    }


    // ═══════════════════════════════════════════
    // COUNTER ANIMATION
    // ═══════════════════════════════════════════
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 1500;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * ease) + '+';

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }


    // ═══════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════
    function initNavigation() {
        const navItems = DOM.sidebarNav.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                navigateToSection(section);
                closeSidebar();
            });
        });

        // Hero button navigation
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToSection(btn.dataset.nav);
            });
        });

        // Track scroll for active nav
        DOM.contentScroll.addEventListener('scroll', onScroll);
    }

    function navigateToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveNav(sectionId);
    }

    function updateActiveNav(sectionId) {
        // Update sidebar nav
        DOM.sidebarNav.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Update topbar
        const fileName = SECTION_FILES[sectionId] || sectionId;
        DOM.topbarTab.textContent = fileName;
        DOM.topbarTab.dataset.section = sectionId;
        DOM.topbarBreadcrumb.textContent = `~/portfolio/${fileName}`;
    }

    function onScroll() {
        const sections = document.querySelectorAll('.section');
        const scrollTop = DOM.contentScroll.scrollTop;
        const scrollHeight = DOM.contentScroll.clientHeight;

        let current = 'home';

        sections.forEach(section => {
            const offsetTop = section.offsetTop - scrollHeight * 0.3;
            if (scrollTop >= offsetTop) {
                current = section.id;
            }
        });

        updateActiveNav(current);
    }


    // ═══════════════════════════════════════════
    // SIDEBAR MOBILE
    // ═══════════════════════════════════════════
    function initSidebar() {
        DOM.sidebarToggle.addEventListener('click', toggleSidebar);
        DOM.sidebarOverlay.addEventListener('click', closeSidebar);
    }

    function toggleSidebar() {
        DOM.sidebar.classList.toggle('open');
        DOM.sidebarOverlay.classList.toggle('active');
    }

    function closeSidebar() {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('active');
    }


    // ═══════════════════════════════════════════
    // SKILL RING ANIMATION
    // ═══════════════════════════════════════════
    function initSkillAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nodes = entry.target.querySelectorAll('.skill-node');
                    nodes.forEach((node, i) => {
                        setTimeout(() => {
                            const level = parseInt(node.dataset.level);
                            const circumference = 2 * Math.PI * 45; // r=45
                            const offset = circumference - (circumference * level / 100);
                            node.style.setProperty('--offset', offset);
                            node.classList.add('animated');
                        }, i * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skill-category').forEach(cat => {
            observer.observe(cat);
        });
    }


    // ═══════════════════════════════════════════
    // SECTION SCROLL REVEAL
    // ═══════════════════════════════════════════
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.section').forEach(section => {
            if (section.id === 'home') {
                section.classList.add('in-view');
            } else {
                observer.observe(section);
            }
        });
    }


    // ═══════════════════════════════════════════
    // CONTACT FORM
    // ═══════════════════════════════════════════
    function initContactForm() {
        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate submission
            const btn = DOM.contactForm.querySelector('.terminal-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending... <span class="blink-cursor">▊</span>';
            btn.disabled = true;

            setTimeout(() => {
                DOM.contactForm.style.display = 'none';
                DOM.contactSuccess.classList.remove('hidden');
            }, 1500);
        });
    }


    // ═══════════════════════════════════════════
    // CLOCK
    // ═══════════════════════════════════════════
    function initClock() {
        function update() {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            DOM.sidebarTime.textContent = time;
        }
        update();
        setInterval(update, 1000);
    }


    // ═══════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // ═══════════════════════════════════════════
    // GEOMETRIC VISUALIZATION (Hero right side)
    // ═══════════════════════════════════════════
    function initGeoVisualization() {
        const canvas = DOM.geoCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        let nodes = [];
        let angle = 0;
        let mouseX = 0, mouseY = 0;

        function resize() {
            canvas.width = parent.offsetWidth * window.devicePixelRatio;
            canvas.height = 400 * window.devicePixelRatio;
            canvas.style.width = parent.offsetWidth + 'px';
            canvas.style.height = '400px';
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            generateNodes();
        }

        function generateNodes() {
            nodes = [];
            const w = parent.offsetWidth;
            const h = 400;
            const cx = w / 2;
            const cy = h / 2;
            const layers = 3;
            const nodesPerLayer = [1, 6, 12];
            const radii = [0, 60, 130];

            for (let layer = 0; layer < layers; layer++) {
                const count = nodesPerLayer[layer];
                const r = radii[layer];
                for (let i = 0; i < count; i++) {
                    const a = (Math.PI * 2 / count) * i;
                    nodes.push({
                        baseX: cx + Math.cos(a) * r,
                        baseY: cy + Math.sin(a) * r,
                        x: 0, y: 0,
                        r: layer === 0 ? 5 : (layer === 1 ? 3.5 : 2.5),
                        layer: layer,
                        angle: a,
                        radius: r,
                        pulsePhase: Math.random() * Math.PI * 2,
                    });
                }
            }
        }

        function draw() {
            const w = parent.offsetWidth;
            const h = 400;
            ctx.clearRect(0, 0, w, h);
            angle += 0.003;

            // Update node positions with rotation
            nodes.forEach(node => {
                if (node.layer === 0) {
                    node.x = node.baseX;
                    node.y = node.baseY;
                } else {
                    const rotAngle = node.angle + angle * (node.layer === 1 ? 1 : -0.5);
                    node.x = w / 2 + Math.cos(rotAngle) * node.radius;
                    node.y = h / 2 + Math.sin(rotAngle) * node.radius;
                }
            });

            // Draw connections
            nodes.forEach((n1, i) => {
                nodes.forEach((n2, j) => {
                    if (j <= i) return;
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 100;

                    if (dist < maxDist) {
                        const alpha = 0.15 * (1 - dist / maxDist);
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
            });

            // Draw hexagonal grid lines (outer ring)
            const outerNodes = nodes.filter(n => n.layer === 2);
            ctx.beginPath();
            outerNodes.forEach((n, i) => {
                if (i === 0) ctx.moveTo(n.x, n.y);
                else ctx.lineTo(n.x, n.y);
            });
            if (outerNodes.length > 0) ctx.lineTo(outerNodes[0].x, outerNodes[0].y);
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Draw inner hex
            const innerNodes = nodes.filter(n => n.layer === 1);
            ctx.beginPath();
            innerNodes.forEach((n, i) => {
                if (i === 0) ctx.moveTo(n.x, n.y);
                else ctx.lineTo(n.x, n.y);
            });
            if (innerNodes.length > 0) ctx.lineTo(innerNodes[0].x, innerNodes[0].y);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Draw nodes with pulse
            const time = performance.now() / 1000;
            nodes.forEach(node => {
                const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;
                const glow = node.layer === 0 ? 12 : (node.layer === 1 ? 8 : 4);

                // Glow
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glow);
                if (node.layer === 0) {
                    gradient.addColorStop(0, `rgba(0, 229, 255, ${0.4 * pulse})`);
                    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
                } else if (node.layer === 1) {
                    gradient.addColorStop(0, `rgba(139, 92, 246, ${0.3 * pulse})`);
                    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
                } else {
                    gradient.addColorStop(0, `rgba(0, 229, 255, ${0.2 * pulse})`);
                    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
                }
                ctx.beginPath();
                ctx.arc(node.x, node.y, glow, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = node.layer === 0 ? 'rgba(0, 229, 255, 0.9)' :
                               node.layer === 1 ? 'rgba(139, 92, 246, 0.8)' :
                               'rgba(0, 229, 255, 0.5)';
                ctx.fill();
            });

            // Data flow animation (traveling dots along connections)
            const flowPhase = (time * 0.5) % 1;
            nodes.filter(n => n.layer === 1).forEach((n, i) => {
                const center = nodes[0];
                const t = (flowPhase + i * 0.15) % 1;
                const fx = center.x + (n.x - center.x) * t;
                const fy = center.y + (n.y - center.y) * t;

                ctx.beginPath();
                ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${0.6 * (1 - t)})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        parent.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        window.addEventListener('resize', resize);
        resize();
        draw();
    }


    // ═══════════════════════════════════════════
    // KEYBOARD NAVIGATION (Ctrl+K)
    // ═══════════════════════════════════════════
    function initKeyboardNav() {
        const sectionOrder = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
        let currentIdx = 0;

        document.addEventListener('keydown', (e) => {
            // Ctrl+K to cycle through sections
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                currentIdx = (currentIdx + 1) % sectionOrder.length;
                navigateToSection(sectionOrder[currentIdx]);

                // Flash the cmd hint
                const hint = document.getElementById('cmd-hint');
                if (hint) {
                    hint.style.background = 'rgba(0,229,255,0.1)';
                    hint.style.borderRadius = '4px';
                    setTimeout(() => {
                        hint.style.background = 'transparent';
                    }, 300);
                }
            }
        });
    }


    // ═══════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════
    async function init() {
        initNavigation();
        initSidebar();
        initScrollReveal();
        initSkillAnimations();
        initContactForm();
        initClock();
        initKeyboardNav();

        // Run boot sequence
        await runBootSequence();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
