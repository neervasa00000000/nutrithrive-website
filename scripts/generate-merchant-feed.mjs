import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS, auSoloShippingRate } from "../storefront/js/data.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIVE = "https://nutrithrive.com.au";
const OUT = path.join(ROOT, "site", "google-merchant-feed.xml");

const products = [
  {
    id: "moringa-powder-100g",
    dataId: "moringa-powder",
    productType: "Moringa leaf powder",
    group: "moringa-powder",
    title: "NutriThrive Moringa Powder 100g",
    description: "Farm-grown, sun-dried moringa leaf powder. NMI lab-tested in Australia and packed in Truganina.",
    link: "/products/moringa-powder/100g/",
    image: "/assets/images/product_webp/moringa-powder-100g-main.webp",
    price: "11.00 AUD",
    size: "100g",
  },
  {
    id: "moringa-powder-200g",
    dataId: "moringa-200g",
    productType: "Moringa leaf powder",
    group: "moringa-powder",
    title: "NutriThrive Moringa Powder 200g",
    description: "Farm-grown, sun-dried moringa leaf powder. NMI lab-tested in Australia and packed in Truganina.",
    link: "/products/moringa-powder/200g/",
    image: "/assets/images/photos/compressed/moringa-powder-200g-main-square.webp",
    price: "22.00 AUD",
    size: "200g",
  },
  {
    id: "moringa-powder-400g",
    dataId: "moringa-400g",
    productType: "Moringa leaf powder",
    group: "moringa-powder",
    title: "NutriThrive Moringa Powder 400g",
    description: "Four 100g pouches of farm-grown, sun-dried moringa leaf powder. NMI lab-tested in Australia and packed in Truganina.",
    link: "/products/moringa-powder/",
    image: "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
    price: "40.00 AUD",
    size: "400g",
    multipack: 4,
  },
  {
    id: "dried-curry-leaves-30g",
    dataId: "curry-leaves",
    productType: "Dried curry leaves",
    title: "NutriThrive Dried Curry Leaves 30g",
    description: "Whole dried curry leaves grown on our farm and packed in Truganina for curries, dal and tadka.",
    link: "/products/curry-leaves/",
    image: "/assets/images/product_webp/dried-curry-leaves-30g-main.webp",
    price: "7.00 AUD",
  },
  {
    id: "darjeeling-black-tea-100g",
    dataId: "black-tea",
    productType: "Darjeeling loose leaf tea",
    title: "NutriThrive Darjeeling Black Tea 100g",
    description: "Loose-leaf Darjeeling black tea sourced from a family farm and packed in Truganina.",
    link: "/products/black-tea/",
    image: "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
    price: "7.50 AUD",
  },
  {
    id: "moringa-soap-95g",
    dataId: "moringa-soap",
    productType: "Handmade soap",
    title: "NutriThrive Moringa Soap 95g",
    description: "Handmade moringa soap made in Australia and packed in Truganina.",
    link: "/products/moringa-soap/",
    image: "/assets/images/product_webp/moringa-soap-95g-main.webp",
    price: "7.00 AUD",
  },
  {
    id: "moringa-curry-combo-pack",
    dataId: "combo-pack",
    productType: "Gift packs and bundles",
    title: "NutriThrive Moringa and Curry Leaves Combo Pack",
    description: "A 100g moringa powder pouch and a 30g dried curry leaves pack, packed together in Truganina.",
    link: "/products/combo-pack/",
    image: "/assets/images/product_webp/moringa-curry-leaves-combo-main.webp",
    price: "17.00 AUD",
    isBundle: true,
  },
  {
    id: "nutrithrive-gift-pack",
    dataId: "gift-pack",
    productType: "Gift packs and bundles",
    title: "NutriThrive Four Product Gift Pack",
    description: "Moringa powder, Darjeeling tea, dried curry leaves and handmade moringa soap in one gift pack.",
    link: "/products/gift-pack/",
    image: "/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp",
    price: "35.00 AUD",
    isBundle: true,
  },
];

const diwali = PRODUCTS.find((product) => product.id === "diwali-gift-box");
if (!diwali || !(Number(diwali.price) > 0) || !(Number(diwali.weight) > 0) || !diwali.href || !diwali.image) {
  throw new Error("diwali-gift-box needs a price, weight, link and image in storefront/js/data.js");
}
products.push({
  id: "diwali-gift-box",
  dataId: "diwali-gift-box",
  productType: "Gift packs and bundles",
  title: "NutriThrive Diwali Gift Box: Darjeeling Tea, Curry Leaves and Soap",
  description: diwali.detail || diwali.benefit,
  link: diwali.href,
  image: diwali.image,
  price: `${Number(diwali.price).toFixed(2)} AUD`,
});

for (const product of products) {
  const source = PRODUCTS.find((item) => item.id === product.dataId);
  const weight = Number(source?.weight);
  if (!source || !(weight > 0)) {
    throw new Error(`Missing cart weight in storefront/js/data.js for feed item ${product.id} (${product.dataId})`);
  }
  product.weight = weight;
  product.shippingRate = auSoloShippingRate(weight).toFixed(2);
}

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function absolute(url) {
  return new URL(url, LIVE).href;
}

const items = products.map((product) => `    <item>
      <g:id>${xml(product.id)}</g:id>
      <g:title>${xml(product.title)}</g:title>
      <g:description>${xml(product.description)}</g:description>
      <g:link>${xml(absolute(product.link))}</g:link>
      <g:image_link>${xml(absolute(product.image))}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${xml(product.price)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>NutriThrive</g:brand>
      <g:product_type>${xml(product.productType)}</g:product_type>
      <g:shipping_weight>${xml(product.weight)} g</g:shipping_weight>
      <g:shipping><g:country>AU</g:country><g:service>Standard</g:service><g:price>${xml(product.shippingRate)} AUD</g:price></g:shipping>
      <g:identifier_exists>no</g:identifier_exists>${product.group ? `
      <g:item_group_id>${xml(product.group)}</g:item_group_id>` : ""}${product.size ? `
      <g:size>${xml(product.size)}</g:size>` : ""}${product.multipack ? `
      <g:multipack>${xml(product.multipack)}</g:multipack>` : ""}${product.isBundle ? `
      <g:is_bundle>yes</g:is_bundle>` : ""}
    </item>`).join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>NutriThrive products</title>
    <link>${LIVE}/products/</link>
    <description>NutriThrive product feed for Google Merchant Center</description>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(OUT, feed);
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${products.length} products.`);
