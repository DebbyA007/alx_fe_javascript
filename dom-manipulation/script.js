// Initial quotes array with categories
let quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        category: "motivation"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        category: "leadership"
    },
    {
        text: "Life is what happens to you while you're busy making other plans.",
        category: "life"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        category: "dreams"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        category: "motivation"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        category: "inspiration"
    }
];

// Global variables
let currentCategory = 'all';
let filteredQuotes = [];

// Initialize the application
function initializeApp() {
    loadQuotes();
    loadLastSelectedCategory(); // This restores the last selected category when page loads
    populateCategories();
    filterQuote(); // Updated to use singular function name
}

// Step 2.1: Populate Categories Dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Extract unique categories from quotes
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    // Set the last selected category
    categoryFilter.value = currentCategory;
}

// Step 2.2: Filter Quotes Based on Selected Category (Note: Function name is filterQuote - singular)
function filterQuote() {
    const categoryFilter = document.getElementById('categoryFilter');
    currentCategory = categoryFilter.value;
    
    // Filter quotes based on selected category
    if (currentCategory === 'all') {
        filteredQuotes = [...quotes];
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
    }
    
    // Save the selected category to local storage
    saveLastSelectedCategory();
    
    // Update the display if there are filtered quotes
    if (filteredQuotes.length > 0) {
        showRandomQuote();
    } else {
        document.getElementById('quoteText').textContent = 'No quotes available for this category.';
        document.getElementById('quoteCategory').textContent = '';
    }
}

// Display a random quote from filtered quotes
function showRandomQuote() {
    if (filteredQuotes.length === 0) {
        document.getElementById('quoteText').textContent = 'No quotes available.';
        document.getElementById('quoteCategory').textContent = '';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    document.getElementById('quoteText').textContent = randomQuote.text;
    document.getElementById('quoteCategory').textContent = `Category: ${randomQuote.category}`;
}

// Step 2.3: Remember the Last Selected Filter
function saveLastSelectedCategory() {
    // Save the selected category to local storage
    localStorage.setItem('lastSelectedCategory', currentCategory);
}

function loadLastSelectedCategory() {
    // Restore the last selected category when the page loads
    const savedCategory = localStorage.getItem('lastSelectedCategory');
    if (savedCategory) {
        currentCategory = savedCategory;
        // Set the dropdown to the saved category
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = currentCategory;
        }
    }
}

// Step 3: Update Web Storage with Category Data
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (quoteText && quoteCategory) {
        const newQuote = {
            text: quoteText,
            category: quoteCategory.toLowerCase()
        };
        
        quotes.push(newQuote);
        saveQuotes();
        
        // Update categories dropdown if new category is introduced
        populateCategories();
        
        // Re-filter quotes to include the new quote if it matches current filter
        filterQuote();
        
        // Clear the form
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

// Export quotes to JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quotes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes = importedQuotes;
            saveQuotes();
            populateCategories();
            filterQuote();
            alert('Quotes imported successfully!');
        } catch (error) {
            alert('Error importing quotes. Please check the file format.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Add quote form submission
    document.getElementById('addQuoteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addQuote();
    });
    
    // Import file change event
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
});
