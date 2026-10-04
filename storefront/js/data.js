export const PRODUCTS = [
  {
    id: "moringa-powder",
    sku: "NT-MOR-100G",
    name: "Moringa Powder",
    variant: "100g",
    benefit: "Shade-dried leaf powder. Nothing else in the bag.",
    price: 11,
    was: 14,
    weight: 100,
    image: "/assets/images/product_webp/moringa-powder-100g-main.webp",
    href: "/products/moringa-powder/100g/",
    unit: "/ 100g",
    lab: true,
    serving: { grams: 3, pack: "100g pouch" },
    detail:
      "Grown on our farm, shade-dried and manufactured by NutriThrive. Tested in Australia and packed in Truganina. Same-day dispatch before 2pm, Monday to Friday.",
  },
  {
    id: "moringa-200g",
    sku: "NT-MOR-200G",
    name: "Moringa Powder",
    variant: "200g",
    benefit: "Same powder, more servings.",
    price: 21.5,
    was: 28,
    weight: 200,
    image: "/assets/images/photos/compressed/moringa-powder-200g-main-square.webp",
    href: "/products/moringa-powder/200g/",
    unit: "/ 200g",
    lab: true,
    serving: { grams: 3, pack: "200g pouch" },
    detail:
      "The same farm-grown, shade-dried moringa in a 200g pouch. Manufactured by NutriThrive, tested in Australia and packed in Truganina.",
  },
  {
    id: "moringa-400g",
    sku: "NT-MOR-400G",
    name: "400g Moringa Bundle",
    variant: "4 × 100g",
    benefit: "Four pouches. Same batch standards.",
    price: 35,
    was: 56,
    weight: 400,
    image: "/assets/images/product_webp/moringa-powder-400g-bundle-main.webp",
    href: "/products/moringa-powder/",
    unit: "/ 400g",
    lab: true,
    serving: { grams: 3, pack: "400g bundle" },
    detail:
      "Four 100g pouches of our farm-grown moringa. Save $21 compared with four packs at the $14 original price. Manufactured by NutriThrive and packed in Truganina.",
  },
  {
    id: "curry-leaves",
    sku: "NT-CUR-30G",
    name: "Dried Curry Leaves",
    variant: "30g",
    benefit: "Farm-grown karipatta from our own farm.",
    price: 7,
    was: null,
    weight: 30,
    image: "/assets/images/product_webp/dried-curry-leaves-30g-main.webp",
    href: "/products/curry-leaves/",
    unit: "/ 30g",
    lab: false,
    costCopy:
      "Free shipping on Australian orders of $79 or more. Under $79, standard shipping is $9.69.",
  },
  {
    id: "black-tea",
    sku: "NT-TEA-DAR",
    name: "Darjeeling Black Tea",
    variant: "100g",
    benefit: "From a Darjeeling family farm.",
    price: 7.5,
    was: null,
    weight: 100,
    image: "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
    href: "/products/black-tea/",
    unit: "/ 100g",
    lab: false,
    costCopy:
      "Free shipping on Australian orders of $79 or more. Under $79, standard shipping is $9.69.",
  },
  {
    id: "moringa-soap",
    sku: "NT-SOAP-95G",
    name: "Moringa Soap",
    variant: "95g",
    benefit: "Handmade by us in Australia.",
    price: 7,
    was: null,
    weight: 95,
    image: "/assets/images/product_webp/moringa-soap-95g-main.webp",
    href: "/products/moringa-soap/",
    unit: "/ 95g",
    lab: false,
    costCopy:
      "Free shipping on Australian orders of $79 or more. Under $79, standard shipping is $9.69.",
  },
  {
    id: "combo-pack",
    sku: "NT-COMBO",
    name: "Premium Combo Pack",
    variant: "Moringa + curry",
    benefit: "100g powder and 30g curry leaves.",
    price: 17,
    was: null,
    weight: 130,
    image: "/assets/images/product_webp/moringa-curry-leaves-combo-main.webp",
    href: "/products/combo-pack/",
    unit: "",
    lab: true,
    serving: {
      grams: 3,
      basisGrams: 100,
      pack: "included 100g pouch",
      extra: "Plus 30g dried curry leaves.",
    },
    detail:
      "100g moringa powder and 30g dried curry leaves. Morning smoothie and evening tadka from one box.",
  },
  {
    id: "diwali-gift-box",
    sku: "NT-DIWALI-BOX",
    name: "Diwali Gift Box",
    variant: "Tea + curry + soap",
    benefit: "Three products packed for shipping — not a decorative box. No moringa.",
    price: 20,
    was: null,
    weight: 225,
    image: "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
    href: "/products/diwali-gift-box/",
    unit: "",
    lab: false,
    costCopy: "$20 for tea, curry leaves, and soap products packed together in Truganina.",
  },
  {
    id: "gift-pack",
    sku: "NT-GIFT-325G",
    name: "Gift Pack",
    variant: "4 products",
    benefit: "Diwali gift pack: powder, tea, curry leaves, and soap.",
    price: 35,
    was: null,
    weight: 325,
    image: "/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp",
    href: "/products/gift-pack/",
    unit: "",
    lab: false,
    costCopy: "$35 for four products packed together in Truganina.",
  },
];

export function costNote(p) {
  const serving = p.serving;
  if (!serving) return p.costCopy || "";
  const grams = serving.basisGrams ?? p.weight;
  const size = serving.grams;
  const count = grams / size;
  const each = `$${(p.price / count).toFixed(2)}`;
  if (serving.unit === "cup") {
    return `About ${each} per cup from the ${serving.pack} (about ${Math.round(count)} cups).`;
  }
  const extra = serving.extra ? ` ${serving.extra}` : "";
  return `About ${each} per daily ${size}g serving from the ${serving.pack}.${extra}`;
}

export const REVIEWS = [
  {
    name: "Mai Anh Trần Thúy",
    text: "Black tea is my fav product here!! I usually use their black tea to make roasted milk tea which is fantastic for such hot summer in Melbourne!",
  },
  {
    name: "Siv Mey",
    text: "Friendly people and good quality products and most of all pretty cheap. Love that!!",
  },
  {
    name: "Priyankari Nath",
    stars: 4,
    text: "I liked it a lot! You should definitely go for it without a second thought",
  },
];
