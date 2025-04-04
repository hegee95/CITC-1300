// --- Bookshelf Interaction ---
const modal = document.getElementById('bookModal');
const modalTitle = document.getElementById('modal-book-title');
const modalSummaryContainer = document.getElementById('modal-book-summary');
const closeBtn = document.querySelector('.modal-close');
const books = document.querySelectorAll('.book');

// Check if modal elements exist before adding listeners
if (modal && modalTitle && modalSummaryContainer && closeBtn && books.length > 0) {

    books.forEach(book => {
        book.addEventListener('click', () => {
            // Get data from the clicked book
            const title = book.getAttribute('data-title');
            const summary = book.getAttribute('data-summary');

            // Populate the modal
            modalTitle.textContent = title;

            // Clear previous summary and add new paragraphs
            modalSummaryContainer.innerHTML = ''; // Clear existing content
            // Split summary into paragraphs if needed (assuming paragraphs are separated by newlines in the attribute)
            const summaryParagraphs = summary.split('\n').filter(p => p.trim() !== '');
            summaryParagraphs.forEach(paraText => {
                const p = document.createElement('p');
                p.textContent = paraText.trim();
                modalSummaryContainer.appendChild(p);
            });

            // Show the modal
            modal.style.display = 'block';
        });
    });

    // Close modal when clicking the close button (x)
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content area
    window.addEventListener('click', (event) => {
        // Make sure modal is actually displayed before hiding
        if (event.target == modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // Optional: Close modal with the Escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

} else {
    // Log an error if essential elements are missing
    console.error("Bookshelf modal elements not found. Interaction script will not run.");
}