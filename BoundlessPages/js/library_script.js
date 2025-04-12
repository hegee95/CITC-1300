function openBook(bookElement, soundId) {
    const isOpen = bookElement.classList.contains('open');
  
    // Close all books first
    document.querySelectorAll('.book').forEach(book => {
      book.classList.remove('open');
    });
  
    if (!isOpen) {
      bookElement.classList.add('open');
  
      // Play sound effect
      const sound = document.getElementById(soundId);
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }
    }
  }
  
  function closeBook(event, button) {
    event.stopPropagation(); // Prevent triggering the book's onclick
    const bookElement = button.closest('.book');
    bookElement.classList.remove('open');
  }
  