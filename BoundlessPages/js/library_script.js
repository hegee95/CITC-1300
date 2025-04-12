document.addEventListener('DOMContentLoaded', () => {
    const books = document.querySelectorAll('.book');

    books.forEach(book => {
        book.addEventListener('click', () => {
            const bookOpen = book.querySelector('.book-open');
            const audioId = book.getAttribute('onclick').match(/'(.*?)'/)[1];
            const audio = document.getElementById(audioId);

            if (bookOpen && audio) {
                book.classList.add('open');
                audio.play();
            }
        });
    });

    const closeButtons = document.querySelectorAll('.close-button');

    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const book = button.closest('.book');
            const audioId = book.getAttribute('onclick').match(/'(.*?)'/)[1];
            const audio = document.getElementById(audioId);

            if (book) {
                book.classList.remove('open');
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });
    });
});
