// Shipping Rates Configuration
// Based on color-coded tables from shipping_rates.xlsx
// GREEN = Australia, BLUE = International Key Destinations, YELLOW = International Other Destinations

// GREEN section - Australia (Domestic)
const GREEN_RATES = {
    'Up to 250g': { zone1: 8.73, zone2: 9.22, zone3: 9.70 },
    '251g-500g': { zone1: 10.04, zone2: 10.59, zone3: 11.15 },
    '501g-1kg': { zone1: 13.73, zone2: 14.49, zone3: 15.25 },
    '1.001kg-1.5kg': { zone1: 17.37, zone2: 18.34, zone3: 19.30 },
    '1.501kg-2kg': { zone1: 20.97, zone2: 22.14, zone3: 23.30 }
};

// BLUE section - International Key Destinations
const BLUE_RATES = {
    'Up to 250g': { zone1: 15.49, zone2: 18.95, zone3: 21.19, zone4: 26.13 },
    '251g-500g': { zone1: 18.67, zone2: 24.70, zone3: 27.55, zone4: 32.68 },
    '501g-1kg': { zone1: 25.08, zone2: 36.24, zone3: 40.09, zone4: 45.89 },
    '1.001kg-1.5kg': { zone1: 31.49, zone2: 47.79, zone3: 52.77, zone4: 59.04 },
    '1.501kg-2kg': { zone1: 37.91, zone2: 59.33, zone3: 65.41, zone4: 72.20 }
};

// YELLOW section - International Other Destinations
const YELLOW_RATES = {
    'Up to 250g': { zone2: 18.95, zone4: 26.13, zone5: 31.68 },
    '251g-500g': { zone2: 24.70, zone4: 32.68, zone5: 40.28 },
    '501g-1kg': { zone2: 36.24, zone4: 45.89, zone5: 57.48 },
    '1.001kg-1.5kg': { zone2: 47.79, zone4: 59.04, zone5: 74.62 },
    '1.501kg-2kg': { zone2: 59.33, zone4: 72.20, zone5: 91.82 }
};

// Country to zone and color mapping
// Based on Country Master List from Excel
// GREEN = Australia only
// BLUE = Key International Destinations (NZ, China, USA & Canada, UK & Ireland)
// YELLOW = All other international destinations
const COUNTRY_MAPPING = {
    // Australia - GREEN (uses Zone 1, 2, or 3 from GREEN table)
    'AU': { zone: 1, color: 'GREEN', freeShippingThreshold: 80 },
    
    // BLUE - Key International Destinations
    'NZ': { zone: 1, color: 'BLUE' }, // New Zealand - Zone 1 in BLUE table
    'CN': { zone: 2, color: 'BLUE' }, // China - Zone 2 in BLUE table
    'US': { zone: 3, color: 'BLUE' }, // United States - Zone 3 in BLUE table
    'CA': { zone: 3, color: 'BLUE' }, // Canada - Zone 3 in BLUE table
    'GB': { zone: 4, color: 'BLUE' }, // United Kingdom - Zone 4 in BLUE table
    'IE': { zone: 4, color: 'BLUE' }, // Ireland - Zone 4 in BLUE table
    
    // YELLOW - Other International (default for all other countries)
    // Uses zones 2, 4, or 5 from YELLOW table based on Country Master List
    'OTHER': { zone: 5, color: 'YELLOW' } // Default for other countries - Zone 5 (Rest of World 2)
};

// Map weight in grams to weight range category
function getWeightRange(totalWeightGrams) {
    if (totalWeightGrams <= 250) {
        return 'Up to 250g';
    } else if (totalWeightGrams <= 500) {
        return '251g-500g';
    } else if (totalWeightGrams <= 1000) {
        return '501g-1kg';
    } else if (totalWeightGrams <= 1500) {
        return '1.001kg-1.5kg';
    } else if (totalWeightGrams <= 2000) {
        return '1.501kg-2kg';
    } else {
        // For weights over 2kg, use the highest tier
        return '1.501kg-2kg';
    }
}

// Get country mapping with zone and color
function getCountryInfo(countryCode) {
    if (!countryCode) return null;
    
    const code = countryCode.toUpperCase();
    const mapping = COUNTRY_MAPPING[code];
    
    if (mapping) {
        return mapping;
    }
    
    // Default to YELLOW for unknown countries
    // Most countries fall into Zone 5 (Rest of World 2)
    return { zone: 5, color: 'YELLOW' };
}

// Calculate shipping cost based on country, weight, and color-coded tables
function calculateShipping(countryCode, cartItems, subtotal) {
    if (!countryCode) {
        return null; // Country not selected
    }
    
    const countryInfo = getCountryInfo(countryCode);
    if (!countryInfo) {
        return null;
    }
    
    // Check for free shipping threshold (Australia only)
    if (countryInfo.freeShippingThreshold && subtotal >= countryInfo.freeShippingThreshold) {
        return 0;
    }
    
    // Calculate total weight from cart items
    let totalWeightGrams = 0;
    if (cartItems && Array.isArray(cartItems)) {
        cartItems.forEach(item => {
            const itemWeight = parseFloat(item.weight || 0); // Weight in grams per unit
            const quantity = parseInt(item.quantity || 1);
            totalWeightGrams += itemWeight * quantity;
        });
    }
    
    // If no weight data available, fallback to old method (quantity * 100g)
    if (totalWeightGrams === 0 && cartItems && cartItems.length > 0) {
        const totalQuantity = cartItems.reduce((sum, item) => sum + parseInt(item.quantity || 1), 0);
        totalWeightGrams = totalQuantity * 100; // Fallback estimate
    }
    
    // Get weight range
    const weightRange = getWeightRange(totalWeightGrams);
    const zone = countryInfo.zone;
    const color = countryInfo.color;
    
    // Get shipping cost based on color and zone
    let shippingCost = null;
    
    if (color === 'GREEN') {
        // Australia - use GREEN rates
        const rates = GREEN_RATES[weightRange];
        if (rates) {
            shippingCost = rates[`zone${zone}`] || rates.zone1;
        }
    } else if (color === 'BLUE') {
        // Key International Destinations - use BLUE rates
        const rates = BLUE_RATES[weightRange];
        if (rates) {
            shippingCost = rates[`zone${zone}`] || rates.zone3;
        }
    } else if (color === 'YELLOW') {
        // Other International Destinations - use YELLOW rates
        const rates = YELLOW_RATES[weightRange];
        if (rates) {
            // Map zone from Country Master List to YELLOW table structure
            // YELLOW table has: Zone 2 (Rest of Asia, Pacific Islands), Zone 4 (Major Europe, Rest of World 1), Zone 5 (Rest of World 2)
            if (zone === 2) {
                shippingCost = rates.zone2; // Rest of Asia, Pacific Islands
            } else if (zone === 4) {
                shippingCost = rates.zone4; // Major Europe, Rest of World 1
            } else {
                shippingCost = rates.zone5; // Rest of World 2 (default for Zone 5 and others)
            }
        }
    }
    
    // Fallback if no match found
    if (shippingCost === null) {
        console.warn(`No shipping rate found for country ${countryCode}, zone ${zone}, color ${color}, weight ${totalWeightGrams}g`);
        // Use highest tier as fallback
        if (color === 'GREEN') {
            shippingCost = GREEN_RATES['1.501kg-2kg'].zone3;
        } else if (color === 'BLUE') {
            shippingCost = BLUE_RATES['1.501kg-2kg'].zone4;
        } else {
            shippingCost = YELLOW_RATES['1.501kg-2kg'].zone5;
        }
    }
    
    return shippingCost;
}

// Get country name
function getCountryName(countryCode) {
    if (!countryCode) return '';
    const countryInfo = getCountryInfo(countryCode);
    if (countryInfo) {
        // Return a readable name based on code
        const names = {
            'AU': 'Australia',
            'NZ': 'New Zealand',
            'US': 'United States',
            'CA': 'Canada',
            'GB': 'United Kingdom',
            'IE': 'Ireland',
            'CN': 'China'
        };
        return names[countryCode.toUpperCase()] || 'Other Countries';
    }
    return 'Other Countries';
}

// Export for use in other scripts
window.ShippingRates = {
    calculate: calculateShipping,
    getCountryName: getCountryName,
    getWeightRange: getWeightRange,
    getCountryInfo: getCountryInfo
};
