// script.js

// Music Player Functionality
const music = document.getElementById('backgroundMusic');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const songTitle = document.getElementById('songTitle');

// Set volume to 30% (softer)
music.volume = 0.3;

// Track if music has been started
let musicStarted = false;

// Function to start music (called on user interaction)
function startMusic() {
    if (!musicStarted && music.paused) {
        musicStarted = true;
        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Music started successfully
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                songTitle.textContent = "Playing: Wedding Song";

                // Remove event listeners since music is now playing
                removeStartListeners();
            }).catch(error => {
                // Autoplay was prevented
                console.log("Music start failed:", error);
                songTitle.textContent = "Click to play wedding song";
                musicStarted = false; // Reset to allow retry
            });
        }
    }
}

// Remove event listeners once music starts
function removeStartListeners() {
    document.removeEventListener('click', startMusic);
    document.removeEventListener('scroll', startMusic);
    document.removeEventListener('touchstart', startMusic);
    document.removeEventListener('keydown', startMusic);
}

// Add multiple interaction listeners to start music
document.addEventListener('click', startMusic);
document.addEventListener('scroll', startMusic);
document.addEventListener('touchstart', startMusic); // For mobile touch
document.addEventListener('keydown', startMusic); // For keyboard

// Also try to autoplay immediately (some browsers may allow this)
setTimeout(() => {
    if (!musicStarted) {
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                songTitle.textContent = "Playing: Wedding Song";
                musicStarted = true;
                removeStartListeners();
            }).catch(_ => {
                // If immediate autoplay fails, wait for user interaction
                songTitle.textContent = "Click to play wedding song";
            });
        }
    }
}, 1000);

// Toggle play/pause on button click
playBtn.addEventListener('click', function (e) {
    e.stopPropagation(); // Prevent triggering the document click listener

    if (music.paused) {
        music.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        songTitle.textContent = "Playing: Wedding Song";
        musicStarted = true;
        removeStartListeners();
    } else {
        music.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        songTitle.textContent = "Click to play";
    }
});

// Update button when song ends (shouldn't happen with loop)
music.addEventListener('ended', function () {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    songTitle.textContent = "Click to play";
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});



// Collapsible Section Functionality
document.addEventListener('DOMContentLoaded', function () {
    const collapsibleToggle = document.querySelector('.collapsible-toggle');
    const collapsibleContent = document.querySelector('.collapsible-content');

    if (collapsibleToggle && collapsibleContent) {
        // Initially hide the content
        collapsibleContent.style.maxHeight = '0';

        collapsibleToggle.addEventListener('click', function () {
            // Toggle collapsed class
            this.classList.toggle('collapsed');

            // Toggle the content
            if (collapsibleContent.style.maxHeight === '0px' || collapsibleContent.style.maxHeight === '') {
                // Expand
                collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + 'px';
                collapsibleContent.classList.add('expanded');
            } else {
                // Collapse
                collapsibleContent.style.maxHeight = '0';
                collapsibleContent.classList.remove('expanded');
            }
        });


        // Bank Details Toggle
        const showBankBtn = document.getElementById('showBankDetails');
        const bankDetails = document.getElementById('bankDetails');

        if (showBankBtn && bankDetails) {
            showBankBtn.addEventListener('click', function () {
                bankDetails.classList.toggle('visible');

                if (bankDetails.classList.contains('visible')) {
                    this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Bank Details';
                    this.style.marginBottom = '20px';
                } else {
                    this.innerHTML = '<i class="fas fa-university"></i> View Bank & Transfer Details';
                    this.style.marginBottom = '0';
                }
            });
        }
    }
});