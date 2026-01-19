// Country/Region Selector with Auto-Detection
// This script automatically detects user's country and displays a selector at the bottom of all pages
(function() {
    // Determine base path for relative URLs
    function getBasePath() {
        const path = window.location.pathname;
        if (path === '/' || path.match(/^\/[^\/]+\.html$/)) {
            return '/';
        } else if (path.includes('/products/')) {
            return '../';
        } else if (path.includes('/pages/') || path.includes('/blog/')) {
            return '../../';
        } else if (path.includes('/about/')) {
            return '../';
        }
        return '/';
    }
    // Country to currency mapping
    const countryCurrencyMap = {
        'AU': { name: 'Australia', currency: 'AUD', symbol: '$' },
        'US': { name: 'United States', currency: 'USD', symbol: '$' },
        'GB': { name: 'United Kingdom', currency: 'GBP', symbol: '£' },
        'CA': { name: 'Canada', currency: 'CAD', symbol: '$' },
        'NZ': { name: 'New Zealand', currency: 'NZD', symbol: '$' },
        'DE': { name: 'Germany', currency: 'EUR', symbol: '€' },
        'FR': { name: 'France', currency: 'EUR', symbol: '€' },
        'IT': { name: 'Italy', currency: 'EUR', symbol: '€' },
        'ES': { name: 'Spain', currency: 'EUR', symbol: '€' },
        'NL': { name: 'Netherlands', currency: 'EUR', symbol: '€' },
        'BE': { name: 'Belgium', currency: 'EUR', symbol: '€' },
        'AT': { name: 'Austria', currency: 'EUR', symbol: '€' },
        'CH': { name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
        'SE': { name: 'Sweden', currency: 'SEK', symbol: 'kr' },
        'NO': { name: 'Norway', currency: 'NOK', symbol: 'kr' },
        'DK': { name: 'Denmark', currency: 'DKK', symbol: 'kr' },
        'FI': { name: 'Finland', currency: 'EUR', symbol: '€' },
        'IE': { name: 'Ireland', currency: 'EUR', symbol: '€' },
        'PT': { name: 'Portugal', currency: 'EUR', symbol: '€' },
        'GR': { name: 'Greece', currency: 'EUR', symbol: '€' },
        'PL': { name: 'Poland', currency: 'PLN', symbol: 'zł' },
        'CZ': { name: 'Czech Republic', currency: 'CZK', symbol: 'Kč' },
        'HU': { name: 'Hungary', currency: 'HUF', symbol: 'Ft' },
        'RO': { name: 'Romania', currency: 'RON', symbol: 'lei' },
        'BG': { name: 'Bulgaria', currency: 'BGN', symbol: 'лв' },
        'HR': { name: 'Croatia', currency: 'EUR', symbol: '€' },
        'SK': { name: 'Slovakia', currency: 'EUR', symbol: '€' },
        'SI': { name: 'Slovenia', currency: 'EUR', symbol: '€' },
        'EE': { name: 'Estonia', currency: 'EUR', symbol: '€' },
        'LV': { name: 'Latvia', currency: 'EUR', symbol: '€' },
        'LT': { name: 'Lithuania', currency: 'EUR', symbol: '€' },
        'JP': { name: 'Japan', currency: 'JPY', symbol: '¥' },
        'CN': { name: 'China', currency: 'CNY', symbol: '¥' },
        'KR': { name: 'South Korea', currency: 'KRW', symbol: '₩' },
        'IN': { name: 'India', currency: 'INR', symbol: '₹' },
        'SG': { name: 'Singapore', currency: 'SGD', symbol: '$' },
        'MY': { name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
        'TH': { name: 'Thailand', currency: 'THB', symbol: '฿' },
        'ID': { name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
        'PH': { name: 'Philippines', currency: 'PHP', symbol: '₱' },
        'VN': { name: 'Vietnam', currency: 'VND', symbol: '₫' },
        'HK': { name: 'Hong Kong', currency: 'HKD', symbol: '$' },
        'TW': { name: 'Taiwan', currency: 'TWD', symbol: 'NT$' },
        'AE': { name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ' },
        'SA': { name: 'Saudi Arabia', currency: 'SAR', symbol: 'ر.س' },
        'IL': { name: 'Israel', currency: 'ILS', symbol: '₪' },
        'TR': { name: 'Turkey', currency: 'TRY', symbol: '₺' },
        'ZA': { name: 'South Africa', currency: 'ZAR', symbol: 'R' },
        'EG': { name: 'Egypt', currency: 'EGP', symbol: '£' },
        'NG': { name: 'Nigeria', currency: 'NGN', symbol: '₦' },
        'KE': { name: 'Kenya', currency: 'KES', symbol: 'KSh' },
        'BR': { name: 'Brazil', currency: 'BRL', symbol: 'R$' },
        'MX': { name: 'Mexico', currency: 'MXN', symbol: '$' },
        'AR': { name: 'Argentina', currency: 'ARS', symbol: '$' },
        'CL': { name: 'Chile', currency: 'CLP', symbol: '$' },
        'CO': { name: 'Colombia', currency: 'COP', symbol: '$' },
        'PE': { name: 'Peru', currency: 'PEN', symbol: 'S/' },
        'RU': { name: 'Russia', currency: 'RUB', symbol: '₽' },
        'UA': { name: 'Ukraine', currency: 'UAH', symbol: '₴' },
        'PK': { name: 'Pakistan', currency: 'PKR', symbol: '₨' },
        'BD': { name: 'Bangladesh', currency: 'BDT', symbol: '৳' },
        'LK': { name: 'Sri Lanka', currency: 'LKR', symbol: '₨' },
        'NP': { name: 'Nepal', currency: 'NPR', symbol: '₨' },
        'MM': { name: 'Myanmar', currency: 'MMK', symbol: 'K' },
        'LA': { name: 'Laos', currency: 'LAK', symbol: '₭' },
        'KH': { name: 'Cambodia', currency: 'KHR', symbol: '៛' },
        'BN': { name: 'Brunei', currency: 'BND', symbol: '$' },
        'FJ': { name: 'Fiji', currency: 'FJD', symbol: '$' },
        'PG': { name: 'Papua New Guinea', currency: 'PGK', symbol: 'K' },
        'NC': { name: 'New Caledonia', currency: 'XPF', symbol: '₣' },
        'PF': { name: 'French Polynesia', currency: 'XPF', symbol: '₣' },
        'WS': { name: 'Samoa', currency: 'WST', symbol: 'T' },
        'TO': { name: 'Tonga', currency: 'TOP', symbol: 'T$' },
        'VU': { name: 'Vanuatu', currency: 'VUV', symbol: 'Vt' },
        'SB': { name: 'Solomon Islands', currency: 'SBD', symbol: '$' },
        'KI': { name: 'Kiribati', currency: 'AUD', symbol: '$' },
        'TV': { name: 'Tuvalu', currency: 'AUD', symbol: '$' },
        'NR': { name: 'Nauru', currency: 'AUD', symbol: '$' },
        'PW': { name: 'Palau', currency: 'USD', symbol: '$' },
        'FM': { name: 'Micronesia', currency: 'USD', symbol: '$' },
        'MH': { name: 'Marshall Islands', currency: 'USD', symbol: '$' },
        'GU': { name: 'Guam', currency: 'USD', symbol: '$' },
        'MP': { name: 'Northern Mariana Islands', currency: 'USD', symbol: '$' },
        'AS': { name: 'American Samoa', currency: 'USD', symbol: '$' },
        'CK': { name: 'Cook Islands', currency: 'NZD', symbol: '$' },
        'NU': { name: 'Niue', currency: 'NZD', symbol: '$' },
        'TK': { name: 'Tokelau', currency: 'NZD', symbol: '$' },
        'PN': { name: 'Pitcairn Islands', currency: 'NZD', symbol: '$' },
        'GL': { name: 'Greenland', currency: 'DKK', symbol: 'kr' },
        'IS': { name: 'Iceland', currency: 'ISK', symbol: 'kr' },
        'FO': { name: 'Faroe Islands', currency: 'DKK', symbol: 'kr' },
        'SJ': { name: 'Svalbard and Jan Mayen', currency: 'NOK', symbol: 'kr' },
        'AX': { name: 'Åland Islands', currency: 'EUR', symbol: '€' },
        'GI': { name: 'Gibraltar', currency: 'GIP', symbol: '£' },
        'AD': { name: 'Andorra', currency: 'EUR', symbol: '€' },
        'MC': { name: 'Monaco', currency: 'EUR', symbol: '€' },
        'SM': { name: 'San Marino', currency: 'EUR', symbol: '€' },
        'VA': { name: 'Vatican City', currency: 'EUR', symbol: '€' },
        'LI': { name: 'Liechtenstein', currency: 'CHF', symbol: 'CHF' },
        'MT': { name: 'Malta', currency: 'EUR', symbol: '€' },
        'CY': { name: 'Cyprus', currency: 'EUR', symbol: '€' },
        'LU': { name: 'Luxembourg', currency: 'EUR', symbol: '€' },
        'IM': { name: 'Isle of Man', currency: 'GBP', symbol: '£' },
        'JE': { name: 'Jersey', currency: 'GBP', symbol: '£' },
        'GG': { name: 'Guernsey', currency: 'GBP', symbol: '£' },
        'MQ': { name: 'Martinique', currency: 'EUR', symbol: '€' },
        'GP': { name: 'Guadeloupe', currency: 'EUR', symbol: '€' },
        'RE': { name: 'Réunion', currency: 'EUR', symbol: '€' },
        'YT': { name: 'Mayotte', currency: 'EUR', symbol: '€' },
        'PM': { name: 'Saint Pierre and Miquelon', currency: 'EUR', symbol: '€' },
        'BL': { name: 'Saint Barthélemy', currency: 'EUR', symbol: '€' },
        'MF': { name: 'Saint Martin', currency: 'EUR', symbol: '€' },
        'WF': { name: 'Wallis and Futuna', currency: 'XPF', symbol: '₣' },
        'BY': { name: 'Belarus', currency: 'BYN', symbol: 'Br' },
        'KZ': { name: 'Kazakhstan', currency: 'KZT', symbol: '₸' },
        'UZ': { name: 'Uzbekistan', currency: 'UZS', symbol: 'so\'m' },
        'GE': { name: 'Georgia', currency: 'GEL', symbol: '₾' },
        'AM': { name: 'Armenia', currency: 'AMD', symbol: '֏' },
        'AZ': { name: 'Azerbaijan', currency: 'AZN', symbol: '₼' },
        'MN': { name: 'Mongolia', currency: 'MNT', symbol: '₮' },
        'KG': { name: 'Kyrgyzstan', currency: 'KGS', symbol: 'сом' },
        'TJ': { name: 'Tajikistan', currency: 'TJS', symbol: 'ЅМ' },
        'TM': { name: 'Turkmenistan', currency: 'TMT', symbol: 'm' },
        'AF': { name: 'Afghanistan', currency: 'AFN', symbol: '؋' },
        'BT': { name: 'Bhutan', currency: 'BTN', symbol: 'Nu' },
        'MV': { name: 'Maldives', currency: 'MVR', symbol: 'Rf' },
        'TL': { name: 'Timor-Leste', currency: 'USD', symbol: '$' },
        'VE': { name: 'Venezuela', currency: 'VES', symbol: 'Bs' },
        'EC': { name: 'Ecuador', currency: 'USD', symbol: '$' },
        'UY': { name: 'Uruguay', currency: 'UYU', symbol: '$' },
        'PY': { name: 'Paraguay', currency: 'PYG', symbol: '₲' },
        'BO': { name: 'Bolivia', currency: 'BOB', symbol: 'Bs' },
        'CR': { name: 'Costa Rica', currency: 'CRC', symbol: '₡' },
        'PA': { name: 'Panama', currency: 'PAB', symbol: 'B/.' },
        'GT': { name: 'Guatemala', currency: 'GTQ', symbol: 'Q' },
        'DO': { name: 'Dominican Republic', currency: 'DOP', symbol: '$' },
        'JM': { name: 'Jamaica', currency: 'JMD', symbol: '$' },
        'TT': { name: 'Trinidad and Tobago', currency: 'TTD', symbol: '$' },
        'BB': { name: 'Barbados', currency: 'BBD', symbol: '$' },
        'BS': { name: 'Bahamas', currency: 'BSD', symbol: '$' },
        'BZ': { name: 'Belize', currency: 'BZD', symbol: '$' },
        'GY': { name: 'Guyana', currency: 'GYD', symbol: '$' },
        'SR': { name: 'Suriname', currency: 'SRD', symbol: '$' }
    };

    // Auto-detect country using IP geolocation
    async function detectCountry() {
        try {
            // Try using ipapi.co (free tier: 1000 requests/day)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data && data.country_code) {
                return data.country_code;
            }
        } catch (error) {
            console.log('ipapi.co failed, trying alternative...');
            try {
                // Fallback to ip-api.com (free tier: 45 requests/minute)
                const response = await fetch('http://ip-api.com/json/');
                const data = await response.json();
                
                if (data && data.countryCode) {
                    return data.countryCode;
                }
            } catch (error2) {
                console.log('Country detection failed:', error2);
            }
        }
        return null;
    }

    // Create country selector HTML with search
    function createCountrySelector() {
        const selector = document.createElement('div');
        selector.id = 'country-selector-container';
        selector.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(26, 46, 34, 0.98);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            border-top: 1px solid rgba(45, 90, 61, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
            transform: translateZ(0);
            will-change: transform;
        `;

        const label = document.createElement('label');
        label.setAttribute('for', 'global-country-selector');
        label.textContent = 'Country/region';
        label.style.cssText = `
            color: #e0e0e0;
            font-size: 0.9rem;
            font-weight: 500;
            margin: 0;
        `;

        // Create wrapper for search and select
        const selectWrapper = document.createElement('div');
        selectWrapper.style.cssText = `
            position: relative;
            min-width: 300px;
        `;

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'country-search-input';
        searchInput.placeholder = 'Search';
        searchInput.style.cssText = `
            width: 100%;
            padding: 0.75rem 1rem;
            padding-right: 2.5rem;
            border: 1px solid rgba(45, 90, 61, 0.5);
            border-radius: 4px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            margin-bottom: 0.5rem;
            box-sizing: border-box;
        `;
        searchInput.style.setProperty('::placeholder', 'color: #999', 'important');

        // Create datalist for search autocomplete
        const datalist = document.createElement('datalist');
        datalist.id = 'country-options';

        // Create select dropdown (hidden, used for value storage)
        const select = document.createElement('select');
        select.id = 'global-country-selector';
        select.style.cssText = `
            width: 100%;
            padding: 0.75rem 1rem;
            padding-right: 2.5rem;
            border: 1px solid rgba(45, 90, 61, 0.5);
            border-radius: 4px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            appearance: none;
            background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1.2em;
            box-sizing: border-box;
        `;

        // Store all country options for filtering
        const allCountries = [];
        Object.keys(countryCurrencyMap).forEach(code => {
            const country = countryCurrencyMap[code];
            const displayText = `${country.name} | ${country.currency} ${country.symbol}`;
            
            // Add to datalist for search
            const datalistOption = document.createElement('option');
            datalistOption.value = displayText;
            datalistOption.setAttribute('data-code', code);
            datalist.appendChild(datalistOption);
            
            // Add to select
            const option = document.createElement('option');
            option.value = code;
            option.textContent = displayText;
            select.appendChild(option);
            
            allCountries.push({ code, name: country.name, displayText });
        });

        // Add "Other Countries" option
        const otherDatalistOption = document.createElement('option');
        otherDatalistOption.value = 'Other Countries | Various';
        otherDatalistOption.setAttribute('data-code', 'OTHER');
        datalist.appendChild(otherDatalistOption);
        
        const otherOption = document.createElement('option');
        otherOption.value = 'OTHER';
        otherOption.textContent = 'Other Countries | Various';
        select.appendChild(otherOption);
        allCountries.push({ code: 'OTHER', name: 'Other Countries', displayText: 'Other Countries | Various' });

        // Link search input to datalist
        searchInput.setAttribute('list', 'country-options');

        // Handle search input changes
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm) {
                // Filter and show matching countries
                const filtered = allCountries.filter(c => 
                    c.name.toLowerCase().includes(searchTerm) || 
                    c.displayText.toLowerCase().includes(searchTerm)
                );
                
                // Update datalist options
                datalist.innerHTML = '';
                filtered.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.displayText;
                    option.setAttribute('data-code', c.code);
                    datalist.appendChild(option);
                });
            } else {
                // Show all countries when search is empty
                datalist.innerHTML = '';
                allCountries.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.displayText;
                    option.setAttribute('data-code', c.code);
                    datalist.appendChild(option);
                });
            }
        });

        // Handle selection from search
        searchInput.addEventListener('change', function() {
            const selectedText = this.value;
            const selectedOption = Array.from(datalist.options).find(opt => opt.value === selectedText);
            if (selectedOption) {
                const countryCode = selectedOption.getAttribute('data-code');
                select.value = countryCode;
                localStorage.setItem('nutrithrive_country', countryCode);
                window.dispatchEvent(new CustomEvent('countryChanged', { detail: { countryCode: countryCode } }));
            }
        });

        select.addEventListener('change', function() {
            const selectedCode = this.value;
            const selectedCountry = allCountries.find(c => c.code === selectedCode);
            if (selectedCountry) {
                searchInput.value = selectedCountry.displayText;
            }
            localStorage.setItem('nutrithrive_country', selectedCode);
            window.dispatchEvent(new CustomEvent('countryChanged', { detail: { countryCode: selectedCode } }));
        });

        selectWrapper.appendChild(searchInput);
        selectWrapper.appendChild(datalist);
        selectWrapper.appendChild(select);
        
        selector.appendChild(label);
        selector.appendChild(selectWrapper);
        return selector;
    }

    // Initialize country selector
    function initCountrySelector() {
        // Check if already exists
        if (document.getElementById('country-selector-container')) {
            return;
        }

        const selector = createCountrySelector();
        document.body.appendChild(selector);

        // Auto-detect and set country
        detectCountry().then(countryCode => {
            const select = document.getElementById('global-country-selector');
            const searchInput = document.getElementById('country-search-input');
            
            if (countryCode && (countryCode in countryCurrencyMap || countryCode === 'OTHER')) {
                if (select) {
                    select.value = countryCode;
                    localStorage.setItem('nutrithrive_country', countryCode);
                    
                    // Update search input to show selected country
                    if (searchInput) {
                        const country = countryCurrencyMap[countryCode];
                        if (country) {
                            searchInput.value = `${country.name} | ${country.currency} ${country.symbol}`;
                        } else if (countryCode === 'OTHER') {
                            searchInput.value = 'Other Countries | Various';
                        }
                    }
                }
            } else {
                // Load saved country or default to Australia
                const savedCountry = localStorage.getItem('nutrithrive_country') || 'AU';
                if (select) {
                    select.value = savedCountry;
                    
                    // Update search input
                    if (searchInput) {
                        const country = countryCurrencyMap[savedCountry];
                        if (country) {
                            searchInput.value = `${country.name} | ${country.currency} ${country.symbol}`;
                        } else if (savedCountry === 'OTHER') {
                            searchInput.value = 'Other Countries | Various';
                        }
                    }
                }
            }
        }).catch(() => {
            // On error, load saved country or default to Australia
            const savedCountry = localStorage.getItem('nutrithrive_country') || 'AU';
            const select = document.getElementById('global-country-selector');
            const searchInput = document.getElementById('country-search-input');
            
            if (select) {
                select.value = savedCountry;
                
                // Update search input
                if (searchInput) {
                    const country = countryCurrencyMap[savedCountry];
                    if (country) {
                        searchInput.value = `${country.name} | ${country.currency} ${country.symbol}`;
                    } else if (savedCountry === 'OTHER') {
                        searchInput.value = 'Other Countries | Various';
                    }
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCountrySelector);
    } else {
        initCountrySelector();
    }
})();
