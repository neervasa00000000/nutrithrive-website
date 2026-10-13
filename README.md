# NutriThrive

**Live shop:** [https://nutrithrive.com.au](https://nutrithrive.com.au/)

NutriThrive is a farmer and manufacturer in Truganina, Melbourne. Moringa and curry leaves are grown on our own farm. Tea comes from a Darjeeling family farm. Moringa soap is handmade in Australia. We pack every order ourselves.

| | |
| --- | --- |
| ABN | 32 639 442 616 |
| Packing address | Ridley Place, Truganina VIC 3029, Australia |
| Phone | [+61 438 201 419](tel:+61438201419) |
| Email | [nutrithrive0@gmail.com](mailto:nutrithrive0@gmail.com) |

## Range

- [Moringa leaf powder](https://nutrithrive.com.au/products/moringa-powder/)
- [Dried curry leaves](https://nutrithrive.com.au/products/curry-leaves/)
- [Darjeeling loose leaf black tea](https://nutrithrive.com.au/products/black-tea/)
- [Handmade moringa soap](https://nutrithrive.com.au/products/moringa-soap/)
- [Diwali Gift Box](https://nutrithrive.com.au/products/diwali-gift-box/) (tea, curry leaves and soap)

Free Australian shipping from $49. International postage is calculated from the parcel weight. Orders placed before 2pm on business days usually leave the same day.

## On the site

- [Shop](https://nutrithrive.com.au/products/)
- [Blog](https://nutrithrive.com.au/blog/)
- [About](https://nutrithrive.com.au/about)
- [Melbourne and pickup](https://nutrithrive.com.au/melbourne/)
- [Shipping and returns](https://nutrithrive.com.au/shipping)
- [Contact](https://nutrithrive.com.au/contact)

## This repository

Source for the public website. Page copy and articles live in `site/`. The storefront generator lives in `storefront/`. Netlify publishes the `main` branch.

```bash
npm ci
npm run build
```

`npm run build` writes the production pages into `site/` and checks the storefront. Do not commit `node_modules/` or `.netlify-publish/`.
