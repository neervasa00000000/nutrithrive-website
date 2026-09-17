# Crawler access audit

Date: 15 September 2026  
Scope: Bing, DuckDuckGo and Anthropic/Claude.  
Mode: read-only. No crawler rules were changed.

## Current robots state

The repository’s `site/robots.txt`:

- allows public crawling under `User-agent: *`;
- explicitly allows `Bingbot`;
- explicitly allows `DuckDuckBot`;
- declares `https://nutrithrive.com.au/sitemap.xml`;
- disallows private/development paths while allowing the public lab-report PDF;
- names `Claude-Web` and `anthropic-ai`, which are not the current crawler names documented by Anthropic.

Live fetching of the text file was blocked by the audit browser’s client controls, so CDN-delivered content and headers require manual verification with Bing Webmaster Tools or an external HTTP checker. The built file is internally consistent with the deployed HTML inspected.

## Purpose-separated status

| System/agent | Purpose | Explicit rule | Effective robots state | Risk | Recommendation |
|---|---|---|---|---|---|
| Bingbot | Search crawling/indexing | `Allow: /` | Allowed | Low | Keep allowed; verify in Bing URL Inspection |
| DuckDuckBot | DuckDuckGo crawl/index contribution | `Allow: /` | Allowed | Low | Keep allowed |
| Claude-SearchBot | Anthropic search discovery/result quality | No matching explicit group | Allowed by `User-agent: *` | Medium: policy is unclear | If founder approves, explicitly allow and monitor logs |
| Claude-User | User-directed retrieval | No matching explicit group | Allowed by `User-agent: *` | Medium: policy is unclear | If founder approves, explicitly allow so users can retrieve pages |
| ClaudeBot | Training/model development | No matching explicit group | Allowed by `User-agent: *` | Privacy/policy decision | Do not auto-allow or auto-block; founder must choose deliberately |
| `Claude-Web` | Obsolete/undocumented name in current file | `Allow: /` | Rule may match no current Anthropic crawler | Misleading configuration | Remove only as part of an approved policy change |
| `anthropic-ai` | Obsolete/undocumented name in current file | `Allow: /` | Rule may match no current Anthropic crawler | Misleading configuration | Remove only as part of an approved policy change |

## Search discovery

### Bing

Status: technically open.

- Sitemap is declared.
- 151 sitemap URLs match local canonical/source checks.
- No Bing verification marker was found in the repository.
- DNS/CNAME verification may still exist and is **MANUAL ACCOUNT CHECK REQUIRED**.
- No IndexNow key or submission code was found.

### DuckDuckGo

Status: technically open.

DuckDuckGo documents that traditional links and images are largely sourced from Bing while it also maintains DuckDuckBot. Therefore the practical levers are Bing index health, public crawlability, consistent canonical/sitemap signals, and natural external links. No separate submission implementation is recommended from the evidence reviewed.

### Claude search

Status: allowed by the generic rule, not intentionally configured.

Explicitly naming `Claude-SearchBot` would make the policy unambiguous. This is not a ranking technique and does not guarantee a citation. It only removes a preventable access ambiguity.

## User-directed retrieval

`Claude-User` is allowed by the generic rule. Anthropic says blocking it can stop Claude from fetching pages at a user’s request. If NutriThrive wants customers to ask Claude about a supplied product/blog URL, an explicit allow is the clearest approved policy.

## Training

`ClaudeBot` is allowed by the generic rule. Training access is distinct from search and user retrieval. The audit does **not** recommend enabling training for visibility, and no training-policy change was made. Founder approval is required after considering content licensing, privacy, commercial preference and enforcement at CDN/WAF layers.

## CDN, WAF and server caveats

Robots is advisory. Access can also be affected by:

- Netlify/CDN bot controls;
- Cloudflare or another WAF if present upstream;
- IP/rate limiting;
- HTTP status and headers;
- JavaScript challenges;
- authentication;
- unavailable assets.

No explicit bot-blocking rule was found in `netlify.toml`, but account-level settings and server logs were unavailable. This is **MANUAL ACCOUNT CHECK REQUIRED**.

## Bing verification and IndexNow

Repository evidence:

- `BingSiteAuth.xml`: not found.
- `msvalidate.01`: not found.
- IndexNow key file/integration: not found.

This does not prove the site is unverified because Bing supports DNS/CNAME verification. Check the account before adding anything.

If verification exists, the safe IndexNow pilot is:

1. Generate an IndexNow key.
2. Host the UTF-8 key file at the root or declare a correct `keyLocation`.
3. Submit only canonical URLs that were added, updated or deleted.
4. Confirm submissions in Bing Webmaster Tools.
5. Monitor crawl/index outcomes; stop if routing or canonical errors appear.

IndexNow is a change-notification protocol. Bing explicitly says submission does not guarantee crawling or indexing.

## `llms.txt`

`site/llms.txt` exists and pages advertise it. No authoritative Anthropic documentation reviewed here says it affects Claude ranking or citation selection. Treat it as optional documentation, not a crawler-control mechanism and not a substitute for robots, sitemap, internal links or source quality.

## Recommended policy change (not implemented)

After founder approval, a purpose-aware Anthropic policy could explicitly address the three current agents. The preferred default for discovery is to allow `Claude-SearchBot` and `Claude-User`. `ClaudeBot` must be a separate affirmative business decision. Verify exact syntax against the current Anthropic documentation immediately before changing production.

## Authoritative sources

- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Bing IndexNow setup](https://www.bing.com/indexnow/getstarted)
- [Bing site verification](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b)
- [DuckDuckGo result sources](https://duckduckgo.com/duckduckgo-help-pages/results/sources)
- [Anthropic crawler documentation](https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Claude web search](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)
