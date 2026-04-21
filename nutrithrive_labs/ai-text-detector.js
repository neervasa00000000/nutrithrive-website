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
  ];

  const TRANSITION_PATTERNS = [
    { re: /\bit is important to note that\b/gi, label: "It is important to note that" },
    { re: /\bit's worth noting that\b/gi, label: "It's worth noting that" },
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
   */
  function perplexityHumanScore(words) {
    const we = wordEntropyNorm(words);
    const be = bigramEntropyNorm(words);
    const combined = we * 0.45 + be * 0.55;
    return Math.round(Math.min(100, Math.max(0, combined * 100)));
  }

  /** Human-likeness burstiness 0–100 from coefficient of variation of sentence lengths. Returns CV too. */
  function burstinessHumanScore(sentences) {
    const lens = sentences.map((s) => tokenizeWords(s).length).filter((n) => n > 0);
    if (lens.length < 2) return { score: 50, cv: 0 };
    const { mean, std } = meanStd(lens);
    if (mean < 1) return { score: 50, cv: 0 };
    const cv = std / mean;
    let score;
    if (cv < 0.4) score = Math.round((cv / 0.4) * 30);
    else if (cv < 0.7) score = Math.round(30 + ((cv - 0.4) / 0.3) * 30);
    else score = Math.round(Math.min(100, 60 + ((cv - 0.7) / 0.5) * 40));
    return { score, cv };
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
    if (per500 <= 2) return Math.round(per500 * 10);
    if (per500 <= 5) return Math.round(20 + (per500 - 2) * 20);
    return Math.round(Math.min(100, 80 + (per500 - 5) * 5));
  }

  function hedgeRatio(words) {
    if (!words.length) return 0;
    let h = 0;
    for (const w of words) {
      if (HEDGE_WORDS.has(w.replace(/'s$/, ""))) h++;
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
    const base = Math.min(100, ratio * 4);
    const phraseBoost = Math.min(40, (phraseHits / Math.max(wordsLen, 1)) * 800);
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
    for (const w of wds) if (HEDGE_WORDS.has(w)) h++;
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

    const perplexityHuman = perplexityHumanScore(words);
    const burst = burstinessHumanScore(sentences);
    const burstinessHuman = burst.score;
    const burstCv = burst.cv;
    const density = lexicalDensity(words);
    const ttrVal = ttr(words);
    const lexicalAi = lexicalDensityAiTypicality(density);
    const ttrAi = ttrAiTypicality(ttrVal);

    const trans = transitionHitsPer500(words, rawLower);
    const transitionAi = transitionAiScore(trans.per500);

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

    const combinedScore = Math.round(Math.min(100, composite * 0.45 + blogComposite * 0.55));

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
