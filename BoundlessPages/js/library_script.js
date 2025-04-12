document.addEventListener('DOMContentLoaded', () => {
  const books = document.querySelectorAll('.book'); // Select all book elements

  books.forEach(book => {
      const spine = book.querySelector('.book-spine img'); // Find the spine image within the book
      const audio = book.querySelector('audio'); // Find the audio element within the book

      // Add click listener to the book spine image
      if (spine) {
          spine.addEventListener('click', () => {
              // Close any other open books first
              document.querySelectorAll('.book.open').forEach(openBook => {
                  if (openBook !== book) {
                      openBook.classList.remove('open'); // Close other books
                      const otherAudio = openBook.querySelector('audio');
                      if (otherAudio) {
                          otherAudio.pause(); // Pause sound of other books
                          otherAudio.currentTime = 0;
                      }
                  }
              });

              // Toggle the 'open' class on the clicked book
              book.classList.toggle('open'); // Add 'open' class if closed, remove if open

              // Play or pause audio based on open state
              if (book.classList.contains('open') && audio) {
                  audio.currentTime = 0; // Reset audio to start
                  audio.play().catch(error => console.error("Audio play failed:", error)); // Play the associated sound
              } else if (audio) {
                  audio.pause(); // Pause if closing
                  audio.currentTime = 0;
              }
          });
      }

      // Add click listener to the close button within the book
      const closeButton = book.querySelector('.close-button'); // Find the close button
      if (closeButton) {
          closeButton.addEventListener('click', (event) => {
              event.stopPropagation(); // Prevent the click from bubbling up to the book spine listener
              book.classList.remove('open'); // Remove 'open' class to close the book
              if (audio) {
                  audio.pause(); // Pause the sound
                  audio.currentTime = 0; // Reset audio time
              }
          });
      }
  });
});