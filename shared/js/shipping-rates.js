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

// BLUE section - International Key Destinations (NZ, China, USA & Canada, UK & Ireland)
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

// Country to zone and color mapping - 230 countries from Country Master List
// Zone 1 = NZ (BLUE), Zone 2 = China/Asia Pacific (BLUE/YELLOW), Zone 3 = USA & Canada (BLUE)
// Zone 4 = UK & Ireland/UK & Europe (BLUE/YELLOW), Zone 5 = Rest of World (YELLOW)
const COUNTRY_MAPPING = {
    // Australia - GREEN (uses Zone 1, 2, or 3 from GREEN table)
    'AU': { zone: 1, color: 'GREEN', freeShippingThreshold: 80 },
    
    // Zone 1 - NZ (BLUE)
    'NZ': { zone: 1, color: 'BLUE' },
    
    // Zone 2 - China (BLUE)
    'CN': { zone: 2, color: 'BLUE' },
    
    // Zone 3 - USA & Canada (BLUE)
    'US': { zone: 3, color: 'BLUE' },
    'CA': { zone: 3, color: 'BLUE' },
    'UM': { zone: 3, color: 'BLUE' }, // United States Minor Outlying Islands
    
    // Zone 4 - UK & Ireland (BLUE)
    'GB': { zone: 4, color: 'BLUE' },
    'IE': { zone: 4, color: 'BLUE' },
    
    // Zone 2 - Asia Pacific (YELLOW)
    'AS': { zone: 2, color: 'YELLOW' }, // American Samoa
    'BD': { zone: 2, color: 'YELLOW' }, // Bangladesh
    'BN': { zone: 2, color: 'YELLOW' }, // Brunei Darussalam
    'KH': { zone: 2, color: 'YELLOW' }, // Cambodia
    'CK': { zone: 2, color: 'YELLOW' }, // Cook Islands
    'FJ': { zone: 2, color: 'YELLOW' }, // Fiji
    'PF': { zone: 2, color: 'YELLOW' }, // French Polynesia
    'GU': { zone: 2, color: 'YELLOW' }, // Guam
    'HK': { zone: 2, color: 'YELLOW' }, // Hong Kong
    'IN': { zone: 2, color: 'YELLOW' }, // India
    'ID': { zone: 2, color: 'YELLOW' }, // Indonesia
    'JP': { zone: 2, color: 'YELLOW' }, // Japan
    'KI': { zone: 2, color: 'YELLOW' }, // Kiribati
    'LA': { zone: 2, color: 'YELLOW' }, // Laos
    'MO': { zone: 2, color: 'YELLOW' }, // Macao
    'MY': { zone: 2, color: 'YELLOW' }, // Malaysia
    'MV': { zone: 2, color: 'YELLOW' }, // Maldives
    'MH': { zone: 2, color: 'YELLOW' }, // Marshall Islands
    'FM': { zone: 2, color: 'YELLOW' }, // Micronesia
    'MM': { zone: 2, color: 'YELLOW' }, // Myanmar (Burma)
    'NR': { zone: 2, color: 'YELLOW' }, // Nauru
    'NP': { zone: 2, color: 'YELLOW' }, // Nepal
    'NC': { zone: 2, color: 'YELLOW' }, // New Caledonia
    'NU': { zone: 2, color: 'YELLOW' }, // Niue
    'KP': { zone: 2, color: 'YELLOW' }, // North Korea
    'MP': { zone: 2, color: 'YELLOW' }, // Northern Mariana Islands
    'PK': { zone: 2, color: 'YELLOW' }, // Pakistan
    'PW': { zone: 2, color: 'YELLOW' }, // Palau
    'PG': { zone: 2, color: 'YELLOW' }, // Papua New Guinea
    'PH': { zone: 2, color: 'YELLOW' }, // Philippines
    'PN': { zone: 2, color: 'YELLOW' }, // Pitcairn Islands
    'WS': { zone: 2, color: 'YELLOW' }, // Samoa
    'SG': { zone: 2, color: 'YELLOW' }, // Singapore
    'SB': { zone: 2, color: 'YELLOW' }, // Solomon Islands
    'KR': { zone: 2, color: 'YELLOW' }, // South Korea
    'LK': { zone: 2, color: 'YELLOW' }, // Sri Lanka
    'TW': { zone: 2, color: 'YELLOW' }, // Taiwan
    'TH': { zone: 2, color: 'YELLOW' }, // Thailand
    'TL': { zone: 2, color: 'YELLOW' }, // Timor Leste
    'TK': { zone: 2, color: 'YELLOW' }, // Tokelau Islands
    'TO': { zone: 2, color: 'YELLOW' }, // Tonga
    'TV': { zone: 2, color: 'YELLOW' }, // Tuvalu
    'VU': { zone: 2, color: 'YELLOW' }, // Vanuatu
    'VN': { zone: 2, color: 'YELLOW' }, // Vietnam
    'WF': { zone: 2, color: 'YELLOW' }, // Wallis and Futuna
    
    // Zone 4 - UK & Europe (YELLOW)
    'AL': { zone: 4, color: 'YELLOW' }, // Albania
    'AD': { zone: 4, color: 'YELLOW' }, // Andorra
    'AT': { zone: 4, color: 'YELLOW' }, // Austria
    'BE': { zone: 4, color: 'YELLOW' }, // Belgium
    'BA': { zone: 4, color: 'YELLOW' }, // Bosnia and Herzegovina
    'BR': { zone: 4, color: 'YELLOW' }, // Brazil
    'BG': { zone: 4, color: 'YELLOW' }, // Bulgaria
    'HR': { zone: 4, color: 'YELLOW' }, // Croatia
    'CY': { zone: 4, color: 'YELLOW' }, // Cyprus
    'CZ': { zone: 4, color: 'YELLOW' }, // Czechia (Czech Republic)
    'DK': { zone: 4, color: 'YELLOW' }, // Denmark
    'EE': { zone: 4, color: 'YELLOW' }, // Estonia
    'FI': { zone: 4, color: 'YELLOW' }, // Finland
    'FR': { zone: 4, color: 'YELLOW' }, // France
    'DE': { zone: 4, color: 'YELLOW' }, // Germany
    'GR': { zone: 4, color: 'YELLOW' }, // Greece
    'HU': { zone: 4, color: 'YELLOW' }, // Hungary
    'IS': { zone: 4, color: 'YELLOW' }, // Iceland
    'IT': { zone: 4, color: 'YELLOW' }, // Italy
    'XK': { zone: 4, color: 'YELLOW' }, // Kosovo
    'MT': { zone: 4, color: 'YELLOW' }, // Malta
    'MC': { zone: 4, color: 'YELLOW' }, // Monaco
    'ME': { zone: 4, color: 'YELLOW' }, // Montenegro
    'NL': { zone: 4, color: 'YELLOW' }, // Netherlands
    'MK': { zone: 4, color: 'YELLOW' }, // North Macedonia
    'NO': { zone: 4, color: 'YELLOW' }, // Norway
    'PL': { zone: 4, color: 'YELLOW' }, // Poland
    'PT': { zone: 4, color: 'YELLOW' }, // Portugal
    'RO': { zone: 4, color: 'YELLOW' }, // Romania
    'RU': { zone: 4, color: 'YELLOW' }, // Russian Federation
    'RS': { zone: 4, color: 'YELLOW' }, // Serbia
    'SK': { zone: 4, color: 'YELLOW' }, // Slovak Republic (Slovakia)
    'SI': { zone: 4, color: 'YELLOW' }, // Slovenia
    'ZA': { zone: 4, color: 'YELLOW' }, // South Africa
    'ES': { zone: 4, color: 'YELLOW' }, // Spain
    'SE': { zone: 4, color: 'YELLOW' }, // Sweden
    'CH': { zone: 4, color: 'YELLOW' }, // Switzerland
    'TR': { zone: 4, color: 'YELLOW' }, // Turkiye
    'UA': { zone: 4, color: 'YELLOW' }, // Ukraine
    
    // Zone 5 - Rest of World (YELLOW)
    'AF': { zone: 5, color: 'YELLOW' }, // Afghanistan
    'DZ': { zone: 5, color: 'YELLOW' }, // Algeria
    'AO': { zone: 5, color: 'YELLOW' }, // Angola
    'AI': { zone: 5, color: 'YELLOW' }, // Anguilla
    'AG': { zone: 5, color: 'YELLOW' }, // Antigua and Barbuda
    'AR': { zone: 5, color: 'YELLOW' }, // Argentina
    'AM': { zone: 5, color: 'YELLOW' }, // Armenia
    'AW': { zone: 5, color: 'YELLOW' }, // Aruba
    'AZ': { zone: 5, color: 'YELLOW' }, // Azerbaijan
    'BS': { zone: 5, color: 'YELLOW' }, // Bahamas
    'BH': { zone: 5, color: 'YELLOW' }, // Bahrain
    'BB': { zone: 5, color: 'YELLOW' }, // Barbados
    'BY': { zone: 5, color: 'YELLOW' }, // Belarus
    'BZ': { zone: 5, color: 'YELLOW' }, // Belize
    'BJ': { zone: 5, color: 'YELLOW' }, // Benin
    'BM': { zone: 5, color: 'YELLOW' }, // Bermuda
    'BT': { zone: 5, color: 'YELLOW' }, // Bhutan
    'BO': { zone: 5, color: 'YELLOW' }, // Bolivia
    'BQ': { zone: 5, color: 'YELLOW' }, // Bonaire, Eustatius and Saba
    'BW': { zone: 5, color: 'YELLOW' }, // Botswana
    'IO': { zone: 5, color: 'YELLOW' }, // British Indian Ocean Territory
    'BF': { zone: 5, color: 'YELLOW' }, // Burkina Faso
    'BI': { zone: 5, color: 'YELLOW' }, // Burundi
    'CV': { zone: 5, color: 'YELLOW' }, // Cabo Verde (formerly Cape Verde)
    'CM': { zone: 5, color: 'YELLOW' }, // Cameroon
    'KY': { zone: 5, color: 'YELLOW' }, // Cayman Islands
    'CF': { zone: 5, color: 'YELLOW' }, // Central African Republic
    'TD': { zone: 5, color: 'YELLOW' }, // Chad
    'CL': { zone: 5, color: 'YELLOW' }, // Chile
    'CO': { zone: 5, color: 'YELLOW' }, // Colombia
    'KM': { zone: 5, color: 'YELLOW' }, // Comoros
    'CD': { zone: 5, color: 'YELLOW' }, // Congo (Democratic Republic)
    'CG': { zone: 5, color: 'YELLOW' }, // Congo (Republic)
    'CR': { zone: 5, color: 'YELLOW' }, // Costa Rica
    'CI': { zone: 5, color: 'YELLOW' }, // Cote d'Ivoire
    'CU': { zone: 5, color: 'YELLOW' }, // Cuba
    'CW': { zone: 5, color: 'YELLOW' }, // Curaçao
    'DJ': { zone: 5, color: 'YELLOW' }, // Djibouti
    'DM': { zone: 5, color: 'YELLOW' }, // Dominica
    'DO': { zone: 5, color: 'YELLOW' }, // Dominican Republic
    'EC': { zone: 5, color: 'YELLOW' }, // Ecuador
    'EG': { zone: 5, color: 'YELLOW' }, // Egypt
    'SV': { zone: 5, color: 'YELLOW' }, // El Salvador
    'GQ': { zone: 5, color: 'YELLOW' }, // Equatorial Guinea
    'ER': { zone: 5, color: 'YELLOW' }, // Eritrea
    'SZ': { zone: 5, color: 'YELLOW' }, // Eswatini
    'ET': { zone: 5, color: 'YELLOW' }, // Ethiopia
    'FK': { zone: 5, color: 'YELLOW' }, // Falkland Islands (Malvinas)
    'FO': { zone: 5, color: 'YELLOW' }, // Faroe Islands
    'GF': { zone: 5, color: 'YELLOW' }, // French Guiana
    'GA': { zone: 5, color: 'YELLOW' }, // Gabon
    'GM': { zone: 5, color: 'YELLOW' }, // Gambia
    'GE': { zone: 5, color: 'YELLOW' }, // Georgia
    'GH': { zone: 5, color: 'YELLOW' }, // Ghana
    'GI': { zone: 5, color: 'YELLOW' }, // Gibraltar
    'GL': { zone: 5, color: 'YELLOW' }, // Greenland
    'GD': { zone: 5, color: 'YELLOW' }, // Grenada
    'GP': { zone: 5, color: 'YELLOW' }, // Guadeloupe
    'GT': { zone: 5, color: 'YELLOW' }, // Guatemala
    'GN': { zone: 5, color: 'YELLOW' }, // Guinea
    'GW': { zone: 5, color: 'YELLOW' }, // Guinea-Bissau
    'GY': { zone: 5, color: 'YELLOW' }, // Guyana
    'HT': { zone: 5, color: 'YELLOW' }, // Haiti
    'VA': { zone: 5, color: 'YELLOW' }, // Holy See / Vatican City
    'HN': { zone: 5, color: 'YELLOW' }, // Honduras
    'IR': { zone: 5, color: 'YELLOW' }, // Iran
    'IQ': { zone: 5, color: 'YELLOW' }, // Iraq
    'IL': { zone: 5, color: 'YELLOW' }, // Israel
    'JM': { zone: 5, color: 'YELLOW' }, // Jamaica
    'JO': { zone: 5, color: 'YELLOW' }, // Jordan
    'KZ': { zone: 5, color: 'YELLOW' }, // Kazakhstan
    'KE': { zone: 5, color: 'YELLOW' }, // Kenya
    'KW': { zone: 5, color: 'YELLOW' }, // Kuwait
    'KG': { zone: 5, color: 'YELLOW' }, // Kyrgyzstan
    'LV': { zone: 5, color: 'YELLOW' }, // Latvia
    'LB': { zone: 5, color: 'YELLOW' }, // Lebanon
    'LS': { zone: 5, color: 'YELLOW' }, // Lesotho
    'LR': { zone: 5, color: 'YELLOW' }, // Liberia
    'LY': { zone: 5, color: 'YELLOW' }, // Libya
    'LI': { zone: 5, color: 'YELLOW' }, // Liechtenstein
    'LT': { zone: 5, color: 'YELLOW' }, // Lithuania
    'LU': { zone: 5, color: 'YELLOW' }, // Luxembourg
    'MG': { zone: 5, color: 'YELLOW' }, // Madagascar
    'MW': { zone: 5, color: 'YELLOW' }, // Malawi
    'ML': { zone: 5, color: 'YELLOW' }, // Mali
    'MQ': { zone: 5, color: 'YELLOW' }, // Martinique
    'MR': { zone: 5, color: 'YELLOW' }, // Mauritania
    'MU': { zone: 5, color: 'YELLOW' }, // Mauritius
    'MX': { zone: 5, color: 'YELLOW' }, // Mexico
    'MD': { zone: 5, color: 'YELLOW' }, // Moldova
    'MN': { zone: 5, color: 'YELLOW' }, // Mongolia
    'MS': { zone: 5, color: 'YELLOW' }, // Montserrat
    'MA': { zone: 5, color: 'YELLOW' }, // Morocco
    'MZ': { zone: 5, color: 'YELLOW' }, // Mozambique
    'NA': { zone: 5, color: 'YELLOW' }, // Namibia
    'NI': { zone: 5, color: 'YELLOW' }, // Nicaragua
    'NE': { zone: 5, color: 'YELLOW' }, // Niger
    'NG': { zone: 5, color: 'YELLOW' }, // Nigeria
    'OM': { zone: 5, color: 'YELLOW' }, // Oman
    'PA': { zone: 5, color: 'YELLOW' }, // Panama
    'PY': { zone: 5, color: 'YELLOW' }, // Paraguay
    'PE': { zone: 5, color: 'YELLOW' }, // Peru
    'PR': { zone: 5, color: 'YELLOW' }, // Puerto Rico
    'QA': { zone: 5, color: 'YELLOW' }, // Qatar
    'RE': { zone: 5, color: 'YELLOW' }, // Reunion
    'RW': { zone: 5, color: 'YELLOW' }, // Rwanda
    'SH': { zone: 5, color: 'YELLOW' }, // Saint Helena, Ascension and Tristan da Cunha
    'KN': { zone: 5, color: 'YELLOW' }, // Saint Kitts and Nevis
    'LC': { zone: 5, color: 'YELLOW' }, // Saint Lucia
    'MF': { zone: 5, color: 'YELLOW' }, // Saint Martin (French part)
    'PM': { zone: 5, color: 'YELLOW' }, // Saint Pierre and Miquelon
    'VC': { zone: 5, color: 'YELLOW' }, // Saint Vincent and the Grenadines
    'ST': { zone: 5, color: 'YELLOW' }, // Sao Tome and Principe
    'SA': { zone: 5, color: 'YELLOW' }, // Saudi Arabia
    'SN': { zone: 5, color: 'YELLOW' }, // Senegal
    'SC': { zone: 5, color: 'YELLOW' }, // Seychelles
    'SL': { zone: 5, color: 'YELLOW' }, // Sierra Leone
    'SO': { zone: 5, color: 'YELLOW' }, // Somalia
    'SS': { zone: 5, color: 'YELLOW' }, // South Sudan
    'SR': { zone: 5, color: 'YELLOW' }, // Suriname
    'SY': { zone: 5, color: 'YELLOW' }, // Syrian Arab Republic
    'TJ': { zone: 5, color: 'YELLOW' }, // Tajikistan
    'TZ': { zone: 5, color: 'YELLOW' }, // Tanzania
    'TG': { zone: 5, color: 'YELLOW' }, // Togo
    'TT': { zone: 5, color: 'YELLOW' }, // Trinidad and Tobago
    'TN': { zone: 5, color: 'YELLOW' }, // Tunisia
    'TM': { zone: 5, color: 'YELLOW' }, // Turkmenistan
    'TC': { zone: 5, color: 'YELLOW' }, // Turks and Caicos Islands
    'UG': { zone: 5, color: 'YELLOW' }, // Uganda
    'AE': { zone: 5, color: 'YELLOW' }, // United Arab Emirates
    'UY': { zone: 5, color: 'YELLOW' }, // Uruguay
    'UZ': { zone: 5, color: 'YELLOW' }, // Uzbekistan
    'VE': { zone: 5, color: 'YELLOW' }, // Venezuela
    'VG': { zone: 5, color: 'YELLOW' }, // Virgin Islands (British)
    'VI': { zone: 5, color: 'YELLOW' }, // Virgin Islands (U.S.)
    'YE': { zone: 5, color: 'YELLOW' }, // Yemen
    'ZM': { zone: 5, color: 'YELLOW' }, // Zambia
    'ZW': { zone: 5, color: 'YELLOW' }, // Zimbabwe
    
    // Default for any other country not listed
    'OTHER': { zone: 5, color: 'YELLOW' }
};

// Complete country list for dropdown - 230 countries from Country Master List
const COUNTRY_LIST = [
    // Australia (first for easy access)
    { code: 'AU', name: 'Australia', group: 'Popular' },
    
    // Zone 1 - NZ
    { code: 'NZ', name: 'New Zealand', group: 'Popular' },
    
    // Zone 2 - China
    { code: 'CN', name: 'China', group: 'Popular' },
    
    // Zone 3 - USA & Canada
    { code: 'US', name: 'United States', group: 'Popular' },
    { code: 'CA', name: 'Canada', group: 'Popular' },
    { code: 'UM', name: 'United States Minor Outlying Islands', group: 'Americas' },
    
    // Zone 4 - UK & Ireland
    { code: 'GB', name: 'United Kingdom', group: 'Popular' },
    { code: 'IE', name: 'Ireland', group: 'Popular' },
    
    // Zone 2 - Asia Pacific
    { code: 'AS', name: 'American Samoa', group: 'Asia Pacific' },
    { code: 'BD', name: 'Bangladesh', group: 'Asia Pacific' },
    { code: 'BN', name: 'Brunei Darussalam', group: 'Asia Pacific' },
    { code: 'KH', name: 'Cambodia', group: 'Asia Pacific' },
    { code: 'CK', name: 'Cook Islands', group: 'Asia Pacific' },
    { code: 'FJ', name: 'Fiji', group: 'Asia Pacific' },
    { code: 'PF', name: 'French Polynesia', group: 'Asia Pacific' },
    { code: 'GU', name: 'Guam', group: 'Asia Pacific' },
    { code: 'HK', name: 'Hong Kong', group: 'Asia Pacific' },
    { code: 'IN', name: 'India', group: 'Asia Pacific' },
    { code: 'ID', name: 'Indonesia', group: 'Asia Pacific' },
    { code: 'JP', name: 'Japan', group: 'Asia Pacific' },
    { code: 'KI', name: 'Kiribati', group: 'Asia Pacific' },
    { code: 'LA', name: 'Laos', group: 'Asia Pacific' },
    { code: 'MO', name: 'Macao', group: 'Asia Pacific' },
    { code: 'MY', name: 'Malaysia', group: 'Asia Pacific' },
    { code: 'MV', name: 'Maldives', group: 'Asia Pacific' },
    { code: 'MH', name: 'Marshall Islands', group: 'Asia Pacific' },
    { code: 'FM', name: 'Micronesia', group: 'Asia Pacific' },
    { code: 'MM', name: 'Myanmar (Burma)', group: 'Asia Pacific' },
    { code: 'NR', name: 'Nauru', group: 'Asia Pacific' },
    { code: 'NP', name: 'Nepal', group: 'Asia Pacific' },
    { code: 'NC', name: 'New Caledonia', group: 'Asia Pacific' },
    { code: 'NU', name: 'Niue', group: 'Asia Pacific' },
    { code: 'KP', name: 'North Korea', group: 'Asia Pacific' },
    { code: 'MP', name: 'Northern Mariana Islands', group: 'Asia Pacific' },
    { code: 'PK', name: 'Pakistan', group: 'Asia Pacific' },
    { code: 'PW', name: 'Palau', group: 'Asia Pacific' },
    { code: 'PG', name: 'Papua New Guinea', group: 'Asia Pacific' },
    { code: 'PH', name: 'Philippines', group: 'Asia Pacific' },
    { code: 'PN', name: 'Pitcairn Islands', group: 'Asia Pacific' },
    { code: 'WS', name: 'Samoa', group: 'Asia Pacific' },
    { code: 'SG', name: 'Singapore', group: 'Asia Pacific' },
    { code: 'SB', name: 'Solomon Islands', group: 'Asia Pacific' },
    { code: 'KR', name: 'South Korea', group: 'Asia Pacific' },
    { code: 'LK', name: 'Sri Lanka', group: 'Asia Pacific' },
    { code: 'TW', name: 'Taiwan', group: 'Asia Pacific' },
    { code: 'TH', name: 'Thailand', group: 'Asia Pacific' },
    { code: 'TL', name: 'Timor Leste', group: 'Asia Pacific' },
    { code: 'TK', name: 'Tokelau Islands', group: 'Asia Pacific' },
    { code: 'TO', name: 'Tonga', group: 'Asia Pacific' },
    { code: 'TV', name: 'Tuvalu', group: 'Asia Pacific' },
    { code: 'VU', name: 'Vanuatu', group: 'Asia Pacific' },
    { code: 'VN', name: 'Vietnam', group: 'Asia Pacific' },
    { code: 'WF', name: 'Wallis and Futuna', group: 'Asia Pacific' },
    
    // Zone 4 - Europe
    { code: 'AL', name: 'Albania', group: 'Europe' },
    { code: 'AD', name: 'Andorra', group: 'Europe' },
    { code: 'AT', name: 'Austria', group: 'Europe' },
    { code: 'BE', name: 'Belgium', group: 'Europe' },
    { code: 'BA', name: 'Bosnia and Herzegovina', group: 'Europe' },
    { code: 'BG', name: 'Bulgaria', group: 'Europe' },
    { code: 'HR', name: 'Croatia', group: 'Europe' },
    { code: 'CY', name: 'Cyprus', group: 'Europe' },
    { code: 'CZ', name: 'Czechia (Czech Republic)', group: 'Europe' },
    { code: 'DK', name: 'Denmark', group: 'Europe' },
    { code: 'EE', name: 'Estonia', group: 'Europe' },
    { code: 'FI', name: 'Finland', group: 'Europe' },
    { code: 'FR', name: 'France', group: 'Europe' },
    { code: 'DE', name: 'Germany', group: 'Europe' },
    { code: 'GR', name: 'Greece', group: 'Europe' },
    { code: 'HU', name: 'Hungary', group: 'Europe' },
    { code: 'IS', name: 'Iceland', group: 'Europe' },
    { code: 'IT', name: 'Italy', group: 'Europe' },
    { code: 'XK', name: 'Kosovo', group: 'Europe' },
    { code: 'MT', name: 'Malta', group: 'Europe' },
    { code: 'MC', name: 'Monaco', group: 'Europe' },
    { code: 'ME', name: 'Montenegro', group: 'Europe' },
    { code: 'NL', name: 'Netherlands', group: 'Europe' },
    { code: 'MK', name: 'North Macedonia', group: 'Europe' },
    { code: 'NO', name: 'Norway', group: 'Europe' },
    { code: 'PL', name: 'Poland', group: 'Europe' },
    { code: 'PT', name: 'Portugal', group: 'Europe' },
    { code: 'RO', name: 'Romania', group: 'Europe' },
    { code: 'RU', name: 'Russian Federation', group: 'Europe' },
    { code: 'RS', name: 'Serbia', group: 'Europe' },
    { code: 'SK', name: 'Slovak Republic (Slovakia)', group: 'Europe' },
    { code: 'SI', name: 'Slovenia', group: 'Europe' },
    { code: 'ES', name: 'Spain', group: 'Europe' },
    { code: 'SE', name: 'Sweden', group: 'Europe' },
    { code: 'CH', name: 'Switzerland', group: 'Europe' },
    { code: 'TR', name: 'Turkiye', group: 'Europe' },
    { code: 'UA', name: 'Ukraine', group: 'Europe' },
    
    // Zone 4/5 - Africa
    { code: 'ZA', name: 'South Africa', group: 'Africa' },
    { code: 'BR', name: 'Brazil', group: 'Americas' },
    { code: 'DZ', name: 'Algeria', group: 'Africa' },
    { code: 'AO', name: 'Angola', group: 'Africa' },
    { code: 'BJ', name: 'Benin', group: 'Africa' },
    { code: 'BW', name: 'Botswana', group: 'Africa' },
    { code: 'BF', name: 'Burkina Faso', group: 'Africa' },
    { code: 'BI', name: 'Burundi', group: 'Africa' },
    { code: 'CV', name: 'Cabo Verde', group: 'Africa' },
    { code: 'CM', name: 'Cameroon', group: 'Africa' },
    { code: 'CF', name: 'Central African Republic', group: 'Africa' },
    { code: 'TD', name: 'Chad', group: 'Africa' },
    { code: 'KM', name: 'Comoros', group: 'Africa' },
    { code: 'CD', name: 'Congo (Democratic Republic)', group: 'Africa' },
    { code: 'CG', name: 'Congo (Republic)', group: 'Africa' },
    { code: 'CI', name: "Cote d'Ivoire", group: 'Africa' },
    { code: 'DJ', name: 'Djibouti', group: 'Africa' },
    { code: 'EG', name: 'Egypt', group: 'Africa' },
    { code: 'GQ', name: 'Equatorial Guinea', group: 'Africa' },
    { code: 'ER', name: 'Eritrea', group: 'Africa' },
    { code: 'SZ', name: 'Eswatini', group: 'Africa' },
    { code: 'ET', name: 'Ethiopia', group: 'Africa' },
    { code: 'GA', name: 'Gabon', group: 'Africa' },
    { code: 'GM', name: 'Gambia', group: 'Africa' },
    { code: 'GH', name: 'Ghana', group: 'Africa' },
    { code: 'GN', name: 'Guinea', group: 'Africa' },
    { code: 'GW', name: 'Guinea-Bissau', group: 'Africa' },
    { code: 'KE', name: 'Kenya', group: 'Africa' },
    { code: 'LS', name: 'Lesotho', group: 'Africa' },
    { code: 'LR', name: 'Liberia', group: 'Africa' },
    { code: 'LY', name: 'Libya', group: 'Africa' },
    { code: 'MG', name: 'Madagascar', group: 'Africa' },
    { code: 'MW', name: 'Malawi', group: 'Africa' },
    { code: 'ML', name: 'Mali', group: 'Africa' },
    { code: 'MR', name: 'Mauritania', group: 'Africa' },
    { code: 'MU', name: 'Mauritius', group: 'Africa' },
    { code: 'MA', name: 'Morocco', group: 'Africa' },
    { code: 'MZ', name: 'Mozambique', group: 'Africa' },
    { code: 'NA', name: 'Namibia', group: 'Africa' },
    { code: 'NE', name: 'Niger', group: 'Africa' },
    { code: 'NG', name: 'Nigeria', group: 'Africa' },
    { code: 'RE', name: 'Reunion', group: 'Africa' },
    { code: 'RW', name: 'Rwanda', group: 'Africa' },
    { code: 'SH', name: 'Saint Helena', group: 'Africa' },
    { code: 'ST', name: 'Sao Tome and Principe', group: 'Africa' },
    { code: 'SN', name: 'Senegal', group: 'Africa' },
    { code: 'SC', name: 'Seychelles', group: 'Africa' },
    { code: 'SL', name: 'Sierra Leone', group: 'Africa' },
    { code: 'SO', name: 'Somalia', group: 'Africa' },
    { code: 'SS', name: 'South Sudan', group: 'Africa' },
    { code: 'TZ', name: 'Tanzania', group: 'Africa' },
    { code: 'TG', name: 'Togo', group: 'Africa' },
    { code: 'TN', name: 'Tunisia', group: 'Africa' },
    { code: 'UG', name: 'Uganda', group: 'Africa' },
    { code: 'ZM', name: 'Zambia', group: 'Africa' },
    { code: 'ZW', name: 'Zimbabwe', group: 'Africa' },
    
    // Middle East
    { code: 'AF', name: 'Afghanistan', group: 'Middle East' },
    { code: 'AM', name: 'Armenia', group: 'Middle East' },
    { code: 'AZ', name: 'Azerbaijan', group: 'Middle East' },
    { code: 'BH', name: 'Bahrain', group: 'Middle East' },
    { code: 'GE', name: 'Georgia', group: 'Middle East' },
    { code: 'IR', name: 'Iran', group: 'Middle East' },
    { code: 'IQ', name: 'Iraq', group: 'Middle East' },
    { code: 'IL', name: 'Israel', group: 'Middle East' },
    { code: 'JO', name: 'Jordan', group: 'Middle East' },
    { code: 'KZ', name: 'Kazakhstan', group: 'Middle East' },
    { code: 'KW', name: 'Kuwait', group: 'Middle East' },
    { code: 'KG', name: 'Kyrgyzstan', group: 'Middle East' },
    { code: 'LB', name: 'Lebanon', group: 'Middle East' },
    { code: 'OM', name: 'Oman', group: 'Middle East' },
    { code: 'QA', name: 'Qatar', group: 'Middle East' },
    { code: 'SA', name: 'Saudi Arabia', group: 'Middle East' },
    { code: 'SY', name: 'Syrian Arab Republic', group: 'Middle East' },
    { code: 'TJ', name: 'Tajikistan', group: 'Middle East' },
    { code: 'TM', name: 'Turkmenistan', group: 'Middle East' },
    { code: 'AE', name: 'United Arab Emirates', group: 'Middle East' },
    { code: 'UZ', name: 'Uzbekistan', group: 'Middle East' },
    { code: 'YE', name: 'Yemen', group: 'Middle East' },
    
    // Americas
    { code: 'AI', name: 'Anguilla', group: 'Americas' },
    { code: 'AG', name: 'Antigua and Barbuda', group: 'Americas' },
    { code: 'AR', name: 'Argentina', group: 'Americas' },
    { code: 'AW', name: 'Aruba', group: 'Americas' },
    { code: 'BS', name: 'Bahamas', group: 'Americas' },
    { code: 'BB', name: 'Barbados', group: 'Americas' },
    { code: 'BZ', name: 'Belize', group: 'Americas' },
    { code: 'BM', name: 'Bermuda', group: 'Americas' },
    { code: 'BO', name: 'Bolivia', group: 'Americas' },
    { code: 'BQ', name: 'Bonaire, Eustatius and Saba', group: 'Americas' },
    { code: 'KY', name: 'Cayman Islands', group: 'Americas' },
    { code: 'CL', name: 'Chile', group: 'Americas' },
    { code: 'CO', name: 'Colombia', group: 'Americas' },
    { code: 'CR', name: 'Costa Rica', group: 'Americas' },
    { code: 'CU', name: 'Cuba', group: 'Americas' },
    { code: 'CW', name: 'Curaçao', group: 'Americas' },
    { code: 'DM', name: 'Dominica', group: 'Americas' },
    { code: 'DO', name: 'Dominican Republic', group: 'Americas' },
    { code: 'EC', name: 'Ecuador', group: 'Americas' },
    { code: 'SV', name: 'El Salvador', group: 'Americas' },
    { code: 'FK', name: 'Falkland Islands', group: 'Americas' },
    { code: 'GF', name: 'French Guiana', group: 'Americas' },
    { code: 'GL', name: 'Greenland', group: 'Americas' },
    { code: 'GD', name: 'Grenada', group: 'Americas' },
    { code: 'GP', name: 'Guadeloupe', group: 'Americas' },
    { code: 'GT', name: 'Guatemala', group: 'Americas' },
    { code: 'GY', name: 'Guyana', group: 'Americas' },
    { code: 'HT', name: 'Haiti', group: 'Americas' },
    { code: 'HN', name: 'Honduras', group: 'Americas' },
    { code: 'JM', name: 'Jamaica', group: 'Americas' },
    { code: 'MQ', name: 'Martinique', group: 'Americas' },
    { code: 'MX', name: 'Mexico', group: 'Americas' },
    { code: 'MS', name: 'Montserrat', group: 'Americas' },
    { code: 'NI', name: 'Nicaragua', group: 'Americas' },
    { code: 'PA', name: 'Panama', group: 'Americas' },
    { code: 'PY', name: 'Paraguay', group: 'Americas' },
    { code: 'PE', name: 'Peru', group: 'Americas' },
    { code: 'PR', name: 'Puerto Rico', group: 'Americas' },
    { code: 'KN', name: 'Saint Kitts and Nevis', group: 'Americas' },
    { code: 'LC', name: 'Saint Lucia', group: 'Americas' },
    { code: 'MF', name: 'Saint Martin', group: 'Americas' },
    { code: 'PM', name: 'Saint Pierre and Miquelon', group: 'Americas' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', group: 'Americas' },
    { code: 'SR', name: 'Suriname', group: 'Americas' },
    { code: 'TT', name: 'Trinidad and Tobago', group: 'Americas' },
    { code: 'TC', name: 'Turks and Caicos Islands', group: 'Americas' },
    { code: 'UY', name: 'Uruguay', group: 'Americas' },
    { code: 'VE', name: 'Venezuela', group: 'Americas' },
    { code: 'VG', name: 'Virgin Islands (British)', group: 'Americas' },
    { code: 'VI', name: 'Virgin Islands (U.S.)', group: 'Americas' },
    
    // Other
    { code: 'BT', name: 'Bhutan', group: 'Other' },
    { code: 'IO', name: 'British Indian Ocean Territory', group: 'Other' },
    { code: 'BY', name: 'Belarus', group: 'Other' },
    { code: 'FO', name: 'Faroe Islands', group: 'Other' },
    { code: 'GI', name: 'Gibraltar', group: 'Other' },
    { code: 'VA', name: 'Holy See / Vatican City', group: 'Other' },
    { code: 'LI', name: 'Liechtenstein', group: 'Other' },
    { code: 'LV', name: 'Latvia', group: 'Other' },
    { code: 'LT', name: 'Lithuania', group: 'Other' },
    { code: 'LU', name: 'Luxembourg', group: 'Other' },
    { code: 'MD', name: 'Moldova', group: 'Other' },
    { code: 'MN', name: 'Mongolia', group: 'Other' }
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
    
    // Default to YELLOW Zone 5 for unknown countries
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
                } else if (name.includes('soap')) {
                    itemWeight = 95; // Soap
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
            // Map zone to YELLOW table structure
            // YELLOW table has: Zone 2 (Asia Pacific), Zone 4 (UK & Europe), Zone 5 (Rest of World)
            if (zone === 2) {
                shippingCost = rates.zone2; // Asia Pacific
            } else if (zone === 4) {
                shippingCost = rates.zone4; // UK & Europe
            } else {
                shippingCost = rates.zone5; // Rest of World (default for Zone 5 and others)
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
