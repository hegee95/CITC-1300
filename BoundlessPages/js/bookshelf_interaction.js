document.addEventListener('DOMContentLoaded', () => {
    const books = document.querySelectorAll('.book');

    books.forEach(book => {
        book.addEventListener('mousedown', (e) => {
            let shiftX = e.clientX - book.getBoundingClientRect().left;
            let shiftY = e.clientY - book.getBoundingClientRect().top;

            const moveAt = (pageX, pageY) => {
                book.style.left = pageX - shiftX + 'px';
                book.style.top = pageY - shiftY + 'px';
            };

            const onMouseMove = (e) => {
                moveAt(e.pageX, e.pageY);
            };

            document.addEventListener('mousemove', onMouseMove);

            book.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
                book.onmouseup = null;
            });
        });

        book.ondragstart = () => false; // Prevent default drag behavior

        book.addEventListener('click', () => {
            alert('Book clicked!'); // Placeholder for future functionality
        });
    });
});