console.log('[NutriThrive] script.js loaded');

document.addEventListener('DOMContentLoaded', () => {

    // Hard redirect if user lands on deprecated Usage Guide blog URL
    try {
        const oldPath = '/pages/usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html';
        const newPath = '/pages/usage-guide/how-to-use-moringa.html';
        if (location.pathname.endsWith(oldPath)) {
            location.replace(newPath);
            return; // stop further scripts on this page
        }
    } catch(e) {}

    // Remove any 'Benefits' nav links globally (page was removed)
    try {
        const containers = [document.querySelector('.nav-links'), ...Array.from(document.querySelectorAll('.footer-links'))];
        containers.forEach(nav => {
            if (!nav) return;
            const links = Array.from(nav.querySelectorAll('a'));
            links.forEach(a => {
                const text = (a.textContent || '').trim().toLowerCase();
                const href = a.getAttribute('href') || '';
                // Normalize any links that still point to the old usage guide blog URL
                if (href.includes('/pages/usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html') || href.includes('usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html')) {
                    // Fix double slashes in URL construction
                    const baseUrl = location.origin.replace(/\/+$/, ''); // Remove trailing slashes
                    const cleanHref = href.replace(/^\/+/, '/'); // Normalize leading slashes
                    const absolute = href.startsWith('http') ? href : new URL(cleanHref, baseUrl).pathname;
                    const isAbsoluteOld = absolute.endsWith('/pages/usage-guide/blog/moringa-powder-benefits-ultimate-guide-2024.html');
                    if (isAbsoluteOld) {
                        a.setAttribute('href', '../usage-guide/how-to-use-moringa.html');
                    }
                }
                if (text === 'benefits' || href.includes('/benefits/')) {
                    a.remove();
                }
                if (href.includes('/usage-guide/how-to-use-moringa.html') || text === 'usage guide') {
                    a.textContent = 'Usage & Benefits';
                }
            });
        });

        // Update any footer section titled "Quick Links"
        Array.from(document.querySelectorAll('.footer-section')).forEach(section => {
            const h = section.querySelector('h3, h2');
            if (!h) return;
            if ((h.textContent || '').trim().toLowerCase() === 'quick links') {
                Array.from(section.querySelectorAll('a')).forEach(a => {
                    const href = a.getAttribute('href') || '';
                    const label = (a.textContent || '').trim().toLowerCase();
                    if (href.includes('/usage-guide/how-to-use-moringa.html') || label === 'usage guide') {
                        a.textContent = 'Usage & Benefits';
                    }
                    if (label === 'benefits' || href.includes('/benefits/')) {
                        a.remove();
                    }
                });
            }
        });
    } catch(e) { console.warn('Nav cleanup error:', e); }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        // Toggle menu function (force display on open for mobile)
        function toggleMenu() {
            const willOpen = !navLinks.classList.contains('nav-active');
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll');
            if (willOpen) {
                navLinks.style.display = 'flex';
            } else {
                navLinks.style.display = '';
            }
        }

        // Expose for inline fallback if needed
        window.ntToggleMenu = toggleMenu;

        // Close menu function
        function closeMenu() {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.classList.remove('no-scroll');
            navLinks.style.display = '';
        }

        // Hamburger click - toggle menu and show close functionality
        const handleTap = (e) => { 
            e.preventDefault();
            e.stopPropagation(); 
            console.log('Hamburger clicked!');
            toggleMenu(); 
        };
        
        // Multiple event listeners for better compatibility
        hamburger.addEventListener('click', handleTap);
        hamburger.addEventListener('touchend', handleTap, { passive: false });
        hamburger.addEventListener('mousedown', handleTap);
        
        // Fallback inline handler assignment
        hamburger.onclick = (e) => { 
            e.preventDefault();
            e.stopPropagation(); 
            console.log('Hamburger onclick triggered!');
            toggleMenu(); 
        };

        // Make hamburger lines clickable to close menu when open
        const hamburgerLines = hamburger.querySelectorAll('div');
        hamburgerLines.forEach(line => {
            line.addEventListener('click', (e) => {
                e.stopPropagation();
                if (navLinks.classList.contains('nav-active')) {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking on nav links
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('nav-active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('nav-active')) {
                closeMenu();
            }
        });

        // Prevent body scroll when menu is open
        navLinks.addEventListener('touchmove', (e) => {
            if (navLinks.classList.contains('nav-active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // --- Page-Specific Animations ---

    // 1. Roadmap Animation (Homepage only)
    const roadmapSection = document.querySelector('.roadmap-section');
    if (roadmapSection) {
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            const timeline = roadmapSection.querySelector('.roadmap-timeline');
            const milestones = gsap.utils.toArray('.roadmap-milestone');

            if (timeline && milestones.length > 0) {
                // Remove any previous vLineGrow
                const oldGrow = timeline.querySelector('.roadmap-vline-grow');
                if (oldGrow) oldGrow.remove();

                // Animate the vertical line growing from top to bottom
                const vLineGrow = document.createElement('div');
                vLineGrow.className = 'roadmap-vline-grow';
                vLineGrow.style.position = 'absolute';
                vLineGrow.style.left = '-2px';
                vLineGrow.style.top = '0';
                vLineGrow.style.width = '4px';
                vLineGrow.style.background = '#1b7f5a';
                vLineGrow.style.borderRadius = '2px';
                vLineGrow.style.zIndex = '1';
                vLineGrow.style.height = '0';
                timeline.appendChild(vLineGrow);

                // Get the full height of the timeline
                function getTimelineHeight() {
                    return timeline.offsetHeight;
                }

                // Animate the vertical line height with scroll
                gsap.fromTo(vLineGrow, { height: 0 }, {
                    height: () => getTimelineHeight() + 'px',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: roadmapSection,
                        start: 'top 80%',
                        end: 'bottom 60%',
                        scrub: 1,
                        invalidateOnRefresh: true,
                        fastScrollEnd: true,
                    }
                });

                // Animate each milestone in sequence
                milestones.forEach((item, i) => {
                    const hline = item.querySelector('.roadmap-hline');
                    const circle = item.querySelector('.roadmap-circle');
                    const text = item.querySelector('.roadmap-text');

                    gsap.set([hline, circle, text], { clearProps: 'all' });
                    gsap.set(hline, { width: 0 });
                    gsap.set(circle, { scale: 0, opacity: 0 });
                    gsap.set(text, { opacity: 0, y: 20 });

                    let tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            start: 'top center+=40',
                            end: 'bottom center-=40',
                            scrub: 1,
                            invalidateOnRefresh: true,
                            fastScrollEnd: true,
                        }
                    });
                    tl.to(hline, { width: '64px', duration: 0.3, ease: 'power1.out' })
                      .to(circle, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' }, '-=0.15')
                      .to(text, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }, '-=0.1');
                });

                // Animate the roadmap title
                gsap.fromTo('.roadmap-title',
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.roadmap-section',
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
        } else {
            console.log('[NutriThrive] GSAP not loaded, skipping roadmap animations.');
        }
    }

    // 2. Features Section Animation (Homepage only)
    const featuresSection = document.querySelector('.features-section.features-clean');
    if (featuresSection) {
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray('.features-section.features-clean .feature').forEach((el) => {
                // Enter: blur -> sharp + fade in
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 32, filter: 'blur(8px)' },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                            end: 'top 65%',
                            scrub: 0.7,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // Keep fully visible while centered
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 75%',
                    end: 'bottom 25%',
                    onEnter: () => gsap.to(el, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.2 }),
                    onEnterBack: () => gsap.to(el, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.2 }),
                });

                // Exit: fade + slight blur when scrolling away
                gsap.to(el, {
                    opacity: 0,
                    y: -16,
                    filter: 'blur(6px)',
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'bottom 45%',
                        end: 'bottom 10%',
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                });
            });
        } else {
            console.log('[NutriThrive] GSAP not loaded, skipping features animations.');
        }
    }

    // 3. Blog Preview Section Fade/Reveal on Scroll (Homepage only)
    const blogPreview = document.querySelector('.blog-preview');
    if (blogPreview) {
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            // Ensure visible on initial load (top→down). We'll only fade when leaving.

            // Fade in the section as it enters, fade out when scrolling away
            // Keep fully visible while centered (works both directions)
            ScrollTrigger.create({
                trigger: blogPreview,
                start: 'top 85%',
                end: 'bottom 15%',
                onEnter: () => blogPreview.classList.add('is-visible'),
                onEnterBack: () => blogPreview.classList.add('is-visible'),
                onLeave: () => blogPreview.classList.remove('is-visible'),
                onLeaveBack: () => blogPreview.classList.remove('is-visible'),
            });

            // Exit fade-out (as the section scrolls away, top→down)
            gsap.to(blogPreview, {
                opacity: 0,
                y: -24,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: blogPreview,
                    start: 'bottom 55%',
                    end: 'bottom 5%',
                    scrub: 0.9,
                    invalidateOnRefresh: true,
                },
            });

            // Stagger in the links/buttons for a subtle motion effect
            const blogLinks = gsap.utils.toArray('.blog-preview-link');
            if (blogLinks.length) {
                gsap.fromTo(
                    blogLinks,
                    { opacity: 0, y: 16 },
                    {
                        opacity: 1,
                        y: 0,
                        ease: 'power1.out',
                        stagger: 0.12,
                        scrollTrigger: {
                            trigger: blogPreview,
                            start: 'top 70%',
                            end: 'top 40%',
                            scrub: 0.6,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }
        } else {
            console.log('[NutriThrive] GSAP not loaded, skipping blog preview animation.');
        }
    }
});

// Ensure GSAP ScrollTrigger refreshes after all images/fonts/layout are loaded
window.addEventListener('load', () => {
    if (window.gsap && window.ScrollTrigger) {
        setTimeout(() => {
            window.ScrollTrigger.refresh();
        }, 100);
    }
});