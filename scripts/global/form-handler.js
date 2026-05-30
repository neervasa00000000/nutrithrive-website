/**
 * Sends contact + newsletter forms via /.netlify/functions/send-form
 * Falls back to Netlify Forms (POST /) when the function is not configured.
 */
(function () {
    "use strict";

    if (window.__NT_FORM_HANDLER_INITIALIZED__) return;
    window.__NT_FORM_HANDLER_INITIALIZED__ = true;

    const SEND_URL = "/.netlify/functions/send-form";
    const FORMSELECTOR =
        'form[action*="formsubmit.co"], form[data-nt-email-form], form[name="contact"], form[name="newsletter"]';

    function thankYouUrl(form) {
        const next = form.querySelector('input[name="_next"]');
        if (next && next.value) return next.value;
        const name = (form.getAttribute("name") || "").toLowerCase();
        if (name === "newsletter") return "/pages/newsletter/thank-you.html";
        return "/pages/contact/thank-you.html";
    }

    function formTypeFrom(form) {
        const explicit = form.getAttribute("data-nt-form-type");
        if (explicit) return explicit;
        const name = (form.getAttribute("name") || "").toLowerCase();
        if (name === "newsletter" || form.classList.contains("newsletter-form")) return "newsletter";
        if (name === "contact" || form.classList.contains("contact-form")) return "contact";
        const subject = form.querySelector('input[name="_subject"]');
        if (subject && /newsletter/i.test(subject.value || "")) return "newsletter";
        return "contact";
    }

    function setBusy(form, busy) {
        const btn = form.querySelector('[type="submit"], button:not([type="button"])');
        if (!btn) return;
        if (busy) {
            btn.dataset.ntPrevText = btn.textContent;
            btn.disabled = true;
            btn.textContent = "Sending…";
        } else {
            btn.disabled = false;
            if (btn.dataset.ntPrevText) btn.textContent = btn.dataset.ntPrevText;
        }
    }

    function showInlineError(form, message) {
        const box =
            form.querySelector(".newsletter-message") ||
            form.querySelector(".newsletter-popup-message") ||
            form.querySelector(".form-error");
        if (!box) {
            alert(message);
            return;
        }
        box.textContent = message;
        box.style.color = "#b42318";
        box.style.marginTop = "0.75rem";
    }

    async function submitNetlifyForm(form) {
        const fd = new FormData(form);
        const formName = form.getAttribute("name") || formTypeFrom(form);
        if (!fd.get("form-name")) fd.set("form-name", formName);

        const res = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(fd).toString(),
        });

        if (!res.ok) throw new Error("Netlify form submission failed");
        window.location.href = thankYouUrl(form);
    }

    async function submitEmailForm(form) {
        const fd = new FormData(form);
        const payload = {
            formType: formTypeFrom(form),
            name: fd.get("name") || "",
            email: fd.get("email") || "",
            subject: fd.get("subject") || fd.get("_subject") || "",
            message: fd.get("message") || "",
            pageUrl: window.location.href,
        };

        setBusy(form, true);

        try {
            const res = await fetch(SEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok && data.ok) {
                window.location.href = thankYouUrl(form);
                return;
            }

            if (res.status === 503 && data.fallback === "netlify-forms" && form.hasAttribute("data-netlify")) {
                await submitNetlifyForm(form);
                return;
            }

            throw new Error(data.error || data.detail || "Could not send your message. Please try again or call 0438 201 419.");
        } catch (err) {
            if (form.hasAttribute("data-netlify")) {
                try {
                    await submitNetlifyForm(form);
                    return;
                } catch {
                    /* fall through */
                }
            }
            showInlineError(form, err.message || "Something went wrong. Please email nutrithrive0@gmail.com directly.");
        } finally {
            setBusy(form, false);
        }
    }

    function bindForm(form) {
        if (!form || form.dataset.ntEmailBound) return;
        form.dataset.ntEmailBound = "1";
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            submitEmailForm(form);
        });
    }

    function scan() {
        document.querySelectorAll(FORMSELECTOR).forEach(bindForm);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scan);
    } else {
        scan();
    }

    document.addEventListener("DOMContentLoaded", () => {
        const observer = new MutationObserver(scan);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
