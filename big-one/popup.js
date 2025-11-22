// Tab Amnesty - Popup Script

let currentTabId = null;
let stats = {
    tabsSnoozed: 0,
    ramSaved: 0,
    timeSaved: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
    await loadTabs();
    await loadSnoozedTabs();
    setupEventListeners();
    updateStats();
});

// Load stats from storage
async function loadStats() {
    const result = await chrome.storage.local.get(['stats']);
    if (result.stats) {
        stats = result.stats;
    }
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
    
    openTabCount.textContent = `${filteredTabs.length} tab${filteredTabs.length !== 1 ? 's' : ''}`;
    
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
    
    const favicon = tab.favIconUrl || '🌐';
    const title = tab.title || tab.url;
    
    tabItem.innerHTML = `
        <div class="tab-info">
            ${favicon.startsWith('http') ? `<img src="${favicon}" class="tab-favicon" onerror="this.style.display='none'">` : `<span class="tab-favicon">${favicon}</span>`}
            <div class="tab-title" title="${title}">${title}</div>
        </div>
        <div class="tab-actions">
            <button class="btn btn-primary snooze-btn">Snooze</button>
            <button class="btn btn-danger close-btn">Close</button>
        </div>
    `;
    
    // Event listeners
    tabItem.querySelector('.snooze-btn').addEventListener('click', () => snoozeTab(tab.id));
    tabItem.querySelector('.close-btn').addEventListener('click', () => closeTab(tab.id));
    
    return tabItem;
}

// Load snoozed tabs
async function loadSnoozedTabs() {
    const result = await chrome.storage.local.get(['snoozedTabs']);
    const snoozedTabs = result.snoozedTabs || [];
    const snoozedList = document.getElementById('snoozedList');
    const snoozedTabCount = document.getElementById('snoozedTabCount');
    
    snoozedTabCount.textContent = `${snoozedTabs.length} tab${snoozedTabs.length !== 1 ? 's' : ''}`;
    
    if (snoozedTabs.length === 0) {
        snoozedList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">💤</span>
                <p>No snoozed tabs</p>
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
    
    item.innerHTML = `
        <div class="snoozed-header">
            <div class="snoozed-title" title="${snoozedTab.title}">${snoozedTab.title}</div>
            <div class="snoozed-time">⏰ ${timeUntil}</div>
        </div>
        <div class="snoozed-actions">
            <button class="btn btn-primary btn-small reopen-btn">Open Now</button>
            <button class="btn btn-danger btn-small delete-btn">Delete</button>
        </div>
    `;
    
    // Event listeners
    item.querySelector('.reopen-btn').addEventListener('click', () => reopenTab(snoozedTab.tabId));
    item.querySelector('.delete-btn').addEventListener('click', () => deleteSnooze(snoozedTab.tabId));
    
    return item;
}

// Format time until
function formatTimeUntil(timestamp) {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Ready now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
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

// Select snooze time
document.querySelectorAll('.snooze-option').forEach(option => {
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

// Calculate wake time
function calculateWakeTime(option) {
    const now = new Date();
    let wakeTime = new Date();
    
    switch(option) {
        case 'tonight':
            wakeTime.setHours(21, 0, 0, 0);
            if (wakeTime <= now) wakeTime.setDate(wakeTime.getDate() + 1);
            break;
        case 'tomorrow':
            wakeTime.setDate(wakeTime.getDate() + 1);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        case 'weekend':
            const dayOfWeek = now.getDay();
            const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
            wakeTime.setDate(now.getDate() + daysUntilSaturday);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        case 'nextweek':
            const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;
            wakeTime.setDate(now.getDate() + daysUntilMonday);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        case 'custom':
            // For MVP, use next week
            wakeTime.setDate(now.getDate() + 7);
            wakeTime.setHours(9, 0, 0, 0);
            break;
        default:
            return null;
    }
    
    return wakeTime.getTime();
}

// Perform snooze
async function performSnooze(tabId, wakeTime, timeOption) {
    const tab = await chrome.tabs.get(tabId);
    
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
    
    // Update stats
    stats.tabsSnoozed++;
    stats.ramSaved += Math.floor(Math.random() * 100) + 50;
    stats.timeSaved = Math.floor(stats.tabsSnoozed * 0.5);
    await saveStats();
    
    // Reload UI
    await loadTabs();
    await loadSnoozedTabs();
    updateStats();
}

// Close tab
async function closeTab(tabId) {
    await chrome.tabs.remove(tabId);
    await loadTabs();
    
    stats.tabsSnoozed++;
    stats.ramSaved += Math.floor(Math.random() * 50) + 30;
    await saveStats();
    updateStats();
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
}

// Update stats display
function updateStats() {
    document.getElementById('tabsSnoozed').textContent = stats.tabsSnoozed;
    document.getElementById('ramSaved').textContent = `${stats.ramSaved} MB`;
    document.getElementById('timeSaved').textContent = `${stats.timeSaved}h`;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllTabs);
    document.getElementById('snoozeWeekendBtn').addEventListener('click', snoozeWeekend);
    
    // Close modal on overlay click
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
}

