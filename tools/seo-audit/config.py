"""Site-specific tuning for NutriThrive SEO audits."""

from pathlib import Path

# Paths intentionally allowed to have fewer than 500 words.
THIN_CONTENT_EXCLUDE = {
    "/",
    "/about",
    "/contact",
    "/faq",
    "/cart",
    "/payment",
    "/privacy-policy",
    "/pages/shop/cart.html",
    "/pages/shop/payment.html",
    "/pages/shop/thank-you.html",
    "/pages/legal/privacy-policy.html",
    "/pages/contact/contact.html",
    "/pages/faq/faq.html",
    "/products/",
    "/products/moringa-powder/",
    "/products/black-tea/",
    "/products/curry-leaves/",
    "/products/combo-pack/",
    "/products/moringa-soap/",
    "/blog/",
    "/moringa-sydney/",
    "/moringa-brisbane/",
    "/moringa-perth/",
    "/moringa-adelaide/",
    "/melbourne",
    "/pages/homepage/melbourne.html",
}

TITLE_MIN = 50
TITLE_MAX = 60
DESC_MIN = 140
DESC_MAX = 160
MIN_WORD_COUNT = 500
CRAWL_MAX_DEPTH = 5
REQUEST_DELAY_SECONDS = 0.75
FRESHNESS_DAYS = 90
SIMILAR_DESC_THRESHOLD = 0.80

BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

DEFAULT_REDIRECTS_FILE = Path(__file__).resolve().parents[2] / "_redirects"
OUTPUT_DIR = Path(__file__).resolve().parent / "output"

# Checkout/cart paths are intentionally noindexed — exclude from zombie redirect checks.
NOINDEX_CHECK_EXCLUDE_PREFIXES = (
    "/cart",
    "/payment",
    "/checkout",
    "/pages/shop/",
)

CRITICAL_FLAG_PREFIXES = (
    "noindex_without_redirect",
    "broken_internal_link",
    "missing_title",
    "missing_meta_description",
    "robots_blocked_in_sitemap",
    "googlebot_cloaking",
)
