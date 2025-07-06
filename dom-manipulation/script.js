// Global quotes array - starts with some sample quotes
let quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        category: "Success",
        author: "Steve Jobs"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        category: "Innovation",
        author: "Steve Jobs"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        category: "Dreams",
        author: "Eleanor Roosevelt"
    },
    {
        text: "It is during our darkest moments that we must focus to see the light.",
        category: "Motivation",
        author: "Aristotle"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        category: "Success",
        author: "Winston Churchill"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        category: "Motivation",
        author: "Tony Robbins"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        category: "Opportunity",
        author: "Albert Einstein"
    },
    {
        text: "Life is what happens to you while you're busy making other plans.",
        category: "Life",
        author: "John Lennon"
    }
];

// Current selected category filter
let selectedCategory = 'all';

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const toggleAddFormBtn = document.getElementById('toggleAddForm');
const addQuoteForm = document.getElementById('addQuoteForm');
const exportBtn = document.getElementById('exportQuotes');
const clearBtn = document.getElementById('clearQuotes');
const categoryFilter = document.getElementById('categoryFilter');
const quoteCount = document.getElementById('quoteCount');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateQuoteCount();
    createCategoryFilter();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    newQuoteBtn.addEventListener('click', showRandomQuote);
    toggleAddFormBtn.addEventListener('click', toggleAddQuoteForm);
    exportBtn.addEventListener('click', exportQuotes);
    clearBtn.addEventListener('click', clearAllQuotes);

    // Add Enter key support for form inputs
    document.getElementById('newQuoteText').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addQuote();
        }
    });
}

/**
 * Display a random quote from the selected category
 * This function demonstrates advanced DOM manipulation
 */
function showRandomQuote() {
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase());

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `
            <div class="empty-state">
                No quotes available in the "${selectedCategory}" category. 
                Try selecting a different category or add some quotes!
            </div>
        `;
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    // Create quote display with dynamic content creation
    quoteDisplay.innerHTML = `
        <div class="quote-text">"${escapeHtml(quote.text)}"</div>
        <div class="quote-category">Category: ${escapeHtml(quote.category)}</div>
        ${quote.author ? `<div class="quote-author">— ${escapeHtml(quote.author)}</div>` : ''}
    `;

    // Add animation effect through DOM manipulation
    quoteDisplay.style.opacity = '0';
    setTimeout(() => {
        quoteDisplay.style.opacity = '1';
    }, 100);
}

/**
 * Create category filter buttons dynamically
 * Demonstrates creating and managing DOM elements
 */
function createCategoryFilter() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing categories
    categoryFilter.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${category === selectedCategory ? 'active' : ''}`;
        btn.textContent = category === 'all' ? 'All Categories' : category;
        btn.addEventListener('click', () => filterByCategory(category));
        categoryFilter.appendChild(btn);
    });
}

/**
 * Filter quotes by category
 * Updates DOM elements based on user interaction
 */
function filterByCategory(category) {
    selectedCategory = category;
    
    // Update active button using DOM manipulation
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show a new quote from the selected category
    showRandomQuote();
}

/**
 * Toggle the add quote form visibility
 * Demonstrates dynamic form creation and management
 */
function toggleAddQuoteForm() {
    const isVisible = addQuoteForm.classList.contains('active');
    
    if (isVisible) {
        addQuoteForm.classList.remove('active');
        toggleAddFormBtn.textContent = 'Add New Quote';
    } else {
        addQuoteForm.classList.add('active');
        toggleAddFormBtn.textContent = 'Hide Form';
        document.getElementById('newQuoteText').focus();
    }
}

/**
 * Create add quote form dynamically
 * This function demonstrates advanced form creation through DOM manipulation
 */
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteForm';
    formContainer.className = 'add-quote-form';
    
    formContainer.innerHTML = `
        <h3>Add Your Own Quote</h3>
        <div class="form-group">
            <label for="newQuoteText">Quote Text:</label>
            <textarea id="newQuoteText" placeholder="Enter your inspiring quote here..." required></textarea>
        </div>
        <div class="form-group">
            <label for="newQuoteCategory">Category:</label>
            <input id="newQuoteCategory" type="text" placeholder="e.g., Motivation, Success, Life" required />
        </div>
        <div class="form-group">
            <label for="newQuoteAuthor">Author (Optional):</label>
            <input id="newQuoteAuthor" type="text" placeholder="Quote author or source" />
        </div>
        <div class="form-actions">
            <button type="button" onclick="addQuote()">Add Quote</button>
            <button type="button" class="btn-secondary" onclick="toggleAddQuoteForm()">Cancel</button>
        </div>
    `;
    
    return formContainer;
}

/**
 * Add a new quote to the collection
 * Demonstrates dynamic content addition and DOM updates
 */
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
    const quoteAuthor = document.getElementById('newQuoteAuthor').value.trim();

    // Validation
    if (!quoteText) {
        alert('Please enter the quote text.');
        document.getElementById('newQuoteText').focus();
        return;
    }

    if (!quoteCategory) {
        alert('Please enter a category for the quote.');
        document.getElementById('newQuoteCategory').focus();
        return;
    }

    // Create new quote object
    const newQuote = {
        text: quoteText,
        category: quoteCategory,
        author: quoteAuthor || null
    };

    // Add to quotes array
    quotes.push(newQuote);

    // Update UI through DOM manipulation
    updateQuoteCount();
    createCategoryFilter();
    
    // Clear form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';

    // Hide form
    toggleAddQuoteForm();

    // Show success message
    showSuccessMessage('Quote added successfully!');

    // Display the new quote
    showRandomQuote();
}

/**
 * Update the quote count display
 * Simple DOM text content manipulation
 */
function updateQuoteCount() {
    quoteCount.textContent = quotes.length;
}

/**
 * Export quotes as JSON
 * Demonstrates file creation and download through DOM manipulation
 */
function exportQuotes() {
    const quotesJson = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link dynamically
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Quotes exported successfully!');
}

/**
 * Clear all quotes with confirmation
 * Demonstrates array manipulation and DOM updates
 */
function clearAllQuotes() {
    if (confirm('Are you sure you want to clear all quotes? This action cannot be undone.')) {
        quotes = [];
        updateQuoteCount();
        createCategoryFilter();
        quoteDisplay.innerHTML = `
            <div class="empty-state">
                All quotes have been cleared. Add some new quotes to get started! ✨
            </div>
        `;
        showSuccessMessage('All quotes cleared!');
    }
}

/**
 * Show success message
 * Demonstrates dynamic element creation and styling
 */
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.
