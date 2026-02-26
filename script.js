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
let isVideoPlaying = false;

// Function to start music (called on user interaction)
function startMusic() {
    if (!musicStarted && music.paused && !isVideoPlaying) {
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
    if (!musicStarted && !isVideoPlaying) {
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

    if (!isVideoPlaying) {
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


// ===== Guest Confirmation Checker =====
let guestList = [];

// Load guest list immediately using fallback, then try to load from file
function initializeGuestList() {
    console.log('Initializing guest list...');

    // First, use the fallback list immediately so search works
    loadFallbackGuestList();

    // Then try to load from file (will update if successful)
    loadGuestList().catch(error => {
        console.log('File loading failed, keeping fallback list');
    });
}

// Load guest list from text file
async function loadGuestList() {
    try {
        console.log('Attempting to load guest list from file...');

        // Try different paths
        const paths = [
            './guests.txt',
            'guests.txt',
            '/guests.txt',
            window.location.pathname.replace(/\/[^\/]*$/, '/guests.txt')
        ];

        let response;
        let lastError;

        for (const path of paths) {
            try {
                console.log('Trying path:', path);
                response = await fetch(path);
                if (response.ok) break;
            } catch (err) {
                lastError = err;
                console.log('Failed with path:', path, err);
            }
        }

        if (!response || !response.ok) {
            throw new Error(`Failed to load guest list from any path. Last error: ${lastError}`);
        }

        const text = await response.text();
        console.log('Raw text loaded, length:', text.length);

        // Process the text file
        guestList = text.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0 && !name.startsWith('#'));

        console.log(`Loaded ${guestList.length} guests from file`);
        console.log('First 10 guests:', guestList.slice(0, 10));

        // Update guest count display
        document.getElementById('totalConfirmed').textContent = guestList.length;

        // Update the display
        const searchInput = document.getElementById('nameSearch');
        if (searchInput && searchInput.value.trim() === '') {
            displayAllGuests();
        } else {
            // If there's a search term, re-run the search with updated list
            searchName();
        }

        return true;

    } catch (error) {
        console.error('Error loading guest list from file:', error);
        return false;
    }
}

// Fallback function if text file fails to load
function loadFallbackGuestList() {
    console.log('Loading fallback guest list...');
    // Full list with duplicates preserved
    guestList = [
        "James Castromayor",
        "Eurish Gutierrez",
        "Cecilia Gutierrez",
        "Cyrill Elyssa Medina",
        "Arian Christian Medina",
        "Ciela Elaine Gutierrez",
        "Pauline San Juan",
        "Claire Ericka Gutierrez",
        "Elson Cedrick Gutierrez",
        "Erjohn Cyruss Gutierrez",
        "Jim Castromayor",
        "Rhodora Glorioso",
        "Jean Quinones",
        "Levi Quinones",
        "Chesi Quinones",
        "Jorja Quinones",
        "Jim Castromayor II",
        "Katherine Vipinosa",
        "Jane Castromayor",
        "Lolit Parado",
        "Joan Ayr Parado",
        "Arkayne Michelle Parado",
        "Azielle Mhaerynn Parado",
        "Ayriell Maryseph Parado",
        "Gene Louis Parado",
        "Domingo Sobrevinas",
        "Alice Sobrevinas",
        "Alyssa Daye Sobrevinas",
        "Alyanna Donne Sobrevinas",
        "Alissandra Daen Sobrevinas",
        "Hobert Orbeta",
        "Marites Orbeta",
        "Henessy Mae Orbeta",
        "Hazel Mayne Orbeta",
        "Harvey Troy Orbeta",
        "Hilary Marj Orbeta",
        "Terry Orbeta",
        "Aleli Orbeta",
        "Marizen Orbeta",
        "Joyce Resubal",
        "Anthony Resubal",
        "Paul Resubal",
        "Maymay Resubal",
        "Rose Ocampo",
        "Erwin Ocampo",
        "Divina Gruspe",
        "Lee Gruspe",
        "Josiephine Glorioso",
        "Alvin Kevin Glorioso",
        "Rio Elaine Glorioso",
        "King Roshan Glorioso",
        "Anthony Glorioso",
        "Marco Antonio Glorioso",
        "Jameer Antonio Glorioso",
        "Joyce Ann Rodil",
        "Christopher Ocampo",
        "Sandae Natividad",
        "Jason Cabalquinto",
        "Reena Cayton",
        "Gabriel James Glorioso",
        "Allandale Zuñiga",
        "Frances Rose Zuñiga",
        "Glen Zuniga",
        "Jhunbert Bencion",
        "Chris Trinidad",
        "Earvin Lim",
        "Danica Lim",
        "Nico Decio",
        "Kevin Jan De Leon",
        "Maryneth De Leon",
        "Lyndon De Vera",
        "Nathan Bunag",
        "Archievincent Arthur Fetalvero",
        "Hubert Gumboc",
        "Anna Marie Zamora",
        "Lala Mirasol",
        "Jun Faduhilao",
        "Mae Battulayan",
        "Ramon Olay",
        "Ken San Jose",
        "Alex Ricamonte",
        "Checel Lastrilla",
        "Jun Tambaba",
        "Joane Toledo",
        "Ben Arigo",
        "Cess de Leon",
        "JJ de Leon",
        "Efrelinda Glorioso",
        "Charles Quincy Dayrit",
        "Carlo Oliver Vergara",
        "Janeth Poso",
        "Rolvin Pagunsan",
        "Angelica Pagunsan",
        "Mikel Resubal",
        "Gina Resubal",
        "Paolo Billones",
        "Sean Billones",
        "Paris Billones",
        "Ericka Billones",
        "Boyet Zuniga",
        "Aica Lineses",
        "Ray Lineses",
        "Rachel Serrano",
        "Aeth Aranda",
        "Cholo Villagarcia",
        "Eddie Gutierrez",
        "Melissa Gutierrez",
        "Yollie Billones",
        "Gloria Santos",
        "Albert Santos",
        "Lem Almendral",
        "Treb Cabrera",
        "Lucci Ocampo",
        "Rio Macapanpan"
    ];
    console.log('Fallback list loaded with', guestList.length, 'guests');
    document.getElementById('totalConfirmed').textContent = guestList.length;

    displayAllGuests();
}

// Display all guests in the results container
function displayAllGuests() {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) {
        console.error('Search results container not found!');
        return;
    }

    resultsContainer.innerHTML = '';

    if (!guestList || guestList.length === 0) {
        resultsContainer.innerHTML = `
            <div class="result-item">
                <i class="fas fa-info-circle"></i>
                <span>Loading guest list...</span>
            </div>
        `;
        return;
    }

    // Show a message instead of the full list
    resultsContainer.innerHTML = `
        <div class="result-item">
            <i class="fas fa-search"></i>
            <span>Enter a name in the search box above to check if you're on the guest list.</span>
        </div>
    `;
}

function searchName() {
    const searchInput = document.getElementById('nameSearch');
    if (!searchInput) {
        console.error('Search input not found!');
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    if (!resultsContainer) {
        console.error('Search results container not found!');
        return;
    }

    console.log("DEBUG: Searching for", searchTerm);
    console.log("DEBUG: Guest list has", guestList ? guestList.length : 0, "entries");

    // Clear previous results
    resultsContainer.innerHTML = '';

    if (searchTerm === '') {
        // Show instructions when search is empty
        resultsContainer.innerHTML = `
            <div class="result-item">
                <i class="fas fa-search"></i>
                <span>Enter a name in the search box above to check if you're on the guest list.</span>
            </div>
        `;
        return;
    }

    if (!guestList || guestList.length === 0) {
        resultsContainer.innerHTML = `
            <div class="result-item">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Guest list not loaded. Please refresh the page.</span>
            </div>
        `;
        return;
    }

    // Search for matches
    const matches = [];
    for (let i = 0; i < guestList.length; i++) {
        const guest = guestList[i];
        if (guest.toLowerCase().includes(searchTerm)) {
            matches.push(guest);
            console.log("DEBUG: Found match at index", i, ":", guest);
        }
    }

    console.log("DEBUG: Total matches found:", matches.length);

    if (matches.length === 0) {
        resultsContainer.innerHTML = `
            <div class="result-item">
                <i class="fas fa-user-times"></i>
                <span>No matching names found for "${searchInput.value}". Please check your spelling or contact the couple directly.</span>
            </div>
        `;
    } else {
        // Show match count
        const matchCount = document.createElement('div');
        matchCount.className = 'result-item';
        matchCount.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Found ${matches.length} matching guest(s)</span>
        `;
        resultsContainer.appendChild(matchCount);

        // Display matches
        matches.forEach(guest => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item found';
            resultItem.innerHTML = `
                <i class="fas fa-user-check"></i>
                <span><strong>${guest}</strong> - Confirmed on guest list ✓</span>
            `;
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Video Player Functionality
function initVideoPlayer() {
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const saveDateVideo = document.getElementById('saveDateVideo');

    if (videoPlaceholder && saveDateVideo) {
        videoPlaceholder.addEventListener('click', function () {
            // Hide placeholder and show video
            videoPlaceholder.style.display = 'none';
            saveDateVideo.style.display = 'block';

            // Pause the background music if it's playing
            if (!music.paused) {
                music.pause();
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
                songTitle.textContent = "Music paused - video playing";
            }

            // Set video playing flag
            isVideoPlaying = true;

            // Play the video
            saveDateVideo.play().catch(error => {
                console.log('Video playback failed:', error);
                // If auto-play fails, show video with controls
                saveDateVideo.style.display = 'block';
                isVideoPlaying = false;
            });
        });

        // When video ends
        saveDateVideo.addEventListener('ended', function () {
            saveDateVideo.style.display = 'none';
            videoPlaceholder.style.display = 'block';
            isVideoPlaying = false;

            // Resume music if it was playing before
            if (musicStarted && !music.paused) {
                music.play();
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                songTitle.textContent = "Playing: Wedding Song";
            }
        });

        // When video is paused by user
        saveDateVideo.addEventListener('pause', function () {
            isVideoPlaying = false;
            // Don't auto-resume music here - let user decide
        });

        // When video is played by user
        saveDateVideo.addEventListener('play', function () {
            isVideoPlaying = true;
            // Pause music when video plays
            if (!music.paused) {
                music.pause();
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
                songTitle.textContent = "Music paused - video playing";
            }
        });

        // Optional: Add click on video to pause
        saveDateVideo.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent triggering parent click
            if (!saveDateVideo.paused) {
                saveDateVideo.pause();
                isVideoPlaying = false;
            } else {
                saveDateVideo.play();
                isVideoPlaying = true;
            }
        });
    }
}

// Initialize search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('nameSearch');
    if (searchInput) {
        // Add Enter key support for search
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchName();
            }
        });

        // Add real-time search
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim();

            if (searchTerm === '') {
                // Show instructions when input is cleared
                const resultsContainer = document.getElementById('searchResults');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `
                    <div class="result-item">
                        <i class="fas fa-search"></i>
                        <span>Enter a name in the search box above to check if you're on the guest list.</span>
                    </div>
                `;
                }
            } else {
                // Only search if there's a term
                searchName();
            }
        });

        // Add clear button to search
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            // Create clear button
            const clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.innerHTML = '<i class="fas fa-times"></i>';
            clearButton.className = 'clear-btn';
            clearButton.style.display = 'none';
            clearButton.onclick = function () {
                searchInput.value = '';
                searchInput.focus();
                displayAllGuests();
                this.style.display = 'none';
            };

            // Add clear button to search container
            searchContainer.appendChild(clearButton);

            // Show/hide clear button based on input
            searchInput.addEventListener('input', function () {
                if (this.value.trim() !== '') {
                    clearButton.style.display = 'flex';
                } else {
                    clearButton.style.display = 'none';
                }
            });
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing...');

    // Initialize guest list
    initializeGuestList();

    // Initialize video player
    initVideoPlayer();

    // Initialize search functionality
    initSearchFunctionality();

    console.log('Initialization complete');
});

// Also initialize when window loads (as a backup)
window.addEventListener('load', function () {
    console.log('Window loaded');
    // Make sure guest list is initialized
    if (!guestList || guestList.length === 0) {
        console.log('Guest list empty on window load, reinitializing...');
        initializeGuestList();
    }

    // Make sure video player is initialized
    initVideoPlayer();
});