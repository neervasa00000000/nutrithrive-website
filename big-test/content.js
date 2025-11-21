// Block The Buy - Content Script
// Detects and blocks buy buttons on shopping sites

const HOURLY_WAGE = 30; // Average Australian wage
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Button selectors for major Australian shopping sites
const BUY_BUTTON_SELECTORS = [
  // Amazon
  '#buy-now-button',
  '#add-to-cart-button',
  'input[name="submit.buy-now"]',
  'input[name="submit.add-to-cart"]',
  // eBay
  '#binBtn_btn',
  '.ux-call-to-action',
  '[data-testid="ux-call-to-action"]',
  // Woolworths/Coles
  '.add-to-cart',
  '[data-test="add-to-cart"]',
  'button[aria-label*="Add to cart"]',
  // Generic patterns
  'button[class*="buy"]',
  'button[class*="purchase"]',
  'button[class*="checkout"]',
  'a[class*="buy-now"]',
  'input[value*="Buy Now"]'
];

let blockedPurchases = 0;
let moneySaved = 0;

// Load stats from storage
chrome.storage.local.get(['blockedCount', 'savedAmount'], (result) => {
  blockedPurchases = result.blockedCount || 0;
  moneySaved = result.savedAmount || 0;
});

// Function to extract price from page
function extractPrice(button) {
  // Try to find price near the button
  let priceElement = button.closest('.product-card, .product-item, [data-component="product"]');
  if (!priceElement) {
    priceElement = document.body;
  }
  
  const priceRegex = /\$([0-9,]+\.?[0-9]*)/;
  const priceText = priceElement.innerText || priceElement.textContent;
  const match = priceText.match(priceRegex);
  
  if (match && match[1]) {
    return parseFloat(match[1].replace(',', ''));
  }
  return 99; // Default fallback price
}

// Create intervention popup
function createInterventionPopup(button, price) {
  const workHours = (price / HOURLY_WAGE).toFixed(1);
  const groceryWeeks = (price / 285).toFixed(1); // Average Aussie weekly grocery spend
  
  const popup = document.createElement('div');
  popup.className = 'btb-intervention-popup';
  popup.innerHTML = `
    <div class="btb-popup-content">
      <div class="btb-popup-header">
        <span class="btb-icon">🛑</span>
        <h3>Hold On! Think Before You Buy</h3>
      </div>
      
      <div class="btb-stats">
        <div class="btb-stat">
          <span class="btb-stat-label">💼 Work hours needed</span>
          <span class="btb-stat-value">${workHours} hours</span>
        </div>
        <div class="btb-stat">
          <span class="btb-stat-label">🛒 Grocery equivalent</span>
          <span class="btb-stat-value">${groceryWeeks} weeks</span>
        </div>
        <div class="btb-stat">
          <span class="btb-stat-label">💰 Price</span>
          <span class="btb-stat-value">$${price.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="btb-question">
        <p><strong>Do you REALLY need this right now?</strong></p>
        <p style="margin-top: 8px; font-size: 0.9em;">This extension has saved you from <strong>${blockedPurchases}</strong> impulse purchases (<strong>$${moneySaved.toFixed(0)}</strong> total).</p>
      </div>
      
      <div class="btb-actions">
        <button class="btb-btn btb-btn-wait">Wait 24 Hours ⏰</button>
        <button class="btb-btn btb-btn-cancel">Cancel Purchase ✅</button>
      </div>
      
      <div class="btb-footer">
        💡 Studies show 24-hour delays reduce regretted purchases by 70%
      </div>
    </div>
  `;
  
  // Position popup near button
  document.body.appendChild(popup);
  const buttonRect = button.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  
  // Center popup relative to button
  let left = buttonRect.left + window.scrollX + (buttonRect.width / 2) - (popupRect.width / 2);
  let top = buttonRect.bottom + window.scrollY + 15;
  
  // Keep popup within viewport
  if (left < 10) left = 10;
  if (left + popupRect.width > window.innerWidth - 10) {
    left = window.innerWidth - popupRect.width - 10;
  }
  if (top + popupRect.height > window.innerHeight + window.scrollY) {
    top = buttonRect.top + window.scrollY - popupRect.height - 15;
  }
  
  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
  
  // Event listeners
  popup.querySelector('.btb-btn-cancel').addEventListener('click', () => {
    popup.remove();
    blockedPurchases++;
    moneySaved += price;
    chrome.storage.local.set({
      blockedCount: blockedPurchases,
      savedAmount: moneySaved
    });
    updateStatsDisplay();
  });
  
  popup.querySelector('.btb-btn-wait').addEventListener('click', () => {
    alert('⏰ Come back in 24 hours if you still want this. Your future self will thank you!');
    popup.remove();
    blockedPurchases++;
    moneySaved += price;
    chrome.storage.local.set({
      blockedCount: blockedPurchases,
      savedAmount: moneySaved
    });
    updateStatsDisplay();
  });
  
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!popup.contains(e.target) && !button.contains(e.target)) {
        popup.remove();
        document.removeEventListener('click', closePopup);
      }
    });
  }, 100);
  
  return popup;
}

// Update stats display in popup
function updateStatsDisplay() {
  chrome.runtime.sendMessage({
    action: 'updateStats',
    blockedCount: blockedPurchases,
      savedAmount: moneySaved
  });
}

// Block a buy button
function blockButton(button) {
  if (button.classList.contains('btb-blocked')) return;
  
  button.classList.add('btb-blocked');
  const originalOnClick = button.onclick;
  const originalHref = button.href;
  
  button.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const price = extractPrice(button);
    createInterventionPopup(button, price);
    return false;
  };
  
  if (button.tagName === 'A') {
    button.href = 'javascript:void(0)';
  }
  
  // Store original handlers in case user disables extension
  button.dataset.btbOriginalOnclick = originalOnClick;
  button.dataset.btbOriginalHref = originalHref;
}

// Scan page for buy buttons
function scanAndBlockButtons() {
  BUY_BUTTON_SELECTORS.forEach(selector => {
    try {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(blockButton);
    } catch (e) {
      console.log('BTB: Invalid selector', selector);
    }
  });
}

// Initialize extension
console.log('🛑 Block The Buy: Extension active on this page');
scanAndBlockButtons();

// Watch for dynamically added buttons
const observer = new MutationObserver((mutations) => {
  scanAndBlockButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Scan every 2 seconds as fallback
setInterval(scanAndBlockButtons, 2000);

