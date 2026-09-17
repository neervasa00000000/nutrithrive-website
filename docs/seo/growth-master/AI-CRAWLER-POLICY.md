# AI crawler policy — verified 15 September 2026

| Provider | Agent | Purpose | Current effective access before | Desired access | Official source | Decision | Founder approval |
|---|---|---|---|---|---|---|---|
| OpenAI | OAI-SearchBot | SEARCH_DISCOVERY | Allowed by general rule | Allow | https://developers.openai.com/api/docs/bots | Added explicit allow | Not required; discovery objective approved |
| OpenAI | ChatGPT-User | USER_RETRIEVAL | Explicit allow; robots may not apply to user actions | Allow | https://developers.openai.com/api/docs/bots | Kept explicit allow | Not required |
| OpenAI | GPTBot | TRAINING | Explicit allow | Leave unchanged | https://developers.openai.com/api/docs/bots | Effective state unchanged | Separate decision for any future change |
| Anthropic | Claude-SearchBot | SEARCH_DISCOVERY | Allowed only by general rule | Allow | https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler | Added explicit allow | Not required; discovery objective approved |
| Anthropic | Claude-User | USER_RETRIEVAL | Allowed only by general rule | Allow | https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler | Added explicit allow | Not required |
| Anthropic | ClaudeBot | TRAINING | Allowed by general rule | Leave unchanged | https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler | No agent rule added; general-rule access remains | Required for future policy change |
| Anthropic | Claude-Web | OBSOLETE / UNDOCUMENTED CURRENTLY | Explicit allow | Remove obsolete name without changing current-agent policy | Anthropic source above documents only ClaudeBot, Claude-User and Claude-SearchBot | Removed | Not required |
| Anthropic | anthropic-ai | OBSOLETE / UNDOCUMENTED CURRENTLY | Explicit allow | Remove obsolete name without changing current-agent policy | Anthropic source above documents only ClaudeBot, Claude-User and Claude-SearchBot | Removed | Not required |
| Perplexity | PerplexityBot | SEARCH_DISCOVERY | Explicit allow | Allow | https://docs.perplexity.ai/docs/resources/perplexity-crawlers | Kept explicit allow | Not required |
| Perplexity | Perplexity-User | USER_RETRIEVAL | Allowed by general rule; vendor says user fetch generally ignores robots | Allow | https://docs.perplexity.ai/docs/resources/perplexity-crawlers | Added explicit allow for policy clarity | Not required |

Robots permission only creates eligibility. It does not guarantee crawling, indexing, citations, traffic or rankings. Account-level WAF/CDN access still requires manual verification.
