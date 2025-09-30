console.log('[NutriThrive] script.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        // Toggle menu function
        function toggleMenu() {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll');
        }

        // Close menu function
        function closeMenu() {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.classList.remove('no-scroll');
        }

        // Hamburger click - toggle menu and show close functionality
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

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
            gsap.utils.toArray('.features-section.features-clean .feature').forEach((el, i) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                            end: 'top 60%',
                            scrub: 0.7,
                            invalidateOnRefresh: true,
                        }
                    }
                );
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

            // Fade in the section as it enters, fade out when scrolling away
            gsap.fromTo(
                blogPreview,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: blogPreview,
                        start: 'top 80%',
                        end: 'top 40%',
                        scrub: 0.7,
                        toggleActions: 'play none none reverse',
                        invalidateOnRefresh: true,
                    },
                }
            );

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