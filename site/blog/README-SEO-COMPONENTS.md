# Blog SEO & conversion components

## Sticky Table of Contents (React)

**File:** `StickyTableOfContents.jsx`

Use this component in your Shopify-linked React frontend for long blog posts. It:

- Sticks below the header on scroll to keep "In this guide" visible.
- Highlights the current section (`.toc-active`) based on scroll position to improve dwell time.

### Example usage

```jsx
import StickyTableOfContents from './blog/StickyTableOfContents';

const tocItems = [
  { href: '#travel-trends', label: 'Melbourne Sydney travel 2026 & VicEmergency safety' },
  { href: '#travel-itinerary', label: '3-day Melbourne summer itinerary 2026' },
  { href: '#online-shopping', label: 'Temu vs Amazon Australia 2026 & shopping tips' },
  { href: '#beauty-hair', label: 'Hair care trends Australia 2026' },
  { href: '#wellness-superfoods', label: 'Wellness & superfoods summer Australia' },
  { href: '#daily-routines', label: 'Summer wellness routines Melbourne' },
  { href: '#conclusion', label: 'Putting it all together' },
];

<StickyTableOfContents title="In this guide" items={tocItems} />
```

Ensure your article headings use matching `id` attributes (e.g. `id="travel-trends"`).

## Inline “Shop Now” product cards (HTML / JSX)

The Australia Summer 2026 blog uses inline product cards at key mentions of **Moringa**, **Black Tea**, and **Curry Leaves**. Pattern:

- **Single card:** `.product-card-inline-flow` (image + copy + “Shop Now”).
- **Two cards in a row:** `.products-inline-row` wrapping two `.product-card-inline-flow` blocks.

For a React version, pass product slug, title, description, image and shop URL and render the same structure so links stay optimized for your Shopify product pages.
