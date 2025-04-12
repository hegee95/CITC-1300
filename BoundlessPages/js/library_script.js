/**
 * library_script.js
 * Handles interactions for the bookshelf in Mylibrary.html
 * - Opens/closes books on click.
 * - Plays/pauses associated sound on open/close.
 * - Ensures only one book is open at a time.
 * - Handles synopsis pagination.
 */
document.addEventListener('DOMContentLoaded', () => {
  const books = document.querySelectorAll('.book'); // Select all book elements

  // --- Helper Function for Pagination ---
  function setupPagination(bookElement) {
      const synopsisContainer = bookElement.querySelector('.synopsis');
      const pages = synopsisContainer?.querySelectorAll('.synopsis-page');
      const bookOpenContainer = bookElement.querySelector('.book-open'); // Container for buttons

      if (!synopsisContainer || !pages || pages.length <= 1 || !bookOpenContainer) {
          // No pages, only one page, or containers missing - no pagination needed
          // Remove any existing buttons just in case
           bookOpenContainer.querySelector('.pagination-button.prev')?.remove();
           bookOpenContainer.querySelector('.pagination-button.next')?.remove();
          return;
      }

      let currentPageIndex = 0;

      // --- Create Buttons ---
      // Remove existing buttons before adding new ones
      bookOpenContainer.querySelector('.pagination-button.prev')?.remove();
      bookOpenContainer.querySelector('.pagination-button.next')?.remove();

      const prevButton = document.createElement('button');
      prevButton.classList.add('pagination-button', 'prev');
      prevButton.innerHTML = '&lt;'; // Left arrow
      prevButton.disabled = true; // Start disabled
      bookOpenContainer.appendChild(prevButton);

      const nextButton = document.createElement('button');
      nextButton.classList.add('pagination-button', 'next');
      nextButton.innerHTML = '&gt;'; // Right arrow
      bookOpenContainer.appendChild(nextButton);

      // --- Show Initial Page ---
      const showPage = (index) => {
          pages.forEach((page, i) => {
              page.classList.toggle('active', i === index);
          });
          // Update button states
          prevButton.disabled = index === 0;
          nextButton.disabled = index === pages.length - 1;
          currentPageIndex = index; // Update current index
      };

      showPage(currentPageIndex); // Show the first page initially

      // --- Button Event Listeners ---
      prevButton.addEventListener('click', (e) => {
           e.stopPropagation(); // Prevent book close
          if (currentPageIndex > 0) {
              showPage(currentPageIndex - 1);
          }
      });

      nextButton.addEventListener('click', (e) => {
           e.stopPropagation(); // Prevent book close
          if (currentPageIndex < pages.length - 1) {
              showPage(currentPageIndex + 1);
          }
      });

       // Store reset function on the book element
       bookElement.resetPagination = () => showPage(0);
       // Store cleanup function
       bookElement.removePagination = () => {
           prevButton.remove();
           nextButton.remove();
       }
  }


  // --- Main Book Interaction Logic ---
  books.forEach(book => {
      const spine = book.querySelector('.book-spine img');
      const audio = book.querySelector('audio');
      const closeButton = book.querySelector('.close-button');

      // Add click listener to the book spine image
      if (spine) {
          spine.addEventListener('click', () => {
              const isAlreadyOpen = book.classList.contains('open');

              // Close any other open books first
              document.querySelectorAll('.book.open').forEach(openBook => {
                  if (openBook !== book) {
                      openBook.classList.remove('open');
                      const otherAudio = openBook.querySelector('audio');
                      if (otherAudio) {
                          otherAudio.pause();
                          otherAudio.currentTime = 0;
                      }
                      // Reset pagination if the function exists
                      if (typeof openBook.resetPagination === 'function') {
                           openBook.resetPagination();
                      }
                  }
              });

              // Toggle the 'open' state of the clicked book
              book.classList.toggle('open');

              // Handle audio and pagination based on state
              if (book.classList.contains('open')) {
                  // Setup pagination when book opens
                  setupPagination(book);
                  if (audio) {
                      audio.currentTime = 0;
                      audio.volume = 1.0; // Set volume to 100%
                      audio.play().catch(error => console.error("Audio play failed:", error));
                  }
              } else {
                  // Reset pagination when book closes
                  if (typeof book.resetPagination === 'function') {
                       book.resetPagination();
                  }
                  // Optionally remove buttons on close if preferred
                  // if (typeof book.removePagination === 'function') {
                  //     book.removePagination();
                  // }
                  if (audio) {
                      audio.pause();
                      audio.currentTime = 0;
                  }
              }
          });
      }

      // Add click listener to the close button within the book
      if (closeButton) {
          closeButton.addEventListener('click', (event) => {
              event.stopPropagation();
              book.classList.remove('open');
               // Reset pagination when book closes
               if (typeof book.resetPagination === 'function') {
                    book.resetPagination();
               }
               // Optionally remove buttons on close if preferred
               // if (typeof book.removePagination === 'function') {
               //     book.removePagination();
               // }
              if (audio) {
                  audio.pause();
                  audio.currentTime = 0;
              }
          });
      }
  });
});
