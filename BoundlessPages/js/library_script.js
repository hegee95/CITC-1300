/**
 * library_script.js (Event Delegation Version)
 * Handles interactions for the bookshelf grid in Mylibrary.html (Responsive)
 * Uses event delegation for potentially more robust click handling.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Library script loaded (Event Delegation Version)");

    const bookshelfGrid = document.querySelector('.bookshelf-grid');

    if (!bookshelfGrid) {
        console.error("Bookshelf grid container not found!");
        return;
    }
    console.log("Bookshelf grid found.");

    // --- Helper Function for Pagination ---
    // (Remains largely the same as before)
    function setupPagination(bookElement) {
        console.log("Setting up pagination for:", bookElement?.id);

        const popup = bookElement?.querySelector('.book-popup');
        const synopsisContainer = popup?.querySelector('.synopsis');
        const pages = synopsisContainer?.querySelectorAll('.synopsis-page');
        const popupContent = popup?.querySelector('.popup-content');

        if (!synopsisContainer || !pages || pages.length <= 1 || !popupContent) {
             console.log("No pagination needed or elements missing for:", bookElement?.id);
             popupContent?.querySelector('.pagination-button.prev')?.remove();
             popupContent?.querySelector('.pagination-button.next')?.remove();
            return;
        }
        console.log(`Found ${pages.length} pages for:`, bookElement.id);

        let currentPageIndex = 0;

        // --- Create Buttons ---
        popupContent.querySelector('.pagination-button.prev')?.remove();
        popupContent.querySelector('.pagination-button.next')?.remove();

        const prevButton = document.createElement('button');
        prevButton.classList.add('pagination-button', 'prev');
        prevButton.innerHTML = '&lt;';
        prevButton.disabled = true;
        popupContent.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.classList.add('pagination-button', 'next');
        nextButton.innerHTML = '&gt;';
        popupContent.appendChild(nextButton);
        console.log("Pagination buttons created for:", bookElement.id);

        const showPage = (index) => {
            console.log(`Showing page ${index} for:`, bookElement.id);
            pages.forEach((page, i) => {
                page.classList.toggle('active', i === index);
            });
            prevButton.disabled = index === 0;
            nextButton.disabled = index === pages.length - 1;
            currentPageIndex = index;
             const activePage = synopsisContainer.querySelector('.synopsis-page.active');
             if(activePage) activePage.scrollTop = 0;
        };

        showPage(currentPageIndex);

        prevButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing modal if propagation isn't stopped elsewhere
            console.log("Prev button clicked for:", bookElement.id);
            if (currentPageIndex > 0) {
                showPage(currentPageIndex - 1);
            }
        });

        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Next button clicked for:", bookElement.id);
            if (currentPageIndex < pages.length - 1) {
                showPage(currentPageIndex + 1);
            }
        });

        bookElement.resetPagination = () => {
            console.log("Resetting pagination for:", bookElement.id);
            showPage(0);
        }
        bookElement.removePagination = () => {
             console.log("Removing pagination buttons for:", bookElement.id);
             prevButton.remove();
             nextButton.remove();
         }
    }

    // --- Main Click Handler using Event Delegation ---
    bookshelfGrid.addEventListener('click', (event) => {
        console.log("Click detected inside bookshelf grid. Target:", event.target);

        // --- Check if a book spine image was clicked ---
        const clickedSpine = event.target.closest('.book-item-spine img');
        if (clickedSpine) {
            const bookItem = clickedSpine.closest('.book-item');
            if (!bookItem) return; // Should not happen if HTML is correct

            console.log("Spine clicked for item:", bookItem.id);
            const isAlreadyOpen = bookItem.classList.contains('open');
            const audio = bookItem.querySelector('audio');

            // Close other open items
            document.querySelectorAll('.book-item.open').forEach(openItem => {
                if (openItem !== bookItem) {
                    console.log("Closing other item:", openItem.id);
                    openItem.classList.remove('open');
                    const otherAudio = openItem.querySelector('audio');
                    if (otherAudio) { otherAudio.pause(); otherAudio.currentTime = 0; }
                    if (typeof openItem.resetPagination === 'function') { openItem.resetPagination(); }
                }
            });

            // Toggle the clicked item
            if (isAlreadyOpen) {
                 console.log("Closing item:", bookItem.id);
                 bookItem.classList.remove('open');
                 if (typeof bookItem.resetPagination === 'function') { bookItem.resetPagination(); }
                 if (audio) { audio.pause(); audio.currentTime = 0; }
            } else {
                console.log("Opening item:", bookItem.id);
                bookItem.classList.add('open');
                setupPagination(bookItem);
                if (audio) {
                    audio.volume = 1.0;
                    audio.currentTime = 0;
                    audio.play().catch(error => console.error("Audio play failed:", error));
                }
            }
            return; // Stop processing click here
        }

        // --- Check if a close button was clicked ---
        // Important: Check if the click happened *inside* an open popup
        const clickedCloseButton = event.target.closest('.close-button');
        if (clickedCloseButton) {
            const popup = clickedCloseButton.closest('.book-popup'); // Check if it's inside a book-popup
            const bookItem = popup?.closest('.book-item'); // Find the parent book-item

            // Only proceed if the button is inside a popup that belongs to an OPEN book item
            if (popup && bookItem && bookItem.classList.contains('open')) {
                console.log("Close button clicked for:", bookItem.id);
                event.stopPropagation(); // Good practice, though maybe not strictly needed here

                bookItem.classList.remove('open'); // Close the modal
                const audio = bookItem.querySelector('audio');
                if (typeof bookItem.resetPagination === 'function') { bookItem.resetPagination(); }
                if (audio) { audio.pause(); audio.currentTime = 0; }
                return; // Stop processing click here
            } else {
                 console.log("Close button clicked, but not inside an open book-item's popup.");
            }
        }

        // --- Check if click was on the modal overlay (outside content) ---
        // This requires the specific modal element to be the event target
         if (event.target.classList.contains('book-popup')) {
            const bookItem = event.target.closest('.book-item'); // Find which book item it belongs to
             if (bookItem && bookItem.classList.contains('open')) {
                 console.log("Clicked outside content for:", bookItem.id);
                 bookItem.classList.remove('open');
                 const audio = bookItem.querySelector('audio');
                 if (typeof bookItem.resetPagination === 'function') { bookItem.resetPagination(); }
                 if (audio) { audio.pause(); audio.currentTime = 0; }
                 return;
             }
         }

    }); // End of bookshelfGrid click listener

}); // End DOMContentLoaded
