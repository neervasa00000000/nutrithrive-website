/**
 * Loads the PayPal JS SDK once. The client id comes from paypal-client-config.js.
 * @param {Record<string, string>|string} [params] - Extra query params, e.g. { currency: "AUD", components: "buttons" }.
 * @returns {Promise<void>}
 */
(function (global) {
    "use strict";

    function getClientId() {
        return String(global.NUTRITHRIVE_PAYPAL_CLIENT_ID || "").trim();
    }

    function applyParams(sp, input) {
        if (!input) return;
        if (typeof input === "string") {
            new URLSearchParams(input.replace(/^\?/, "")).forEach(function (v, k) {
                sp.set(k, v);
            });
        } else if (typeof input === "object" && input !== null) {
            Object.keys(input).forEach(function (k) {
                if (input[k] == null || input[k] === "") return;
                sp.set(k, String(input[k]));
            });
        }
    }

    function buildUrl(params) {
        var id = getClientId();
        if (!id) return null;
        var sp = new URLSearchParams();
        sp.set("client-id", id);
        applyParams(sp, params);
        return "https://www.paypal.com/sdk/js?" + sp.toString();
    }

    function findScriptWithUrl(url) {
        var list = document.querySelectorAll('script[src*="www.paypal.com/sdk/js"]');
        for (var i = 0; i < list.length; i++) {
            if (list[i].src === url) return list[i];
        }
        return null;
    }

    global.ntLoadPayPalSdk = function (params) {
        var url = buildUrl(params);
        if (!url) {
            return Promise.reject(new Error("NUTRITHRIVE_PAYPAL_CLIENT_ID is not set"));
        }
        if (global.paypal && global.paypal.version) {
            return Promise.resolve();
        }
        var existing = findScriptWithUrl(url);
        if (existing) {
            return new Promise(function (resolve, reject) {
                if (global.paypal && global.paypal.version) {
                    resolve();
                    return;
                }
                function onLoad() {
                    existing.removeEventListener("load", onLoad);
                    existing.removeEventListener("error", onErr);
                    resolve();
                }
                function onErr() {
                    existing.removeEventListener("load", onLoad);
                    existing.removeEventListener("error", onErr);
                    reject(new Error("PayPal SDK failed to load"));
                }
                existing.addEventListener("load", onLoad);
                existing.addEventListener("error", onErr);
            });
        }
        return new Promise(function (resolve, reject) {
            var s = document.createElement("script");
            s.src = url;
            s.async = true;
            s.setAttribute("data-nt-paypal-sdk", "1");
            s.onload = function () {
                resolve();
            };
            s.onerror = function () {
                reject(new Error("Failed to load PayPal SDK"));
            };
            (document.head || document.documentElement).appendChild(s);
        });
    };
})(typeof window !== "undefined" ? window : this);
