import { createHmac, timingSafeEqual } from "node:crypto";

function signature(value, secret) {
    return createHmac("sha256", secret).update(value).digest("hex");
}

export function makeCaptureToken(orderId, secret, walletOrder) {
    if (!walletOrder) return signature(orderId, secret);
    const encoded = Buffer.from(JSON.stringify({ version: 1, orderId, walletOrder })).toString("base64url");
    return `v1.${encoded}.${signature(encoded, secret)}`;
}

export function verifyCaptureToken(orderId, token, secret) {
    if (typeof token !== "string" || token.length > 8192) return null;
    const parts = token.split(".");
    if (parts.length === 1 && /^[a-f0-9]{64}$/i.test(token)) {
        const expected = Buffer.from(signature(orderId, secret), "hex");
        const received = Buffer.from(token, "hex");
        return timingSafeEqual(received, expected) ? { walletOrder: null } : null;
    }
    if (parts.length !== 3 || parts[0] !== "v1" || !/^[A-Za-z0-9_-]+$/.test(parts[1]) || !/^[a-f0-9]{64}$/i.test(parts[2])) return null;
    const expected = Buffer.from(signature(parts[1], secret), "hex");
    const received = Buffer.from(parts[2], "hex");
    if (!timingSafeEqual(received, expected)) return null;
    try {
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
        if (payload.version !== 1 || payload.orderId !== orderId || !payload.walletOrder?.purchase_units?.[0]?.shipping?.address) return null;
        return { walletOrder: payload.walletOrder };
    } catch {
        return null;
    }
}
