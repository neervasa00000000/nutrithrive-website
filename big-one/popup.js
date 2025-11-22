// Tab Amnesty - Popup Script

let currentTabId = null;
let stats = {
    tabsSnoozed: 0,
    ramSaved: 0,
    timeSaved: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Always refresh everything when popup opens
    await refreshAll();
    setupEventListeners();
});

// Refresh all data
async function refreshAll() {
    await loadStats();
    await loadTabs();
    await loadSnoozedTabs();
    updateStats();
}

// Also refresh when popup becomes visible (in case it was already open)
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
        await refreshAll();
    }
});

// Load stats from storage and recalculate from actual data
async function loadStats() {
    // Get actual snoozed tabs to calculate real stats
    const result = await chrome.storage.local.get(['snoozedTabs', 'stats']);
    const snoozedTabs = result.snoozedTabs || [];
    
    // Recalculate stats from actual data
    stats.tabsSnoozed = snoozedTabs.length;
    
    // Calculate RAM saved (realistic estimates based on Chrome's actual usage)
    // Each tab typically uses:
    // - Base: 30-50MB (Chrome process overhead)
    // - Content: 20-100MB+ (depending on page complexity)
    // - Average: ~60-80MB per tab
    // We use 75MB as a conservative average
    stats.ramSaved = snoozedTabs.length * 75;
    
    // Calculate time saved (estimate: 0.5 hours per tab)
    stats.timeSaved = Math.floor(snoozedTabs.length * 0.5);
    
    // Save updated stats
    await chrome.storage.local.set({ stats });
}

// Save stats to storage
async function saveStats() {
    await chrome.storage.local.set({ stats });
}

// Load all open tabs
async function loadTabs() {
    const tabs = await chrome.tabs.query({});
    const openTabsList = document.getElementById('openTabsList');
    const openTabCount = document.getElementById('openTabCount');
    
    // Filter out extension pages and this popup
    const filteredTabs = tabs.filter(tab => 
        !tab.url.startsWith('chrome://') && 
        !tab.url.startsWith('chrome-extension://') &&
        !tab.url.startsWith('edge://')
    );
    
    openTabCount.textContent = filteredTabs.length;
    
    if (filteredTabs.length === 0) {
        openTabsList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📑</span>
                <p>No tabs to manage</p>
            </div>
        `;
        return;
    }
    
    openTabsList.innerHTML = '';
    
    filteredTabs.forEach(tab => {
        const tabItem = createTabItem(tab);
        openTabsList.appendChild(tabItem);
    });
}

// Create tab item element
function createTabItem(tab) {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';
    tabItem.dataset.tabId = tab.id;
    
    const title = tab.title || tab.url;
    
    // Create tab info
    const tabInfo = document.createElement('div');
    tabInfo.className = 'tab-info';
    
    // Create favicon element
    const faviconEl = document.createElement('div');
    faviconEl.className = 'tab-favicon';
    if (tab.favIconUrl && tab.favIconUrl.startsWith('http')) {
        const img = document.createElement('img');
        img.src = tab.favIconUrl;
        img.alt = '';
        img.onerror = function() {
            faviconEl.textContent = '🌐';
            faviconEl.style.fontSize = '12px';
        };
        faviconEl.appendChild(img);
    } else {
        faviconEl.textContent = '🌐';
        faviconEl.style.fontSize = '12px';
    }
    
    // Create title
    const titleEl = document.createElement('div');
    titleEl.className = 'tab-title';
    titleEl.textContent = title;
    titleEl.title = title;
    
    tabInfo.appendChild(faviconEl);
    tabInfo.appendChild(titleEl);
    
    // Create actions
    const actions = document.createElement('div');
    actions.className = 'tab-actions';
    
    const snoozeBtn = document.createElement('button');
    snoozeBtn.className = 'btn btn-primary snooze-btn';
    snoozeBtn.textContent = 'Snooze';
    snoozeBtn.addEventListener('click', () => snoozeTab(tab.id));
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-danger close-btn';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => closeTab(tab.id));
    
    actions.appendChild(snoozeBtn);
    actions.appendChild(closeBtn);
    
    tabItem.appendChild(tabInfo);
    tabItem.appendChild(actions);
    
    return tabItem;
}

// Load snoozed tabs
async function loadSnoozedTabs() {
    const result = await chrome.storage.local.get(['snoozedTabs']);
    const snoozedTabs = result.snoozedTabs || [];
    const snoozedList = document.getElementById('snoozedList');
    const snoozedTabCount = document.getElementById('snoozedTabCount');
    
    snoozedTabCount.textContent = snoozedTabs.length;
    
    if (snoozedTabs.length === 0) {
        snoozedList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💤</div>
                <p class="empty-title">No snoozed tabs</p>
                <p class="empty-hint">Snooze tabs to see them here</p>
            </div>
        `;
        return;
    }
    
    snoozedList.innerHTML = '';
    
    snoozedTabs.forEach(snoozedTab => {
        const snoozedItem = createSnoozedItem(snoozedTab);
        snoozedList.appendChild(snoozedItem);
    });
}

// Create snoozed item element
function createSnoozedItem(snoozedTab) {
    const item = document.createElement('div');
    item.className = 'snoozed-item';
    item.dataset.tabId = snoozedTab.tabId;
    
    const timeUntil = formatTimeUntil(snoozedTab.wakeTime);
    
    // Create header
    const header = document.createElement('div');
    header.className = 'snoozed-header';
    
    const title = document.createElement('div');
    title.className = 'snoozed-title';
    title.textContent = snoozedTab.title;
    title.title = snoozedTab.title;
    
    const time = document.createElement('div');
    time.className = 'snoozed-time';
    time.textContent = `⏰ ${timeUntil}`;
    
    header.appendChild(title);
    header.appendChild(time);
    
    // Create actions
    const actions = document.createElement('div');
    actions.className = 'snoozed-actions';
    
    const reopenBtn = document.createElement('button');
    reopenBtn.className = 'btn btn-primary btn-small reopen-btn';
    reopenBtn.textContent = 'Open Now';
    reopenBtn.addEventListener('click', () => reopenTab(snoozedTab.tabId));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-small delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteSnooze(snoozedTab.tabId));
    
    actions.appendChild(reopenBtn);
    actions.appendChild(deleteBtn);
    
    item.appendChild(header);
    item.appendChild(actions);
    
    return item;
}

// Format time until
function formatTimeUntil(timestamp) {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Ready now';
    
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    
    if (days > 0) {
        if (days === 1 && hours === 0) {
            return '1 day';
        } else if (days === 1) {
            return `1 day ${hours}h`;
        } else {
            return `${days} days`;
        }
    } else if (totalHours > 0) {
        return `${totalHours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Snooze tab
function snoozeTab(tabId) {
    currentTabId = tabId;
    document.getElementById('snoozeModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('snoozeModal').classList.remove('active');
    currentTabId = null;
    
    // Remove selected state
    document.querySelectorAll('.snooze-option').forEach(opt => {
        opt.classList.remove('selected');
    });
}

// Setup snooze option listeners (called after DOM is ready)
function setupSnoozeOptions() {
    const snoozeOptions = document.querySelectorAll('.snooze-option');
    snoozeOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const timeOption = option.dataset.time;
            
            // Visual feedback
            document.querySelectorAll('.snooze-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Calculate wake time
            const wakeTime = calculateWakeTime(timeOption);
            
            if (wakeTime) {
                await performSnooze(currentTabId, wakeTime, timeOption);
                closeModal();
            }
        });
    });
}

// Calculate wake time
function calculateWakeTime(option) {
    const now = new Date();
    let wakeTime = new Date();
    const dayOfWeek = now.getDay(); // Get day of week once (0 = Sunday, 6 = Saturday)
    
    switch(option) {
        case 'tonight':
            wakeTime.setHours(21, 0, 0, 0);
            if (wakeTime <= now) wakeTime.setDate(wakeTime.getDate() + 1);
            break;
        case 'tomorrow':
            wakeTime.setDate(now.getDate() + 1);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        case 'weekend':
            // Calculate days until Saturday (6)
            let daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
            if (daysUntilSaturday === 0) daysUntilSaturday = 7; // If it's Saturday, go to next Saturday
            wakeTime.setDate(now.getDate() + daysUntilSaturday);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        case 'nextweek':
            // Calculate days until next Monday (1)
            let daysUntilMonday = (1 - dayOfWeek + 7) % 7;
            if (daysUntilMonday === 0) daysUntilMonday = 7; // If it's Monday, go to next Monday
            wakeTime.setDate(now.getDate() + daysUntilMonday);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        case 'custom':
            // For MVP, add 7 days from now
            wakeTime.setDate(now.getDate() + 7);
            wakeTime.setHours(9, 0, 0, 0);
            // Ensure it's in the future
            if (wakeTime <= now) {
                wakeTime.setDate(wakeTime.getDate() + 1);
            }
            break;
        default:
            return null;
    }
    
    return wakeTime.getTime();
}

// Perform snooze
async function performSnooze(tabId, wakeTime, timeOption) {
    try {
        const tab = await chrome.tabs.get(tabId);
        
        if (!tab) {
            console.error('Tab not found:', tabId);
            return;
        }
        
        // Save snoozed tab
        const result = await chrome.storage.local.get(['snoozedTabs']);
        const snoozedTabs = result.snoozedTabs || [];
        
        snoozedTabs.push({
            tabId: tab.id,
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
            wakeTime: wakeTime,
            snoozedAt: Date.now(),
            timeOption: timeOption
        });
        
        await chrome.storage.local.set({ snoozedTabs });
        
        // Set alarm
        const alarmName = `snooze_${tab.id}_${wakeTime}`;
        chrome.alarms.create(alarmName, {
            when: wakeTime
        });
        
        // Close tab
        await chrome.tabs.remove(tab.id);
        
    // Reload UI first
    await loadTabs();
    await loadSnoozedTabs();
    
    // Recalculate stats from actual data
    await loadStats();
    updateStats();
    
    // Show success toast
    showToast('Tab snoozed successfully!', 'success');
    } catch (error) {
        console.error('Error performing snooze:', error);
    }
}

// Close tab
async function closeTab(tabId) {
    await chrome.tabs.remove(tabId);
    await loadTabs();
    
    // Recalculate stats
    await loadStats();
    updateStats();
    
    showToast('Tab closed', 'success');
}

// Reopen tab
async function reopenTab(tabId) {
    const result = await chrome.storage.local.get(['snoozedTabs']);
    const snoozedTabs = result.snoozedTabs || [];
    const snoozedTab = snoozedTabs.find(st => st.tabId === parseInt(tabId));
    
    if (snoozedTab) {
        await chrome.tabs.create({
            url: snoozedTab.url,
            active: false
        });
        
        // Remove from snoozed
        const updated = snoozedTabs.filter(st => st.tabId !== parseInt(tabId));
        await chrome.storage.local.set({ snoozedTabs: updated });
        
        // Cancel alarm
        const alarmName = `snooze_${tabId}_${snoozedTab.wakeTime}`;
        chrome.alarms.clear(alarmName);
        
        await loadSnoozedTabs();
        await loadTabs();
        
        // Recalculate stats
        await loadStats();
        updateStats();
        
        showToast('Tab reopened!', 'success');
    }
}

// Delete snooze
async function deleteSnooze(tabId) {
    const result = await chrome.storage.local.get(['snoozedTabs']);
    const snoozedTabs = result.snoozedTabs || [];
    const snoozedTab = snoozedTabs.find(st => st.tabId === parseInt(tabId));
    
    if (snoozedTab) {
        // Cancel alarm
        const alarmName = `snooze_${tabId}_${snoozedTab.wakeTime}`;
        chrome.alarms.clear(alarmName);
        
        // Remove from snoozed
        const updated = snoozedTabs.filter(st => st.tabId !== parseInt(tabId));
        await chrome.storage.local.set({ snoozedTabs: updated });
        
        await loadSnoozedTabs();
        
        // Recalculate stats
        await loadStats();
        updateStats();
        
        showToast('Snooze cancelled', 'success');
    }
}

// Clear all tabs
async function clearAllTabs() {
    const tabs = await chrome.tabs.query({});
    const filteredTabs = tabs.filter(tab => 
        !tab.url.startsWith('chrome://') && 
        !tab.url.startsWith('chrome-extension://') &&
        !tab.url.startsWith('edge://')
    );
    
    const wakeTime = calculateWakeTime('tomorrow');
    
    for (const tab of filteredTabs) {
        await performSnooze(tab.id, wakeTime, 'tomorrow');
    }
}

// Snooze until weekend
async function snoozeWeekend() {
    const tabs = await chrome.tabs.query({});
    const filteredTabs = tabs.filter(tab => 
        !tab.url.startsWith('chrome://') && 
        !tab.url.startsWith('chrome-extension://') &&
        !tab.url.startsWith('edge://')
    );
    
    const wakeTime = calculateWakeTime('weekend');
    
    for (const tab of filteredTabs) {
        await performSnooze(tab.id, wakeTime, 'weekend');
    }
    
    // Final refresh
    await refreshAll();
    showToast(`Snoozed ${filteredTabs.length} tabs until weekend`, 'success');
}

// Update stats display with animation
function updateStats() {
    const tabsSnoozedEl = document.getElementById('tabsSnoozed');
    const ramSavedEl = document.getElementById('ramSaved');
    const timeSavedEl = document.getElementById('timeSaved');
    
    // Animate stat updates
    animateValue(tabsSnoozedEl, parseInt(tabsSnoozedEl.textContent) || 0, stats.tabsSnoozed, 300);
    animateValue(ramSavedEl, parseInt(ramSavedEl.textContent) || 0, stats.ramSaved, 300, ' MB');
    animateValue(timeSavedEl, parseInt(timeSavedEl.textContent) || 0, stats.timeSaved, 300, 'h');
}

// Animate number changes
function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.textContent = '✓';
        toastIcon.style.color = 'var(--success)';
        toast.style.borderColor = 'var(--success)';
    } else if (type === 'error') {
        toastIcon.textContent = '✕';
        toastIcon.style.color = 'var(--danger)';
        toast.style.borderColor = 'var(--danger)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    const closeModalBtn = document.getElementById('closeModalBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const snoozeWeekendBtn = document.getElementById('snoozeWeekendBtn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllTabs);
    }
    
    if (snoozeWeekendBtn) {
        snoozeWeekendBtn.addEventListener('click', snoozeWeekend);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Setup snooze options after DOM is ready
    setTimeout(() => {
        setupSnoozeOptions();
    }, 100);
}

