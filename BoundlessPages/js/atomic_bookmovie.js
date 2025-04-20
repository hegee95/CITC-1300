/**
 * atomic_bookmovie.js (Atomic Age Redesign)
 * Handles interactions for the comparison grid in BookToMovie.html
 * Uses event delegation. (Very similar to atomic_library.js)
 * Includes refined "click outside" logic.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Atomic Book vs Movie script loaded"); // Log 1: Script start

    // Try finding the specific grid, fall back to general item grid if on book-movie page
    let gridContainer = document.querySelector('.comparison-grid');
    if (!gridContainer) {
        const generalGrid = document.querySelector('.item-grid');
         // Ensure we are actually on the book-movie page before using the general grid
        if (generalGrid && document.querySelector('.page-book-movie')) {
             console.warn("Using general '.item-grid' selector for book-movie page.");
             gridContainer = generalGrid;
        } else {
             // Only log error if we expect a grid on this page
            if (document.querySelector('.page-book-movie')) {
                console.error("Comparison grid container (.comparison-grid or .item-grid) not found on Book vs Movie page!");
            } else {
                 console.log("Not on book-movie page or grid not found, script inactive.");
            }
            return; // Stop if no grid found for this page
        }
    }
    console.log("Grid container found:", gridContainer); // Log 2: Grid found


    let currentlyOpenItem = null; // Track the currently open item

    // --- Helper Function for Pagination ---
    function setupPagination(gridItemElement) {
        console.log("Setting up pagination for:", gridItemElement?.id); // Log P1: Setup start
        const popup = gridItemElement?.querySelector('.modal-popup'); // Use generic modal class
        const contentArea = popup?.querySelector('.comparison-content'); // Specific content class
        const pages = contentArea?.querySelectorAll('.modal-page'); // Use generic page class
        const modalContent = popup?.querySelector('.modal-content'); // Container for buttons (tv-screen)

        if (!contentArea || !pages || pages.length <= 1 || !modalContent) {
            console.log("No pagination needed or elements missing for:", gridItemElement?.id); // Log P2: No pagination
            modalContent?.querySelector('.pagination-button.prev')?.remove();
            modalContent?.querySelector('.pagination-button.next')?.remove();
            return; // No pagination needed
        }
        console.log(`Found ${pages.length} pages for:`, gridItemElement.id); // Log P3: Pages found

        let currentPageIndex = 0;

        // --- Create Buttons ---
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
        console.log("Pagination buttons created for:", gridItemElement.id); // Log P4: Buttons created

        const showPage = (index) => {
            console.log(`Showing page ${index} for:`, gridItemElement.id); // Log P5: Show page
            pages.forEach((page, i) => {
                page.classList.toggle('active', i === index);
            });
            prevButton.disabled = index === 0;
            nextButton.disabled = index === pages.length - 1;
            currentPageIndex = index;
             const activePage = contentArea.querySelector('.modal-page.active');
             if(activePage) activePage.scrollTop = 0;
        };

        showPage(currentPageIndex); // Show first page

        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Prev button clicked for:", gridItemElement.id); // Log P6: Prev click
            if (currentPageIndex > 0) showPage(currentPageIndex - 1);
        });

        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Next button clicked for:", gridItemElement.id); // Log P7: Next click
            if (currentPageIndex < pages.length - 1) showPage(currentPageIndex + 1);
        });

        gridItemElement.resetPagination = () => {
            console.log("Resetting pagination for:", gridItemElement.id); // Log P8: Reset
            showPage(0);
        }
         gridItemElement.removePagination = () => {
            console.log("Removing pagination buttons for:", gridItemElement.id); // Log P9: Remove buttons
            prevButton.remove();
            nextButton.remove();
         }
    } // --- End setupPagination ---

     // --- Function to close an item ---
    function closeItem(gridItem) {
        if (!gridItem || !gridItem.classList.contains('open')) return;
        console.log("Closing item:", gridItem.id); // Log CL1: Closing item
        gridItem.classList.remove('open');
        const audio = gridItem.querySelector('audio');
        if (typeof gridItem.resetPagination === 'function') gridItem.resetPagination();
        if (audio) { audio.pause(); audio.currentTime = 0; }
        currentlyOpenItem = null; // Reset tracker
    }

    // --- Main Click Handler using Event Delegation ---
    gridContainer.addEventListener('click', (event) => {
        console.log("Click detected inside comparison grid. Target:", event.target); // Log C1: Grid click

        // Check if an item image was clicked
        const clickedImage = event.target.closest('.item-image img');
        if (clickedImage) {
            const gridItem = clickedImage.closest('.grid-item');
            if (!gridItem) {
                 console.error("Could not find parent .grid-item for clicked image:", clickedImage);
                 return;
            }

            console.log("Item image clicked:", gridItem.id); // Log C2: Image click
            const isAlreadyOpen = gridItem.classList.contains('open');
            const audio = gridItem.querySelector('audio');

            // If clicking the currently open item's image, close it
            if (isAlreadyOpen) {
                closeItem(gridItem);
                return;
            }

            // Close any other item that might be open
            if (currentlyOpenItem && currentlyOpenItem !== gridItem) {
                 closeItem(currentlyOpenItem);
            }

            // Open the new item
            console.log("Opening item:", gridItem.id); // Log C4b: Opening item
            gridItem.classList.add('open');
            currentlyOpenItem = gridItem; // Track open item
            setupPagination(gridItem);
            if (audio) {
                audio.volume = 0.5; // Adjust volume if needed
                audio.currentTime = 0;
                audio.play().catch(error => console.error("Audio play failed:", error));
            }
            return; // Stop processing click here
        }

        // Check if a close button was clicked inside an open modal
        const clickedCloseButton = event.target.closest('.modal-content .close-button'); // More specific selector
        if (clickedCloseButton) {
            const gridItem = clickedCloseButton.closest('.grid-item'); // Find the grid item associated with the button
            console.log("Close button element clicked:", clickedCloseButton); // Log C5: Close button element found
             if (gridItem && gridItem.classList.contains('open')) {
                console.log("Close button click confirmed for open item:", gridItem.id); // Log C6: Close confirmed
                event.stopPropagation(); // Prevent triggering other listeners like 'click outside'
                closeItem(gridItem); // Use close function
                return; // Stop processing click here
            } else {
                 console.log("Close button clicked, but parent item not found or not open."); // Log C7: Close invalid context
                 console.log("GridItem found:", gridItem);
                 console.log("GridItem has 'open' class:", gridItem?.classList.contains('open'));
            }
        }

    }); // End gridContainer click listener

     // --- Refined Click Outside Listener ---
     document.addEventListener('click', (event) => {
         if (currentlyOpenItem) { // Only run if an item is open
             const modalContent = currentlyOpenItem.querySelector('.modal-content');
             const clickedImage = currentlyOpenItem.querySelector('.item-image img'); // Get the image that opened it

             // Check if the click target is NOT the modal content or anything inside it,
             // AND also NOT the image that opened it
             if (modalContent && !modalContent.contains(event.target) && event.target !== clickedImage) {
                  // Also check it wasn't the close button itself (which handles its own closing)
                 if (!event.target.closest('.close-button')) {
                    console.log("Click detected outside open modal content and trigger image for:", currentlyOpenItem.id); // Log C8: Outside click
                    closeItem(currentlyOpenItem); // Close the item
                 }
             }
         }
     });

}); // End DOMContentLoaded
