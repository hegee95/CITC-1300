/**
 * atomic_nav.js
 * Handles the responsive navigation menu toggle for the Atomic Age redesign.
 */
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        console.log("Nav elements found."); // Debug log

        navToggle.addEventListener('click', () => {
            console.log("Nav toggle clicked."); // Debug log
            // Toggle the 'active' class on the button for animation
            navToggle.classList.toggle('active');
            // Toggle the 'nav-open' class on the nav menu itself to show/hide
            mainNav.classList.toggle('nav-open');

            // Update aria-expanded attribute for accessibility
            const isExpanded = mainNav.classList.contains('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
            console.log("Nav toggled. Is open:", isExpanded); // Debug log
        });

        // Optional: Close menu if clicking outside on mobile/tablet
        document.addEventListener('click', (event) => {
            // Check if mainNav exists and is open before proceeding
            // Also check if navToggle exists before trying to access contains method
            if (!mainNav || !mainNav.classList.contains('nav-open') || !navToggle) {
                return;
            }

            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle) {
                console.log("Clicked outside nav, closing menu."); // Debug log
                mainNav.classList.remove('nav-open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

    } else {
        console.error("Navigation toggle button or main nav element not found! Ensure IDs 'nav-toggle' and 'main-nav' exist.");
    }
});
