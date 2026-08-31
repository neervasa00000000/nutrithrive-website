---
name: NutriThrive Design System v1.0
description: Calm Melbourne wellness storefront — white and stone-green, Inter, hairline seams, almost no shadow.
colors:
  primary: "#2f6b3c"
  brand-dark: "#244f2d"
  stone-green: "#eaf2e9"
  paper: "#ffffff"
  mist: "#f7f8f5"
  warm-paper: "#faf9f5"
  ink: "#171a17"
  stone: "#5f655f"
  muted: "#555c55"
  seam: "#e4e7e2"
  success: "#287a43"
  error: "#b42318"
  on-brand: "#ffffff"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "38px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "40px"
  8: "48px"
  9: "64px"
  10: "80px"
  11: "96px"
  12: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-brand}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.brand-dark}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-secondary-hover:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  product-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  review-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  answer-box:
    backgroundColor: "{colors.stone-green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  cart-summary:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: NutriThrive Design System v1.0

## Overview

**Creative North Star: "The Truganina Proof Counter"**

NutriThrive’s shipped storefront is a quiet Melbourne warehouse counter: white paper, one stone-green field, Inter at a short scale, and published proof instead of marketplace decoration. Apple HIG is a principles benchmark (touch size, visible focus, one primary action) — not an Apple costume. The visitor should read the product, trust the lab story, and act.

Density is low. Sections breathe on an 8-point rhythm. Brand green is an action and a proof mark, not a theme wash. Surfaces stay flat; a 1px pale seam does the work a shadow would do elsewhere. Product photography is the real pouch on a flat stone-green or mist square — photoreal, no studio forest, no badge stack.

**Key Characteristics:**
- Neutral paper and mist fields; stone-green reserved for product stages and answer callouts
- Single face (Inter) at 48 / 38 / 28 / 22 / 17 / 14
- 8-point spacing; 52px / 12px-radius buttons; 16px-radius cards
- Hairline `#e4e7e2` borders; almost no shadow
- One primary action per screen; 44px practical touch; 2px brand focus ring

## Colors

A restrained leaf-green accent on warm-neutral paper. Most of any screen is white or mist; green appears on buttons, links, and small proof.

### Primary
- **Lab Green**: Actions, in-content links, current nav, cart count, selection wash pairing. Hover deepens to **Deep Canopy**.
- **Deep Canopy**: Primary hover and pressed link.
- **Stone Green**: Hero and “why” photo wells, journal answer boxes, text selection. Not a page background.

### Neutral
- **Paper**: Default page, header, footer, cards, inputs.
- **Mist**: Alternating bands, product-card media, PDP gallery, cart summary, article sidebar, icon-button hover.
- **Warm Paper**: Quiet checkout notices only.
- **Ink**: Body, headings, announcement bar, closing CTA band.
- **Stone**: Supporting lines, review meta, footer links at rest.
- **Muted**: Struck prices and legal footer.
- **Seam**: Every divider, card edge, input stroke, and sticky header rule.

### Secondary
Omit. Success (**Proof Green**) is check-list confirmation on the PDP only. Error is form invalid borders and helper text.

**The Restrained Green Rule.** Do not make the whole website green. Brand green occupies actions and proof, not section fills. A screen that reads as a green field has left the system.

## Typography

**Display Font:** Inter (with -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)
**Body Font:** Inter (same stack)
**Label/Mono Font:** Inter (same stack; no mono face)

**Character:** One utilitarian grotesque. Headlines are semibold with tight negative tracking; body is regular 17px at 1.6. No italic display, no second family.

### Hierarchy
- **Display** (600, 48px, 1.1, -0.03em): Page and hero H1. Caps at 36px from 860px, 34px from 480px.
- **Headline** (600, 38px, 1.15, -0.03em): Section H2.
- **Title** (600, 28px, 1.2, -0.03em): H3, featured journal title, PDP price.
- **Body** (400, 17px, 1.6): Default copy; 16px from 860px. Measure 720px. Lede support is 20px / 1.55 in Stone.
- **Label** (500, 14px, 1.45): Nav, announce, trust lines, field labels, article category (sentence case, Lab Green), breadcrumbs.

Buttons use 16px / 600 / 1.2 on the same face — not a separate family.

**The Short Scale Rule.** Stay on 48 / 38 / 28 / 22 / 20 / 17 / 16 / 14. Do not add a display serif, a 60px poster size, or a weight below 400 or above 600 for UI type.

## Layout

Centered canvas `min(100% − 40px, 1280px)`; 32px inset from 860px. Reading column 720px. Sticky header 76px (64px from 860px) under a 40px ink announcement bar.

Section padding is 80px, 96px on large bands. Grids: products 4 → 3 (1100px) → 1 (860px); reviews 3 → 1; footer and trust 4 → 2 → 1; PDP, cart, and article (720 + 280) collapse to one column at 860px. Hero is ~1.05 / 0.95 until 860px. Product and hero photos are 1:1; article media 16:9; why-band 4:3.

**The Eight-Point Rule.** Gutters and padding come from 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128. A 10px or 18px space is a defect.

## Elevation & Depth

The system is flat. Cards, header, and inputs have no drop shadow. Separation is a 1px Seam, a shift to Mist or Stone Green, or Ink inversion on the announce bar and closing CTA. The only shipped shadow is the search overlay sheet (`0 4px 16px rgba(0, 0, 0, 0.06)`). Focus is a 2px Lab Green ring, offset 3px.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06)`): Search sheet only.

**The Hairline Rule.** Surfaces are flat at rest. Do not put a shadow on cards, buttons, or product tiles. If a floating layer is required, use the overlay token once.

## Shapes

Buttons, fields, quantity steppers, and answer boxes are gently rounded (12px). Cards, review quotes, article thumbs, and cart summary are a step softer (16px). Hero and PDP photo wells are the softest square (20px). Icon buttons are 8px. The cart count is a pill. Logo mark is a 32px circle. No hard corners, no squircles, no clipped diagonals.

Borders are always 1px Seam. Product-card hover darkens that stroke one step; it does not lift.

## Components

### Buttons
Quiet, full-color slabs. 52px tall, 12px radius, 16px / 600, horizontal padding 24px, 150ms ease-out. Product-card internals may drop to 48px height, not a new style.

- **Shape:** Gently rounded (12px)
- **Primary:** Lab Green on white type. Hover Deep Canopy. On the ink CTA band, invert: Paper fill, Ink type.
- **Secondary:** Paper fill, Ink type, 1px Seam. Hover Mist.
- **Focus:** 2px Lab Green, 3px offset. Disabled at 50% opacity.

### Cards / Containers
- **Corner Style:** Soft tile (16px)
- **Background:** Paper; media well Mist (products) or Stone Green (hero / why)
- **Shadow Strategy:** None. See Elevation.
- **Border:** 1px Seam
- **Internal Padding:** 24px on product cards; 32px on reviews and cart summary

Product cards are a 1:1 photo, 17px title, 14px Stone benefit, 18px / 600 price (struck price 14px Muted), then a primary add button. Article cards have no border: 16:9 thumb (16px radius), sentence-case Lab Green category, 20px title (28px when featured).

### Inputs / Fields
- **Style:** Paper fill, 1px Seam, 12px radius, 12×16 padding, 48px min height (52px inside search). Caret is Lab Green.
- **Focus:** Shared 2px ring. Labels 14px / 500 above the control.
- **Error:** Seam becomes Error; helper in Error at 14px.
- **Quantity:** Segmented 44px stepper, Seam border, 12px radius, 48px numeric well.

### Navigation
Sticky Paper header, 1px Seam under a 76px bar: circular 32px mark + 17px / 600 wordmark; centered 14px / 500 Ink links (Lab Green + 1.5px underline when current); 44px icon tools. Mobile hides the inline nav, shortens the announce, and opens a 48px-row list. Footer is four quiet columns of 14px Stone links.

### Announcement and CTA band
Ink bar, 14px / 500 light type, 40px min height. Closing CTA inverts the page: Ink field, Paper primary button.

### Answer box
Stone Green well, 12px radius, 24px padding. Journal “quick answer” only — not a general card.

### FAQ
Hairline stack. 17px / 600 summary, 44px min height, CSS chevron. No icon font.

## Do's and Don'ts

### Do:
- **Do** keep most of the screen Paper or Mist and spend Lab Green on the primary action and proof links.
- **Do** size primary buttons 52px tall with 12px radius and cards 16px radius.
- **Do** separate surfaces with a 1px Seam, not a shadow.
- **Do** set product photography on a flat Stone Green or Mist square, 1:1, real packaging, no badge collage.
- **Do** keep body copy at 17px (16px from 860px) and touch targets at 44px with a visible focus ring.

### Don't:
- **Don't** wash sections or pages in Lab Green or decorative leaf gradients.
- **Don't** add drop shadows to cards, buttons, or product tiles.
- **Don't** introduce a second typeface, a poster display size, or uppercase tracked eyebrows above headlines.
- **Don't** drop body text below 16px or omit labels on fields.
- **Don't** invent prices, reviews, lab results, or medical claims to fill a layout.
