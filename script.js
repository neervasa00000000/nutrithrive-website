document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Roadmap scroll-driven animation: vertical line grows as you scroll, milestones animate in sequence
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        const section = document.querySelector('.roadmap-section');
        const timeline = document.querySelector('.roadmap-timeline');
        const milestones = gsap.utils.toArray('.roadmap-milestone');

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
                trigger: section,
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
    }

    // Animate the roadmap title (fade in and move up)
    if (window.gsap && window.ScrollTrigger) {
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

    // Animate features below roadmap (fade in and move up, staggered)
    if (window.gsap && window.ScrollTrigger) {
        gsap.set('.features-section.features-clean .feature', { opacity: 0, y: 40 });
        gsap.to('.features-section.features-clean .feature', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.18,
            scrollTrigger: {
                trigger: '.features-section.features-clean',
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
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