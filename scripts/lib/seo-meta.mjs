/**
 * Meta description parse/escape helpers.
 *
 * Naive `content=["']([^"']*)["']` treats apostrophes as attribute delimiters,
 * so `content="I couldn't…"` becomes `I couldn`. The same join-bug then leaves
 * smashed leftovers (`required.'t eat`, `eating.'s serotonin`).
 */

export const META_DESCRIPTION_MIN = 120;
export const META_DESCRIPTION_MAX = 160;

export const META_OVERRIDES = {
  "moringa-vs-coffee-melbourne-energy-hack":
    "Moringa vs coffee Melbourne: no caffeine crash — how locals use shade-dried leaf powder for steady energy instead of a third long black this spring.",
  "moringa-for-anxiety-stress-evidence-2026":
    "Moringa isn't a proven anxiety treatment. But some of its nutritional properties are genuinely relevant to stress and anxiety. Read the evidence breakdown.",
};

const CUT_STEM =
  /(?:couldn|wouldn|shouldn|isn|aren|wasn|weren|hasn|haven|hadn|doesn|don|didn|won|can|mustn|needn|mightn|Here|Father)$/i;

const SMASH_RE = /[.!?]['\u2019](?:s|t|re|ll|ve|d)\b/;

export function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function escapeAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normalizeMetaText(value) {
  return decodeEntities(value)
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function visibleLength(value) {
  return normalizeMetaText(value).length;
}

export function extractQuotedAttr(tag, attrName) {
  const re = new RegExp(`(?:\\s|^)${attrName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i");
  const match = String(tag || "").match(re);
  return match ? match[2] : null;
}

export function metaContent(html, name) {
  const want = String(name).toLowerCase();
  const tags = String(html || "").match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const key = (
      extractQuotedAttr(tag, "name") ||
      extractQuotedAttr(tag, "property") ||
      ""
    ).toLowerCase();
    if (key === want) return extractQuotedAttr(tag, "content");
  }
  return null;
}

export function naiveMetaContent(html) {
  return (
    String(html || "").match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i
    )?.[1] || ""
  );
}

export function repairSmashedMeta(value) {
  const text = normalizeMetaText(value);
  const index = text.search(SMASH_RE);
  if (index === -1) return text;
  return text.slice(0, index + 1).trim();
}

export function looksTruncatedMeta(value) {
  const text = normalizeMetaText(value);
  if (!text) return true;
  if (text.includes('"')) return true;
  if (SMASH_RE.test(text)) return true;
  if (text.length < 80 && !/[.!?]$/.test(text)) return true;
  if (CUT_STEM.test(text)) return true;
  if (/\b(?:what|who)$/i.test(text) && text.length < 110) return true;
  return false;
}

function trimAtWord(text, limit) {
  if (text.length <= limit) return text;
  let shortened = text.slice(0, limit + 1).replace(/\s+\S*$/, "").trim();
  shortened = shortened.replace(/[,:;\-–—]+$/, "").trim();
  shortened = shortened.replace(/\s+(?:couldn|wouldn|shouldn|isn|aren|wasn|weren|hasn|haven|hadn|doesn|don|didn|won|can|mustn|needn|mightn|Here|Father)$/i, "").trim();
  return shortened;
}

export function fitMetaDescription(value) {
  let description = repairSmashedMeta(value);
  if (!description) return description;

  if (description.length < META_DESCRIPTION_MIN) {
    const lower = description.toLowerCase();
    const topicSuffix = lower.includes("curry")
      ? " Practical preparation, storage and cooking guidance from NutriThrive."
      : lower.includes("tea") || lower.includes("darjeeling") || lower.includes("caffeine")
        ? " Practical guidance for choosing, brewing and enjoying tea from NutriThrive."
        : lower.includes("soap") || lower.includes("skin")
          ? " Clear guidance on ingredients, everyday use and important limitations."
          : lower.includes("moringa")
            ? " Evidence-aware guidance, practical use and important safety considerations."
            : " Evidence-aware, practical Australian guidance from NutriThrive.";
    const candidates = [
      topicSuffix,
      " Practical Australian guidance from NutriThrive.",
      " Read the practical NutriThrive guide.",
    ];
    const addition = candidates.find((suffix) => description.length + suffix.length <= META_DESCRIPTION_MAX);
    if (addition) description = `${description.replace(/\.$/, "")}.${addition}`;
  }

  if (description.length <= META_DESCRIPTION_MAX) return description;

  const sentence = description.slice(0, META_DESCRIPTION_MAX + 1).match(/^(.{90,160}[.!?])(?:\s|$)/)?.[1];
  if (sentence && !looksTruncatedMeta(sentence)) return sentence;
  const shortened = trimAtWord(description, META_DESCRIPTION_MAX - 3);
  const closed = `${shortened.replace(/[.!?]+$/, "")}.`;
  return closed.length <= META_DESCRIPTION_MAX ? closed : trimAtWord(description, META_DESCRIPTION_MAX);
}

export function pickSeoDescription({ live, file, catalog, slug } = {}) {
  if (slug && META_OVERRIDES[slug]) return META_OVERRIDES[slug];
  const candidates = [file, live, catalog]
    .map((value) => repairSmashedMeta(value))
    .filter(Boolean);
  const complete = candidates.find((value) => !looksTruncatedMeta(value) && visibleLength(value) >= 80);
  const chosen = complete || candidates[0] || "";
  if (!chosen) return chosen;
  if (!looksTruncatedMeta(chosen) && visibleLength(chosen) >= 80) {
    if (visibleLength(chosen) <= META_DESCRIPTION_MAX) return chosen;
    return fitMetaDescription(chosen);
  }
  return fitMetaDescription(chosen);
}

export function setMetaContent(html, name, value) {
  const escaped = escapeAttr(value);
  const want = String(name).toLowerCase();
  return String(html).replace(/<meta\b[^>]*>/gi, (tag) => {
    const key = (
      extractQuotedAttr(tag, "name") ||
      extractQuotedAttr(tag, "property") ||
      ""
    ).toLowerCase();
    if (key !== want) return tag;
    if (/\scontent\s*=/i.test(tag)) {
      return tag.replace(/\scontent\s*=\s*(["'])[\s\S]*?\1/i, () => ` content="${escaped}"`);
    }
    return tag.replace(/<meta\b/i, `<meta content="${escaped}"`);
  });
}

export function sameSeoText(a, b) {
  return normalizeMetaText(a) === normalizeMetaText(b);
}
