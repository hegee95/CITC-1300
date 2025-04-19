/**
 * atomic_bookmovie.js (Atomic Age Redesign)
 * Handles interactions for the comparison grid in BookToMovie.html
 * Uses event delegation. (Very similar to atomic_library.js)
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Atomic Book vs Movie script loaded");

    const comparisonGrid = document.querySelector('.comparison-grid'); // Ensure class matches HTML

    if (!comparisonGrid) {
         // Try the general item-grid class if specific one isn't found
        const grid = document.querySelector('.item-grid');
         if (grid && document.querySelector('.page-book-movie')) { // Check if we are on the book-movie page
             console.warn("Using general '.item-grid' for book-movie page.");
             setupGridListener(grid);
        } else {
            console.error("Comparison grid container not found!");
        }
        return; // Stop if no grid found
    } else {
        console.log("Comparison grid found.");
        setupGridListener(comparisonGrid); // Setup listener
    }

    // --- Function to setup the main listener ---
    function setupGridListener(gridContainer) {
        console.log("Setting up grid listener for:", gridContainer);

         // --- Helper Function for Pagination ---
        function setupPagination(gridItemElement) {
            console.log("Setting up pagination for:", gridItemElement?.id);
            const popup = gridItemElement?.querySelector('.modal-popup'); // Use generic modal class
            const contentArea = popup?.querySelector('.comparison-content'); // Specific content class
            const pages = contentArea?.querySelectorAll('.modal-page'); // Use generic page class
            const modalContent = popup?.querySelector('.modal-content'); // Container for buttons (tv-screen in this case)

            if (!contentArea || !pages || pages.length <= 1 || !modalContent) {
                console.log("No pagination needed or elements missing for:", gridItemElement?.id);
                modalContent?.querySelector('.pagination-button.prev')?.remove();
                modalContent?.querySelector('.pagination-button.next')?.remove();
                return;
            }
            console.log(`Found ${pages.length} pages for:`, gridItemElement.id);

            let currentPageIndex = 0;

            modalContent.querySelector('.pagination-button.prev')?.remove();
            modalContent.querySelector('.pagination-button.next')?.remove();

            const prevButton = document.createElement('button');
            prevButton.classList.add('pagination-button', 'prev');
            prevButton.innerHTML = '&lt;'; // Or use SVG/Icon font
            prevButton.disabled = true;
            modalContent.appendChild(prevButton);

            const nextButton = document.createElement('button');
            nextButton.classList.add('pagination-button', 'next');
            nextButton.innerHTML = '&gt;'; // Or use SVG/Icon font
            modalContent.appendChild(nextButton);
            console.log("Pagination buttons created for:", gridItemElement.id);

            const showPage = (index) => {
                console.log(`Showing page ${index} for:`, gridItemElement.id);
                pages.forEach((page, i) => {
                    page.classList.toggle('active', i === index);
                });
                prevButton.disabled = index === 0;
                nextButton.disabled = index === pages.length - 1;
                currentPageIndex = index;
                const activePage = contentArea.querySelector('.modal-page.active');
                if(activePage) activePage.scrollTop = 0;
            };

            showPage(currentPageIndex);

            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Prev button clicked for:", gridItemElement.id);
                if (currentPageIndex > 0) showPage(currentPageIndex - 1);
            });

            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Next button clicked for:", gridItemElement.id);
                if (currentPageIndex < pages.length - 1) showPage(currentPageIndex + 1);
            });

            gridItemElement.resetPagination = () => {
                console.log("Resetting pagination for:", gridItemElement.id);
                showPage(0);
            }
             gridItemElement.removePagination = () => {
                console.log("Removing pagination buttons for:", gridItemElement.id);
                prevButton.remove();
                nextButton.remove();
            }
        } // --- End setupPagination ---


        // --- Main Click Handler using Event Delegation ---
        gridContainer.addEventListener('click', (event) => {
            console.log("Click detected inside comparison grid. Target:", event.target);

            // Check if an item image was clicked
            const clickedImage = event.target.closest('.item-image img');
            if (clickedImage) {
                const gridItem = clickedImage.closest('.grid-item'); // Find the parent item
                if (!gridItem) return;

                console.log("Item image clicked:", gridItem.id);
                const isAlreadyOpen = gridItem.classList.contains('open');
                const audio = gridItem.querySelector('audio');

                // Close other open items
                document.querySelectorAll('.grid-item.open').forEach(openItem => {
                    if (openItem !== gridItem) {
                        console.log("Closing other item:", openItem.id);
                        openItem.classList.remove('open');
                        const otherAudio = openItem.querySelector('audio');
                        if (otherAudio) { otherAudio.pause(); otherAudio.currentTime = 0; }
                        if (typeof openItem.resetPagination === 'function') openItem.resetPagination();
                    }
                });

                // Toggle the clicked item
                if (isAlreadyOpen) {
                     console.log("Closing item:", gridItem.id);
                     gridItem.classList.remove('open');
                     if (typeof gridItem.resetPagination === 'function') gridItem.resetPagination();
                     if (audio) { audio.pause(); audio.currentTime = 0; }
                } else {
                    console.log("Opening item:", gridItem.id);
                    gridItem.classList.add('open');
                    setupPagination(gridItem); // Setup pagination when opening
                    if (audio) {
                        audio.volume = 0.5; // Adjust volume if needed for TV sound
                        audio.currentTime = 0;
                        audio.play().catch(error => console.error("Audio play failed:", error));
                    }
                }
                return;
            }

            // Check if a close button was clicked inside an open modal
            const clickedCloseButton = event.target.closest('.close-button');
            if (clickedCloseButton) {
                const modal = clickedCloseButton.closest('.modal-popup');
                const gridItem = modal?.closest('.grid-item'); // Find parent item

                if (modal && gridItem && gridItem.classList.contains('open')) {
                    console.log("Close button clicked for:", gridItem.id);
                    event.stopPropagation();

                    gridItem.classList.remove('open'); // Close the modal
                    const audio = gridItem.querySelector('audio');
                    if (typeof gridItem.resetPagination === 'function') gridItem.resetPagination();
                    if (audio) { audio.pause(); audio.currentTime = 0; }
                    return;
                }
            }

             // Check if click was on the modal overlay itself
             if (event.target.classList.contains('modal-popup')) {
                 const gridItem = event.target.closest('.grid-item');
                 if (gridItem && gridItem.classList.contains('open')) {
                     console.log("Clicked outside modal content for:", gridItem.id);
                     gridItem.classList.remove('open');
                     const audio = gridItem.querySelector('audio');
                     if (typeof gridItem.resetPagination === 'function') gridItem.resetPagination();
                     if (audio) { audio.pause(); audio.currentTime = 0; }
                     return;
                 }
             }

        }); // End gridContainer click listener

    } // --- End setupGridListener ---

}); // End DOMContentLoaded
