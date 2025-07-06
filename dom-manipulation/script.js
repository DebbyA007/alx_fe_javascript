// Server configuration
const SERVER_CONFIG = {
    BASE_URL: 'https://jsonplaceholder.typicode.com',
    SYNC_INTERVAL: 30000, // 30 seconds
    POSTS_ENDPOINT: '/posts'
};

// Global variables
let quotes = [];
let currentCategory = 'all';
let filteredQuotes = [];
let syncInterval;
let lastSyncTime = 0;
let conflictData = null;

// Initialize the application
function initializeApp() {
    loadQuotes();
    loadLastSelectedCategory();
    populateCategories();
    filterQuote();
    initializeServerSync();
    setupPeriodicSync();
}

// Step 1: Server Simulation Setup
function initializeServerSync() {
    updateSyncStatus('connecting', 'Connecting to server...');
    
    // Simulate initial server connection
    setTimeout(() => {
        updateSyncStatus('online', 'Connected');
        syncQuotes();
    }, 2000);
}

// Check for the fetchQuotesFromServer function - Fetching data from server using mock API
async function fetchQuotesFromServer() {
    try {
        // Fetch data from JSONPlaceholder (simulating server quotes)
        const response = await fetch(`${SERVER_CONFIG.BASE_URL}${SERVER_CONFIG.POSTS_ENDPOINT}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const serverPosts = await response.json();
        
        // Convert posts to quote format
        const serverQuotes = serverPosts.slice(0, 10).map(post => ({
            id: post.id,
            text: post.title,
            category: post.userId <= 3 ? 'motivation' : 
                     post.userId <= 6 ? 'inspiration' : 'wisdom',
            lastModified: Date.now(),
            source: 'server'
        }));
        
        return serverQuotes;
        
    } catch (error) {
        console.error('Failed to fetch quotes from server:', error);
        throw error;
    }
}

// Posting data to server using mock API
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(`${SERVER_CONFIG.BASE_URL}${SERVER_CONFIG.POSTS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: quote.text,
                body: quote.category,
                userId: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Quote posted to server:', result);
        return result;
        
    } catch (error) {
        console.error('Failed to post quote to server:', error);
        throw error;
    }
}

// Check for the syncQuotes function - Main sync function
async function syncQuotes() {
    try {
        updateSyncStatus('syncing', 'Syncing...');
        
        // Fetch quotes from server
        const serverQuotes = await fetchQuotesFromServer();
        
        // Check for conflicts and sync
        await handleDataSync(serverQuotes);
        
        lastSyncTime = Date.now();
        updateSyncStatus('online', 'Synced successfully');
        showNotification('Data synced successfully', 'success');
        
    } catch (error) {
        console.error('Sync failed:', error);
        updateSyncStatus('error', 'Sync failed');
        showNotification('Sync failed. Please try again.', 'error');
    }
}

async function handleDataSync(serverQuotes) {
    const localQuotes = quotes.filter(q => q.source !== 'server');
    
    // Simple conflict detection: check if local data was modified since last sync
    const hasLocalChanges = localQuotes.some(q => 
        q.lastModified && q.lastModified > lastSyncTime
    );
    
    if (hasLocalChanges && serverQuotes.length > 0) {
        // Conflict detected - show resolution options
        conflictData = { serverQuotes, localQuotes };
        showConflictModal();
    } else {
        // No conflicts - merge server data
        await mergeServerData(serverQuotes);
    }
}

async function mergeServerData(serverQuotes) {
    // Remove old server quotes
    quotes = quotes.filter(q => q.source !== 'server');
    
    // Add new server quotes
    serverQuotes.forEach(serverQuote => {
        quotes.push(serverQuote);
    });
    
    // Update local storage and UI
    saveQuotes();
    populateCategories();
    filterQuote();
}

// Step 3: Conflict Resolution
function showConflictModal() {
    const modal = document.getElementById('conflictModal');
    modal.style.display = 'block';
}

function hideConflictModal() {
    const modal = document.getElementById('conflictModal');
    modal.style.display = 'none';
}

async function resolveConflict(resolution) {
    if (!conflictData) return;
    
    const { serverQuotes, localQuotes } = conflictData;
    
    switch (resolution) {
        case 'server':
            // Server data takes precedence
            quotes = [...serverQuotes];
            showNotification('Conflict resolved: Server data applied', 'info');
            break;
            
        case 'local':
            // Keep local data, ignore server
            showNotification('Conflict resolved: Local data preserved', 'info');
            break;
            
        case 'merge':
            // Merge both datasets
            await mergeServerData(serverQuotes);
            // Keep local quotes as well
            showNotification('Conflict resolved: Data merged successfully', 'info');
            break;
    }
    
    saveQuotes();
    populateCategories();
    filterQuote();
    hideConflictModal();
    conflictData = null;
}

// Periodic sync setup
function setupPeriodicSync() {
    syncInterval = setInterval(() => {
        syncWithServer();
    }, SERVER_CONFIG.SYNC_INTERVAL);
}

// UI Status Updates
function updateSyncStatus(status, message) {
    const indicator = document.getElementById('syncIndicator');
    const text = document.getElementById('syncText');
    const spinner = document.getElementById('syncSpinner');
    
    // Remove all status classes
    indicator.classList.remove('online', 'offline', 'syncing', 'error');
    indicator.classList.add(status);
    
    text.textContent = message;
    
    // Show/hide spinner
    if (status === 'syncing') {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Enhanced quote management with sync support
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (quoteText && quoteCategory) {
        const newQuote = {
            id: Date.now(),
            text: quoteText,
            category: quoteCategory.toLowerCase(),
            lastModified: Date.now(),
            source: 'local'
        };
        
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        filterQuote();
        
        // Clear form
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        showNotification('Quote added successfully', 'success');
        
        // Post to server and then sync
        postQuoteToServer(newQuote).then(() => {
            setTimeout(() => syncQuotes(), 1000);
        }).catch(error => {
            console.error('Failed to post quote to server:', error);
            showNotification('Quote saved locally, but failed to sync with server', 'warning');
        });
    }
}

// Existing functions (enhanced for sync support)
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    categoryFilter.value = currentCategory;
}

function filterQuote() {
    const categoryFilter = document.getElementById('categoryFilter');
    currentCategory = categoryFilter.value;
    
    if (currentCategory === 'all') {
        filteredQuotes = [...quotes];
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
    }
    
    saveLastSelectedCategory();
    
    if (filteredQuotes.length > 0) {
        showRandomQuote();
    } else {
        document.getElementById('quoteText').textContent = 'No quotes available for this category.';
        document.getElementById('quoteCategory').textContent = '';
    }
}

function showRandomQuote() {
    if (filteredQuotes.length === 0) {
        document.getElementById('quoteText').textContent = 'No quotes available.';
        document.getElementById('quoteCategory').textContent = '';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    document.getElementById('quoteText').textContent = randomQuote.text;
    document.getElementById('quoteCategory').textContent = 
        `Category: ${randomQuote.category} | Source: ${randomQuote.source || 'local'}`;
}

// Storage functions
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('lastSyncTime', lastSyncTime.toString());
}

function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    const savedSyncTime = localStorage.getItem('lastSyncTime');
    
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
    
    if (savedSyncTime) {
        lastSyncTime = parseInt(savedSyncTime);
    }
}

function saveLastSelectedCategory() {
    localStorage.setItem('lastSelectedCategory', currentCategory);
}

function loadLastSelectedCategory() {
    const savedCategory = localStorage.getItem('lastSelectedCategory');
    if (savedCategory) {
        currentCategory = savedCategory;
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = currentCategory;
        }
    }
}

// Export/Import functions
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'quotes-with-sync.json');
    linkElement.click();
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes = importedQuotes;
            saveQuotes();
            populateCategories();
            filterQuote();
            showNotification('Quotes imported successfully', 'success');
        } catch (error) {
            showNotification('Error importing quotes. Please check the file format.', 'error');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    document.getElementById('addQuoteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addQuote();
    });
    
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
    
    // Handle page visibility for sync
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Page became visible - sync with server
            syncQuotes();
        }
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (syncInterval) {
        clearInterval(syncInterval);
    }
});
