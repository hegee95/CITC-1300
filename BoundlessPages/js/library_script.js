/**
 * library_script.js
 * Handles interactions for the bookshelf grid in Mylibrary.html (Responsive)
 * - Opens/closes book pop-up modals on spine click.
 * - Plays/pauses associated sound (optional).
 * - Ensures only one pop-up is open at a time.
 * - Handles synopsis pagination within the modal.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select all book items in the grid
    const bookItems = document.querySelectorAll('.book-item');

    // --- Helper Function for Pagination ---
    function setupPagination(bookElement) {
        const popup = bookElement.querySelector('.book-popup');
        const synopsisContainer = popup?.querySelector('.synopsis');
        const pages = synopsisContainer?.querySelectorAll('.synopsis-page');
        const popupContent = popup?.querySelector('.popup-content'); // Container for buttons

        if (!synopsisContainer || !pages || pages.length <= 1 || !popupContent) {
             popupContent?.querySelector('.pagination-button.prev')?.remove();
             popupContent?.querySelector('.pagination-button.next')?.remove();
            return; // No pagination needed
        }

        let currentPageIndex = 0;

        // --- Create Buttons ---
        popupContent.querySelector('.pagination-button.prev')?.remove();
        popupContent.querySelector('.pagination-button.next')?.remove();

        const prevButton = document.createElement('button');
        prevButton.classList.add('pagination-button', 'prev');
        prevButton.innerHTML = '&lt;';
        prevButton.disabled = true;
        popupContent.appendChild(prevButton); // Append to popup content area

        const nextButton = document.createElement('button');
        nextButton.classList.add('pagination-button', 'next');
        nextButton.innerHTML = '&gt;';
        popupContent.appendChild(nextButton); // Append to popup content area

        // --- Show Page Function ---
        const showPage = (index) => {
            pages.forEach((page, i) => {
                page.classList.toggle('active', i === index);
            });
            prevButton.disabled = index === 0;
            nextButton.disabled = index === pages.length - 1;
            currentPageIndex = index;
            // Scroll page content to top
             const activePage = synopsisContainer.querySelector('.synopsis-page.active');
             if(activePage) activePage.scrollTop = 0;
        };

        showPage(currentPageIndex); // Show first page

        // --- Button Event Listeners ---
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPageIndex > 0) {
                showPage(currentPageIndex - 1);
            }
        });

        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPageIndex < pages.length - 1) {
                showPage(currentPageIndex + 1);
            }
        });

        // Store reset function
        bookElement.resetPagination = () => showPage(0);
         // Store cleanup function
         bookElement.removePagination = () => {
             prevButton.remove();
             nextButton.remove();
         }
    }


    // --- Main Book Item Interaction Logic ---
    bookItems.forEach(bookItem => {
        const spine = bookItem.querySelector('.book-item-spine img');
        const audio = bookItem.querySelector('audio');
        const popup = bookItem.querySelector('.book-popup');
        const closeButton = popup?.querySelector('.close-button');

        // Add click listener to the book spine image
        if (spine) {
            spine.addEventListener('click', () => {
                // Close any other open popups first
                document.querySelectorAll('.book-item.open').forEach(openItem => {
                    if (openItem !== bookItem) {
                        openItem.classList.remove('open');
                        const otherAudio = openItem.querySelector('audio');
                        if (otherAudio) { otherAudio.pause(); otherAudio.currentTime = 0; }
                        if (typeof openItem.resetPagination === 'function') { openItem.resetPagination(); }
                    }
                });

                // Open the clicked item's popup
                bookItem.classList.add('open'); // Add .open to show modal

                // Handle audio and pagination
                setupPagination(bookItem); // Setup pagination when opening
                if (audio) {
                    audio.volume = 1.0; // Ensure full volume
                    audio.currentTime = 0;
                    audio.play().catch(error => console.error("Audio play failed:", error));
                }
            });
        }

        // Add click listener to the close button
        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                bookItem.classList.remove('open'); // Remove .open to hide modal
                if (typeof bookItem.resetPagination === 'function') { bookItem.resetPagination(); }
                if (audio) { audio.pause(); audio.currentTime = 0; }
                 // Optionally remove buttons on close
                 // if (typeof bookItem.removePagination === 'function') { bookItem.removePagination(); }
            });
        }

        // Optional: Close modal if clicking outside the content area
        if (popup) {
            popup.addEventListener('click', (event) => {
                // Check if the click target is the overlay itself (not the content)
                if (event.target === popup) {
                     bookItem.classList.remove('open');
                     if (typeof bookItem.resetPagination === 'function') { bookItem.resetPagination(); }
                     if (audio) { audio.pause(); audio.currentTime = 0; }
                      // Optionally remove buttons on close
                     // if (typeof bookItem.removePagination === 'function') { bookItem.removePagination(); }
                }
            });
        }
    });
});
