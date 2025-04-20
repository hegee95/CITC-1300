/**
 * atomic_player.js (Enhanced)
 * Handles the enhanced Play/Pause/Next/Prev controls for the ambient audio player
 * in the site header for the Atomic Age redesign. Includes playlist functionality.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Enhanced Audio Player script loaded.");

    // --- Playlist Configuration ---
    // IMPORTANT: Replace these with the actual paths to YOUR audio files!
    const playlist = [
        "sounds/ambient_space_track1.mp3", // Example track 1
        "sounds/ambient_space_track2.mp3", // Example track 2
        "sounds/ambient_space_track3.mp3"  // Example track 3
        // Add more tracks here
    ];
    let currentTrackIndex = 0; // Start with the first track

    // --- Get DOM Elements ---
    const ambientAudio = document.getElementById('ambient-audio');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    // Optional: Add element for displaying track info if desired
    // const trackInfoDisplay = document.getElementById('track-info');

    // Check if all essential elements were found
    if (!ambientAudio || !playButton || !pauseButton || !prevButton || !nextButton) {
        console.error("Audio player elements not found! Missing:",
            !ambientAudio ? "#ambient-audio" : "",
            !playButton ? "#play-button" : "",
            !pauseButton ? "#pause-button" : "",
            !prevButton ? "#prev-button" : "",
            !nextButton ? "#next-button" : ""
        );
        return; // Stop execution if elements are missing
    }
     console.log("Audio player elements found.");

    // --- Helper Functions ---

    // Function to load and optionally play a track
    function loadTrack(index, playImmediately = false) {
        if (index >= 0 && index < playlist.length) {
            currentTrackIndex = index;
            ambientAudio.src = playlist[currentTrackIndex];
            ambientAudio.load(); // Important to load the new source
            console.log(`Loading track ${currentTrackIndex + 1}: ${playlist[currentTrackIndex]}`);

            // Optional: Update track info display
            // if (trackInfoDisplay) {
            //     trackInfoDisplay.textContent = `Track ${currentTrackIndex + 1}`;
            // }

            if (playImmediately) {
                playAudio();
            } else {
                // If not playing immediately, ensure buttons reflect paused state
                pauseButton.style.display = 'none';
                playButton.style.display = 'inline-block';
            }
        } else {
            console.error("Invalid track index:", index);
        }
    }

    // Function to handle playing audio and updating buttons
    function playAudio() {
         ambientAudio.play()
            .then(() => {
                playButton.style.display = 'none';
                pauseButton.style.display = 'inline-block';
                console.log("Audio playing.");
            })
            .catch(error => {
                console.error("Audio playback failed:", error);
                 // Reset buttons if play fails
                 pauseButton.style.display = 'none';
                 playButton.style.display = 'inline-block';
            });
    }

     // Function to handle pausing audio and updating buttons
    function pauseAudio() {
        ambientAudio.pause();
        pauseButton.style.display = 'none';
        playButton.style.display = 'inline-block';
        console.log("Audio paused.");
    }

    // --- Event Listeners ---

    // Play button
    playButton.addEventListener('click', () => {
        console.log("Play button clicked.");
        playAudio();
    });

    // Pause button
    pauseButton.addEventListener('click', () => {
        console.log("Pause button clicked.");
        pauseAudio();
    });

    // Next button
    nextButton.addEventListener('click', () => {
        console.log("Next button clicked.");
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= playlist.length) {
            nextIndex = 0; // Loop back to the first track
        }
        loadTrack(nextIndex, true); // Load and play next track
    });

    // Previous button
    prevButton.addEventListener('click', () => {
        console.log("Previous button clicked.");
        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) {
            prevIndex = playlist.length - 1; // Loop back to the last track
        }
        loadTrack(prevIndex, true); // Load and play previous track
    });

    // When a track finishes, automatically play the next one
    ambientAudio.addEventListener('ended', () => {
         console.log("Track ended, playing next.");
         nextButton.click(); // Simulate a click on the next button
    });

     // Optional: Update button state if audio is paused/played by other means
     ambientAudio.addEventListener('pause', () => {
        // Check if pause was triggered by user clicking pause or something else
        if (pauseButton.style.display !== 'none' && !ambientAudio.ended) {
             console.log("Audio paused by other means.");
             pauseButton.style.display = 'none';
             playButton.style.display = 'inline-block';
        }
     });
     ambientAudio.addEventListener('play', () => {
         if (playButton.style.display !== 'none') {
             console.log("Audio playing by other means.");
             playButton.style.display = 'none';
             pauseButton.style.display = 'inline-block';
         }
     });

    // --- Initial Setup ---
    // Load the first track initially, but don't play it yet
    loadTrack(currentTrackIndex, false);

}); // End DOMContentLoaded
