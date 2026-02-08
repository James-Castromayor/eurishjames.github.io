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
        "Cyrill Medina",
        "Xian Medina",
        "Ciela Gutierrez",
        "Pau San Juan",
        "Claire Gutierrez",
        "Elson Gutierrez",
        "Erjohn Gutierrez",
        "Jim Castromayor",
        "Rhodora Glorioso",
        "Jean Quinones",
        "Levi Quinones",
        "Chesi Quinones",
        "Jorja Quinones",
        "Jimboy Castromayor",
        "Kat Vipinosa",
        "Jane Castromayor",
        "Lolit Parado",
        "Joan Parado",
        "Arkayne Parado",
        "Azielle Parado",
        "Ayriell Parado",
        "GL Parado",
        "Dione Sobrevinas",
        "Alice Sobrevinas",
        "Daye Sobrevinas",
        "Donne Sobrevinas",
        "Den Sobrevinas",
        "Hobert Orbeta",
        "Thess Orbeta",
        "Henessy Orbeta",
        "Hazel Orbeta",
        "Harvey Orbeta",
        "Hilary Orbeta",
        "Terry Orbeta",
        "Leli Orbeta",
        "Marizen Orbeta",
        "Joy Resubal",
        "Anthony Resubal",
        "Paul Resubal",
        "Maymay Resubal",
        "Rose Ocampo",
        "Erwin Ocampo",
        "Divine Gruspe",
        "Lee Gruspe",
        "Josie Glorioso",
        "Kevin Glorioso",
        "Rio Glorioso",
        "Rosh Glorioso",
        "Anthony Glorioso",
        "Marco Glorioso",
        "Jameer Glorios",
        "Joyce Glorioso",
        "Christoper Ocampo",
        "Sandae Natividad",
        "Jason Cabalquinto",
        "Reena",
        "Gab Glorioso",
        "Allan Zuniga",
        "Cess Zuniga",
        "Glen Zuniga",
        "Jhunbert Bencion",
        "Chris Trinidad",
        "Earvin Lim",
        "Earvin Lim (wife)",
        "Nico Decio",
        "Kae",
        "Kae wife",
        "Kuya Dong",
        "Nathan",
        "Archie",
        "Hubert",
        "AM Zamora",
        "Brenda Balucas",
        "Lala Mirasol",
        "Jun Faduhilao",
        "Richard Malapitan",
        "Ricardo Felix",
        "Mae Battulayan",
        "Ramon Olay",
        "Ken San Jose",
        "Alex Ricamonte",
        "Checel Lastrilla",
        "Jun Tambaba",
        "Joan - HR",
        "Ben Arigo",
        "Cess de Leon",
        "JJ de Leon",
        "Tita Puti",
        "Queency",
        "Carlo",
        "Carlo +1",
        "Papz",
        "Papz +1",
        "Mikel Resubal",
        "Gina Resubal",
        "Paolo Billones",
        "Sean Billones",
        "Paris Billones",
        "Ericka Billones",
        "Nanay Azon",
        "Jeanie Armac",
        "Alfie Armac",
        "Boyet Zuniga",
        "Aica Posadas",
        "Aica Posadas +1",
        "Rachel Serrano",
        "Aeth",
        "Aeth +1",
        "Eddie Gutierrez",
        "Melissa Gutierrez",
        "Yollie Billones",
        "Gloria Santos",
        "Abet Santos",
        "Lem Almendral",
        "Treb Cabrera",
        "Lucci Ocampo",
        "Rio Macapanpan",
        "Efrelinda Glorioso"
    ];
    console.log('Fallback list loaded with', guestList.length, 'guests');
    document.getElementById('totalConfirmed').textContent = guestList.length;

    // Update display
    const searchInput = document.getElementById('nameSearch');
    if (!searchInput || searchInput.value.trim() === '') {
        displayAllGuests();
    }
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

    // Display all guests without sorting (preserve order from file)
    guestList.forEach(guest => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${guest}</span>
        `;
        resultsContainer.appendChild(resultItem);
    });
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
        displayAllGuests();
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

    // Simple test - just log what we find
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
                <span>No matching names found for "${searchInput.value}".</span>
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
                <span><strong>${guest}</strong> - Confirmed ✓</span>
            `;
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing...');

    // Initialize guest list immediately
    initializeGuestList();

    // Add Enter key support for search
    const searchInput = document.getElementById('nameSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchName();
            }
        });

        // Add real-time search
        searchInput.addEventListener('input', function () {
            // Only search if there's a term
            if (this.value.trim() !== '') {
                searchName();
            } else {
                displayAllGuests();
            }
        });
    }

    // Add clear button to search
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && searchInput) {
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
});