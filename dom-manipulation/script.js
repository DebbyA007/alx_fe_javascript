// Default quotes array
const defaultQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "wisdom" },
    { text: "The only impossible journey is the one you never begin.", category: "motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "wisdom" }
];

// Global quotes array
let quotes = [];
let currentQuoteIndex = 0;

// STEP 1: Storage configuration
const STORAGE_KEY = 'dynamicQuotes';
const SESSION_KEY = 'lastViewedQuote';

// STEP 1: Initialize application with storage
function initializeApp() {
    loadQuotes();
    updateStorageStatus();
    populateCategoryFilter();
    loadLastViewedQuote();
}

// STEP 1: Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem(STORAGE_KEY);
    if (savedQuotes) {
        try {
            quotes = JSON.parse(savedQuotes);
            console.log('Loaded quotes from localStorage:', quotes.length);
        } catch (error) {
            console.error('Error parsing saved quotes:', error);
            quotes = [...defaultQuotes];
        }
    } else {
        quotes = [...defaultQuotes];
        saveQuotes(); // Save defaults to localStorage
    }
}

// STEP 1: Save quotes to localStorage
function saveQuotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        updateStorageStatus();
        console.log('Quotes saved to localStorage');
    } catch (error) {
        console.error('Error saving quotes:', error);
        alert('Error saving quotes to local storage');
    }
}

// STEP 1: Update storage status display
function updateStorageStatus() {
    const statusElement = document.getElementById('storageStatus');
    const quotesCount = quotes.length;
    const storageSize = localStorage.getItem(STORAGE_KEY)?.length || 0;
    statusElement.textContent = `${quotesCount} quotes stored (${storageSize} characters)`;
}

// STEP 1: Save last viewed quote to sessionStorage
function saveLastViewedQuote(index) {
    sessionStorage.setItem(SESSION_KEY, index.toString());
}

// STEP 1: Load last viewed quote from sessionStorage
function loadLastViewedQuote() {
    const lastIndex = sessionStorage.getItem(SESSION_KEY);
    if (lastIndex !== null && quotes.length > 0) {
        currentQuoteIndex = parseInt(lastIndex);
        if (currentQuoteIndex >= quotes.length) {
            currentQuoteIndex = 0;
        }
        displayQuote(quotes[currentQuoteIndex]);
    }
}

// Display a quote
function displayQuote(quote) {
    document.getElementById('quoteDisplay').textContent = quote.text;
    document.getElementById('categoryDisplay').textContent = `Category: ${quote.category}`;
}

// Show random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        alert('No quotes available');
        return;
    }

    const categoryFilter = document.getElementById('categoryFilter').value;
    let filteredQuotes = quotes;
    
    if (categoryFilter !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === categoryFilter);
    }

    if (filteredQuotes.length === 0) {
        alert('No quotes found for the selected category');
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex];
    
    // Find the index in the original quotes array
    currentQuoteIndex = quotes.findIndex(quote => quote === selectedQuote);
    
    displayQuote(selectedQuote);
    saveLastViewedQuote(currentQuoteIndex);
}

// Populate category filter
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Show add quote form
function createAddQuoteForm() {
    document.getElementById('addQuoteForm').style.display = 'block';
    document.getElementById('newQuoteText').focus();
}

// Hide add quote form
function cancelAddQuote() {
    document.getElementById('addQuoteForm').style.display = 'none';
    document.getElementById('newQuoteText').value = '';
}

// Add new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText === '') {
        alert('Please enter a quote text');
        return;
    }

    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes(); // STEP 1: Save to localStorage
    populateCategoryFilter();
    
    alert('Quote added successfully!');
    cancelAddQuote();
}

// STEP 2: Export quotes to JSON file
function exportToJsonFile() {
    if (quotes.length === 0) {
        alert('No quotes to export');
        return;
    }

    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    URL.revokeObjectURL(url);
    alert('Quotes exported successfully!');
}

// STEP 2: Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            
            // Validate imported data
            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid file format: expected an array of quotes');
            }
            
            // Validate each quote object
            for (const quote of importedQuotes) {
                if (!quote.text || !quote.category) {
                    throw new Error('Invalid quote format: each quote must have text and category');
                }
            }
            
            // Add imported quotes to existing quotes
            quotes.push(...importedQuotes);
            saveQuotes(); // STEP 1: Save to localStorage
            populateCategoryFilter();
            
            alert(`${importedQuotes.length} quotes imported successfully!`);
            
            // Clear the file input
            event.target.value = '';
            
        } catch (error) {
            console.error('Error importing quotes:', error);
            alert('Error importing quotes: ' + error.message);
        }
    };
    
    fileReader.onerror = function() {
        alert('Error reading file');
    };
    
    fileReader.readAsText(file);
}

// Initialize the application when page loads
window.addEventListener('load', initializeApp);

// Handle page visibility change to update session storage
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveLastViewedQuote(currentQuoteIndex);
    }
});
