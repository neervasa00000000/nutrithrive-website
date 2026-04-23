// Tracks recently viewed products for cart recommendations.
(function () {
    const STORAGE_KEY = 'nutrithrive_recently_viewed';
    const MAX_ITEMS = 12;

    function safeString(value, maxLen) {
        const s = String(value || '').trim();
        return s.slice(0, maxLen);
    }

    function safePrice(value) {
        const n = Number.parseFloat(value);
        if (!Number.isFinite(n) || n < 0 || n > 100000) return null;
        return Number(n.toFixed(2));
    }

    function safePath(value) {
        const v = safeString(value, 300);
        if (!v) return '';
        if (v.startsWith('/')) return v;
        if (/^https:\/\/nutrithrive\.com\.au\//i.test(v)) {
            try {
                const u = new URL(v);
                return u.pathname + (u.search || '');
            } catch (e) {
                return '';
            }
        }
        return '';
    }

    function safeImage(value) {
        const v = safeString(value, 400);
        if (!v) return '';
        if (v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) return v;
        if (/^https:\/\//i.test(v)) return v;
        return '';
    }

    function readList() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(function (item) {
                return item && typeof item === 'object' && safeString(item.id, 60);
            });
        } catch (e) {
            return [];
        }
    }

    function writeList(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
        } catch (e) {
            // noop
        }
    }

    function track(product) {
        if (!product) return;

        const id = safeString(product.id, 60);
        const name = safeString(product.name, 120);
        const price = safePrice(product.price);
        const url = safePath(product.url || window.location.pathname);
        const image = safeImage(product.image);
        if (!id || !name || price === null || !url) return;

        const entry = {
            id: id,
            name: name,
            price: price,
            url: url,
            image: image,
            viewedAt: Date.now()
        };

        const current = readList().filter(function (item) {
            return item.id !== id;
        });
        current.unshift(entry);
        writeList(current);
    }

    function getAll() {
        return readList();
    }

    window.RecentlyViewed = {
        track: track,
        getAll: getAll
    };
})();
