/**
 * atomic_bookmovie.js (Atomic Age Redesign)
 * Handles interactions for the comparison grid in BookToMovie.html
 * Uses event delegation and a single decoupled modal. (Very similar to atomic_library.js)
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

    // Find the single modal elements
    const mainModal = document.getElementById('main-modal');
    const modalContainer = mainModal?.querySelector('.modal-container'); // The styled box inside overlay
    const modalBody = mainModal?.querySelector('.modal-body'); // Where content goes
    const modalCloseButton = mainModal?.querySelector('.close-button'); // The single close button

    if (!mainModal || !modalContainer || !modalBody || !modalCloseButton) {
        console.error("Essential modal elements (#main-modal, .modal-container, .modal-body, .close-button) not found!");
        return;
    }
    console.log("Main modal elements found."); // Log 3: Modal elements found


    let currentlyOpenTrigger = null; // Track which item opened the modal

    // --- Helper Function for Pagination ---
    function setupPagination(modalBodyContainer, themeClass) {
        // Select pages within the *currently loaded* modal body
        const pages = modalBodyContainer?.querySelectorAll('.modal-page');
        console.log("Setting up pagination inside modal. Found pages:", pages?.length); // Log P1

        // Remove previous buttons first
        modalContainer.querySelectorAll('.pagination-button').forEach(btn => btn.remove());

        if (!pages || pages.length <= 1) {
             console.log("No pagination needed."); // Log P2
            return; // No pagination needed
        }
        console.log(`Found ${pages.length} pages.`); // Log P3

        let currentPageIndex = 0;

        // --- Create Buttons ---
        const prevButton = document.createElement('button');
        prevButton.classList.add('pagination-button', 'prev');
        prevButton.innerHTML = '&lt;'; // Or use SVG/Icon font
        prevButton.disabled = true;
        modalContainer.appendChild(prevButton); // Append to modal container

        const nextButton = document.createElement('button');
        nextButton.classList.add('pagination-button', 'next');
        nextButton.innerHTML = '&gt;'; // Or use SVG/Icon font
        modalContainer.appendChild(nextButton);
        console.log("Pagination buttons created."); // Log P4

        const showPage = (index) => {
            console.log(`Showing page ${index}`); // Log P5
            pages.forEach((page, i) => {
                page.classList.toggle('active', i === index);
            });
            prevButton.disabled = index === 0;
            nextButton.disabled = index === pages.length - 1;
            currentPageIndex = index;
             const activePage = modalBodyContainer.querySelector('.modal-page.active');
             if(activePage) activePage.scrollTop = 0;
        };

        showPage(currentPageIndex); // Show first page

        // Use event delegation for pagination buttons as well, attached to modal container
        const paginationClickHandler = (e) => {
             if (e.target === prevButton) {
                 e.stopPropagation();
                 console.log("Prev button clicked."); // Log P6
                 if (currentPageIndex > 0) showPage(currentPageIndex - 1);
             } else if (e.target === nextButton) {
                 e.stopPropagation();
                 console.log("Next button clicked."); // Log P7
                 if (currentPageIndex < pages.length - 1) showPage(currentPageIndex + 1);
             }
         };

        // Store reference to handler for removal later
        modalContainer._paginationHandler = paginationClickHandler;
        modalContainer.addEventListener('click', paginationClickHandler);

        // Function to remove pagination elements and listener
        modalContainer.removePagination = () => {
             console.log("Removing pagination elements and listener."); // Log P9
             prevButton.remove();
             nextButton.remove();
             // Check if handler exists before trying to remove
             if (modalContainer._paginationHandler) {
                 modalContainer.removeEventListener('click', modalContainer._paginationHandler);
                 delete modalContainer._paginationHandler; // Clean up reference
             }
         }

    } // --- End setupPagination ---

     // --- Function to open the modal ---
    function openModal(targetContentId, themeClass) {
        const contentSource = document.getElementById(targetContentId?.substring(1)); // Get ID without #
        const audio = currentlyOpenTrigger?.querySelector('audio'); // Get audio from the trigger item

        if (!contentSource) {
            console.error(`Content source element not found for ID: ${targetContentId}`);
            return;
        }
        if (!modalBody || !mainModal || !modalContainer) {
             console.error("Cannot open modal, essential elements missing.");
             return;
        }

        console.log(`Opening modal with content from ${targetContentId} and theme ${themeClass}`); // Log O1

        // Clear previous content and theme
        modalBody.innerHTML = '';
        modalContainer.className = 'modal-container'; // Reset to base class

        // Clone content pages and append to modal body
        // Wrap content in appropriate container (.synopsis or .comparison-content)
        let contentWrapperClass = themeClass === 'neon-sign-modal' ? 'comparison-content' : 'comparison-content'; // Defaulting to comparison for book-movie
        const contentWrapper = document.createElement('div');
        contentWrapper.className = contentWrapperClass;
        Array.from(contentSource.children).forEach(page => {
            contentWrapper.appendChild(page.cloneNode(true));
        });
        modalBody.appendChild(contentWrapper);
        console.log("Modal body populated."); // Log O2

        // Add the theme class to the container
        if(themeClass) {
            modalContainer.classList.add(themeClass);
        }

        // Setup pagination for the newly added content
        setupPagination(modalBody, themeClass);

        // Show the modal
        mainModal.classList.add('open');
        mainModal.setAttribute('aria-hidden', 'false');
        console.log("Modal open class added."); // Log O3

        // Play sound
        if (audio) {
            audio.volume = 0.5; // Adjust volume if needed
            audio.currentTime = 0;
            audio.play().catch(error => console.error("Audio play failed:", error));
        }
    }

    // --- Function to close the modal ---
    function closeModal() {
        if (!mainModal.classList.contains('open')) return; // Already closed

        console.log("Closing modal."); // Log CL1
        mainModal.classList.remove('open');
        mainModal.setAttribute('aria-hidden', 'true');

        // Stop audio associated with the item that opened the modal
        if (currentlyOpenTrigger) {
            const audio = currentlyOpenTrigger.querySelector('audio');
            if (audio) { audio.pause(); audio.currentTime = 0; }
        }

        // Remove pagination buttons and listener
        if (typeof modalContainer.removePagination === 'function') {
            modalContainer.removePagination();
        }

        // Clear content after fade out (optional, helps reset state)
        setTimeout(() => {
            if (!mainModal.classList.contains('open')) { // Check if still closed
                 modalBody.innerHTML = '';
                 modalContainer.className = 'modal-container'; // Reset theme
                 console.log("Modal content cleared."); // Log CL2
            }
        }, 300); // Match CSS opacity transition duration

        currentlyOpenTrigger = null; // Reset trigger tracker
    }

    // --- Main Click Handler for Grid Items ---
    gridContainer.addEventListener('click', (event) => {
        console.log("Click detected inside comparison grid. Target:", event.target); // Log C1

        // Find the grid item that was clicked (or contains the click target)
        const gridItem = event.target.closest('.grid-item');
        if (!gridItem) {
            console.log("Click was not inside a grid item.");
            return; // Click was not on an item or its descendant
        }

        // Check if an image inside the item was the primary target (or the item itself if no image)
        const clickedImage = event.target.closest('.item-image img');
        // Allow click on item itself if image isn't hit directly
        // Also check that the click wasn't on a pagination button inside the modal triggered by THIS item
        if ((clickedImage || event.target === gridItem || gridItem.contains(event.target)) && !event.target.closest('.pagination-button')) {

            console.log("Grid item clicked:", gridItem.id); // Log C2

            const targetContentId = gridItem.dataset.modalTarget; // Get #content-itemX
            const targetTheme = gridItem.dataset.modalTheme || 'neon-sign-modal'; // Get theme or default

            if (!targetContentId) {
                console.error("Grid item is missing data-modal-target attribute:", gridItem.id);
                return;
            }

            // Close if already open (clicking the trigger again), otherwise open
            if (currentlyOpenTrigger === gridItem) {
                 closeModal();
            } else {
                // Close any potentially open modal first
                if (currentlyOpenTrigger) {
                    closeModal();
                }
                // Set the trigger and open
                currentlyOpenTrigger = gridItem;
                openModal(targetContentId, targetTheme);
            }
        }
    }); // End gridContainer click listener

    // --- Listener for Close Button ---
    modalCloseButton.addEventListener('click', (event) => {
         console.log("Modal close button clicked."); // Log CL3
         event.stopPropagation(); // Prevent triggering click outside
         closeModal();
    });

    // --- Listener for Click Outside Modal ---
    mainModal.addEventListener('click', (event) => {
        // Check if the click target is the overlay itself (and not the container/content or buttons)
        if (event.target === mainModal) {
             console.log("Click detected on modal overlay."); // Log CL4
             closeModal();
        }
    });

    // --- Listener for Escape Key ---
     document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainModal.classList.contains('open')) {
             console.log("Escape key pressed."); // Log CL5
             closeModal();
         }
     });

}); // End DOMContentLoaded
