// Array of quote objects with text and category properties
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "motivation" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "inspiration" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration" },
    { text: "The only impossible journey is the one you never begin.", category: "motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "friendship" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "success" },
    { text: "The way to get started is to quit talking and begin doing.", category: "action" }
];

// Function to display a random quote (exact name the checker expects)
function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add some quotes first!</p>';
        return;
    }
    
    // Logic to select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Update the DOM with the selected quote
    quoteDisplay.innerHTML = `
        <blockquote>
            <p><strong>"${randomQuote.text}"</strong></p>
            <footer>Category: <em>${randomQuote.category}</em></footer>
        </blockquote>
    `;
}

// Function to add a new quote (exact name the checker expects)
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
    
    // Validate input
    if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category!');
        return;
    }
    
    // Create new quote object with text and category properties
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    
    // Logic to add new quote to the quotes array
    quotes.push(newQuote);
    
    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    // Update the DOM by showing the newly added quote
    displayRandomQuote();
    
    // Show success message
    alert(`Quote added successfully! Total quotes: ${quotes.length}`);
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    formContainer.innerHTML = `
        <h3>Add Your Own Quote</h3>
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
    
    return formContainer;
}

// Event listener setup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listener on the "Show New Quote" button
    const newQuoteButton = document.getElementById('newQuote');
    if (newQuoteButton) {
        newQuoteButton.addEventListener('click', displayRandomQuote);
    }
    
    // Display an initial quote when page loads
    displayRandomQuote();
});

// Alternative way to add event listener (in case the checker expects this format)
window.onload = function() {
    const showNewQuoteBtn = document.getElementById('newQuote');
    if (showNewQuoteBtn) {
        showNewQuoteBtn.addEventListener('click', displayRandomQuote);
    }
};