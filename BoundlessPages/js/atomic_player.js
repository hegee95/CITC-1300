/**
 * atomic_player.js
 * Handles the simple Play/Pause controls for the ambient audio player
 * in the site header for the Atomic Age redesign.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Audio Player script loaded.");

    // Get the audio element and control buttons
    const ambientAudio = document.getElementById('ambient-audio');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');

    // Check if all elements were found
    if (ambientAudio && playButton && pauseButton) {
        console.log("Audio player elements found.");

        // Event listener for the Play button
        playButton.addEventListener('click', () => {
            console.log("Play button clicked.");
            ambientAudio.play()
                .then(() => {
                    // If playback starts successfully
                    playButton.style.display = 'none';   // Hide Play button
                    pauseButton.style.display = 'inline-block'; // Show Pause button
                    console.log("Audio playing.");
                })
                .catch(error => {
                    // Handle potential errors (e.g., browser restrictions on autoplay)
                    console.error("Audio playback failed:", error);
                    // Optionally, provide feedback to the user here
                });
        });

        // Event listener for the Pause button
        pauseButton.addEventListener('click', () => {
            console.log("Pause button clicked.");
            ambientAudio.pause();
            pauseButton.style.display = 'none';   // Hide Pause button
            playButton.style.display = 'inline-block'; // Show Play button
            console.log("Audio paused.");
        });

        // Optional: If the audio finishes (though it's set to loop), reset buttons
        ambientAudio.addEventListener('ended', () => {
             console.log("Audio ended (loop should restart).");
             // Reset to show Play button if needed, though loop attribute handles this
             // pauseButton.style.display = 'none';
             // playButton.style.display = 'inline-block';
        });

         // Optional: Update button state if audio is paused by other means
         // (e.g., browser controls, end of track if loop was false)
         ambientAudio.addEventListener('pause', () => {
            // Check if pause was triggered by our button or something else
            if (pauseButton.style.display !== 'none') {
                 console.log("Audio paused by other means.");
                 pauseButton.style.display = 'none';
                 playButton.style.display = 'inline-block';
            }
         });
         // Optional: Update button state if audio starts playing by other means
         ambientAudio.addEventListener('play', () => {
             if (playButton.style.display !== 'none') {
                 console.log("Audio playing by other means.");
                 playButton.style.display = 'none';
                 pauseButton.style.display = 'inline-block';
             }
         });


    } else {
        // Log which elements are missing
        console.error("Audio player elements not found! Missing:",
            !ambientAudio ? "#ambient-audio" : "",
            !playButton ? "#play-button" : "",
            !pauseButton ? "#pause-button" : ""
        );
    }
});
