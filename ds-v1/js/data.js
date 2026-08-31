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
    href: "/products/moringa-powder/",
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
    href: "/products/moringa-powder/",
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
      "Four 100g pouches of our farm-grown moringa. Save $21 compared with buying four separately. Manufactured by NutriThrive and packed in Truganina.",
  },
  {
    id: "curry-leaves",
    sku: "NT-CUR-30G",
    name: "Dried Curry Leaves",
    variant: "30g",
    benefit: "Farm-grown karipatta from our own farm.",
    price: 7,
    was: 8.49,
    weight: 30,
    image: "/assets/images/product_webp/dried-curry-leaves-30g-main.webp",
    href: "/products/curry-leaves/",
    unit: "/ 30g",
    lab: false,
    costCopy: "$7 for a 30g pack of whole dried leaves.",
  },
  {
    id: "black-tea",
    sku: "NT-TEA-DAR",
    name: "Darjeeling Black Tea",
    variant: "100g",
    benefit: "From a Darjeeling family farm.",
    price: 7.5,
    was: 10,
    weight: 100,
    image: "/assets/images/product_webp/darjeeling-black-tea-100g-main.webp",
    href: "/products/black-tea/",
    unit: "/ 100g",
    lab: false,
    serving: { grams: 2, unit: "cup", pack: "100g pack" },
  },
  {
    id: "moringa-soap",
    sku: "NT-SOAP-95G",
    name: "Moringa Soap",
    variant: "95g",
    benefit: "Handmade by us in Australia.",
    price: 7,
    was: 9.49,
    weight: 95,
    image: "/assets/images/product_webp/moringa-soap-95g-main.webp",
    href: "/products/moringa-soap/",
    unit: "/ 95g",
    lab: false,
    costCopy: "$7 for one handmade 95g bar.",
  },
  {
    id: "combo-pack",
    sku: "NT-COMBO",
    name: "Premium Combo Pack",
    variant: "Moringa + curry",
    benefit: "100g powder and 30g curry leaves.",
    price: 17,
    was: 22.49,
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
    id: "gift-pack",
    sku: "NT-GIFT-325G",
    name: "Gift Pack",
    variant: "4 products",
    benefit: "Powder, tea, curry leaves, and soap.",
    price: 35,
    was: 41.98,
    weight: 325,
    image: "/assets/images/product_webp/nutrithrive-four-product-gift-pack-main.webp",
    href: "/products/gift-pack/",
    unit: "",
    lab: true,
    costCopy: "$35 for four products with a combined regular value of $41.98.",
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
    name: "Jay Turakhia",
    text: "I have used various brands of moringa powder but the powder from Nutri-Thrive is the greenest in color and tastes way better than the other moringa powder in the market. The pricing is very reasonable and the shipping was also very quick!!",
  },
  {
    name: "chizaram olanma",
    text: "I've been using this Moringa powder for a month now, and I can honestly feel the difference! My energy levels have improved, and I love adding it to my morning smoothies. It blends well and doesn't have an overpowering taste.",
  },
  {
    name: "Mai Anh Trần Thúy",
    text: "Black tea is my fav product here!! I usually use their black tea to make roasted milk tea which is fantastic for such hot summer in Melbourne!",
  },
  {
    name: "Dimple Szhane",
    text: "love it, This Moringa powder has been a game-changer for my gut health. I mix it with warm water and lemon every morning, and my digestion has never been better. I also noticed I've been getting sick less often—must be the immune-boosting properties! The quality is top-notch, and I love that it's organic. Will definitely repurchase",
  },
  {
    name: "Bindu",
    text: "Tried Moringa powder daily for 30 days. Helps with bloating and slight increase in stamina. good natural supplement.",
  },
  {
    name: "buket",
    text: "Honestly wasn't expecting much on the taste front, most powders like this are a chore to get down. NutriThrive actually surprised me. I've been having the moringa powder daily for a while now, and recently added the black tea into my routine too. Both have genuinely become part of my day rather than something I'm forcing myself to do. Good quality, easy to stick with.",
  },
  {
    name: "Jay Vasa",
    text: "Moringa has been a game-changer! Better focus, natural energy, and overall wellness boost in just 30 days. Will keep using!",
  },
  {
    name: "reetysha ramjee",
    text: "This product is healthy, of excellent quality, and very affordable. Highly recommend!",
  },
  {
    name: "Shaily Vasa",
    text: "The product is very good and have been using it over 5 months. It's very helpful if you are on a weight loss journey.",
  },
  {
    name: "Jay Rohit Sharma",
    text: "The product is super good and healthy I would definitely like to buy more and again!! Thanks for amazing product it helped me.",
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
