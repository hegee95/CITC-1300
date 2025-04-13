/**
 * book_movie_script.js
 * Handles interactions for BookToMovie.html
 * - Opens/closes TV pop-up on item click.
 * - Plays/pauses associated sound (optional).
 * - Ensures only one pop-up is open at a time.
 * - Handles comparison content pagination.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select all comparison items
    const items = document.querySelectorAll('.comparison-item');

    // --- Helper Function for Pagination ---
    function setupPagination(itemElement) {
        const popup = itemElement.querySelector('.tv-popup');
        const contentContainer = popup?.querySelector('.comparison-content');
        const pages = contentContainer?.querySelectorAll('.comparison-page');
        const tvScreen = popup?.querySelector('.tv-screen'); // Buttons container

        if (!contentContainer || !pages || pages.length <= 1 || !tvScreen) {
            // No pages, only one page, or containers missing - no pagination needed
             tvScreen?.querySelector('.pagination-button.prev')?.remove();
             tvScreen?.querySelector('.pagination-button.next')?.remove();
            return;
        }

        let currentPageIndex = 0;

        // --- Create Buttons ---
        tvScreen.querySelector('.pagination-button.prev')?.remove();
        tvScreen.querySelector('.pagination-button.next')?.remove();

        const prevButton = document.createElement('button');
        prevButton.classList.add('pagination-button', 'prev');
        prevButton.innerHTML = '&lt;'; // Use appropriate icon/text
        prevButton.disabled = true;
        tvScreen.appendChild(prevButton); // Append to tv-screen

        const nextButton = document.createElement('button');
        nextButton.classList.add('pagination-button', 'next');
        nextButton.innerHTML = '&gt;'; // Use appropriate icon/text
        tvScreen.appendChild(nextButton); // Append to tv-screen

        // --- Show Page Function ---
        const showPage = (index) => {
            pages.forEach((page, i) => {
                page.classList.toggle('active', i === index);
            });
            prevButton.disabled = index === 0;
            nextButton.disabled = index === pages.length - 1;
            currentPageIndex = index;
             // Scroll page content to top when changing pages
             const activePage = contentContainer.querySelector('.comparison-page.active');
             if(activePage) activePage.scrollTop = 0;
        };

        showPage(currentPageIndex); // Show first page

        // --- Button Event Listeners ---
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent pop-up close
            if (currentPageIndex > 0) {
                showPage(currentPageIndex - 1);
            }
        });

        nextButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent pop-up close
            if (currentPageIndex < pages.length - 1) {
                showPage(currentPageIndex + 1);
            }
        });

        // Store reset function
        itemElement.resetPagination = () => showPage(0);
        // Store cleanup function
         itemElement.removePagination = () => {
             prevButton.remove();
             nextButton.remove();
         }
    }


    // --- Main Item Interaction Logic ---
    items.forEach(item => {
        const image = item.querySelector('.comparison-item-image img');
        const audio = item.querySelector('audio'); // Optional audio
        const popup = item.querySelector('.tv-popup');
        const closeButton = popup?.querySelector('.close-button');

        // Add click listener to the item image
        if (image) {
            image.addEventListener('click', () => {
                const isAlreadyOpen = item.classList.contains('open');

                // Close any other open items first
                document.querySelectorAll('.comparison-item.open').forEach(openItem => {
                    if (openItem !== item) {
                        openItem.classList.remove('open');
                        const otherAudio = openItem.querySelector('audio');
                        if (otherAudio) {
                            otherAudio.pause();
                            otherAudio.currentTime = 0;
                        }
                        if (typeof openItem.resetPagination === 'function') {
                            openItem.resetPagination();
                        }
                    }
                });

                // Toggle the 'open' state of the clicked item
                item.classList.toggle('open');

                // Handle audio and pagination
                if (item.classList.contains('open')) {
                    setupPagination(item); // Setup pagination when opening
                    if (audio) {
                        audio.volume = 0.5; // Adjust volume if needed
                        audio.currentTime = 0;
                        audio.play().catch(error => console.error("Audio play failed:", error));
                    }
                } else {
                     if (typeof item.resetPagination === 'function') {
                         item.resetPagination(); // Reset to page 1 on close
                     }
                    // Optionally remove buttons on close
                    // if (typeof item.removePagination === 'function') {
                    //     item.removePagination();
                    // }
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }
            });
        }

        // Add click listener to the close button
        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from bubbling up
                item.classList.remove('open');
                if (typeof item.resetPagination === 'function') {
                    item.resetPagination(); // Reset to page 1 on close
                }
                 // Optionally remove buttons on close
                 // if (typeof item.removePagination === 'function') {
                 //     item.removePagination();
                 // }
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        }
    });
});
