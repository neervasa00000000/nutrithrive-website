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
    
    // YELLOW - Zone 2 (Rest of Asia, Pacific Islands)
    'JP': { zone: 2, color: 'YELLOW' }, // Japan
    'KR': { zone: 2, color: 'YELLOW' }, // South Korea
    'SG': { zone: 2, color: 'YELLOW' }, // Singapore
    'MY': { zone: 2, color: 'YELLOW' }, // Malaysia
    'TH': { zone: 2, color: 'YELLOW' }, // Thailand
    'ID': { zone: 2, color: 'YELLOW' }, // Indonesia
    'PH': { zone: 2, color: 'YELLOW' }, // Philippines
    'VN': { zone: 2, color: 'YELLOW' }, // Vietnam
    'HK': { zone: 2, color: 'YELLOW' }, // Hong Kong
    'TW': { zone: 2, color: 'YELLOW' }, // Taiwan
    'IN': { zone: 2, color: 'YELLOW' }, // India
    'PK': { zone: 2, color: 'YELLOW' }, // Pakistan
    'BD': { zone: 2, color: 'YELLOW' }, // Bangladesh
    'LK': { zone: 2, color: 'YELLOW' }, // Sri Lanka
    'NP': { zone: 2, color: 'YELLOW' }, // Nepal
    'FJ': { zone: 2, color: 'YELLOW' }, // Fiji
    'PG': { zone: 2, color: 'YELLOW' }, // Papua New Guinea
    'WS': { zone: 2, color: 'YELLOW' }, // Samoa
    'TO': { zone: 2, color: 'YELLOW' }, // Tonga
    'VU': { zone: 2, color: 'YELLOW' }, // Vanuatu
    'NC': { zone: 2, color: 'YELLOW' }, // New Caledonia
    'PF': { zone: 2, color: 'YELLOW' }, // French Polynesia
    
    // YELLOW - Zone 4 (Major Europe, Rest of World 1)
    'DE': { zone: 4, color: 'YELLOW' }, // Germany
    'FR': { zone: 4, color: 'YELLOW' }, // France
    'IT': { zone: 4, color: 'YELLOW' }, // Italy
    'ES': { zone: 4, color: 'YELLOW' }, // Spain
    'PT': { zone: 4, color: 'YELLOW' }, // Portugal
    'NL': { zone: 4, color: 'YELLOW' }, // Netherlands
    'BE': { zone: 4, color: 'YELLOW' }, // Belgium
    'AT': { zone: 4, color: 'YELLOW' }, // Austria
    'CH': { zone: 4, color: 'YELLOW' }, // Switzerland
    'SE': { zone: 4, color: 'YELLOW' }, // Sweden
    'NO': { zone: 4, color: 'YELLOW' }, // Norway
    'DK': { zone: 4, color: 'YELLOW' }, // Denmark
    'FI': { zone: 4, color: 'YELLOW' }, // Finland
    'PL': { zone: 4, color: 'YELLOW' }, // Poland
    'CZ': { zone: 4, color: 'YELLOW' }, // Czech Republic
    'GR': { zone: 4, color: 'YELLOW' }, // Greece
    'HU': { zone: 4, color: 'YELLOW' }, // Hungary
    'RO': { zone: 4, color: 'YELLOW' }, // Romania
    'BG': { zone: 4, color: 'YELLOW' }, // Bulgaria
    'HR': { zone: 4, color: 'YELLOW' }, // Croatia
    'SK': { zone: 4, color: 'YELLOW' }, // Slovakia
    'SI': { zone: 4, color: 'YELLOW' }, // Slovenia
    'LT': { zone: 4, color: 'YELLOW' }, // Lithuania
    'LV': { zone: 4, color: 'YELLOW' }, // Latvia
    'EE': { zone: 4, color: 'YELLOW' }, // Estonia
    'CY': { zone: 4, color: 'YELLOW' }, // Cyprus
    'MT': { zone: 4, color: 'YELLOW' }, // Malta
    'LU': { zone: 4, color: 'YELLOW' }, // Luxembourg
    'IS': { zone: 4, color: 'YELLOW' }, // Iceland
    'AE': { zone: 4, color: 'YELLOW' }, // United Arab Emirates
    'SA': { zone: 4, color: 'YELLOW' }, // Saudi Arabia
    'QA': { zone: 4, color: 'YELLOW' }, // Qatar
    'KW': { zone: 4, color: 'YELLOW' }, // Kuwait
    'BH': { zone: 4, color: 'YELLOW' }, // Bahrain
    'OM': { zone: 4, color: 'YELLOW' }, // Oman
    'IL': { zone: 4, color: 'YELLOW' }, // Israel
    'TR': { zone: 4, color: 'YELLOW' }, // Turkey
    'ZA': { zone: 4, color: 'YELLOW' }, // South Africa
    
    // YELLOW - Zone 5 (Rest of World 2)
    'MX': { zone: 5, color: 'YELLOW' }, // Mexico
    'BR': { zone: 5, color: 'YELLOW' }, // Brazil
    'AR': { zone: 5, color: 'YELLOW' }, // Argentina
    'CL': { zone: 5, color: 'YELLOW' }, // Chile
    'CO': { zone: 5, color: 'YELLOW' }, // Colombia
    'PE': { zone: 5, color: 'YELLOW' }, // Peru
    'VE': { zone: 5, color: 'YELLOW' }, // Venezuela
    'EC': { zone: 5, color: 'YELLOW' }, // Ecuador
    'UY': { zone: 5, color: 'YELLOW' }, // Uruguay
    'PY': { zone: 5, color: 'YELLOW' }, // Paraguay
    'BO': { zone: 5, color: 'YELLOW' }, // Bolivia
    'RU': { zone: 5, color: 'YELLOW' }, // Russia
    'UA': { zone: 5, color: 'YELLOW' }, // Ukraine
    'EG': { zone: 5, color: 'YELLOW' }, // Egypt
    'NG': { zone: 5, color: 'YELLOW' }, // Nigeria
    'KE': { zone: 5, color: 'YELLOW' }, // Kenya
    'GH': { zone: 5, color: 'YELLOW' }, // Ghana
    'MA': { zone: 5, color: 'YELLOW' }, // Morocco
    'TN': { zone: 5, color: 'YELLOW' }, // Tunisia
    'ET': { zone: 5, color: 'YELLOW' }, // Ethiopia
    'TZ': { zone: 5, color: 'YELLOW' }, // Tanzania
    'UG': { zone: 5, color: 'YELLOW' }, // Uganda
    'ZW': { zone: 5, color: 'YELLOW' }, // Zimbabwe
    'MU': { zone: 5, color: 'YELLOW' }, // Mauritius
    
    // Default for any other country not listed
    'OTHER': { zone: 5, color: 'YELLOW' } // Default for other countries - Zone 5 (Rest of World 2)
};

// Complete country list for dropdown
const COUNTRY_LIST = [
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'IE', name: 'Ireland' },
    { code: 'CN', name: 'China' },
    // Asia & Pacific
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SG', name: 'Singapore' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'TH', name: 'Thailand' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'PH', name: 'Philippines' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'IN', name: 'India' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'NP', name: 'Nepal' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'WS', name: 'Samoa' },
    { code: 'TO', name: 'Tonga' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'PF', name: 'French Polynesia' },
    // Europe
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PT', name: 'Portugal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'GR', name: 'Greece' },
    { code: 'HU', name: 'Hungary' },
    { code: 'RO', name: 'Romania' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'HR', name: 'Croatia' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LV', name: 'Latvia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'MT', name: 'Malta' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'IS', name: 'Iceland' },
    // Middle East
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'OM', name: 'Oman' },
    { code: 'IL', name: 'Israel' },
    { code: 'TR', name: 'Turkey' },
    // Africa
    { code: 'ZA', name: 'South Africa' },
    { code: 'EG', name: 'Egypt' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'GH', name: 'Ghana' },
    { code: 'MA', name: 'Morocco' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'UG', name: 'Uganda' },
    { code: 'ZW', name: 'Zimbabwe' },
    { code: 'MU', name: 'Mauritius' },
    // Americas
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'BO', name: 'Bolivia' },
    // Other
    { code: 'RU', name: 'Russia' },
    { code: 'UA', name: 'Ukraine' }
];

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
            let itemWeight = parseFloat(item.weight || 0); // Weight in grams per unit
            
            // If weight is 0 or missing, try to infer from product name
            if (itemWeight === 0 || isNaN(itemWeight)) {
                const name = (item.name || '').toLowerCase();
                
                // Extract weight from product name (e.g., "200g Moringa", "100g Moringa")
                const weightMatch = name.match(/(\d+)g/);
                if (weightMatch) {
                    itemWeight = parseInt(weightMatch[1]);
                } else if (name.includes('400g') || name.includes('3 + 1') || name.includes('4 x')) {
                    itemWeight = 400;
                } else if (name.includes('195g') || (name.includes('soap') && name.includes('100g'))) {
                    itemWeight = 195; // Moringa 100g + Soap 95g
                } else if (name.includes('130g') || (name.includes('combo') && name.includes('curry'))) {
                    itemWeight = 130; // Combo pack 100g + 30g
                } else if (name.includes('moringa')) {
                    itemWeight = 100; // Default Moringa is 100g
                } else if (name.includes('curry')) {
                    itemWeight = 30; // Dried Curry Leaves
                } else if (name.includes('tea')) {
                    itemWeight = 100; // Black Tea
                } else {
                    itemWeight = 100; // Default fallback
                }
                
                // Update the item's weight in the cart for future calculations
                if (item.weight === undefined || item.weight === null || item.weight === 0) {
                    item.weight = itemWeight;
                }
            }
            
            const quantity = parseInt(item.quantity || 1);
            const itemTotalWeight = itemWeight * quantity;
            totalWeightGrams += itemTotalWeight;
            
            console.log(`Cart item: ${item.name}, weight: ${itemWeight}g, qty: ${quantity}, total: ${itemTotalWeight}g`);
        });
    }
    
    console.log(`Total cart weight: ${totalWeightGrams}g`);
    
    // Get weight range
    const weightRange = getWeightRange(totalWeightGrams);
    const zone = countryInfo.zone;
    const color = countryInfo.color;
    
    console.log(`Shipping calculation: weight=${totalWeightGrams}g, range=${weightRange}, country=${countryCode}, zone=${zone}, color=${color}`);
    
    // Get shipping cost based on color and zone
    let shippingCost = null;
    
    if (color === 'GREEN') {
        // Australia - use GREEN rates
        const rates = GREEN_RATES[weightRange];
        if (rates) {
            shippingCost = rates[`zone${zone}`] || rates.zone1;
            console.log(`GREEN rates for ${weightRange}, zone${zone}: ${shippingCost}`);
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
    const code = countryCode.toUpperCase();
    const country = COUNTRY_LIST.find(c => c.code === code);
    if (country) {
        return country.name;
    }
    return 'Other Countries';
}

// Get full country list for dropdowns
function getCountryList() {
    return COUNTRY_LIST;
}

// Export for use in other scripts
window.ShippingRates = {
    calculate: calculateShipping,
    getCountryName: getCountryName,
    getWeightRange: getWeightRange,
    getCountryInfo: getCountryInfo,
    getCountryList: getCountryList
};
