/**
 * Sticky Table of Contents – React component for blog posts
 * Use this in your Shopify-linked React frontend to improve dwell time and navigation.
 * Renders a sticky nav that highlights the current section on scroll.
 *
 * Usage:
 *   import StickyTableOfContents from './blog/StickyTableOfContents';
 *   const items = [
 *     { href: '#travel-trends', label: 'Melbourne Sydney travel 2026 & VicEmergency safety' },
 *     { href: '#travel-itinerary', label: '3-day Melbourne summer itinerary 2026' },
 *     ...
 *   ];
 *   <StickyTableOfContents title="In this guide" items={items} />
 */

import { useState, useEffect } from 'react';

export default function StickyTableOfContents({ title = 'In this guide', items = [], className = '' }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const sections = items
      .map(({ href }) => {
        const id = href.replace('#', '');
        const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
        return { id, el };
      })
      .filter((s) => s.el);

    const onScroll = () => {
      const scrollY = window.scrollY ?? window.pageYOffset;
      let best = null;
      sections.forEach(({ id, el }) => {
        const top = el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - 120) best = id;
      });
      setActiveId(best || sections[0]?.id || '');
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <nav
      className={`toc toc-sticky ${className}`}
      aria-label={title}
      id="blog-toc"
      style={{
        position: 'sticky',
        top: '5.5rem',
        zIndex: 20,
        margin: '2.5rem 0 1.5rem',
        padding: '1rem 1.25rem',
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid rgba(23,92,54,0.12)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.98rem' }}>
        {items.map(({ href, label }) => (
          <li key={href} style={{ marginBottom: '0.35rem' }}>
            <a
              href={href}
              className={activeId === href.replace('#', '') ? 'toc-active' : ''}
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: activeId === href.replace('#', '') ? 700 : 500,
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
