// Shipping Rates Configuration
// Based on location and product quantity

const SHIPPING_RATES = {
    // Australia - Free shipping over $80, otherwise based on quantity
    'AU': {
        name: 'Australia',
        freeShippingThreshold: 80,
        rates: [
            { minQuantity: 1, maxQuantity: 2, cost: 10.00 },
            { minQuantity: 3, maxQuantity: 5, cost: 15.00 },
            { minQuantity: 6, maxQuantity: 10, cost: 20.00 },
            { minQuantity: 11, maxQuantity: null, cost: 25.00 }
        ]
    },
    // New Zealand
    'NZ': {
        name: 'New Zealand',
        freeShippingThreshold: null,
        rates: [
            { minQuantity: 1, maxQuantity: 2, cost: 15.00 },
            { minQuantity: 3, maxQuantity: 5, cost: 25.00 },
            { minQuantity: 6, maxQuantity: 10, cost: 35.00 },
            { minQuantity: 11, maxQuantity: null, cost: 45.00 }
        ]
    },
    // United States
    'US': {
        name: 'United States',
        freeShippingThreshold: null,
        rates: [
            { minQuantity: 1, maxQuantity: 2, cost: 20.00 },
            { minQuantity: 3, maxQuantity: 5, cost: 30.00 },
            { minQuantity: 6, maxQuantity: 10, cost: 40.00 },
            { minQuantity: 11, maxQuantity: null, cost: 50.00 }
        ]
    },
    // United Kingdom
    'GB': {
        name: 'United Kingdom',
        freeShippingThreshold: null,
        rates: [
            { minQuantity: 1, maxQuantity: 2, cost: 18.00 },
            { minQuantity: 3, maxQuantity: 5, cost: 28.00 },
            { minQuantity: 6, maxQuantity: 10, cost: 38.00 },
            { minQuantity: 11, maxQuantity: null, cost: 48.00 }
        ]
    },
    // Canada
    'CA': {
        name: 'Canada',
        freeShippingThreshold: null,
        rates: [
            { minQuantity: 1, maxQuantity: 2, cost: 22.00 },
            { minQuantity: 3, maxQuantity: 5, cost: 32.00 },
            { minQuantity: 6, maxQuantity: 10, cost: 42.00 },
            { minQuantity: 11, maxQuantity: null, cost: 52.00 }
        ]
    },
    // Other countries - default rates
    'OTHER': {
        name: 'Other Countries',
        freeShippingThreshold: null,
        rates: [
            { minQuantity: 1, maxQuantity: 2, cost: 25.00 },
            { minQuantity: 3, maxQuantity: 5, cost: 35.00 },
            { minQuantity: 6, maxQuantity: 10, cost: 45.00 },
            { minQuantity: 11, maxQuantity: null, cost: 55.00 }
        ]
    }
};

// Calculate shipping cost based on country and total quantity
function calculateShipping(countryCode, totalQuantity, subtotal) {
    if (!countryCode) {
        return null; // Country not selected
    }
    
    // Get shipping rates for the country, or use OTHER as default
    const countryRates = SHIPPING_RATES[countryCode] || SHIPPING_RATES['OTHER'];
    
    // Check for free shipping threshold
    if (countryRates.freeShippingThreshold && subtotal >= countryRates.freeShippingThreshold) {
        return 0;
    }
    
    // Find the appropriate rate based on quantity
    for (const rate of countryRates.rates) {
        if (totalQuantity >= rate.minQuantity) {
            if (rate.maxQuantity === null || totalQuantity <= rate.maxQuantity) {
                return rate.cost;
            }
        }
    }
    
    // If no rate matches, use the highest rate
    const lastRate = countryRates.rates[countryRates.rates.length - 1];
    return lastRate.cost;
}

// Get country name
function getCountryName(countryCode) {
    if (!countryCode) return '';
    const country = SHIPPING_RATES[countryCode] || SHIPPING_RATES['OTHER'];
    return country.name;
}

// Export for use in other scripts
window.ShippingRates = {
    calculate: calculateShipping,
    getCountryName: getCountryName,
    rates: SHIPPING_RATES
};
