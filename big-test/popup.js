// Popup script for Block The Buy extension

// Load stats from storage and display
chrome.storage.local.get(['blockedCount', 'savedAmount'], (result) => {
  const blockedCount = result.blockedCount || 0;
  const savedAmount = result.savedAmount || 0;
  const hoursSaved = Math.round(savedAmount / 30);

  // Format numbers with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatCurrency(amount) {
    return '$' + formatNumber(Math.round(amount));
  }

  document.getElementById('blocked-count').textContent = formatNumber(blockedCount);
  document.getElementById('money-saved').textContent = formatCurrency(savedAmount);
  document.getElementById('hours-saved').textContent = formatNumber(hoursSaved);
});

// Reset button functionality
document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('⚠️ Reset all stats?\n\nThis will permanently delete:\n• Blocked purchase count\n• Money saved total\n• Work hours saved\n\nThis cannot be undone.')) {
    chrome.storage.local.set({
      blockedCount: 0,
      savedAmount: 0
    }, () => {
      // Update display immediately
      document.getElementById('blocked-count').textContent = '0';
      document.getElementById('money-saved').textContent = '$0';
      document.getElementById('hours-saved').textContent = '0';
      
      // Show confirmation
      const btn = document.getElementById('reset-btn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Reset Complete!';
      btn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    });
  }
});

// Listen for stats updates from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    const blockedCount = request.blockedCount || 0;
    const savedAmount = request.savedAmount || 0;
    const hoursSaved = Math.round(savedAmount / 30);

    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatCurrency(amount) {
      return '$' + formatNumber(Math.round(amount));
    }

    document.getElementById('blocked-count').textContent = formatNumber(blockedCount);
    document.getElementById('money-saved').textContent = formatCurrency(savedAmount);
    document.getElementById('hours-saved').textContent = formatNumber(hoursSaved);
  }
});

