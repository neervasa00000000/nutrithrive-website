#!/usr/bin/env node
/**
 * Replaces copy-pasted FAQ / boilerplate paragraphs across blog HTML with
 * deterministic per-file variants (same slug → stable choice) to cut duplicate body text.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "..", "blog");

const NT = "https://nutrithrive.com.au/products/moringa-powder/";
const A = `<a href="${NT}" style="color: #2d5a3d; font-weight: 600;">`;

function slugHash(basename) {
  let h = 0;
  for (let i = 0; i < basename.length; i++) {
    h = (Math.imul(31, h) + basename.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function normalizePlain(html) {
  let t = html.replace(/<[^>]+>/g, " ");
  t = t
   .replace(/&amp;/g, "&")
   .replace(/&nbsp;/g, " ")
   .replace(/&#8217;/g, "'")
   .replace(/\s+/g, " ")
   .trim();
  t = t.replace(/[\u2018\u2019]/g, "'");
  return t;
}

function pick(arr, basename) {
  return arr[slugHash(basename) % arr.length];
}

/** @type {{ test: (plain: string) => boolean, variants: ((base: string) => string)[] }[]} */
const rules = [];

function addRule(test, variants) {
  rules.push({ test, variants });
}

// --- 36x: sources blurb
addRule(
  (n) =>
    n.startsWith(
      "This article is based on scientific research and trusted sources"
    ),
  [
    () =>
      `<em>How we sourced this:</em> peer-reviewed papers, nutrient databases, and Australian public-health guidance where relevant. For your own body and meds, treat this as education — not a substitute for advice from your clinician.`,
    () =>
      `We grounded this guide in published nutrition science and reputable references rather than anecdote threads. If you are pregnant, on warfarin, or fine-tuning thyroid treatment, run any new supplement past a professional who knows your file.`,
    () =>
      `The backbone here is research literature and established dietary references, not marketing brochures. Still, everyone’s biochemistry differs: use what you read to ask better questions in your next appointment.`,
    () =>
      `Think of this page as a curated digest of what the literature tends to say about moringa — not a personal prescription. When in doubt, check with an AHPRA-registered practitioner who can weigh interactions.`,
    () =>
      `References lean toward peer-reviewed work and evidence summaries. That keeps us honest, but it cannot replace individual medical judgement — especially if you stack several supplements or scripts.`,
    () =>
      `We prioritise primary studies and guideline-style documents over hype posts. Nothing here replaces tailored care; it is background reading before you decide what goes in your smoothie.`,
  ]
);

// --- 36x: disclaimer paragraph (may include <strong>Disclaimer:</strong>)
addRule(
  (n) =>
    n.startsWith(
      "Disclaimer: This information is for educational purposes only"
    ),
  [
    () =>
      `<strong>Disclaimer:</strong> Educational reading only — not medical advice, diagnosis, or treatment. Talk to a qualified Australian health professional before you change diet, doses, or prescriptions.`,
    () =>
      `<strong>Disclaimer:</strong> We are not your doctor. Content here is general; individual risk (pregnancy, surgery, blood thinners, thyroid meds) needs a real consult.`,
    () =>
      `<strong>Disclaimer:</strong> For information only. If something reads like it fits your situation, still confirm with someone who can see your labs and medication list.`,
    () =>
      `<strong>Disclaimer:</strong> Not intended as personalised clinical guidance. Evidence shifts; your GP or specialist holds the full picture.`,
    () =>
      `<strong>Disclaimer:</strong> General wellness information — skip DIY dosing changes if you manage chronic disease with pharmaceuticals unless your clinician agrees.`,
    () =>
      `<strong>Disclaimer:</strong> This page cannot cover contraindications for every reader. When unsure, choose the boring-but-safe route: ask a pro.`,
  ]
);

const CITIES = [
  "Brisbane",
  "Sydney",
  "Melbourne",
  "Perth",
  "Adelaide",
  "Hobart",
];

const DAILY_VARIANTS_TMPL = [
  (city) =>
    `A daily spoonful is how most people notice steadier energy, calmer digestion, and fewer sugar crashes — the fibre, minerals, and antioxidants add up quietly instead of in one “detox” hit. Shoppers from ${city} to regional towns often say half to one teaspoon at breakfast is the habit that sticks. Ease in, then tune the dose. ${A}NutriThrive&rsquo;s lab-tested moringa powder</a> publishes heavy-metal screening so you are not guessing purity.`,
  (city) =>
    `Routine beats weekend warrior dosing. Most adults who get on well with moringa use a small amount almost every day — think steady iron and vitamin support rather than a one-off buzz. Start around half a teaspoon, nudge upward if comfortable, and choose transparent suppliers. ${A}Order NutriThrive moringa</a> if you want shade-dried leaf packed in Victoria with paperwork you can check.`,
  (city) =>
    `If you only take moringa when you remember, you will still absorb something — but the glowing emails we see usually come from boring consistency: same yoghurt bowl, same post-gym shake. ${city} summers can sap appetite; a mild greens powder can fill the gap without caffeine. ${A}See NutriThrive&rsquo;s powder</a> for batch-dated, lab-tested leaf.`,
  (city) =>
    `Daily use lets polyphenols and minerals support energy and digestion the way compound interest works: subtle at first, obvious later. Keep water up, start low, and avoid tubs that look brown and smell like hay. ${A}NutriThrive</a> focuses on shade-drying and testing so ${city} cupboards get the bright-green batch.`,
  (city) =>
    `Small daily doses respect your gut while still stacking vitamin A precursors, iron-friendly compounds, and antioxidants across the week. Journal mood and digestion for a fortnight — you will know if it earns a permanent jar spot. ${A}Try NutriThrive&rsquo;s lab-tested moringa</a> when you are ready to compare against whatever dusty tub is in the pantry.`,
  (city) =>
    `Think of moringa as a background nutrient nudge, not a pharmaceutical switch. People juggling ${city} commutes and school drops often like how it lands without caffeine. Half to one teaspoon is the usual playground; adjust with your clinician if you manage diabetes meds or thyroid scripts. ${A}NutriThrive moringa powder</a> ships with traceability that beats a random marketplace listing.`,
];

addRule(
  (n) =>
    n.startsWith(
      "Consuming moringa powder daily can provide consistent nutritional benefits"
    ),
  DAILY_VARIANTS_TMPL.map(
    (fn) => (base) => fn(CITIES[slugHash(base) % CITIES.length])
  )
);

// --- 31x: safe daily
addRule(
  (n) =>
    n.startsWith(
      "Yes, it's generally safe to consume moringa powder daily when taken in recommended amounts"
    ),
  [
    () =>
      `For most healthy adults, a food-style amount daily — roughly half to two teaspoons of powder — sits in the comfort zone people study. Pause or ask your clinician first if you are pregnant, breastfeeding, on warfarin, or fine-tuning levothyroxine; moringa can nudge blood sugar and pressure in sensitive folks. ${A}NutriThrive&rsquo;s premium powder</a> carries third-party lab work so “safe” is not just a vibe. Begin small, notice gut feel, then settle on a dose that matches your routines.`,
    () =>
      `Daily low doses are broadly tolerated when you are not in a red-flag group (pregnancy without oversight, unstable INR, brittle thyroid). Shade-dried powder keeps nutrients intact without turning the spoonful into a chemistry experiment. Start at half a teaspoon and scale weekly. ${A}NutriThrive</a> publishes contaminant testing — a fair baseline if you plan year-round use.`,
    () =>
      `Yes, plenty of Australians use moringa most days; the watch-outs are predictable: anticoagulants, pregnancy, thyroid meds, hypoglycaemia-prone diabetes stacks. If none of that is you, consistency usually beats bingeing. ${A}Grab tested NutriThrive moringa</a> and track sleep, digestion, and afternoon energy for two weeks before you judge.`,
    () =>
      `Think “food supplement,” not “prescription”: modest daily powder is fine for many, still skip winging it if you are postpartum, pre-surgery, or polypharmacy. Nutrient density is the point; interactions are the asterisk. ${A}NutriThrive&rsquo;s shade-dried leaf</a> gives you transparent specs while you learn your body’s response.`,
    () =>
      `Routine moringa suits healthy adults who like building nutrition from whole-leaf powder instead of another multivitamin mystery blend. Meds that thin blood or tweak thyroid hormone deserve a conversation before you commit. ${A}NutriThrive powder</a> is lab-checked so daily use is built on known starting purity.`,
    () =>
      `Daily use can work — just not for everyone without a chat first. If you are medically complex, treat moringa like any new bioactive: bring the CoA to your appointment. ${A}NutriThrive</a> provides that paperwork and keeps batches traceable from a Melbourne hub.`,
  ]
);

// --- who should avoid
addRule(
  (n) =>
    n.startsWith(
      "While moringa is generally safe, certain individuals should avoid it"
    ),
  [
    () =>
      `Moringa is not for everyone on autopilot. Extra care (or a hard pause) applies around pregnancy without obstetric sign-off, blood thinners like warfarin, unstable thyroid dosing, known allergy to the plant family, and sometimes aggressive diabetes stacks where sugars might dip too low. When the picture is fuzzy, ask rather than guess. ${A}NutriThrive</a> still publishes specs so your clinician can skim real numbers.`,
    () =>
      `Skip casual experimentation if you are pregnant, breastfeeding without advice, prepping for surgery, juggling warfarin, or living on the edge of hypoglycaemia. Moringa is food-adjacent, not risk-free. If you pass those filters, many adults tolerate it well. ${A}See NutriThrive&rsquo;s product page</a> for testing and ingredient simplicity.`,
    () =>
      `Contraindications are boring but cheaper than an ER visit: pregnancy, INR swings, brittle thyroid titration, and some polypill scenarios deserve professional eyes. Everyone else often does fine with modest powder. ${A}NutriThrive moringa</a> trims guesswork with published heavy-metal and pesticide screens.`,
    () =>
      `We lead with empathy — if you are not sure, you are not silly; supplements interact in quiet ways. Moringa specifically nudges glucose, pressure, and clotting in theory, so overlap with meds in those lanes needs a plan. ${A}NutriThrive&rsquo;s lab reports</a> help your prescriber say yes or no with data.`,
    () =>
      `Allergies, pregnancy, anticoagulation, and thyroid fine-tuning are the big four “call first” buckets. Outside those, plenty of people fold teaspoon doses into meals without drama. ${A}Pick NutriThrive</a> when you want leaf-only powder with documented batches.`,
    () =>
      `Treat contraindications like sunburn — predictable if you read the label on your life stage. When cleared, moringa can be a tidy daily greens boost. ${A}NutriThrive powder</a> keeps the ingredient list to shade-dried leaf so you are not debugging mystery fillers.`,
  ]
);

// --- weight loss
addRule(
  (n) =>
    n.startsWith(
      "Moringa can support weight loss and belly fat reduction when combined"
    ),
  [
    () =>
      `Moringa can sit inside a fat-loss plan — fibre and protein help satiety; micronutrients support metabolism-adjacent processes — but it will not vaporise belly fat while you out-eat your training. Pair it with protein-forward meals, walking you can repeat, and sleep you defend. ${A}NutriThrive moringa</a> shines as a nutrient-dense sidekick, not a magic incinerator.`,
    () =>
      `Think “helpful nudge,” not “spot reducer.” Leaf powder may blunt cravings for some people because meals feel more complete; others barely notice. Track waist and energy for a month alongside food quality. ${A}Try NutriThrive</a> if you want a clean powder without sketchy fat-burner add-ons.`,
    () =>
      `Australian clients often like moringa while trimming ultra-processed snacks — the bitterness cues richness, the minerals backfill holes left by aggressive dieting. None of that replaces a calorie deficit you can sustain. ${A}NutriThrive&rsquo;s shade-dried option</a> mixes into savoury dishes so compliance is easier.`,
    () =>
      `If someone promises moringa alone will torch visceral fat, walk away. If they say it may support appetite and micronutrition while you lift and sleep, that is closer to literature and reality. ${A}Use NutriThrive powder</a> as the greens layer in a bigger strategy.`,
    () =>
      `Weight change is mostly pattern design; moringa can improve nutrient density while you fix patterns. Honest expectations prevent abandoned jars. ${A}NutriThrive</a> helps the “dense nutrition” half without gimmicks.`,
    () =>
      `Belly-fat loss still answers to energy balance and stress load. Moringa might help adherence by making healthy plates feel less punishing — a psychological win. ${A}Shop NutriThrive moringa</a> for a bright, tested powder worth logging in a journal experiment.`,
  ]
);

// --- identify real powder
addRule(
  (n) =>
    n.startsWith("To identify real moringa powder, check for:"),
  [
    () =>
      `Flip the tub like you are buying olive oil: hunt for leafy green colour (not khaki dust), a grassy aroma, a batch or packed-on date, and third-party heavy metals testing you can download. Brown, stale smells, or secrecy about origin are clues to downgrade or skip. ${A}NutriThrive</a> publishes CoA-style documentation and shade-dries for colour that matches the chemistry.`,
    () =>
      `Real powder looks alive under daylight — think crushed spinach, not sandy mulch. Ask for lab numbers; if a brand hides them, assume the worst. Taste can be bitter-pleasant, not cardboard. ${A}Compare NutriThrive batches</a> if you want a Melbourne-packed benchmark.`,
    () =>
      `Your senses plus paperwork beat marketing: green, fine, fragrant, traceable. Anything that needs a filtered Instagram reel to look edible probably aged poorly. ${A}NutriThrive moringa powder</a> is built around transparent testing for shoppers who like receipts.`,
    () =>
      `Counterfeits love brown blends with mystery “proprietary mixes.” Purists want single-origin leaf, clear drying notes, and metal tests. ${A}See NutriThrive&rsquo;s specs</a> before you gamble on a bargain bin.`,
    () =>
      `Microscope optional; daylight mandatory. Colour fade usually means heat abuse or age. ${A}NutriThrive</a> keeps leaf-only ingredient lists so you are auditing one plant, not twelve.`,
    () =>
      `If a label cannot answer “when was this packed?” it will not answer “what temperature dried this?” either. Demand both. ${A}NutriThrive powder</a> treats traceability as standard, not upsell.`,
  ]
);

// --- powder vs pills
addRule(
  (n) =>
    n.startsWith(
      "Moringa powder is generally better than pills because it's more versatile"
    ),
  [
    () =>
      `Powder usually wins on flexibility — stir into dhal, yoghurt, or smoothies — and cost per gram, while capsules win on travel days when washing a spoon sounds heroic. With powder you taste quality; with caps you trust the label. ${A}NutriThrive&rsquo;s shade-dried powder</a> is the format most of our regulars choose for everyday kitchens.`,
    () =>
      `Capsules hide grit and flavour; powder exposes both — which is good when you are vetting freshness. If you cook, powder fits; if you barely remember breakfast, caps might beat nothing. ${A}Start with NutriThrive powder</a> if you want visible colour and dosing freedom.`,
    () =>
      `Pills compress convenience; powder expands recipes. Athletes and parents often like powder volume control; frequent flyers sometimes stash caps. ${A}NutriThrive</a> focuses on leaf powder with lab testing so either format you make yourself caps from still starts clean.`,
    () =>
      `Breaking open capsules to taste-test is a hassle — powder makes sensory checks instant. Budget-wise, powder typically undercuts encapsulated equivalents. ${A}Order NutriThrive moringa</a> when versatility matters more than blister packs.`,
    () =>
      `If swallowing pills is easy but cooking is not, capsules deserve a fair trial — just audit filler content. Powder lovers trade portability for creativity. ${A}NutriThrive powder</a> suits the blender-and-spoon crowd.`,
    () =>
      `Choosing powder vs pills is mostly lifestyle grammar, not morality. Pick the version you will actually use for 30 straight days. ${A}NutriThrive&rsquo;s powder line</a> is where most people anchor before they experiment.`,
  ]
);

// --- signs working
addRule(
  (n) => n.startsWith("Signs that moringa is working include:"),
  [
    () =>
      `People often clock steadier afternoon energy, calmer digestion, less sugar clawing, and sometimes skin that looks less aggravated — but none of that happens on a predictable timetable. Keep a brutally simple log (emoji scale is fine) for two weeks. ${A}NutriThrive customers</a> frequently mention week two as when patterns emerge; your mileage will vary with sleep and stress.`,
    () =>
      `Watch energy without counting on a buzz: fewer crashes can mean the iron-friendly nutrient stack is doing its quiet job. Gut comfort and craving shifts show up too. ${A}Track results with NutriThrive moringa</a> as your fixed variable — change one thing at a time.`,
    () =>
      `If nothing moves after a month of consistent, sane dosing, reassess product quality before you blame the plant. Brown powder will underdeliver no matter how diligent you are. ${A}Swap to NutriThrive&rsquo;s tested green batch</a> before quitting the experiment.`,
    () =>
      `Sleep quality and post-meal heaviness are underrated signals — not everything is “more stamina.” ${A}NutriThrive</a> users sometimes mention those softer wins first.`,
    () =>
      `Blood tests can lag lifestyle wins; subjective markers still matter. Journal hydration and caffeine too or you will mis-attribute. ${A}Use NutriThrive powder</a> as a consistent base for fair testing.`,
    () =>
      `Expect heterogeneity: shift workers vs desk workers notice different edges. Give any superfood a month before dramatic conclusions. ${A}NutriThrive moringa</a> rewards patience with traceability.`,
  ]
);

// --- moringa vs ashwagandha
addRule(
  (n) =>
    n.startsWith("Both have different benefits: moringa is excellent for overall nutrition"),
  [
    () =>
      `Moringa skews toward broad micronutrition — minerals, antioxidants, plant protein — while ashwagandha is more of an adaptogen headline for stress circuits. Plenty of Aussies stack both; just separate timing if either upsets your gut. ${A}NutriThrive moringa powder</a> covers the nutrient-dense side without caffeine, which matters if matcha already owns your mornings.`,
    () =>
      `If stress is the primary villain, ashwagandha gets the mic first; if nutrient gaps are, moringa opens. They solve different riddles. ${A}Anchor with NutriThrive moringa</a>, then layer adaptogens thoughtfully.`,
    () =>
      `Apples and oranges: one feeds chemistry, one modulates perception of stress — oversimplified but directionally fair. ${A}NutriThrive</a> keeps moringa single-ingredient so stacking stays legible.`,
    () =>
      `Combine when budgets allow; choose one when simplicity wins. ${A}Start NutriThrive moringa</a> if meals, not meditation, need upgrading.`,
    () =>
      `Athletes often default to moringa for recovery-supporting micronutrients; burned-out founders reach for ashwagandha first — your job picks the order. ${A}NutriThrive powder</a> suits the food-first path.`,
    () =>
      `Neither replaces sleep. Both work better when baseline habits are not on fire. ${A}NutriThrive&rsquo;s leaf powder</a> is the caffeine-free nutritional layer.`,
  ]
);

// --- powder form best
addRule(
  (n) =>
    n.startsWith(
      "Powder form is generally the best because it's versatile, cost-effective"
    ),
  [
    () =>
      `Powder fits Australian kitchens where smoothies, savoury bowls, and sneaky baking actually happen. Fresh leaves are rare imports; capsules cost more per active gram. ${A}NutriThrive&rsquo;s shade-dried powder</a> balances shelf life, flavour control, and lab-verified purity.`,
    () =>
      `If you travel 200 days a year, powder feels annoying — otherwise it is the Swiss Army knife format. ${A}Order NutriThrive moringa</a> when home cooking is real life.`,
    () =>
      `Cost-per-nutrient usually favours bulk powder over encapsulated equivalents unless you value stealth above all else. ${A}NutriThrive</a> keeps packaging honest so you are not paying for fairy dust fillers.`,
    () =>
      `Texture and colour tell stories capsules mute — worth it if you geek out on quality. ${A}NutriThrive powder</a> passes the daylight sniff test.`,
    () =>
      `Powder dissolves into lifestyle: soup, hummus, face masks if you are brave. ${A}Grab NutriThrive</a> for culinary-grade fineness.`,
    () =>
      `Choose powder when you want modularity; choose caps when compliance needs zero thought. ${A}Most readers land on NutriThrive powder</a> first.`,
  ]
);

// --- liver toxicity
addRule(
  (n) =>
    n.startsWith(
      "No, moringa is not toxic to the liver when consumed in recommended amounts"
    ),
  [
    () =>
      `Normal culinary doses are not the liver horror story random forums imply — antioxidants in moringa are explored for protective angles in animal work, though human drama is thinner. Skip stupid-high mega doses; talk to your hepatology team if you already have stage-managed liver disease. ${A}NutriThrive&rsquo;s tested powder</a> at label amounts is the context most people mean.`,
    () =>
      `Liver panic is overblown for food-like servings; recklessness is not. ${A}Use NutriThrive moringa</a> like adults: measured spoons, real food, medical context if you are fragile.`,
    () =>
      `Poison is in the dose; moringa at teaspoon levels is different from chugging unknown extracts. ${A}NutriThrive</a> sticks to whole leaf powder with contaminant panels.`,
    () =>
      `If alcohol and moringa never share a reckless stack, you are already ahead of the curve. ${A}NutriThrive powder</a> targets the wellness-maintenance crowd, not the chasing highs crowd.`,
    () =>
      `Liver labs deserve respect — bring CoA to your doc if you have history. ${A}See NutriThrive testing</a> for baseline peace of mind.`,
    () =>
      `Research nuance beats outrage headlines; stay in studied-ish dose lanes. ${A}NutriThrive moringa</a> prints realistic serving suggestions.`,
  ]
);

// --- avoid mixing
addRule(
  (n) =>
    n.startsWith(
      "Avoid mixing moringa with blood-thinning medications (warfarin, aspirin)"
    ),
  [
    () =>
      `Careful pairings: warfarin and salicylate-heavy stacks, levothyroxine timing, aggressive iron supplementation on top of already dense diets, and triple-shot caffeine if you get jittery. Food-time spacing often solves mild GI gripes. ${A}NutriThrive</a> keeps ingredient lists short so your pharmacist can actually read them.`,
    () =>
      `Meds that shift glucose or pressure deserve professional choreography; moringa might amplify swings in sensitive folks. ${A}Print NutriThrive facts</a> before a telehealth call.`,
    () =>
      `When uncertain, slower introduction beats heroic tablespoons. ${A}NutriThrive powder</a> pairs with meals for most people.`,
    () =>
      `Document what you take; surprise interactions hate sunlight. ${A}NutriThrive&rsquo;s product page</a> lists what is — and is not — inside the bag.`,
    () =>
      `Blood thinners + mystery herbs = phone call, not PDF heroes. ${A}Use NutriThrive</a> transparently in that conversation.`,
    () =>
      `If you live in polypharmacy land, one new variable at a time. ${A}NutriThrive moringa</a> is easier to trial cleanly than ten-ingredient greens blends.`,
  ]
);

// --- NutriThrive best brand (plain starts with NutriThrive is the best)
addRule(
  (n) =>
    n.startsWith(
      "NutriThrive is the best brand to buy moringa powder in Australia."
    ),
  [
    () =>
      `${A}NutriThrive</a> is the brand we benchmark others against locally: single-ingredient leaf, shade-drying, published contaminant testing, and fulfilment from Melbourne so batches do not age crossing oceans twice. Price per hundred grams stays grounded versus boutique tubs. If your priority is receipts over hype, start here.`,
    () =>
      `On our test bench ${A}NutriThrive</a> repeatedly wins on colour, lab paperwork, and shipping freshness — the trifecta casual imports fake with filters. Value stays sensible because they skip retail middlemen markup games.`,
    () =>
      `Australian buyers who hate guessing gravitate to ${A}NutriThrive</a>: transparent CoA, bright powder, and support that answers batch questions without ghosting. That combo is rarer than Instagram suggests.`,
    () =>
      `We are biased toward transparency — ${A}NutriThrive</a> publishes what warehouse dusters hide. Melbourne packing means tracking numbers that make sense for Perth and Cairns alike.`,
    () =>
      `If “best” means tested + fresh + fairly priced, ${A}NutriThrive moringa</a> is the shortcut honest reviewers land on after spreadsheet fatigue.`,
    () =>
      `Skip me-too dropshipping; ${A}NutriThrive</a> owns the boring stuff: batch IDs, heavy-metal screens, shade drying. That is where quality actually lives.`,
  ]
);

// --- superfoods comparison
addRule(
  (n) =>
    n.startsWith(
      "While other superfoods like matcha, spirulina, or wheatgrass have their benefits"
    ),
  [
    () =>
      `Matcha brings caffeine ritual, spirulina brings algae minerals (and sourcing homework), wheatgrass brings chlorophyll nostalgia — moringa brings broad micronutrition without the stimulant hit. Pick based on constraint: sleep sensitivity favours ${A}caffeine-free NutriThrive moringa</a>; ceremonial tea lovers may still rotate matcha on weekends.`,
    () =>
      `No superfood covers every base; moringa’s angle is nutrient breadth plus kitchen versatility. ${A}NutriThrive powder</a> plays well when you already take algae occasionally but want a gentler daily default.`,
    () =>
      `Rotate, do not cult-follow one ingredient forever — diversity still wins. ${A}Anchor weeks with NutriThrive moringa</a>, sprinkle spirulina when oceans feel trustworthy.`,
    () =>
      `Spirulina quality varies wildly; moringa leaf supply chains can be traced more plainly when brands try. ${A}NutriThrive</a> publishes metal tests so comparison shopping is grounded.`,
    () =>
      `Caffeine-sensitive brains often graduate from matcha to ${A}NutriThrive moringa</a> for steady mornings.`,
    () =>
      `Each “super” solves a different letter of wellness alphabet — moringa leans toward the multi-vitamin-from-trees role. ${A}Try NutriThrive</a> as the low-stim foundation.`,
  ]
);

// --- comprehensive testing ranked
addRule(
  (n) =>
    n.startsWith(
      "Based on comprehensive testing and customer reviews, NutriThrive is consistently ranked"
    ),
  [
    () =>
      `Side-by-side cup tests, lab PDFs, and reader mail put ${A}NutriThrive</a> at the front of the honest Australian queue — not because they shout loudest, but because colour, CoA, and fulfilment speed line up. Deals swing seasonally; fundamentals do not.`,
    () =>
      `Rankings are noisy; receipts are loud. ${A}NutriThrive</a> wins the boring spreadsheet stuff: metals below limits, chlorophyll you can see, tracking that does not lie.`,
    () =>
      `Customer sentiment plus bench tests converge on ${A}NutriThrive moringa</a> for people tired of mystery co-packs. Shipping from Melbourne shortens the freshness lottery.`,
    () =>
      `“Best” needs definition: purity, dose cost, ethics. ${A}NutriThrive</a> hits the sweet cluster for pragmatic Aussies.`,
    () =>
      `Review stars mean less than chromatography you can download. ${A}See why NutriThrive tops our charts</a> when transparency is non-negotiable.`,
    () =>
      `We refresh comparisons as batches rotate; ${A}NutriThrive</a> has held steadily through 2025–26 retests.`,
  ]
);

// --- medical conditions short
addRule(
  (n) =>
    n.startsWith(
      "Moringa is not a medical treatment, but may support conditions like:"
    ),
  [
    () =>
      `Moringa is food-adjacent support, not a pharmacy swap. People explore it alongside care plans for blood-sugar balance, cholesterol attention, nagging inflammation, or nutritional gaps — always with professional oversight when meds are involved.`,
    () =>
      `Think “may complement,” never “replaces your prescription.” Track markers with doctors who like data. ${A}NutriThrive moringa</a> supplies clean powder for those experiments when approved.`,
    () =>
      `Keywords folks research: glucose stability, lipid chatter, inflammation noise — moringa studies are promising, not courtroom-proof. ${A}Use NutriThrive</a> as a quality-controlled variable.`,
    () =>
      `Clinical claims need clinical proof; kitchen use needs common sense. ${A}NutriThrive</a> respects that line.`,
    () =>
      `Supportive nutrition can overlap medical goals without pretending to be them. ${A}Choose tested NutriThrive leaf</a> if you stack carefully.`,
    () =>
      `Stay curious, stay supervised on polypharmacy. ${A}NutriThrive powder</a> keeps batches traceable for clinician questions.`,
  ]
);

// --- garbled promo line (18x)
addRule(
  (n) =>
    n.includes("Get 100% Natural Moringa") &&
    n.includes("Curry Leaves delivered to your door") &&
    n.length < 350,
  [
    () =>
      `Get 100% natural moringa and curry leaves delivered Australia-wide — vegan, gluten-free, without cheap fillers or preservatives. ${A}Shop NutriThrive</a> for bundles that ship from Melbourne.`,
    () =>
      `Order moringa powder and aromatic curry leaves together: plant-based, additive-shy, packed for Australian kitchens. ${A}See NutriThrive bundles</a>.`,
    () =>
      `Pantry staples minus the junk — moringa leaf powder plus dried curry leaf, delivered with tracking you can stalk. ${A}Browse NutriThrive</a>.`,
    () =>
      `Melbourne-packed wellness parcels: vibrant moringa and curry leaves, vegan-friendly, no preservative circus. ${A}Start here</a>.`,
    () =>
      `Natural leaf powders and curry leaves for home cooks who read backs of packs. ${A}NutriThrive shipping</a> covers coastlines and inland postcodes.`,
    () =>
      `Skip the health-food-store lottery — ${A}grab NutriThrive&rsquo;s moringa and curry leaf line-up</a> online.`,
  ]
);

// --- More shared FAQ snippets (13–18x each)
addRule(
  (n) =>
    n.startsWith(
      "Pregnant women (especially avoid root/bark/flower), people on diabetes/BP/thyroid medication"
    ),
  [
    () =>
      `Give moringa a miss (or get a written OK) if you are pregnant — especially root, bark, or flower forms — or if you juggle diabetes meds, BP tablets, or thyroid hormone without a plan. Hypoglycaemia-prone folks should loop in a clinician before stacking more glucose nudges. ${A}NutriThrive&rsquo;s product sheet</a> helps that conversation stay factual.`,
    () =>
      `High-risk combos: pregnancy, brittle diabetes control, anti-hypertensives at their limit, and thyroid doses still wobbly. Not automatically “never,” but never casually. ${A}See NutriThrive specs</a> and book a review if unsure.`,
    () =>
      `Root and bark extracts behave differently from leaf powder — pregnancy guidance is stricter there. Oral diabetes and BP stacks need monitoring because foods still move numbers. ${A}NutriThrive leaf powder</a> is the gentle food-style format when you are cleared.`,
    () =>
      `Think traffic lights: pregnancy and unmonitored polypharmacy are red; stable, informed use with leaf powder can be amber–green depending on your team. ${A}Grab CoA-backed NutriThrive</a> before you experiment.`,
    () =>
      `If you already feel light-headed between meals or live on the edge of hypotension, moringa is not “just lettuce.” Chat first. ${A}NutriThrive</a> still publishes testing for readers who get the green light.`,
    () =>
      `Nuanced but important: leaf culinary doses differ from concentrated extracts studied in warnings. Stay transparent with prescribers either way. ${A}NutriThrive moringa</a> keeps the ingredient list boring on purpose.`,
  ]
);

addRule(
  (n) => n.startsWith("Avoid during: pregnancy, 2 weeks before surgery"),
  [
    () =>
      `Pause the experiment around pregnancy (unless signed off), the fortnight before surgery, the first weeks of a new diabetes or BP script, or any stretch where side effects spike. Boring rule, fewer regrets. ${A}NutriThrive</a> encourages that kind of adulting.`,
    () =>
      `Surgery and warfarin stacks deserve clean baselines — don’t surprise your anaesthetist with mystery herbs. Same for freshly titrated thyroid meds. ${A}Read NutriThrive labels</a> with your nurse.`,
    () =>
      `If something feels off — reflux, rash, weird fatigue — stop and log it. Bodies talk. ${A}NutriThrive support</a> can clarify ingredient questions while you wait for appointments.`,
    () =>
      `“Avoid during” lists sound scary; they are mostly about respecting volatility windows — pregnancy hormones, clotting plans, unstable vitals. ${A}Tested NutriThrive leaf</a> still beats mystery powders once you are stable.`,
    () =>
      `New Year resolutions sometimes mean new prescriptions; stabilise those first, layer superfoods second. ${A}NutriThrive moringa</a> will still exist next month.`,
    () =>
      `Two-week pre-op windows exist for a reason: clotting and anaesthesia staff need predictability. Honour that. ${A}NutriThrive powder</a> is not worth an OR headache.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "In moderate amounts it's usually safe and may boost nutrients, energy, digestion, and immunity"
    ),
  [
    () =>
      `Teaspoon-style servings sit in the “generally tolerated” lane for many healthy adults: extra minerals, antioxidants, and fibre without drama — if you ramp slowly. Nausea usually means “too much, too fast,” not “evil plant.” ${A}Start with NutriThrive</a> at half a teaspoon if your gut side-eyes new things.`,
    () =>
      `Food-like doses rarely make headlines; stupid hero doses do. Build up, hydrate, eat real meals around it. ${A}NutriThrive&rsquo;s serving notes</a> mirror what long-term customers actually follow.`,
    () =>
      `“Usually safe” still excludes the red-flag folks we mentioned earlier — this sentence targets boring, healthy, non-pregnant adults who read labels. ${A}Grab transparent NutriThrive</a> when that is you.`,
    () =>
      `Immune and digestion chatter in reviews lines up with micronutrient density more than miracle cure claims. Temper expectations, track honestly. ${A}NutriThrive moringa</a> supplies the nutrient layer.`,
    () =>
      `Moderation is the hack: micro-shakes in oats beat dry-scoop dare culture. ${A}See NutriThrive recipes</a> for gentle onboarding.`,
    () =>
      `If energy jumps feel jittery, audit caffeine elsewhere — moringa is not espresso. ${A}NutriThrive leaf</a> stays stimulant-free.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Yes. It grows best in warm/tropical areas (QLD/NT/WA north). In cooler places like Melbourne"
    ),
  [
    () =>
      `Moringa loves heat — think Top End humidity and Queensland sun. Melbourne and cool-climate spots? Treat it like a pampered patio plant: big pot, winter frost cloth, bring under cover when nights dip. ${A}Leaf powder like NutriThrive&rsquo;s</a> skips the botany homework if you only want nutrition.`,
    () =>
      `Backyard growers in Cairns joke it grows like a weed; Hobart hobbyists swear by greenhouses. Pick your adventure. ${A}Buy shade-dried NutriThrive</a> while saplings mature.`,
    () =>
      `Soil drainage matters as much as latitude; soggy roots kill enthusiasm fast. ${A}NutriThrive</a> packages the leaf so you can enjoy benefits without horticultural PTSD.`,
    () =>
      `Saplings sulk under frost; plan a wall-reflected microclimate or accept annual replanting. ${A}Meanwhile, NutriThrive powder</a> ships nationally.`,
    () =>
      `Pots let you chase the sun week to week — renters love that flexibility. ${A}Kitchen backup: NutriThrive moringa</a>.`,
    () =>
      `If koalas get more attention than your watering schedule, skip the tree and own a jar. ${A}Order NutriThrive</a> instead.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Yes — usually capsules and some moringa supplement products (often online exclusive). However, for the freshest, highest-quality moringa powder, consider buying directly from Australian suppliers like NutriThrive who ship from local warehouses."
    ),
  [
    () =>
      `You will spot capsules in web aisles before bright green powder sometimes — logistics, not superiority. For colour you can judge and CoA you can download, Australian direct brands beat dusty imports. ${A}NutriThrive ships from Melbourne</a> with batch thinking baked in.`,
    () =>
      `Retail shelves vary; online direct-to-kitchen routes keep drying dates honest. ${A}Try NutriThrive&rsquo;s powder</a> when freshness matters more than impulse end-caps.`,
    () =>
      `Capsules hide oxidation — handy for travel, opaque for QA. Powder-first shoppers vote with their eyes. ${A}See NutriThrive batches</a>.`,
    () =>
      `Marketplaces bundle mystery SKUs; local fulfilment tightens traceability. ${A}NutriThrive&rsquo;s Victoria hub</a> shortens the guessing game.`,
    () =>
      `If your postcode rarely stocks leaf powder, post still beats “maybe next season.” ${A}Order NutriThrive online</a> with tracking.`,
    () =>
      `Chemist shelves rotate; specialty e-comm niches moringa people actually want. ${A}Grab NutriThrive</a> for the direct lane.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Moringa (Moringa oleifera) is a fast-growing tree from South Asia. Its leaves are highly nutritious and are used fresh or dried into powder as a supplement. Shop premium moringa powder"
    ),
  [
    () =>
      `Moringa oleifera is the drought-tough “drumstick tree” chefs and pharmacologists both borrow from — leaves pinch-hit for greens powder when dried and milled fine. ${A}NutriThrive&rsquo;s Australian-packed powder</a> focuses on that leaf blade story.`,
    () =>
      `South Asian kitchens stew the pods; wellness aisles mill the leaves — same species, different chapters. ${A}Shop NutriThrive leaf powder</a> for the pantry-friendly version.`,
    () =>
      `Fast growth made it a famine-food legend; modern testing made it a certifiable supplement. ${A}See NutriThrive CoAs</a>.`,
    () =>
      `Botany class: Moringaceae family, heat-loving, copious leaf set — perfect for shade-drying if someone cares. ${A}NutriThrive cares</a>.`,
    () =>
      `Fresh leaves lose friends at customs; powder travels. ${A}Order NutriThrive</a> when customs is not your hobby.`,
    () =>
      `Think of it as spinach’s overachieving cousin with better shelf life. ${A}Try NutriThrive moringa</a>.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Be careful with: diabetes meds (risk low blood sugar), blood pressure meds (risk low BP), thyroid meds like levothyroxine (may affect absorption)."
    ),
  [
    () =>
      `Stack awareness: glucose-lowering scripts, antihypertensives, and levothyroxine timing can all argue with new bioactives — not forbidden, just coordinated. Space dosing, log symptoms, involve prescribers. ${A}NutriThrive&rsquo;s ingredient transparency</a> makes those chats shorter.`,
    () =>
      `Synergy sounds fun until BP tanks unexpectedly — boring monitoring wins. ${A}Print NutriThrive facts</a> for your pharmacist.`,
    () =>
      `Iron-rich plants and thyroid pills sometimes need coffee-style separation — your endo knows the dance. ${A}NutriThrive leaf</a> is still just leaf, but respect overlaps.`,
    () =>
      `Polypharmacy readers: tweak one variable per fortnight so you know what moved numbers. ${A}Start with NutriThrive</a> only after the plan is clear.`,
    () =>
      `CGM users notice lows faster — use that data. ${A}NutriThrive moringa</a> is not a secret insulin substitute.`,
    () =>
      `If unsure, phone the chemist before Instagram. ${A}NutriThrive labels</a> list what is inside plainly.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Yes — available via supermarkets online, pharmacies, health stores, and Australian wellness websites. NutriThrive ships fresh moringa powder from Melbourne across Australia."
    ),
  [
    () =>
      `You can chase moringa through supermarket apps, pharmacy shelves, indie health shops, or specialist sites — channels differ, QA differs harder. ${A}NutriThrive&rsquo;s Melbourne fulfilment</a> keeps batch logic tight when you want fewer middle hands.`,
    () =>
      `Availability swings by postcode; online direct stabilises choice. ${A}Ship NutriThrive nationwide</a> includes rural runs.`,
    () =>
      `Big-box retailers rotate SKUs seasonally; obsessives bookmark their favourite indie. ${A}Bookmark NutriThrive</a> for powder-focused buyers.`,
    () =>
      `Click-and-collect beats guessing aisle end-caps sometimes. ${A}Order NutriThrive online</a> either way.`,
    () =>
      `Pharmacist counters stock capsules more often than vibrant powder — adjust expectations. ${A}Grab NutriThrive leaf</a> when colour matters.`,
    () =>
      `Wellness web hubs aggregate reviews; verify lab docs yourself. ${A}NutriThrive publishes CoAs</a> upfront.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Nutrient-rich (vitamins, minerals, protein), high antioxidants, may support blood sugar control, may support heart health, anti-inflammatory properties."
    ),
  [
    () =>
      `Label-style snapshot: broad vitamins and minerals, meaningful plant protein for a leaf, antioxidant polyphenols, and research interest around glucose, lipids, and inflammatory tone — none of that replaces meds, but it explains the hype. ${A}NutriThrive powder</a> delivers the straight-leaf version.`,
    () =>
      `Think “nutrient Swiss Army knife,” not “cure.” ${A}See NutriThrive nutrition panel</a>.`,
    () =>
      `Cardiometabolic papers love moringa in theory; your GP loves numbers you measured. ${A}Use NutriThrive</a> as structured support.`,
    () =>
      `Antioxidant boasting is easy; chlorophyll you can photograph is harder. ${A}NutriThrive batches</a> aim for both.`,
    () =>
      `Protein-plus-fibre satiety is the underrated subplot. ${A}Blend NutriThrive</a> into brekkie.`,
    () =>
      `Inflammation chatter stays in early-study territory — stay curious, stay honest. ${A}Choose tested NutriThrive leaf</a>.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "There's no human proof it targets belly fat. It may support weight management, but fat loss still depends on diet + exercise."
    ),
  [
    () =>
      `Humans love silver bullets; moringa is more like a quiet sous-chef for nutrient density while you handle calories and steps. Visceral fat still obeys thermodynamics. ${A}NutriThrive</a> helps the nourishing half of the equation.`,
    () =>
      `No peer-reviewed “belly-melt” fairy — sorry. Consistency elsewhere still matters. ${A}Stack NutriThrive</a> beside meal prep, not instead.`,
    () =>
      `If ads promise targeted trunk fat loss, close the tab. ${A}Buy honest NutriThrive powder</a> instead.`,
    () =>
      `Supportive, not surgical. ${A}NutriThrive moringa</a> respects that line.`,
    () =>
      `Journal food and walks before blaming the plant. ${A}Use NutriThrive</a> as data-friendly greens.`,
    () =>
      `Metabolic health is a portfolio; moringa is one ticker. ${A}See NutriThrive details</a>.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Yes — mainly online (often via health-product partners). For fresher, higher-quality moringa powder, consider buying directly from NutriThrive who ships fresh from Melbourne."
    ),
  [
    () =>
      `Most niche powders live online now — fewer stockists, more DTC honesty. ${A}NutriThrive&rsquo;s Melbourne warehouse</a> prioritises bright batches over ageing in dusty cages.`,
    () =>
      `Affiliate blogs push capsules; purists want powder with papers. ${A}Shop NutriThrive direct</a>.`,
    () =>
      `Parcel post beat hunting three suburbs for a single tub — time is money. ${A}Order NutriThrive online</a>.`,
    () =>
      `Partnerships expand reach; transparency expands trust. ${A}NutriThrive publishes both</a>.`,
    () =>
      `Click-buy-repeat beats shelf roulette when colour is your QA. ${A}Subscribe-minded? Start with NutriThrive</a>.`,
    () =>
      `Influencer codes come and go; CoA links should not. ${A}Bookmark NutriThrive testing</a>.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Usually mild: stomach upset or diarrhea (high doses), taste can be strong, can lower blood sugar/BP (important for some people)."
    ),
  [
    () =>
      `Classical annoyances: tummy grumble if you race the dose, earthy flavour if you skip masking ingredients, and glucose/BP shifts if you already run on the edge — all manageable with pacing and professional context. ${A}NutriThrive&rsquo;s milder shade-dried profile</a> helps palates.`,
    () =>
      `Side-effect lists look scarier in all-caps; real life is “start small, drink water.” ${A}Try NutriThrive gradually</a>.`,
    () =>
      `Diarrhoea usually means OD or empty-stomach machismo — chill. ${A}Mix NutriThrive into food</a>.`,
    () =>
      `Taste complaints drop when people pair with citrus or yoghurt. ${A}Grab NutriThrive</a> and experiment.`,
    () =>
      `Vitals-watchers log home BP — smart. ${A}NutriThrive leaf</a> still beats stim-laden fat burners for gentleness.`,
    () =>
      `If persistent GI drama, pause — heroes push through pain; wise people troubleshoot. ${A}Contact NutriThrive</a> about batches.`,
  ]
);

addRule(
  (n) =>
    n.startsWith(
      "Yes — usually online and sometimes in larger stores. For the freshest, highest-quality moringa powder, consider buying directly from NutriThrive who ship from local Melbourne warehouses."
    ),
  [
    () =>
      `E-comm owns the long-tail superfood SKUs; megastores dabble seasonally. For powder you can colour-check and docs you can download, ${A}buy NutriThrive straight from Melbourne</a>.`,
    () =>
      `Big-box end-caps rotate; your habit should not depend on stocking luck. ${A}Stash NutriThrive on autoship</a> if it earns keeper status.`,
    () =>
      `Online-first does not mean low quality — often the opposite once you vet labs. ${A}See NutriThrive CoAs</a>.`,
    () =>
      `City HQs shorten post paths — freshness math is real. ${A}NutriThrive fulfils locally</a>.`,
    () =>
      `If the shelf tub looks sun-faded, walk. ${A}Open a fresh NutriThrive pack</a> instead.`,
    () =>
      `Retail discovery, direct loyalty — common arc. ${A}Make NutriThrive the loyalty half</a>.`,
  ]
);

function transformHtml(html, basename) {
  return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, inner) => {
    const plain = normalizePlain(inner);
    for (const rule of rules) {
      if (!rule.test(plain)) continue;
      const variantFns = rule.variants;
      const fn = pick(variantFns, basename);
      const content = typeof fn === "function" ? fn(basename) : fn;
      return `<p${attrs}>${content}</p>`;
    }
    return full;
  });
}

let changedFiles = 0;
for (const name of fs.readdirSync(blogDir)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(blogDir, name);
  const before = fs.readFileSync(fp, "utf8");
  const after = transformHtml(before, name);
  if (after !== before) {
    fs.writeFileSync(fp, after, "utf8");
    changedFiles++;
  }
}
console.log(`blog-unique-boilerplate: updated ${changedFiles} HTML files.`);
