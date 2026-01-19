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

// Map product quantity to package size
// Assuming average product weight: ~100g per product
// This can be adjusted based on actual product weights
function getPackageSize(totalQuantity) {
    // Calculate approximate weight based on quantity
    // Adjust these thresholds based on your actual product weights
    const estimatedWeight = totalQuantity * 100; // grams (adjust multiplier as needed)
    
    if (estimatedWeight <= 250) {
        return 'Extra Small';
    } else if (estimatedWeight <= 500) {
        return 'Small';
    } else if (estimatedWeight <= 1000) {
        return 'Medium';
    } else if (estimatedWeight <= 3000) {
        return 'Large';
    } else {
        return 'Extra Large';
    }
}

// Map PayPal country codes to our shipping zones
function mapCountryToZone(countryCode) {
    if (!countryCode) return 'OTHER';
    
    // Convert to uppercase for consistency
    const code = countryCode.toUpperCase();
    
    // Zone 1 - Australia
    if (code === 'AU') return 'AU';
    
    // Zone 2 - New Zealand
    if (code === 'NZ') return 'NZ';
    
    // Zone 3 - US, UK, Canada (these are already in our rates)
    if (code === 'US' || code === 'GB' || code === 'CA') return code;
    
    // All other countries use Zone 3 rates
    return 'OTHER';
}

// Calculate shipping cost based on country and total quantity
function calculateShipping(countryCode, totalQuantity, subtotal) {
    if (!countryCode) {
        return null; // Country not selected
    }
    
    // Map country code to our zone
    const mappedCountry = mapCountryToZone(countryCode);
    
    // Get shipping rates for the country, or use OTHER as default
    const countryRates = SHIPPING_RATES[mappedCountry] || SHIPPING_RATES['OTHER'];
    
    // Check for free shipping threshold
    if (countryRates.freeShippingThreshold && subtotal >= countryRates.freeShippingThreshold) {
        return 0;
    }
    
    // Determine package size based on quantity
    const packageSize = getPackageSize(totalQuantity);
    
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
    getPackageSize: getPackageSize
};
