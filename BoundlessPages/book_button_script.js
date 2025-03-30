// book_button_script.js
function toggleLinks() {
    const links = document.getElementById("book-links");
    const button = document.querySelector(".book-button");
  
    if (!button.classList.contains("open")) {
      button.classList.add("flipping");
  
      setTimeout(() => {
        button.classList.remove("flipping");
        button.classList.add("open");
      }, 300);
    } else {
      button.classList.remove("open");
    }
  
    links.style.display = links.style.display === "block" ? "none" : "block";
  }
  
  function toggleSynopsis(bookContainer) {
    const synopsis = bookContainer.querySelector(".synopsis");
    synopsis.style.display = synopsis.style.display === "block" ? "none" : "block";
  }