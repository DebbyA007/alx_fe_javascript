let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "motivation" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "inspiration" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration" },
    { text: "The only impossible journey is the one you never begin.", category: "motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "friendship" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "success" },
    { text: "The way to get started is to quit talking and begin doing.", category: "action" }
];
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add some quotes first!</p>';
        return;
    }
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
      quoteDisplay.innerHTML = `
        <blockquote>
            <p><strong>"${randomQuote.text}"</strong></p>
            <footer>Category: <em>${randomQuote.category}</em></footer>
        </blockquote>
    `;
}
function createAddQuoteForm() {
     const formContainer = document.createElement('div');
    formContainer.className = 'dynamic-form';
    formContainer.innerHTML = `
        <h3>Dynamically Created Form</h3>
        <input type="text" id="dynamicQuoteText" placeholder="Enter quote text" />
        <input type="text" id="dynamicQuoteCategory" placeholder="Enter category" />
        <button onclick="addDynamicQuote()">Add Quote Dynamically</button>
    `;
    }
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
     if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category!');
        return;
        }
         const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
     quotes.push(newQuote);
       document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
     alert(`Quote added successfully! Total quotes: ${quotes.length}`);
       showRandomQuote();
}
function addDynamicQuote() {
    const quoteText = document.getElementById('dynamicQuoteText').value.trim();
    const quoteCategory = document.getElementById('dynamicQuoteCategory').value.trim();
    
    if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category!');
        return;
    }
    
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById('dynamicQuoteText').value = '';
    document.getElementById('dynamicQuoteCategory').value = '';
    alert('Quote added from dynamic form!');
}
document.addEventListener('DOMContentLoaded', function() {
    const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.addEventListener('click', showRandomQuote);
       showRandomQuote();
});
function filterQuotesByCategory(category) {
    return quotes.filter(quote => quote.category.toLowerCase() === category.toLowerCase());
}

function displayQuotesByCategory(category) {
    const filteredQuotes = filterQuotesByCategory(category);
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found for category: ${category}</p>`;
        return;
    }
    
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `
        <blockquote>
        <p><strong>"${randomQuote.text}"</strong></p>
            <footer>Category: <em>${randomQuote.category}</em></footer>
        </blockquote>
    `;
}  