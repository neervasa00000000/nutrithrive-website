// Shipping Rates Configuration
// Based on location (Zone) and package size/weight
// Rates from shipping_rates.xlsx

const SHIPPING_RATES = {
    // Zone 1 - Australia
    'AU': {
        name: 'Australia',
        zone: 1,
        freeShippingThreshold: 80, // Free shipping over $80
        rates: {
            'Extra Small': { weight: '250g', cost: 8.73 },
            'Small': { weight: '500g', cost: 10.04 },
            'Medium': { weight: '1kg', cost: 13.73 },
            'Large': { weight: '3kg', cost: 17.37 },
            'Extra Large': { weight: '5kg', cost: 20.97 }
        }
    },
    // Zone 2 - New Zealand
    'NZ': {
        name: 'New Zealand',
        zone: 2,
        freeShippingThreshold: null,
        rates: {
            'Extra Small': { weight: '250g', cost: 9.22 },
            'Small': { weight: '500g', cost: 10.59 },
            'Medium': { weight: '1kg', cost: 14.49 },
            'Large': { weight: '3kg', cost: 18.34 },
            'Extra Large': { weight: '5kg', cost: 22.14 }
        }
    },
    // Zone 3 - International (US, UK, Canada, Other)
    'US': {
        name: 'United States',
        zone: 3,
        freeShippingThreshold: null,
        rates: {
            'Extra Small': { weight: '250g', cost: 9.70 },
            'Small': { weight: '500g', cost: 11.15 },
            'Medium': { weight: '1kg', cost: 15.25 },
            'Large': { weight: '3kg', cost: 19.30 },
            'Extra Large': { weight: '5kg', cost: 23.30 }
        }
    },
    'GB': {
        name: 'United Kingdom',
        zone: 3,
        freeShippingThreshold: null,
        rates: {
            'Extra Small': { weight: '250g', cost: 9.70 },
            'Small': { weight: '500g', cost: 11.15 },
            'Medium': { weight: '1kg', cost: 15.25 },
            'Large': { weight: '3kg', cost: 19.30 },
            'Extra Large': { weight: '5kg', cost: 23.30 }
        }
    },
    'CA': {
        name: 'Canada',
        zone: 3,
        freeShippingThreshold: null,
        rates: {
            'Extra Small': { weight: '250g', cost: 9.70 },
            'Small': { weight: '500g', cost: 11.15 },
            'Medium': { weight: '1kg', cost: 15.25 },
            'Large': { weight: '3kg', cost: 19.30 },
            'Extra Large': { weight: '5kg', cost: 23.30 }
        }
    },
    'OTHER': {
        name: 'Other Countries',
        zone: 3,
        freeShippingThreshold: null,
        rates: {
            'Extra Small': { weight: '250g', cost: 9.70 },
            'Small': { weight: '500g', cost: 11.15 },
            'Medium': { weight: '1kg', cost: 15.25 },
            'Large': { weight: '3kg', cost: 19.30 },
            'Extra Large': { weight: '5kg', cost: 23.30 }
        }
    }
};

// Map total weight in grams to package size
function getPackageSize(totalWeightGrams) {
    if (totalWeightGrams <= 250) {
        return 'Extra Small';
    } else if (totalWeightGrams <= 500) {
        return 'Small';
    } else if (totalWeightGrams <= 1000) {
        return 'Medium';
    } else if (totalWeightGrams <= 3000) {
        return 'Large';
    } else {
        return 'Extra Large';
    }
}

// Calculate shipping cost based on country and actual cart items weight
function calculateShipping(countryCode, cartItems, subtotal) {
    if (!countryCode) {
        return null; // Country not selected
    }
    
    // Get shipping rates for the country, or use OTHER as default
    const countryRates = SHIPPING_RATES[countryCode] || SHIPPING_RATES['OTHER'];
    
    // Check for free shipping threshold
    if (countryRates.freeShippingThreshold && subtotal >= countryRates.freeShippingThreshold) {
        return 0;
    }
    
    // Calculate total weight from cart items
    let totalWeightGrams = 0;
    if (cartItems && Array.isArray(cartItems)) {
        cartItems.forEach(item => {
            const itemWeight = item.weight || 0; // Weight in grams per unit
            const quantity = parseInt(item.quantity || 1);
            totalWeightGrams += itemWeight * quantity;
        });
    }
    
    // If no weight data available, fallback to old method (quantity * 100g)
    if (totalWeightGrams === 0 && cartItems && cartItems.length > 0) {
        const totalQuantity = cartItems.reduce((sum, item) => sum + parseInt(item.quantity || 1), 0);
        totalWeightGrams = totalQuantity * 100; // Fallback estimate
    }
    
    // Determine package size based on actual total weight
    const packageSize = getPackageSize(totalWeightGrams);
    
    // Get the shipping cost for this package size
    const packageRate = countryRates.rates[packageSize];
    if (packageRate) {
        return packageRate.cost;
    }
    
    // Fallback to Extra Large if no match
    return countryRates.rates['Extra Large'].cost;
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
    rates: SHIPPING_RATES,
    getPackageSize: getPackageSize,
    // Keep old function for backward compatibility
    calculateOld: function(countryCode, totalQuantity, subtotal) {
        const estimatedWeight = totalQuantity * 100;
        const packageSize = getPackageSize(estimatedWeight);
        const countryRates = SHIPPING_RATES[countryCode] || SHIPPING_RATES['OTHER'];
        if (countryRates.freeShippingThreshold && subtotal >= countryRates.freeShippingThreshold) {
            return 0;
        }
        return countryRates.rates[packageSize]?.cost || countryRates.rates['Extra Large'].cost;
    }
};
