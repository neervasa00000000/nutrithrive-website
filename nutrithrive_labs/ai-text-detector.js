/**
 * Browser-only stylometric heuristics for AI-vs-human text signals.
 * Not a substitute for ML detectors; no true LM perplexity (uses entropy proxies).
 */
(function () {
  "use strict";

  const STOPWORDS = new Set(
    `a an the and or but if while with about against between into through during before after above below to from up down in out on off over under again further then once here there when where why how all any both each few more most other some such no nor not only own same so than too very can will just should now for of as by on are was were been being have has had having do does did doing could would should may might must shall is am was were be been being it its this that these those i you he she they we me him her them my your his their our what which who whom whose`.split(
      /\s+/
    )
  );

  /** Legacy combined list (sentence suspicion + counts). */
  const AI_VOCAB = [
    "delve",
    "landscape",
    "realm",
    "tapestry",
    "robust",
    "comprehensive",
    "leverage",
    "facilitate",
    "pivotal",
    "crucial",
    "paramount",
    "noteworthy",
    "underscore",
    "elucidate",
    "exemplify",
    "multifaceted",
    "nuanced",
    "intricate",
    "seamlessly",
    "utilize",
    "harness",
    "empower",
    "streamline",
    "innovative",
    "testament",
    "underpinnings",
    "ever-evolving",
  ];

  const AI_VERBS_FIX = {
    delve: "Use “look at closely”, “unpack”, or “explain step-by-step”—and name who is doing the looking.",
    leverage: "Say “use”, “apply”, or “build on” with a concrete next step.",
    utilize: "Prefer “use” unless a technical register truly needs “utilize”.",
    harness: "Say “tap into”, “capture”, or “use” with one specific mechanism.",
    underscore: "Say “shows”, “highlights”, or cut the setup and state the claim.",
    empower: "Name the real outcome (“helps you ship faster”) instead of “empowers”.",
    streamline: "Say “speeds up”, “cuts steps”, or list the actual step removed.",
    facilitate: "Say “helps”, “lets”, or “makes X possible” with one concrete mechanism.",
  };

  const INFLATED_ADJ_FIX = {
    pivotal: "Name why it matters in one concrete consequence, or use “key” once.",
    robust: "Describe what survived testing (load, time, edge cases) instead.",
    innovative: "Say what changed versus the old way, or drop the adjective.",
    seamless: "Describe the actual user flow; “seamless” is usually filler.",
    comprehensive: "List what is covered, or say “full” / “step-by-step”.",
    "ever-evolving": "Anchor time (“as of 2026”) or drop; “ever-evolving” reads like AI padding.",
    "ever evolving": "Same as “ever-evolving”—prefer a dated, specific claim.",
  };

  const FILLER_NOUNS_FIX = {
    landscape: "Name the market or topic directly (“moringa retail in AU”) instead of “landscape”.",
    realm: "Use “field”, “area”, or the exact domain name.",
    tapestry: "Cut or replace with one specific thread (one trend, one product).",
    testament: "Say “shows that” or give the evidence sentence instead.",
    underpinnings: "Say “reasons”, “causes”, or list them plainly.",
  };

  const TRANSITION_PATTERNS = [
    { re: /\bit is important to note that\b/gi, label: "It is important to note that" },
    { re: /\bit's worth noting that\b/gi, label: "It's worth noting that" },
    { re: /\bfirstly\b/gi, label: "Firstly" },
    { re: /\bfurthermore\b/gi, label: "Furthermore" },
    { re: /\bmoreover\b/gi, label: "Moreover" },
    { re: /\badditionally\b/gi, label: "Additionally" },
    { re: /\bin conclusion\b/gi, label: "In conclusion" },
    { re: /\bto summarize\b/gi, label: "To summarize" },
    { re: /\bin summary\b/gi, label: "In summary" },
    { re: /\bthis underscores the importance of\b/gi, label: "This underscores the importance of" },
    { re: /\bin light of this\b/gi, label: "In light of this" },
    { re: /\bthat being said\b/gi, label: "That being said" },
    { re: /\bon the other hand\b/gi, label: "On the other hand" },
  ];

  const HEDGE_WORDS = new Set(
    `may might could potentially often typically generally frequently sometimes usually appears seems tend tends perhaps arguably possibly`.split(/\s+/)
  );

  const HEDGE_PHRASES = [
    /\bappears to\b/gi,
    /\bseems to\b/gi,
    /\btends to\b/gi,
    /\bit has been (?:shown|suggested|demonstrated|found)\b/gi,
    /\bmany studies (?:show|suggest|indicate)\b/gi,
    /\bresearch suggests\b/gi,
    /\bit could be argued\b/gi,
    /\bit is important to note\b/gi,
    /\bit should be noted\b/gi,
    /\bone might (?:argue|say)\b/gi,
  ];

  const UNEARNED_ENTHUSIASM = [
    {
      re: /\b(?:your )?journey to (?:health|wellness|success)\b/gi,
      fix: "Tone down hype: name one outcome the reader can verify this week.",
    },
    {
      re: /\btruly remarkable\b/gi,
      fix: "Replace with a specific observation (“we saw X in lab tests”) or delete.",
    },
    {
      re: /\b(?:game|life)[- ]changer\b/gi,
      fix: "Say what changed, for whom, and in what timeframe—one sentence.",
    },
    {
      re: /\bunlock your (?:full )?potential\b/gi,
      fix: "Swap for a concrete benefit (“fewer 3pm crashes”) or a plain CTA.",
    },
    {
      re: /\btransformative (?:experience|impact)\b/gi,
      fix: "Describe the before/after in plain numbers or a short anecdote.",
    },
    {
      re: /\b(?:exciting|vibrant)\s+(?:journey|future|path|opportunity)\b/gi,
      fix: "Swap cheerleading for one measurable outcome or a mundane detail readers trust.",
    },
    {
      re: /\b(?:truly|really)\s+(?:exciting|remarkable|incredible|amazing)\b/gi,
      fix: "Cut intensifiers; show evidence instead (“shipped in 2 days”, “lab sheet shows…”).",
    },
  ];

  const GENERIC_INTRO_HOOKS = [
    /^in today'?s (?:fast-paced )?world\b/im,
    /^in the modern (?:era|age|world)\b/im,
    /^when it comes to\b/im,
    /^navigating the (?:complex )?landscape\b/im,
    /^in an era (?:where|of)\b/im,
    /^the (?:importance|role) of .{5,80} cannot be overstated\b/im,
    /^understanding .{3,60} is (?:essential|crucial|vital)\b/im,
  ];

  const AUSTRALIAN_EEAT = [
    /\bmelbourne\b/gi,
    /\bsydney\b/gi,
    /\bbrisbane\b/gi,
    /\bperth\b/gi,
    /\badelaide\b/gi,
    /\bvictoria\b/gi,
    /\bnsw\b/gi,
    /\bqueensland\b/gi,
    /\bwestern australia\b/gi,
    /\bsouth australia\b/gi,
    /\btasmania\b/gi,
    /\baustralia(?:n|-wide)?\b/gi,
    /\baussie\b/gi,
    /\btruganina\b/gi,
    /\bpostcode\b/gi,
    /\b(?:vic|qld|wa|sa|tas|nt)\b/gi,
    /\b(?:aud|a\$)\b/gi,
  ];

  const AUTHORITY_PHRASES = [
    /\bi believe\b/gi,
    /\bin my opinion\b/gi,
    /\bclearly\b/gi,
    /\bundoubtedly\b/gi,
    /\bi think\b/gi,
    /\bwe think\b/gi,
  ];

  const INFORMAL = [
    /\bdon't\b/gi,
    /\bcan't\b/gi,
    /\bwon't\b/gi,
    /\bit's\b/gi,
    /\bthat's\b/gi,
    /\bkind of\b/gi,
    /\bsort of\b/gi,
    /\ba bit\b/gi,
  ];

  const META_PATTERNS = [
    /\bthis (?:essay|article|section|paper) will\b/gi,
    /\bfirst\b.*\bsecond\b.*\bthird\b/gis,
    /\bin conclusion\b/gi,
    /\bto summarize\b/gi,
    /\bas we all know\b/gi,
  ];

  const AI_TRIGRAMS = [
    "it is important",
    "in order to",
    "the fact that",
    "due to the",
    "a wide range",
    "plays a crucial",
    "plays an important",
    "it should be noted",
    "it is worth noting",
    "at its core",
    "in conclusion the",
    "plays a pivotal",
    "a powerhouse of",
    "rich in nutrients",
    "it is worth",
    "as a result",
    "wide range of",
    "essential for maintaining",
  ];

  /** “Safe” / template completions → lower statistical surprise (perplexity proxy). */
  const PREDICTABLE_CLICHES = [
    /\bpowerhouse of nutrition\b/gi,
    /\bmoringa is a powerhouse\b/gi,
    /\brich in vitamins\b/gi,
    /\brich in nutrients\b/gi,
    /\bpacked with nutrients\b/gi,
    /\bvery effective\b/gi,
    /\bwealth of health benefits\b/gi,
    /\bholistic approach to\b/gi,
  ];

  const PARALLEL_PATTERNS = [
    /\bboth\s+[\w'-]{2,32}\s+and\s+[\w'-]{2,32}\b/gi,
    /\bnot\s+only\s+.{5,85}\s+but\s+also\b/gi,
  ];

  const SOFTENER_EXTRA = new Set(
    `largely broadly commonly frequently usually sometimes perhaps arguably tends tend considered`.split(/\s+/)
  );

  const AI_FLOURISH_ADJECTIVES = [
    "vibrant",
    "compelling",
    "invaluable",
    "remarkable",
    "exciting",
    "dynamic",
  ];

  const EXPANDED_FORMAL = [
    [/\bit is\b/gi, "it is"],
    [/\bthey are\b/gi, "they are"],
    [/\bdo not\b/gi, "do not"],
    [/\bcannot\b/gi, "cannot"],
    [/\bwill not\b/gi, "will not"],
  ];

  const BLOG_AI_TRANSITIONS = [
    /\bin this article,?\s+we(?:'ll| will)\s+explore\b/gi,
    /\blet's dive into\b/gi,
    /\bnow that we've covered\b/gi,
    /\bmoving on to\b/gi,
    /\banother important aspect is\b/gi,
    /\bit's worth noting that\b/gi,
    /\bto summarize\b/gi,
    /\bin conclusion\b/gi,
  ];

  const BLOG_HUMAN_TRANSITIONS = [
    /\bso here's the thing\b/gi,
    /\bbut wait,?\s+there's more\b/gi,
    /\bokay,?\s+so\b/gi,
    /\breal talk\b/gi,
    /\banyway\b/gi,
    /\blong story short\b/gi,
    /\bbottom line\??\b/gi,
    /\balright,?\s+let's get into it\b/gi,
  ];

  const FLUFF_PHRASES = [
    "is important in today's world",
    "plays a crucial role",
    "continues to grow in popularity",
    "has become increasingly common",
    "it's no secret that",
    "as we all know",
    "needless to say",
    "many people believe",
    "studies have shown",
    "experts agree that",
    "in order to",
    "due to the fact that",
    "at this point in time",
  ];

  const AI_CTA_PHRASES = [
    /\bready to get started\??\b/gi,
    /\bwhat are you waiting for\??\b/gi,
    /\btry it today\b/gi,
    /\bsee the difference\b/gi,
    /\btake action now\b/gi,
    /\bdon't miss out\b/gi,
  ];

  const HUMAN_CTA_PHRASES = [
    /\blet me know in the comments\b/gi,
    /\bhave you tried this\??\b/gi,
    /\btell me\b/gi,
    /\bdrop your thoughts\b/gi,
    /\bam i crazy\b/gi,
  ];

  const STORY_MARKERS = [
    /\bwhen i\b/gi,
    /\bi remember\b/gi,
    /\blast year\b/gi,
    /\bmy experience\b/gi,
    /\bi used to\b/gi,
  ];

  const OPINION_MARKERS = [
    /\bi think\b/gi,
    /\bi believe\b/gi,
    /\bin my opinion\b/gi,
    /\bhonestly\b/gi,
    /\bto be frank\b/gi,
  ];

  const PERSONAL_HUMOR = [
    /\blol\b/gi,
    /\bhaha\b/gi,
    /\blet's be real\b/gi,
    /\bno judgment\b/gi,
  ];

  const PERSONAL_VULN = [
    /\bi'll be honest\b/gi,
    /\bfull disclosure\b/gi,
    /\bi messed up\b/gi,
    /\bi was wrong\b/gi,
  ];

  const CONVERSATIONAL_FILLERS = [
    /\byou know\b/gi,
    /\bkind of\b/gi,
    /\bsort of\b/gi,
    /\bbasically\b/gi,
    /\bhonestly\b/gi,
    /\bactually\b/gi,
  ];

  const GENERIC_EXAMPLE_MARKERS = [
    /\bfor example\b/gi,
    /\bfor instance\b/gi,
    /\bsuch as\b/gi,
    /\bone might\b/gi,
    /\byou could\b/gi,
  ];

  const SPECIFIC_EXAMPLE_MARKERS = [
    /\bi tried\b/gi,
    /\bwhen i used\b/gi,
    /\blast (?:week|month|year)\b/gi,
    /\b\d+\s*(?:hours?|days?|minutes?|years?|months?)\b/gi,
    /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  ];

  const TEMPORAL_MARKERS = [
    /\byesterday\b/gi,
    /\blast week\b/gi,
    /\brecently\b/gi,
    /\bright now\b/gi,
    /\bcurrently\b/gi,
    /\bthis month\b/gi,
    /\bthis year\b/gi,
    /\b(?:20[2-3]\d)\b/g,
  ];

  const STOCK_PHOTO_HOSTS = [
    "shutterstock",
    "istock",
    "pexels",
    "unsplash",
    "pixabay",
    "gettyimages",
    "depositphotos",
  ];

  function stripHtmlToText(html) {
    const no = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
    return no
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasHtmlMarkup(s) {
    return /<[a-z][\s\S]*?>/i.test(s);
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function countMatches(re, text) {
    re.lastIndex = 0;
    const m = text.match(re);
    return m ? m.length : 0;
  }

  function analyzePersonalVoice(rawLower, words) {
    const wc = words.length || 1;
    const firstPerson = countMatches(/\b(?:i|me|my|mine|myself|we|us|our|ours)\b/g, rawLower);
    let anecdotes = 0;
    for (const re of STORY_MARKERS) anecdotes += countMatches(re, rawLower);
    const direct = countMatches(/\b(?:you|your|yours)\b/g, rawLower);
    let opinions = 0;
    for (const re of OPINION_MARKERS) opinions += countMatches(re, rawLower);
    const total = firstPerson + anecdotes + direct + opinions;
    const per500 = (total / wc) * 500;
    let band;
    let aiLikelihood;
    if (per500 <= 2) {
      band = "0–2 per 500 words (sparse personal voice)";
      aiLikelihood = 90;
    } else if (per500 <= 5) {
      band = "3–5 per 500 words";
      aiLikelihood = 60;
    } else if (per500 <= 10) {
      band = "6–10 per 500 words";
      aiLikelihood = 30;
    } else {
      band = "10+ per 500 words (strong personal signal)";
      aiLikelihood = 10;
    }
    return {
      firstPerson,
      anecdotes,
      direct,
      opinions,
      total,
      per500,
      band,
      aiLikelihood,
    };
  }

  function analyzeBlogStructure(rawInput, plainLower) {
    let h2 = 0;
    let h3 = 0;
    if (hasHtmlMarkup(rawInput)) {
      h2 = (rawInput.match(/<h2\b/gi) || []).length;
      h3 = (rawInput.match(/<h3\b/gi) || []).length;
    }
    const mdH2 = (rawInput.match(/^##\s+(?!#)/gm) || []).length;
    const mdH3 = (rawInput.match(/^###\s+/gm) || []).length;
    h2 += mdH2;
    h3 += mdH3;
    const intro =
      /^(?:introduction|in this (?:article|post|guide|piece))\b/im.test(plainLower.slice(0, 500)) ||
      /\bthis (?:article|post|guide)\s+(?:will|explores?|covers?)\b/i.test(plainLower.slice(0, 800));
    const conclusion =
      /\b(?:in conclusion|to summarize|final thoughts|wrapping up|in summary)\b/i.test(plainLower.slice(-1200)) ||
      /\b(?:thank you for reading|thanks for reading)\b/i.test(plainLower.slice(-800));
    let aiBits = 0;
    if (h2 >= 3 && h3 > 0 && h3 === h2 * 2) aiBits += 25;
    else if (h2 >= 3 && h3 >= h2) aiBits += 12;
    if (intro && conclusion) aiBits += 15;
    else if (intro || conclusion) aiBits += 6;
    const perfectHeadingRatio = h2 >= 3 && h3 === h2 * 2;
    return {
      h2,
      h3,
      introDetected: !!intro,
      conclusionDetected: !!conclusion,
      perfectHeadingRatio,
      structureAiSignal: Math.min(100, aiBits * 2),
    };
  }

  function analyzeSeoStuffing(plainLower, words, targetKeyword, lsiList) {
    const wc = words.length || 1;
    if (!targetKeyword || !targetKeyword.trim()) {
      return {
        active: false,
        density: null,
        exactMatches: 0,
        inGoldilocksBand: false,
        lsiHitRatio: null,
        seoAiSignal: 0,
      };
    }
    const kw = targetKeyword.trim().toLowerCase();
    const reKw = new RegExp("\\b" + escapeRegex(kw) + "\\b", "gi");
    const exactMatches = (plainLower.match(reKw) || []).length;
    const density = (exactMatches / wc) * 100;
    let seoAiSignal = 0;
    const inGoldilocks = density >= 0.8 && density <= 2.5;
    if (inGoldilocks) seoAiSignal += 20;
    if (exactMatches > 5) seoAiSignal += 15;
    let lsiHitRatio = null;
    if (lsiList && lsiList.length) {
      let hits = 0;
      for (const term of lsiList) {
        const t = term.trim().toLowerCase();
        if (!t) continue;
        if (plainLower.includes(t)) hits++;
      }
      lsiHitRatio = lsiList.length ? hits / lsiList.length : 0;
      if (lsiList.length >= 3 && lsiHitRatio >= 0.7) seoAiSignal += 25;
    }
    return {
      active: true,
      density,
      exactMatches,
      inGoldilocksBand: inGoldilocks,
      lsiHitRatio,
      seoAiSignal: Math.min(100, seoAiSignal),
    };
  }

  function analyzePersonality(raw) {
    let humor = 0;
    for (const re of PERSONAL_HUMOR) humor += countMatches(re, raw);
    let vuln = 0;
    for (const re of PERSONAL_VULN) vuln += countMatches(re, raw);
    const exclam = (raw.match(/!/g) || []).length;
    const capsWords = (raw.match(/\b[A-Z]{2,}\b/g) || []).length;
    let conv = 0;
    for (const re of CONVERSATIONAL_FILLERS) conv += countMatches(re, raw.toLowerCase());
    const questions = (raw.match(/\?/g) || []).length;
    const personalityRichness = humor + vuln + Math.min(15, exclam) + Math.min(10, capsWords) + conv + Math.min(12, questions);
    const aiLikelihood = Math.max(0, Math.min(100, 100 - personalityRichness * 3));
    return {
      humor,
      vulnerability: vuln,
      exclamations: exclam,
      capsWords,
      conversational: conv,
      questionMarks: questions,
      personalityRichness,
      aiLikelihood: Math.round(aiLikelihood),
    };
  }

  function analyzeBlogTransitions(rawLower) {
    let ai = 0;
    for (const re of BLOG_AI_TRANSITIONS) ai += countMatches(re, rawLower);
    let human = 0;
    for (const re of BLOG_HUMAN_TRANSITIONS) human += countMatches(re, rawLower);
    const net = ai - human;
    let transitionBlogAi = 0;
    if (net > 0) transitionBlogAi = Math.min(100, 30 + net * 8);
    else transitionBlogAi = Math.max(0, 15 + net * 5);
    return { ai, human, net, transitionBlogAi: Math.round(transitionBlogAi) };
  }

  function analyzeFluff(rawLower, words) {
    const wc = words.length || 1;
    let hits = 0;
    for (const phrase of FLUFF_PHRASES) {
      const idx = rawLower.indexOf(phrase);
      if (idx !== -1) {
        let pos = 0;
        const sub = phrase.toLowerCase();
        while ((pos = rawLower.indexOf(sub, pos)) !== -1) {
          hits++;
          pos += sub.length;
        }
      }
    }
    const per1000 = (hits / wc) * 1000;
    let fluffAi = 20;
    if (per1000 >= 8) fluffAi = 90;
    else if (per1000 >= 5) fluffAi = 75;
    else if (per1000 >= 3) fluffAi = 55;
    else if (per1000 <= 1) fluffAi = 25;
    return { hits, per1000, fluffAi: Math.round(fluffAi) };
  }

  function analyzeExamples(rawLower) {
    let gen = 0;
    for (const re of GENERIC_EXAMPLE_MARKERS) gen += countMatches(re, rawLower);
    let spec = 0;
    for (const re of SPECIFIC_EXAMPLE_MARKERS) spec += countMatches(re, rawLower);
    let exampleAi = 35;
    if (gen > spec * 2 && gen >= 3) exampleAi = 85;
    else if (gen > spec) exampleAi = 65;
    else if (spec > gen) exampleAi = 25;
    return { generic: gen, specific: spec, exampleAi: Math.round(exampleAi) };
  }

  function analyzeCtas(rawLower) {
    let ai = 0;
    for (const re of AI_CTA_PHRASES) ai += countMatches(re, rawLower);
    let hum = 0;
    for (const re of HUMAN_CTA_PHRASES) hum += countMatches(re, rawLower);
    let ctaAi = 40;
    if (ai > hum + 1) ctaAi = Math.min(95, 55 + ai * 10);
    else if (hum > ai) ctaAi = 25;
    return { ai, human: hum, ctaAi: Math.round(ctaAi) };
  }

  function analyzeTemporal(rawLower) {
    let n = 0;
    for (const re of TEMPORAL_MARKERS) n += countMatches(re, rawLower);
    let temporalAi = 15;
    if (n === 0) temporalAi = 65;
    else if (n >= 4) temporalAi = 20;
    else temporalAi = 35;
    return { markers: n, temporalAi: Math.round(temporalAi) };
  }

  function analyzeImages(rawInput, keywordLower) {
    if (!hasHtmlMarkup(rawInput) || !/<img\b/i.test(rawInput)) {
      return {
        imageCount: 0,
        stockCount: 0,
        seoAltCount: 0,
        imageAi: 40,
        note: "No <img> tags in paste (skip or neutral).",
      };
    }
    const imgTags = rawInput.match(/<img\b[^>]*>/gi) || [];
    let stockCount = 0;
    let seoAltCount = 0;
    for (const tag of imgTags) {
      const srcM = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
      const src = srcM ? srcM[1].toLowerCase() : "";
      if (STOCK_PHOTO_HOSTS.some((h) => src.includes(h))) stockCount++;
      const altM = tag.match(/\balt\s*=\s*["']([^"']*)["']/i);
      const alt = altM ? altM[1].toLowerCase() : "";
      if (keywordLower && alt.length > 10 && alt.includes(keywordLower)) seoAltCount++;
    }
    const imageCount = imgTags.length;
    let imageAi = 30;
    if (imageCount > 0 && stockCount === imageCount) imageAi += 25;
    if (imageCount > 0 && keywordLower && seoAltCount === imageCount) imageAi += 20;
    return {
      imageCount,
      stockCount,
      seoAltCount,
      imageAi: Math.min(100, Math.round(imageAi)),
      note: "Parsed from HTML only.",
    };
  }

  function blogCompositeScore(parts) {
    const personal = parts.personalAi;
    const structure = parts.structureAi;
    const seo = parts.seoActive ? parts.seoAi : 45;
    const personality = parts.personalityAi;
    const blogTrans = parts.blogTransAi;
    const fluff = parts.fluffAi;
    const examples = parts.exampleAi;
    const cta = parts.ctaAi;
    const temporal = parts.temporalAi;
    const image = parts.imageAi;
    const p =
      personal * 0.18 +
      structure * 0.12 +
      seo * 0.12 +
      personality * 0.12 +
      blogTrans * 0.1 +
      fluff * 0.1 +
      examples * 0.08 +
      cta * 0.08 +
      temporal * 0.06 +
      image * 0.04;
    return Math.round(Math.min(100, Math.max(0, p)));
  }

  function tokenizeWords(text) {
    return text
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .match(/[a-z0-9']+/g) || [];
  }

  function splitSentences(raw) {
    const t = raw.replace(/\s+/g, " ").trim();
    if (!t) return [];
    const parts = t.split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/);
    const out = [];
    for (const p of parts) {
      const s = p.trim();
      if (s.length) out.push(s);
    }
    if (!out.length && t) return [t];
    return out;
  }

  function splitParagraphs(raw) {
    return raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  function countSyllables(word) {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (w.length <= 3) return 1;
    const vowels = w.match(/[aeiouy]+/g);
    let n = vowels ? vowels.length : 1;
    if (w.endsWith("e")) n--;
    return Math.max(1, n);
  }

  function meanStd(arr) {
    if (!arr.length) return { mean: 0, std: 0 };
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const v = arr.reduce((s, x) => s + (x - mean) ** 2, 0) / arr.length;
    return { mean, std: Math.sqrt(v) };
  }

  /** Shannon entropy of token distribution (normalized 0–1 vs max for this vocabulary). */
  function wordEntropyNorm(words) {
    if (words.length < 5) return 0.5;
    const freq = new Map();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
    const n = words.length;
    let h = 0;
    for (const c of freq.values()) {
      const p = c / n;
      h -= p * Math.log2(p);
    }
    const uniq = freq.size;
    const hMax = uniq > 1 ? Math.log2(uniq) : 0;
    if (hMax <= 0) return 0;
    return Math.min(1, h / hMax);
  }

  /** Bigram entropy rate (0 = repetitive/predictable). */
  function bigramEntropyNorm(words) {
    if (words.length < 6) return 0.5;
    const bi = new Map();
    for (let i = 0; i < words.length - 1; i++) {
      const b = words[i] + " " + words[i + 1];
      bi.set(b, (bi.get(b) || 0) + 1);
    }
    const total = words.length - 1;
    let h = 0;
    for (const c of bi.values()) {
      const p = c / total;
      h -= p * Math.log2(p);
    }
    const maxH = Math.log2(Math.min(bi.size, 64));
    if (maxH <= 0) return 0;
    return Math.min(1, h / maxH);
  }

  /**
   * Human-likeness 0–100: higher = less predictable (proxy for perplexity).
   * Stricter: dampened toward “machine-safe” entropy bands.
   */
  function perplexityHumanScore(words) {
    const we = wordEntropyNorm(words);
    const be = bigramEntropyNorm(words);
    const combined = we * 0.45 + be * 0.55;
    return Math.round(Math.min(100, Math.max(0, combined * 100 * 0.9)));
  }

  /** Human-likeness burstiness 0–100 (stricter CV bands = harder to score “human”). */
  function burstinessHumanScore(sentences) {
    const lens = sentences.map((s) => tokenizeWords(s).length).filter((n) => n > 0);
    if (lens.length < 2) return { score: 50, cv: 0, flatMidFraction: 0 };
    const { mean, std } = meanStd(lens);
    if (mean < 1) return { score: 50, cv: 0, flatMidFraction: 0 };
    const cv = std / mean;
    const mid = lens.filter((n) => n >= 15 && n <= 20).length;
    const flatMidFraction = lens.length ? mid / lens.length : 0;
    let score;
    if (cv < 0.32) score = Math.round((cv / 0.32) * 22);
    else if (cv < 0.55) score = Math.round(22 + ((cv - 0.32) / 0.23) * 33);
    else score = Math.round(Math.min(100, 55 + ((cv - 0.55) / 0.55) * 45));
    if (flatMidFraction >= 0.34 && lens.length >= 5) score = Math.round(score * 0.94);
    if (flatMidFraction >= 0.42 && lens.length >= 6) score = Math.round(score * 0.88);
    if (flatMidFraction >= 0.5 && lens.length >= 6) score = Math.round(Math.min(score, score * 0.8));
    return { score, cv, flatMidFraction };
  }

  function lexicalDensity(words) {
    if (!words.length) return 0;
    let content = 0;
    for (const w of words) {
      if (!STOPWORDS.has(w) && w.length > 1) content++;
    }
    return (content / words.length) * 100;
  }

  function ttr(words) {
    if (!words.length) return 0;
    return (new Set(words).size / words.length) * 100;
  }

  /** 0–100: higher = more typical of described "AI band" for density. */
  function lexicalDensityAiTypicality(d) {
    if (d >= 45 && d <= 55) return 100;
    if (d < 35 || d > 65) return 15;
    const dist = d < 45 ? 45 - d : d - 55;
    return Math.round(Math.max(20, 100 - dist * 4));
  }

  /** 0–100 AI typicality for TTR. */
  function ttrAiTypicality(t) {
    if (t >= 40 && t <= 50) return 100;
    if (t >= 55) return Math.max(15, 100 - (t - 50) * 3);
    if (t < 40) return Math.max(25, 100 - (40 - t) * 2);
    return 50;
  }

  function transitionHitsPer500(words, rawLower) {
    let hits = 0;
    const found = [];
    for (const { re, label } of TRANSITION_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(rawLower)) !== null) {
        hits++;
        found.push(label);
      }
    }
    const wc = words.length || 1;
    const per500 = (hits / wc) * 500;
    return { hits, per500, found };
  }

  function transitionAiScore(per500) {
    if (per500 <= 1) return Math.round(per500 * 14);
    if (per500 <= 3) return Math.round(14 + (per500 - 1) * 16);
    if (per500 <= 5) return Math.round(46 + (per500 - 3) * 17);
    return Math.round(Math.min(100, 80 + (per500 - 5) * 7));
  }

  function hedgeRatio(words) {
    if (!words.length) return 0;
    let h = 0;
    for (const w of words) {
      const x = w.replace(/'s$/, "");
      if (HEDGE_WORDS.has(x) || SOFTENER_EXTRA.has(x)) h++;
    }
    return (h / words.length) * 100;
  }

  function hedgePhraseHits(raw) {
    let n = 0;
    for (const re of HEDGE_PHRASES) {
      const m = raw.match(re);
      if (m) n += m.length;
    }
    return n;
  }

  function hedgeAiScore(ratio, phraseHits, wordsLen) {
    const base = Math.min(100, ratio * 4.8);
    const phraseBoost = Math.min(48, (phraseHits / Math.max(wordsLen, 1)) * 950);
    return Math.round(Math.min(100, base + phraseBoost));
  }

  function structureUniformityScore(paragraphs) {
    if (paragraphs.length < 2) return 40;
    const counts = paragraphs.map((p) => splitSentences(p).length);
    const { mean, std } = meanStd(counts);
    if (mean < 1) return 50;
    const cv = std / mean;
    if (cv < 0.25 && mean >= 4 && mean <= 7) return 90;
    if (cv < 0.35) return 70;
    if (cv > 0.8) return 25;
    return Math.round(50 - cv * 30);
  }

  function emotionalFlatness(raw, words) {
    const ex = (raw.match(/!/g) || []).length;
    const q = (raw.match(/\?/g) || []).length;
    const punct = (raw.match(/[.!?]/g) || []).length || 1;
    const emotive = (ex + q) / punct;
    const flat = emotive < 0.05 ? 85 : emotive < 0.12 ? 55 : 25;
    return Math.round(flat);
  }

  function readabilityGrade(words, sentences) {
    if (!words.length || !sentences.length) return 0;
    const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
    const w = words.length;
    const s = sentences.length;
    return 0.39 * (w / s) + 11.8 * (syllables / w) - 15.59;
  }

  function readabilityMismatchScore(grade) {
    if (grade >= 10 && grade <= 12) return 70;
    if (grade > 16 || grade < 6) return 25;
    return 45;
  }

  function ngramAiHits(words) {
    const text = words.join(" ");
    let n = 0;
    for (const tri of AI_TRIGRAMS) {
      const re = new RegExp(tri.replace(/\s+/g, "\\s+"), "gi");
      const m = text.match(re);
      if (m) n += m.length;
    }
    return n;
  }

  function punctuationProfile(raw) {
    const em = (raw.match(/\u2014|—|--/g) || []).length;
    const semi = (raw.match(/;/g) || []).length;
    const conservative = em === 0 && semi < 2;
    return { em, semi, conservative };
  }

  function sentenceStarterRepetition(sentences) {
    const first = sentences
      .map((s) => {
        const tw = tokenizeWords(s);
        return tw[0] || "";
      })
      .filter(Boolean);
    if (first.length < 3) return { score: 30, top: [] };
    const freq = new Map();
    for (const f of first) freq.set(f, (freq.get(f) || 0) + 1);
    const max = Math.max(...freq.values());
    const ratio = max / first.length;
    const top = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([w, c]) => `${w} (${c}×)`);
    const score = Math.round(Math.min(100, ratio * 150));
    return { score, top };
  }

  function passiveRoughHits(sentences) {
    let n = 0;
    const re = /\b(?:is|are|was|were|been|be)\s+[\w']+\s+(?:\w+\s+){0,3}(?:ed|en)\b/gi;
    for (const s of sentences) {
      const m = s.match(re);
      if (m) n += m.length;
    }
    return n;
  }

  function vagueHits(raw) {
    let n = 0;
    const patterns = [
      /\bmany studies\b/gi,
      /\bit has been (?:demonstrated|shown|found)\b/gi,
      /\bseveral studies\b/gi,
      /\bresearch suggests\b/gi,
    ];
    for (const re of patterns) {
      const m = raw.match(re);
      if (m) n += m.length;
    }
    return n;
  }

  function sentencePassiveHeuristic(s) {
    const pats = [
      /\bit is recommended\b/gi,
      /\b(?:has|have)\s+been\s+\w+ed\b/gi,
      /\b(?:was|were)\s+\w+ed\b/gi,
      /\b(?:is|are)\s+being\s+\w+ed\b/gi,
      /\b(?:is|are|was|were)\s+[a-z']{3,20}\s+(?:[a-z']{2,12}\s+){1,4}[a-z]{3,22}(?:ed|en)\b/gi,
    ];
    for (const pr of pats) {
      pr.lastIndex = 0;
      if (pr.test(s)) return true;
      pr.lastIndex = 0;
    }
    return false;
  }

  function countPredictableCliches(rawLower) {
    let n = 0;
    for (const re of PREDICTABLE_CLICHES) n += countMatches(re, rawLower);
    return n;
  }

  function countEmDashPer500(raw, wc) {
    const em = (raw.match(/\u2014|—/g) || []).length;
    const doubled = (raw.match(/--/g) || []).length;
    return ((em + doubled) / Math.max(wc, 1)) * 500;
  }

  function countParallelisms(rawLower) {
    let n = 0;
    for (const re of PARALLEL_PATTERNS) n += countMatches(re, rawLower);
    return n;
  }

  function maxConsecutiveSameStarter(sentences) {
    const starters = sentences.map((s) => {
      const tw = tokenizeWords(s);
      return (tw[0] || "").toLowerCase();
    });
    let bestRun = 1;
    let bestWord = "";
    let cur = 1;
    for (let i = 1; i < starters.length; i++) {
      if (starters[i] && starters[i] === starters[i - 1]) {
        cur++;
        if (cur > bestRun) {
          bestRun = cur;
          bestWord = starters[i];
        }
      } else cur = 1;
    }
    return { maxRun: bestRun, word: bestWord };
  }

  function isLoopSubjectWord(w) {
    return ["the", "it", "this", "these", "that", "moringa", "a", "an"].includes(w);
  }

  function maxTheStartsInSingleParagraph(paragraphs) {
    let worst = 0;
    let excerpt = "";
    for (const p of paragraphs) {
      const sens = splitSentences(p);
      let c = 0;
      for (const s of sens) {
        const tw = tokenizeWords(s);
        if (tw[0] === "the") c++;
      }
      if (c > worst) {
        worst = c;
        excerpt = p.slice(0, 200);
      }
    }
    return { count: worst, excerpt };
  }

  function analyzeHeadingXFORY(rawInput) {
    const titles = [];
    if (hasHtmlMarkup(rawInput)) {
      const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
      let m;
      while ((m = re.exec(rawInput)) !== null) {
        const t = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (t) titles.push(t);
      }
    }
    for (const line of rawInput.split(/\n/)) {
      const m = line.match(/^##\s+(?!#)\s*(.+)$/);
      if (m) titles.push(m[1].trim());
    }
    let xForY = 0;
    for (const t of titles) {
      if (/\sfor\s+/i.test(t) && t.length < 90 && t.length > 5) xForY++;
    }
    return { titles, xForY };
  }

  function passiveFractionStrict(sentences) {
    let n = 0;
    for (const s of sentences) if (sentencePassiveHeuristic(s)) n++;
    return sentences.length ? n / sentences.length : 0;
  }

  function countSoftenerHits(words, rawLower) {
    let c = 0;
    for (const w of words) {
      const x = w.replace(/'s$/, "");
      if (HEDGE_WORDS.has(x) || SOFTENER_EXTRA.has(x)) c++;
    }
    c += countMatches(/\bcould be considered\b/gi, rawLower);
    return c;
  }

  function flourishHitsPer500(words, rawLower) {
    const wc = words.length || 1;
    let hits = 0;
    for (const adj of AI_FLOURISH_ADJECTIVES) {
      hits += countMatches(new RegExp("\\b" + escapeRegex(adj) + "\\b", "gi"), rawLower);
    }
    return (hits / wc) * 500;
  }

  function trigramIntroOutroEcho(words) {
    if (words.length < 36) return { shared: [], hasEcho: false };
    const n = words.length;
    const introN = Math.max(12, Math.floor(n * 0.22));
    const outN = Math.max(12, Math.floor(n * 0.22));
    const intro = words.slice(0, introN);
    const outro = words.slice(n - outN);
    function buildSet(arr) {
      const s = new Set();
      for (let i = 0; i < arr.length - 2; i++) {
        const a = arr[i];
        const b = arr[i + 1];
        const c = arr[i + 2];
        if (a.length < 2 && b.length < 2) continue;
        if (STOPWORDS.has(a) && STOPWORDS.has(b) && STOPWORDS.has(c)) continue;
        s.add(a + " " + b + " " + c);
      }
      return s;
    }
    const Si = buildSet(intro);
    const So = buildSet(outro);
    const shared = [...Si].filter((t) => So.has(t));
    const meaningful = shared.filter((t) => {
      const p = t.split(" ");
      return !(p[0] === "the" && p[1] === "the");
    });
    return {
      shared: meaningful.slice(0, 6),
      hasEcho: meaningful.length >= 1,
    };
  }

  /**
   * Weighted blend per spec (sums to 1.0). Structure blends paragraph uniformity + FK mismatch + n-gram hits.
   */
  function compositeAiProbability(scores) {
    const {
      perplexityHuman,
      burstinessHuman,
      lexicalAi,
      ttrAi,
      transitionAi,
      hedgingAi,
      structureAi,
      emotionalFlat,
      readabilityAi,
      ngramHits,
    } = scores;

    const ngramBoost = Math.min(35, ngramHits * 10);
    const structureUniformity = Math.min(100, Math.round((structureAi * 0.55 + readabilityAi * 0.35 + ngramBoost * 0.1)));

    const p =
      (100 - perplexityHuman) * 0.15 +
      (100 - burstinessHuman) * 0.2 +
      lexicalAi * 0.1 +
      ttrAi * 0.1 +
      Math.min(100, transitionAi + Math.min(20, ngramHits * 5)) * 0.15 +
      hedgingAi * 0.1 +
      structureUniformity * 0.1 +
      emotionalFlat * 0.1;

    return Math.round(Math.min(100, Math.max(0, p)));
  }

  function sentenceSuspicion(sentence, rawLower) {
    let score = 0;
    const reasons = [];
    const sLower = sentence.toLowerCase();
    for (const { re } of TRANSITION_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(sentence)) {
        score += 28;
        reasons.push("Formal transition phrase");
      }
      re.lastIndex = 0;
    }
    for (const tri of AI_TRIGRAMS) {
      if (sLower.includes(tri)) {
        score += 22;
        reasons.push(`AI trigram: "${tri}"`);
      }
    }
    const wds = tokenizeWords(sentence);
    let h = 0;
    for (const w of wds) {
      const x = w.replace(/'s$/, "");
      if (HEDGE_WORDS.has(x) || SOFTENER_EXTRA.has(x)) h++;
    }
    if (h >= 2) {
      score += 20;
      reasons.push("Multiple hedging words");
    }
    for (const w of AI_VOCAB) {
      if (sLower.includes(w)) {
        score += 15;
        reasons.push(`AI-flag vocabulary: "${w}"`);
      }
    }
    if (!/['']/.test(sentence) && wds.length > 12) {
      score += 5;
      reasons.push("No contractions in a long sentence");
    }
    score = Math.min(98, score);
    return { score: score || 5, reasons: reasons.length ? reasons : ["Minor stylometric flags"] };
  }

  function collectStrictIssues(sentences, rawTrim, rawLower, paragraphs, wordCount, words, rawInput) {
    const issues = [];
    const seen = new Set();

    function pushIssue(category, flagged, humanFix, dedupeKey) {
      const k = dedupeKey || flagged.slice(0, 140);
      if (seen.has(k)) return;
      seen.add(k);
      issues.push({
        category,
        flagged: flagged.length > 360 ? flagged.slice(0, 357) + "…" : flagged,
        humanFix,
      });
    }

    const lens = sentences.map((s) => tokenizeWords(s).length).filter((n) => n > 0);
    const mid = lens.filter((n) => n >= 15 && n <= 20).length;
    const flatMidFraction = lens.length ? mid / lens.length : 0;
    if (lens.length >= 5 && flatMidFraction >= 0.38) {
      pushIssue(
        "Structural rhythm (flat burst)",
        `About ${Math.round(flatMidFraction * 100)}% of sentences are 15–20 words (“middle-length” trap).`,
        "Humans zig-zag length: add a 3–6 word sting, then a longer explainer—avoid a metronome of ~18-word lines.",
        "flat-rhythm-doc"
      );
    }

    const emPer500 = countEmDashPer500(rawTrim, wordCount);
    if (emPer500 > 3) {
      pushIssue(
        "Em dash / double-hyphen crutch",
        `~${emPer500.toFixed(1)} em-dash–style breaks per 500 words (>3 forensic threshold).`,
        "Replace half with parentheses, a period + short follow-up, or a colon—keep em dashes for real asides only.",
        "em-dash-crutch"
      );
    }

    const parallelCount = countParallelisms(rawLower);
    if (parallelCount > 2) {
      pushIssue(
        'Parallel / “twin” phrasing',
        `${parallelCount} “both X and Y” / “not only… but also” style constructions (>2 threshold).`,
        "Pick one adjective with teeth, or split into two sentences with different verbs—skip symmetrical pairs.",
        "parallel-twins"
      );
    }

    const consec = maxConsecutiveSameStarter(sentences);
    if (consec.maxRun >= 3 && isLoopSubjectWord(consec.word)) {
      pushIssue(
        "Consecutive subject loop",
        `${consec.maxRun} sentences in a row start with “${consec.word}…” (memory / template tell).`,
        "Change the subject line-up: verb-first, “We”, a year, a customer quote—never three identical openers in a row.",
        "consec-starter"
      );
    }

    const passivePct = passiveFractionStrict(sentences);
    if (sentences.length >= 8 && passivePct > 0.1) {
      pushIssue(
        "Passive voice load",
        `~${Math.round(passivePct * 100)}% of sentences read passive (>10% threshold).`,
        "Lead with actor + action: “I soaked the roots” beats “The roots were watered”; name who did the work.",
        "passive-load"
      );
    }

    const theWorst = maxTheStartsInSingleParagraph(paragraphs);
    if (theWorst.count > 3) {
      pushIssue(
        'Paragraph “The…” clustering',
        `One paragraph has ${theWorst.count} sentences starting with “The” (>3 threshold). Excerpt: ${theWorst.excerpt.slice(0, 140)}…`,
        "Merge ideas, use pronouns, or start with a verb / number so every line doesn’t open like a textbook.",
        "the-cluster-para"
      );
    }

    const heading = analyzeHeadingXFORY(rawInput);
    if (heading.xForY >= 3) {
      pushIssue(
        "Heading symmetry (“X for Y” template)",
        `${heading.xForY} H2-style titles match a tight “… for …” pattern (≥3).`,
        "Vary heading shapes: question, number list, contrarian hook, or a blunt noun phrase without “for”.",
        "heading-x-for-y"
      );
    }

    const softHits = countSoftenerHits(words, rawLower);
    if (wordCount >= 80 && softHits > 5) {
      pushIssue(
        "Hedged / softener repetition",
        `${softHits} softener tokens (tends to, generally, may, potentially, …) — >5 in one post tanks trust.`,
        "Keep one hedge where risk is real; elsewhere swap for a testable claim or a named source.",
        "softener-flood"
      );
    }

    const flourishP500 = flourishHitsPer500(words, rawLower);
    if (flourishP500 >= 3) {
      pushIssue(
        "Watermark-style flourish adjectives",
        `High density of “vibrant / compelling / remarkable…” (~${flourishP500.toFixed(1)} hits per 500 words).`,
        "Pick one vivid concrete noun; cut stacked praise adjectives—readers trust boring specifics more.",
        "flourish-watermark"
      );
    }

    const triEcho = trigramIntroOutroEcho(words);
    if (triEcho.hasEcho && triEcho.shared.length) {
      pushIssue(
        "Trigram “logic template” echo (intro ↔ outro)",
        `Same 3-word sequence appears in opening and closing segments, e.g. “${triEcho.shared[0]}”.`,
        "Rewrite one end so the phrase isn’t duplicated—templates recycle the same trigram when wrapping up.",
        "trigram-echo"
      );
    }

    const firstP = ((paragraphs[0] != null ? paragraphs[0] : rawTrim) || "").trim();
    const introProbe = firstP.slice(0, 520);
    for (const re of GENERIC_INTRO_HOOKS) {
      re.lastIndex = 0;
      if (re.test(introProbe)) {
        pushIssue(
          "Formulaic enclosure (intro)",
          firstP.slice(0, 300) + (firstP.length > 300 ? "…" : ""),
          "Open with a concrete moment: where you were, what failed, or a Melbourne-specific snag—then state the thesis.",
          "generic-intro"
        );
        break;
      }
      re.lastIndex = 0;
    }

    const lastP = paragraphs.length ? paragraphs[paragraphs.length - 1].trim() : "";
    if (lastP.length > 50) {
      const hasCloseCue = /\b(?:in conclusion|to summarize|in summary|overall|in closing)\b/i.test(lastP);
      const hasNewInsight =
        /\d/.test(lastP) ||
        /\?/.test(lastP) ||
        /\b(however|but|yet|the catch|the downside)\b/i.test(lastP);
      if (hasCloseCue && !hasNewInsight) {
        pushIssue(
          "Formulaic enclosure (conclusion)",
          lastP.slice(0, 320) + (lastP.length > 320 ? "…" : ""),
          "Add one fresh angle: a trade-off, a cost, or what you’d test next—don’t only restate earlier bullets.",
          "formula-conclusion"
        );
      }
    }

    if (wordCount >= 100) {
      let au = 0;
      for (const re of AUSTRALIAN_EEAT) au += countMatches(re, rawLower);
      if (au === 0) {
        pushIssue(
          "EEAT / locality (Australian signal)",
          "No clear AU anchor (cities, states, shipping region, AUD, etc.) in this length of copy.",
          "Drop in one checkable local detail: e.g. Victoria weather for drying herbs, AU-wide shipping timing, or a suburb you ship from.",
          "eeat-au"
        );
      }
    }

    if (/\bever[- ]evolving\b/i.test(rawLower)) {
      pushIssue(
        'AI-ism (“ever-evolving”)',
        "Phrase: ever-evolving / ever evolving",
        INFLATED_ADJ_FIX["ever-evolving"],
        "ever-evolving-phrase"
      );
    }

    const clichéHits = countPredictableCliches(rawLower);
    if (clichéHits >= 1) {
      pushIssue(
        "Statistical predictability (safe clichés)",
        `${clichéHits} “template-safe” phrase(s) detected (e.g. powerhouse-of-nutrition style completions).`,
        "Swap for a weird, testable detail only you could write (“I forgot to water it for a week and it still…”).",
        "cliche-predictability"
      );
    }

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const sl = s.toLowerCase();
      if (sentencePassiveHeuristic(s)) {
        pushIssue(
          "Passive voice",
          s.trim(),
          "Lead with who did what: “We measured…” / “Customers reported…” instead of hiding the actor.",
          "passive:" + i
        );
      }

      for (const word of Object.keys(AI_VERBS_FIX)) {
        const wr = new RegExp("\\b" + escapeRegex(word) + "\\b", "i");
        if (wr.test(sl)) {
          pushIssue('AI-style verb (“' + word + '”)', s.trim(), AI_VERBS_FIX[word], "verb:" + word + ":" + i);
        }
      }
      for (const word of Object.keys(INFLATED_ADJ_FIX)) {
        const wr = new RegExp("\\b" + escapeRegex(word) + "\\b", "i");
        if (wr.test(sl)) {
          pushIssue(
            'Inflated adjective (“' + word + '”)',
            s.trim(),
            INFLATED_ADJ_FIX[word],
            "adj:" + word + ":" + i
          );
        }
      }
      for (const word of Object.keys(FILLER_NOUNS_FIX)) {
        const wr = new RegExp("\\b" + escapeRegex(word) + "\\b", "i");
        if (wr.test(sl)) {
          pushIssue(
            'Filler noun (“' + word + '”)',
            s.trim(),
            FILLER_NOUNS_FIX[word],
            "noun:" + word + ":" + i
          );
        }
      }

      for (const { re, fix } of UNEARNED_ENTHUSIASM) {
        re.lastIndex = 0;
        if (re.test(s)) {
          pushIssue("Unearned enthusiasm / hype tone", s.trim(), fix, "hype:" + i + ":" + issues.length);
        }
        re.lastIndex = 0;
      }

      for (const hre of HEDGE_PHRASES) {
        hre.lastIndex = 0;
        if (hre.test(s)) {
          pushIssue(
            "Hedging / weak authority",
            s.trim(),
            "Say one claim plainly, then qualify if needed—or cite a named study/source instead of vague distance.",
            "hedge:" + i
          );
          break;
        }
        hre.lastIndex = 0;
      }

      if (/^(?:Firstly|Moreover|Furthermore|Additionally|In conclusion)\b/i.test(s.trim())) {
        pushIssue(
          "Predictable transition (sentence start)",
          s.trim(),
          "Replace with a spoken bridge (“Here’s why that matters”) or fold the link into the prior sentence without a signpost word.",
          "transstart:" + i
        );
      }

      if (issues.length >= 52) break;
    }

    const firstWords = sentences
      .map((s) => {
        const tw = tokenizeWords(s);
        return tw[0] || "";
      })
      .filter(Boolean);
    const tc = sentences.length || 1;
    const theThisIt = firstWords.filter((w) => {
      const x = w.toLowerCase();
      return x === "the" || x === "this" || x === "these" || x === "it";
    }).length;
    if (tc >= 6 && theThisIt / tc >= 0.36) {
      pushIssue(
        "“The / This / It” subject loop (document)",
        `${Math.round((theThisIt / tc) * 100)}% of sentences start with “The”, “This”, “These”, or “It” (stricter >~35%).`,
        "Same fix as consecutive loops: alternate grammatical subjects; use “We”, time, place, or a proper noun.",
        "subject-loop-the-this"
      );
    }
    const moringaStarts = firstWords.filter((w) => w.toLowerCase() === "moringa").length;
    if (tc >= 5 && moringaStarts / tc >= 0.22) {
      pushIssue(
        "Topic-led openings (e.g. “Moringa…”)",
        `"Moringa" opens ${moringaStarts} sentences—reads like templated product copy.`,
        "Lead with effect, objection, or story; mention the product after the hook.",
        "moringa-loop"
      );
    }

    const firstPersonHits = countMatches(/\b(?:i|me|my|mine|myself)\b/gi, rawLower);
    if (wordCount >= 140 && firstPersonHits < 3) {
      pushIssue(
        "EEAT / first-person proof gap",
        "Very few “I / me / my” anchors for this length—reads like generic authority, not lived experience.",
        "Add one tactile anecdote (soil on hands, a packing mistake, a customer DM) tied to AU context.",
        "eeat-i-me"
      );
    }

    const forensic = {
      emCrutch: emPer500 > 3,
      parallelCrutch: parallelCount > 2,
      passiveHeavy: sentences.length >= 8 && passivePct > 0.1,
      starterChain: consec.maxRun >= 3 && isLoopSubjectWord(consec.word),
      theCluster: theWorst.count > 3,
      trigramEcho: triEcho.hasEcho,
      softenerOverload: wordCount >= 80 && softHits > 5,
      headingTemplate: heading.xForY >= 3,
      flourishCrutch: flourishP500 >= 3,
      predictabilityHeavy: clichéHits >= 2,
    };

    const forensicChecklist = [
      {
        id: "em",
        label: "Em dashes (— / --) per 500 words",
        threshold: "> 3",
        triggered: forensic.emCrutch,
        detail: emPer500.toFixed(1) + " per 500w",
      },
      {
        id: "thepara",
        label: '“The” starts in one paragraph',
        threshold: "> 3 sentences",
        triggered: forensic.theCluster,
        detail: "worst count " + theWorst.count,
      },
      {
        id: "parallel",
        label: "Parallel “both X and Y” / not only…",
        threshold: "> 2 in post",
        triggered: forensic.parallelCrutch,
        detail: String(parallelCount) + " hits",
      },
      {
        id: "passive",
        label: "Passive-leaning sentences",
        threshold: "> 10% of sentences",
        triggered: forensic.passiveHeavy,
        detail: Math.round(passivePct * 100) + "%",
      },
      {
        id: "cheer",
        label: "Cheerleading / hype scan",
        threshold: "Any hit",
        triggered: UNEARNED_ENTHUSIASM.some((x) => new RegExp(x.re.source, x.re.flags).test(rawTrim)),
        detail: "pattern scan",
      },
      {
        id: "h2sym",
        label: "H2 “X for Y” template count",
        threshold: "≥ 3",
        triggered: forensic.headingTemplate,
        detail: String(heading.xForY) + " headings",
      },
      {
        id: "starter",
        label: "Same word opens 3+ sentences in a row",
        threshold: "The / It / Moringa / …",
        triggered: forensic.starterChain,
        detail: consec.maxRun >= 3 ? consec.word + " ×" + consec.maxRun : "—",
      },
      {
        id: "trigram",
        label: "Trigram echoed intro → conclusion",
        threshold: "Any shared 3-gram",
        triggered: forensic.trigramEcho,
        detail: triEcho.shared[0] || "—",
      },
      {
        id: "soft",
        label: "Softener words (may, tends, typically…)",
        threshold: "> 5 in post",
        triggered: forensic.softenerOverload,
        detail: String(softHits) + " hits",
      },
      {
        id: "cliche",
        label: "Predictable cliché completions",
        threshold: "≥ 2 phrases",
        triggered: forensic.predictabilityHeavy,
        detail: String(clichéHits) + " phrase(s)",
      },
    ];

    return { issues, flatMidFraction, forensicChecklist, forensic };
  }

  function strictCompositeFromIssues(issueCount, flatMidFraction, transPer500, forensic) {
    const f = forensic || {
      emCrutch: false,
      parallelCrutch: false,
      passiveHeavy: false,
      starterChain: false,
      theCluster: false,
      trigramEcho: false,
      softenerOverload: false,
      headingTemplate: false,
      flourishCrutch: false,
      predictabilityHeavy: false,
    };
    let x = issueCount * 6.9;
    if (flatMidFraction >= 0.34) x += 11;
    if (flatMidFraction >= 0.42) x += 12;
    if (flatMidFraction >= 0.52) x += 10;
    if (transPer500 > 2) x += 7;
    if (transPer500 > 3.5) x += 8;
    if (transPer500 > 5) x += 7;
    if (f.emCrutch) x += 20;
    if (f.parallelCrutch) x += 16;
    if (f.passiveHeavy) x += 18;
    if (f.starterChain) x += 17;
    if (f.theCluster) x += 14;
    if (f.trigramEcho) x += 15;
    if (f.softenerOverload) x += 13;
    if (f.headingTemplate) x += 13;
    if (f.flourishCrutch) x += 11;
    if (f.predictabilityHeavy) x += 12;
    return Math.round(Math.min(100, x));
  }

  function interpretBand(p) {
    if (p <= 25) return { label: "Very likely human", className: "band human" };
    if (p <= 50) return { label: "Probably human (possible light AI editing)", className: "band maybe" };
    if (p <= 75) return { label: "Likely AI-generated (possible human editing)", className: "band ai" };
    return { label: "Very likely AI-generated", className: "band ai-strong" };
  }

  function analyze(raw, options) {
    options = options || {};
    const rawInput = raw.trim();
    if (!rawInput) return null;

    const plain = hasHtmlMarkup(rawInput) ? stripHtmlToText(rawInput) : rawInput;
    const rawTrim = plain;
    const words = tokenizeWords(rawTrim);
    const sentences = splitSentences(rawTrim);
    const paragraphs = splitParagraphs(rawTrim);
    const rawLower = rawTrim.toLowerCase();

    const targetKeyword = (options.targetKeyword || "").trim();
    const lsiList = String(options.lsiKeywords || "")
      .split(/[,;\n]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const keywordLower = targetKeyword.toLowerCase();

    const personalVoice = analyzePersonalVoice(rawLower, words);
    const blogStructure = analyzeBlogStructure(rawInput, rawLower);
    const seo = analyzeSeoStuffing(rawLower, words, targetKeyword, lsiList);
    const personality = analyzePersonality(rawTrim);
    const blogTransitions = analyzeBlogTransitions(rawLower);
    const fluff = analyzeFluff(rawLower, words);
    const examples = analyzeExamples(rawLower);
    const ctas = analyzeCtas(rawLower);
    const temporal = analyzeTemporal(rawLower);
    const images = analyzeImages(rawInput, keywordLower);

    const blogComposite = blogCompositeScore({
      personalAi: personalVoice.aiLikelihood,
      structureAi: blogStructure.structureAiSignal,
      seoActive: seo.active,
      seoAi: seo.seoAiSignal,
      personalityAi: personality.aiLikelihood,
      blogTransAi: blogTransitions.transitionBlogAi,
      fluffAi: fluff.fluffAi,
      exampleAi: examples.exampleAi,
      ctaAi: ctas.ctaAi,
      temporalAi: temporal.temporalAi,
      imageAi: images.imageAi,
    });

    let perplexityHuman = perplexityHumanScore(words);
    const clichéDocHits = countPredictableCliches(rawLower);
    const triEchoDoc = trigramIntroOutroEcho(words);
    perplexityHuman = Math.max(
      0,
      Math.round(perplexityHuman - Math.min(42, clichéDocHits * 15) - (triEchoDoc.hasEcho ? 10 : 0))
    );

    const burst = burstinessHumanScore(sentences);
    const burstinessHuman = burst.score;
    const burstCv = burst.cv;
    const flatMidSentenceFraction = burst.flatMidFraction;
    const density = lexicalDensity(words);
    const ttrVal = ttr(words);
    const lexicalAi = lexicalDensityAiTypicality(density);
    const ttrAi = ttrAiTypicality(ttrVal);

    const trans = transitionHitsPer500(words, rawLower);
    const transitionAi = transitionAiScore(trans.per500);

    const strictPack = collectStrictIssues(
      sentences,
      rawTrim,
      rawLower,
      paragraphs,
      words.length,
      words,
      rawInput
    );
    const strictComposite = strictCompositeFromIssues(
      strictPack.issues.length,
      strictPack.flatMidFraction,
      trans.per500,
      strictPack.forensic
    );

    const hRatio = hedgeRatio(words);
    const hPhrases = hedgePhraseHits(rawTrim);
    const hedgingAi = hedgeAiScore(hRatio, hPhrases, words.length);

    const structureAi = structureUniformityScore(paragraphs);

    const emotionalFlat = emotionalFlatness(rawTrim, words);

    const fk = readabilityGrade(words, sentences);
    const readabilityAi = readabilityMismatchScore(fk);

    const ngramHits = ngramAiHits(words);

    const starters = sentenceStarterRepetition(sentences);

    const punct = punctuationProfile(rawTrim);
    const passiveHits = passiveRoughHits(sentences);
    const vague = vagueHits(rawTrim);

    let contractionHits = 0;
    for (const re of INFORMAL) {
      const m = rawTrim.match(re);
      if (m) contractionHits += m.length;
    }
    let formalHits = 0;
    for (const [re] of EXPANDED_FORMAL) {
      const m = rawTrim.match(re);
      if (m) formalHits += m.length;
    }

    let aiVocabHits = 0;
    const aiVocabFound = [];
    for (const w of AI_VOCAB) {
      const re = new RegExp(`\\b${w}\\b`, "gi");
      const m = rawTrim.match(re);
      if (m) {
        aiVocabHits += m.length;
        aiVocabFound.push(w);
      }
    }

    let metaHits = 0;
    for (const re of META_PATTERNS) {
      if (re.test(rawTrim)) metaHits++;
      re.lastIndex = 0;
    }

    let authorityHits = 0;
    for (const re of AUTHORITY_PHRASES) {
      const m = rawTrim.match(re);
      if (m) authorityHits += m.length;
    }

    const composite = compositeAiProbability({
      perplexityHuman,
      burstinessHuman,
      lexicalAi,
      ttrAi,
      transitionAi,
      hedgingAi,
      structureAi,
      emotionalFlat,
      readabilityAi,
      ngramHits,
    });

    const combinedScore = Math.round(
      Math.min(100, composite * 0.26 + blogComposite * 0.34 + strictComposite * 0.4)
    );

    const suspicious = sentences
      .map((s, i) => {
        const { score, reasons } = sentenceSuspicion(s, rawLower);
        return { i, text: s, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      hadHtmlInput: hasHtmlMarkup(rawInput),
      perplexityHuman,
      burstinessHuman,
      density,
      ttr: ttrVal,
      transitionHits: trans.hits,
      transitionPer500: trans.per500,
      hedgingPercent: hRatio,
      hedgingPhrases: hPhrases,
      fkGrade: fk,
      ngramHits,
      aiVocabHits,
      aiVocabFound: [...new Set(aiVocabFound)],
      structureAi,
      emotionalFlat,
      starters,
      punct,
      passiveHits,
      vagueHits: vague,
      contractionHits,
      formalHits,
      metaHits,
      authorityHits,
      composite,
      blogComposite,
      combinedScore,
      suspicious,
      band: interpretBand(combinedScore),
      burstCv,
      flatMidSentenceFraction,
      strictComposite,
      strictIssues: strictPack.issues,
      forensicChecklist: strictPack.forensicChecklist,
      blog: {
        personalVoice,
        blogStructure,
        seo,
        personality,
        blogTransitions,
        fluff,
        examples,
        ctas,
        temporal,
        images,
      },
    };
  }

  window.NutriThriveAiTextDetector = { analyze, interpretBand };
})();
