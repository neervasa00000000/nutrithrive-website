// PayPal Integration - Expanded Checkout
// This file handles both PayPal buttons and Card Fields

// Product configuration
const PRODUCT_PRICE = 10.00;
const PRODUCT_ID = "MORINGA_POWDER_200G";
const PRODUCT_NAME = "Moringa Powder";
const PRODUCT_DESCRIPTION = "100% pure Moringa Oleifera leaf powder";

// Get quantity from input
function getQuantity() {
    const quantityInput = document.getElementById('product-quantity');
    return parseInt(quantityInput?.value) || 1;
}

// Calculate total amount
function calculateTotal() {
    const quantity = getQuantity();
    return (PRODUCT_PRICE * quantity).toFixed(2);
}

// Create Order Callback - Called when user clicks PayPal button or submits card
async function createOrderCallback() {
    resultMessage("");
    
    try {
        const quantity = getQuantity();
        const total = calculateTotal();
        
        const response = await fetch("/.netlify/functions/create-order-tt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart: [
                    {
                        id: PRODUCT_ID,
                        quantity: quantity.toString(),
                        name: PRODUCT_NAME,
                        description: PRODUCT_DESCRIPTION,
                        unit_amount: PRODUCT_PRICE.toFixed(2),
                        total: total
                    },
                ],
            }),
        });

        const orderData = await response.json();

        if (orderData.id) {
            console.log("Order created:", orderData.id);
            return orderData.id;
        } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Create order error:", error);
        resultMessage(`Could not initiate PayPal Checkout...<br><br>${error.message}`, true);
        throw error;
    }
}

// On Approve Callback - Called after payment is approved
async function onApproveCallback(data, actions) {
    try {
        const response = await fetch(`/.netlify/functions/capture-order-tt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID
            }),
        });

        const orderData = await response.json();
        
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show confirmation or thank you message

        const transaction =
            orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
            orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
        const errorDetail = orderData?.details?.[0];

        // Handle INSTRUMENT_DECLINED error
        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // Restart the payment flow
            return actions.restart();
        } else if (errorDetail || !transaction || transaction.status === "DECLINED") {
            // (2) Other non-recoverable errors -> Show a failure message
            let errorMessage;
            if (transaction) {
                errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
            } else if (errorDetail) {
                errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
            } else {
                errorMessage = JSON.stringify(orderData);
            }

            throw new Error(errorMessage);
        } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            resultMessage(
                `✅ Payment Successful!<br><br>Transaction ID: ${transaction.id}<br>Status: ${transaction.status}<br><br>Thank you for your purchase!`
            );
            console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
        }
    } catch (error) {
        console.error("Capture error:", error);
        resultMessage(
            `Sorry, your transaction could not be processed...<br><br>${error.message}`,
            true
        );
    }
}

// Error Handler
function onErrorCallback(error) {
    console.error("PayPal SDK error:", error);
    resultMessage(`An error occurred with PayPal. Please try again or contact support.<br><br>Error: ${error.message}`, true);
}

// Result Message Display
function resultMessage(message, isError = false) {
    const container = document.querySelector("#result-message");
    if (container) {
        container.innerHTML = message;
        container.className = isError ? "error-message" : "";
    }
}

// Wait for PayPal SDK to load
function initializePayPal() {
    if (typeof paypal === 'undefined') {
        console.error("PayPal SDK not loaded");
        resultMessage("PayPal SDK failed to load. Please refresh the page.", true);
        return;
    }
    
    try {
        // Render PayPal Buttons
        paypal
            .Buttons({
                createOrder: createOrderCallback,
                onApprove: onApproveCallback,
                onError: onErrorCallback,
                style: {
                    shape: "rect",
                    layout: "vertical",
                    color: "gold",
                    label: "paypal",
                },
            })
            .render("#paypal-button-container");

        // Render Card Fields
        const cardField = window.paypal.CardFields({
            createOrder: createOrderCallback,
            onApprove: onApproveCallback,
            style: {
                input: {
                    "font-size": "16px",
                    "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    "font-weight": "normal",
                    color: "#1a2e22",
                },
                ".invalid": { 
                    color: "#c62828",
                    border: "2px solid #c62828"
                },
            },
        });

        if (cardField.isEligible()) {
            // Render Card Name Field
            const nameField = cardField.NameField({
                style: { 
                    input: { color: "#1a2e22" }, 
                    ".invalid": { color: "#c62828" } 
                },
            });
            nameField.render("#card-name-field-container");

            // Render Card Number Field
            const numberField = cardField.NumberField({
                style: { input: { color: "#1a2e22" } },
            });
            numberField.render("#card-number-field-container");

            // Render CVV Field
            const cvvField = cardField.CVVField({
                style: { input: { color: "#1a2e22" } },
            });
            cvvField.render("#card-cvv-field-container");

            // Render Expiry Field
            const expiryField = cardField.ExpiryField({
                style: { input: { color: "#1a2e22" } },
            });
            expiryField.render("#card-expiry-field-container");

            // Add click listener to submit button - use event delegation for reliability
            const submitButton = document.getElementById("card-field-submit-button");
            if (submitButton) {
                // Remove any existing listeners first
                const newButton = submitButton.cloneNode(true);
                submitButton.parentNode.replaceChild(newButton, submitButton);
                
                newButton.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log("Card submit button clicked");
                    
                    // Validate billing address fields
                    const addressLine1 = document.getElementById("card-billing-address-line-1")?.value?.trim();
                    const adminArea1 = document.getElementById("card-billing-address-admin-area-line-1")?.value?.trim();
                    const countryCode = document.getElementById("card-billing-address-country-code")?.value?.trim();
                    const postalCode = document.getElementById("card-billing-address-postal-code")?.value?.trim();
                    
                    if (!addressLine1 || !adminArea1 || !countryCode || !postalCode) {
                        resultMessage("Please fill in all required billing address fields.", true);
                        return;
                    }
                    
                    // Disable button during processing
                    newButton.disabled = true;
                    newButton.textContent = "Processing...";
                    
                    console.log("Submitting card payment...");
                    resultMessage("Processing payment...", false);
                    
                    cardField
                        .submit({
                            billingAddress: {
                                addressLine1: addressLine1,
                                addressLine2: document.getElementById("card-billing-address-line-2")?.value?.trim() || "",
                                adminArea1: adminArea1,
                                adminArea2: document.getElementById("card-billing-address-admin-area-line-2")?.value?.trim() || "",
                                countryCode: countryCode,
                                postalCode: postalCode,
                            },
                        })
                        .then(() => {
                            console.log("Card field submit successful");
                        })
                        .catch((error) => {
                            console.error("Card field submit error:", error);
                            resultMessage(`Card payment error: ${error.message}`, true);
                            // Re-enable button on error
                            newButton.disabled = false;
                            newButton.textContent = "Pay now with Card";
                        });
                });
                
                console.log("Card submit button handler attached");
            } else {
                console.error("Card submit button not found - retrying in 500ms");
                setTimeout(() => {
                    const retryButton = document.getElementById("card-field-submit-button");
                    if (retryButton) {
                        console.log("Found button on retry");
                        // Re-run the button setup
                        location.reload();
                    }
                }, 500);
            }
        } else {
            // Card fields not eligible - hide the card form
            const cardForm = document.getElementById("card-form");
            if (cardForm) {
                cardForm.style.display = "none";
            }
        }
    } catch (error) {
        console.error("PayPal initialization error:", error);
        resultMessage(`PayPal initialization error: ${error.message}. Please refresh the page.`, true);
    }
}

// Wait for DOM and PayPal SDK to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for PayPal SDK to load
        setTimeout(initializePayPal, 100);
    });
} else {
    // DOM already loaded, wait for PayPal SDK
    if (typeof paypal !== 'undefined') {
        initializePayPal();
    } else {
        // Wait for PayPal SDK to load
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        const checkPayPal = setInterval(function() {
            attempts++;
            if (typeof paypal !== 'undefined') {
                clearInterval(checkPayPal);
                initializePayPal();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkPayPal);
                resultMessage("PayPal SDK failed to load. Please check your internet connection and refresh the page.", true);
            }
        }, 100);
    }
}
