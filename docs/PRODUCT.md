# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS generated from `storefront/` into the established production paths at the repository root. Netlify publishes the verified `.netlify-publish/` build artifact.

## Users

Adults in Australia shopping for moringa powder, dried curry leaves, Darjeeling tea, and related pantry/wellness products. They arrive from search, Instagram, or Google reviews and need to decide whether the powder is trustworthy enough to add to a smoothie or pantry.

## Product Purpose

NutriThrive sells shade-dried moringa leaf powder and a small related range, packed in Truganina, Melbourne, with published Australian lab summaries. Success is a visitor understanding what is sold, why it can be trusted, and completing a purchase or reading a guide that leads to a purchase.

## Positioning

Single-ingredient shade-dried moringa leaf powder, batch-tested in Australia, packed in small runs from a named Truganina warehouse, with a published lab summary PDF. Neighbouring pharmacy and marketplace powders typically do not publish batch PDFs at this price.

## Operating Context

Ecommerce storefront plus journal. Orders before 2pm on business days aim for same-day Melbourne dispatch. Free standard shipping on Australian orders AU$80+ and worldwide on AU$90+. Pickup/visit at 15 Europe Street, Truganina VIC 3029 by calling first. Hours listed as daily 9:00 AM – 11:00 PM AEST.

## Capabilities and Constraints

- Products: moringa powder (100g $11, 200g $21.50, 400g bundle $35), moringa soap $7, curry leaves 30g $7, Darjeeling black tea $7.50, combo pack $17, gift pack $35, moringa+soap bundle $17.
- Cart, checkout and payment use the production storefront flow, including PayPal and the existing server-side payment functions. Local preview does not submit a real payment.
- Journal currently holds 128 public articles.
- Do not invent medical claims, extra reviews, prices, lab results, or customers.
- Founder is Neer; not a medical doctor or TGA-registered health practitioner.
- 7-day returns on unopened packs; original shipping not refunded.

## Brand Commitments

- Name: NutriThrive / NutriThrive Australia.
- Voice: direct, calm, factual Melbourne warehouse voice. Prefer “shade-dried”, “lab-tested in Australia”, “packed in Truganina”.
- Visual direction is the NutriThrive design system (Apple HIG as a principles benchmark, not an Apple clone). Fraunces display type, Plus Jakarta Sans body type, specified colour tokens, 8-point spacing, disciplined navigation, product-card and PDP templates.
- Do not make the whole website green. Neutral surfaces with restrained brand green.

## Evidence on Hand

- Live site copy, product data, and prices in `shared/site-data.js`.
- Google reviews (4.9 from the listing; quotes in `shared/js/google-reviews-data.js`). Do not rewrite quotes.
- Lab summary PDF at `/documents/nutrithrive-lab-report-summary.pdf`.
- Product photography in `/assets/images/product_photos/` and homepage showcase images.
- ABN 32 639 442 616. Email nutrithrive0@gmail.com. Phone +61 438 201 419. Instagram https://www.instagram.com/nutri__thrive/.

## Product Principles

- Trust before decoration: lab testing and Melbourne packing must be findable without hunting.
- One primary action per screen.
- Use only confirmed prices, reviews, and claims.
- Calm over marketplace density.
- Accessibility is a pass/fail layer, not polish.

## Accessibility & Inclusion

WCAG AA-level contrast, 44px practical touch targets, visible focus, labels on forms, heading hierarchy, reduced-motion support, and information not by colour alone. Body text must not drop below 16px.
