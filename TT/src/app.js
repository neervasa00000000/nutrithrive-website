// PayPal Integration with Card Fields
// Based on PayPal official documentation

// Product configuration
const PRODUCT_PRICE = 10.00;

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

// Create Order Callback - Used by both PayPal buttons and card fields
async function createOrderCallback() {
    resultMessage("");
    try {
        const quantity = getQuantity();
        const amount = calculateTotal();
        
        const response = await fetch("/.netlify/functions/paypal-create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: amount,
                cart: [
                    {
                        id: "MORINGA_POWDER_200G",
                        quantity: quantity.toString(),
                    },
                ],
            }),
        });

        const orderData = await response.json();

        if (orderData.id) {
            return orderData.id;
        } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error(error);
        resultMessage(`Could not initiate PayPal Checkout...<br><br>${error.message || error}`);
        throw error;
    }
}

// On Approve Callback - Used by both PayPal buttons and card fields
async function onApproveCallback(data, actions) {
    try {
        const response = await fetch(`/.netlify/functions/paypal-capture-order`, {
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
        if (errorDetail?.issue === "INSTRUMENT_DECLINED" && actions && actions.restart) {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
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
            console.log(
                "Capture result",
                orderData,
                JSON.stringify(orderData, null, 2)
            );
        }
    } catch (error) {
        console.error(error);
        resultMessage(
            `Sorry, your transaction could not be processed...<br><br>${error.message || error}`
        );
    }
}

// Result Message Display
function resultMessage(message) {
    const container = document.querySelector("#result-message");
    if (container) {
        container.innerHTML = message;
        container.className = message.includes("✅") ? "" : "error-message";
    }
}

// Wait for PayPal SDK to load
function initializePayPal() {
    if (typeof paypal === 'undefined') {
        setTimeout(initializePayPal, 100);
        return;
    }

    console.log("PayPal SDK loaded, initializing...");

    // Render PayPal Buttons
    paypal
        .Buttons({
            createOrder: createOrderCallback,
            onApprove: onApproveCallback,
            onError: function (error) {
                console.error("PayPal button error:", error);
                resultMessage(`An error occurred with PayPal. Please try again.<br><br>${error.message || error}`);
            },
            style: {
                shape: "rect",
                layout: "vertical",
                color: "gold",
                label: "paypal",
            },
        })
        .render("#paypal-button-container");

    // Render Card Fields - check if available
    if (!window.paypal.CardFields) {
        console.warn("CardFields not available - your account may need approval");
        const cardForm = document.getElementById("card-form");
        if (cardForm) {
            cardForm.innerHTML = '<p style="color: #c62828; padding: 1rem;">Card payment is not available. Your PayPal account needs to be approved for "Expanded Credit and Debit Card Payments". Please use the PayPal button above.</p>';
        }
        return;
    }

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

        // Add click listener to submit button
        const submitButton = document.getElementById("card-field-submit-button");
        if (submitButton) {
            // Remove any existing listeners by cloning the button
            const newButton = submitButton.cloneNode(true);
            submitButton.parentNode.replaceChild(newButton, submitButton);
            
            newButton.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log("Card submit button clicked");
                
                // Validate required fields
                const addressLine1 = document.getElementById("card-billing-address-line-1")?.value?.trim();
                const adminArea1 = document.getElementById("card-billing-address-admin-area-line-1")?.value?.trim();
                const countryCode = document.getElementById("card-billing-address-country-code")?.value?.trim();
                const postalCode = document.getElementById("card-billing-address-postal-code")?.value?.trim();
                
                if (!addressLine1 || !adminArea1 || !countryCode || !postalCode) {
                    resultMessage("Please fill in all required billing address fields.");
                    return;
                }
                
                // Disable button during processing
                newButton.disabled = true;
                newButton.textContent = "Processing...";
                
                console.log("Submitting card payment with billing address...");
                resultMessage("Processing payment...");
                
                cardField
                    .submit({
                        // From your billing address fields
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
                        resultMessage(`Card payment error: ${error.message || error}`);
                        // Re-enable button on error
                        newButton.disabled = false;
                        newButton.textContent = "Pay now with Card";
                    });
            });
            
            console.log("Card submit button handler attached successfully");
        } else {
            console.error("Card submit button not found");
        }
    } else {
        // Card fields not eligible - hide the card form
        console.warn("Card fields not eligible for this account");
        const cardForm = document.getElementById("card-form");
        if (cardForm) {
            cardForm.innerHTML = '<p style="color: #c62828; padding: 1rem;">Card payment is not available. Please use the PayPal button above.</p>';
        }
    }
}

// Start initialization when SDK is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePayPal);
} else {
    initializePayPal();
}
