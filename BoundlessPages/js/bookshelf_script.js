const pageFlip = document.getElementById('pageFlipSound');
const pageClose = document.getElementById('pageCloseSound');
const bookThump = document.getElementById('bookThumpSound');
const hoverWhoosh = document.getElementById('hoverWhoosh');
const shelfCreak = document.getElementById('shelfCreak');

window.addEventListener('DOMContentLoaded', () => {
  if (shelfCreak) {
    shelfCreak.play().catch(() => {});
  }
});

document.querySelectorAll('.book').forEach(book => {
  const closeBtn = book.querySelector('.close-btn');

  book.addEventListener('mouseenter', () => {
    if (hoverWhoosh) {
      hoverWhoosh.currentTime = 0;
      hoverWhoosh.play().catch(() => {});
    }
  });

  book.addEventListener('click', () => {
    if (!book.classList.contains('active')) {
      document.querySelectorAll('.book.active').forEach(b => b.classList.remove('active'));
      book.classList.add('active');
      if (pageFlip) {
        pageFlip.currentTime = 0;
        pageFlip.play().catch(() => {});
      }
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    book.classList.remove('active');
    if (pageClose) {
      pageClose.currentTime = 0;
      pageClose.play().catch(() => {});
    }
    if (bookThump) {
      setTimeout(() => {
        bookThump.currentTime = 0;
        bookThump.play().catch(() => {});
      }, 400);
    }
  });
});

document.querySelectorAll('.book').forEach(book => {
    const synopsis = book.querySelector('.synopsis');
    const closeBtn = synopsis.querySelector('.close-btn');
    const pageFlip = document.getElementById('pageFlipSound');
  
    book.addEventListener('click', e => {
      if (!synopsis.classList.contains('visible')) {
        synopsis.classList.add('visible');
        pageFlip.currentTime = 0;
        pageFlip.play();
        e.stopPropagation();
      }
    });
  
    closeBtn.addEventListener('click', e => {
      synopsis.classList.remove('visible');
      pageFlip.currentTime = 0;
      pageFlip.play();
      e.stopPropagation();
    });
  
    synopsis.addEventListener('click', e => e.stopPropagation());
  });
  
  document.body.addEventListener('click', () => {
    document.querySelectorAll('.synopsis.visible').forEach(s => s.classList.remove('visible'));
  });
  