// PaiNaiDee Enhanced 3D Map JavaScript with Modern UX/UI Features

let isRotating = true;
let rotationSpeed = 1;
let currentFocus = 'world';
let globe;
let favorites = JSON.parse(localStorage.getItem('painaidee-favorites')) || [];
let userPreferences = JSON.parse(localStorage.getItem('painaidee-preferences')) || {
    theme: 'light',
    language: 'th'
};

// Enhanced Thai locations with more detailed information
const locations = {
    bangkok: {
        name: "กรุงเทพมหานคร",
        nameEn: "Bangkok",
        description: "เมืองหลวงของประเทศไทย เต็มไปด้วยวัดสวยงามและวัฒนธรรม อีกทั้งยังเป็นศูนย์กลางทางเศรษฐกิจและการท่องเที่ยว",
        descriptionEn: "Capital city of Thailand, rich in temples and culture, and the economic and tourism center",
        emoji: "🏛️",
        coordinates: [100.5018, 13.7563],
        attractions: ["วัดพระแก้ว", "พระบรมมหาราชวัง", "วัดโพธิ์", "ตลาดจตุจักร"],
        attractionsEn: ["Wat Phra Kaew", "Grand Palace", "Wat Pho", "Chatuchak Market"],
        photos: [
            { name: "Grand Palace", emoji: "🏰" },
            { name: "Wat Arun", emoji: "🕌" },
            { name: "Floating Market", emoji: "🛶" }
        ],
        weather: "30°C ☀️",
        bestTime: "November - February"
    },
    chiangmai: {
        name: "เชียงใหม่", 
        nameEn: "Chiang Mai",
        description: "เมืองแห่งดอยสูงและวัฒนธรรมล้านนา มีอากาศเย็นสบายและธรรมชาติที่สวยงาม",
        descriptionEn: "City of mountains and Lanna culture with cool weather and beautiful nature",
        emoji: "🏔️",
        coordinates: [98.9817, 18.7883],
        attractions: ["ดอยสุเทพ", "วัดพระธาตุ", "ตลาดวอร์กกิ้งสตรีท", "อุทยานแห่งชาติดอยอินทนนท์"],
        attractionsEn: ["Doi Suthep", "Wat Phra That", "Walking Street", "Doi Inthanon National Park"],
        photos: [
            { name: "Doi Suthep", emoji: "⛰️" },
            { name: "Night Bazaar", emoji: "🌃" },
            { name: "Elephant Sanctuary", emoji: "🐘" }
        ],
        weather: "25°C 🌤️",
        bestTime: "October - March"
    },
    phuket: {
        name: "ภูเก็ต",
        nameEn: "Phuket", 
        description: "เกะมุกอันดามัน ทะเลใสและหาดทรายขาว เป็นจุดหมายปลายทางการท่องเที่ยวที่มีชื่อเสียงระดับโลก",
        descriptionEn: "Pearl of Andaman with crystal clear sea and white sandy beaches, a world-famous tourist destination",
        emoji: "🏝️",
        coordinates: [98.3923, 7.8804],
        attractions: ["หาดป่าตอง", "เกาะพีพี", "หาดกะตะ", "บิ๊กบุดดา"],
        attractionsEn: ["Patong Beach", "Phi Phi Islands", "Kata Beach", "Big Buddha"],
        photos: [
            { name: "Patong Beach", emoji: "🏖️" },
            { name: "Phi Phi Islands", emoji: "🏝️" },
            { name: "Sunset View", emoji: "🌅" }
        ],
        weather: "28°C 🌊",
        bestTime: "November - April"
    },
    europe: {
        name: "ยุโรป",
        nameEn: "Europe",
        description: "ทวีปแห่งประวัติศาสตร์และศิลปะ มีสถาปัตยกรรมที่งดงามและวัฒนธรรมที่หลากหลาย",
        descriptionEn: "Continent of history and art with beautiful architecture and diverse cultures",
        emoji: "🏛️",
        coordinates: [10.0, 54.0],
        attractions: ["หอไอเฟล", "โคลอสเซี่ยม", "สะพานลอนดอน", "พิพิธภัณฑ์ลูฟร์"],
        attractionsEn: ["Eiffel Tower", "Colosseum", "Tower Bridge", "Louvre Museum"],
        photos: [
            { name: "Eiffel Tower", emoji: "🗼" },
            { name: "Colosseum", emoji: "🏟️" },
            { name: "Big Ben", emoji: "🕰️" }
        ],
        weather: "15°C 🌤️",
        bestTime: "April - October"
    },
    america: {
        name: "อเมริกา",
        nameEn: "America", 
        description: "ดินแดนแห่งความฝันและโอกาส มีเมืองใหญ่ที่ทันสมัยและธรรมชาติที่น่าประทับใจ",
        descriptionEn: "Land of dreams and opportunities with modern cities and impressive nature",
        emoji: "🗽",
        coordinates: [-95.0, 37.0],
        attractions: ["เทพีเสรีภาพ", "แกรนด์แคนยอน", "ไทม์สแควร์", "โลกดิสนีย์"],
        attractionsEn: ["Statue of Liberty", "Grand Canyon", "Times Square", "Disney World"],
        photos: [
            { name: "Statue of Liberty", emoji: "🗽" },
            { name: "Grand Canyon", emoji: "🏔️" },
            { name: "Times Square", emoji: "🌃" }
        ],
        weather: "20°C 🌤️",
        bestTime: "Year Round"
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLoadingSpinner();
    initializeEnhanced3D();
    initializeTheme();
    initializeSearch();
    initializeFavorites();
    initializeKeyboardNavigation();
    updateWeatherInfo();
    setTimeout(hideLoadingSpinner, 1000);
    updateStatus('🌍 สร้างโลก 3D ปรับปรุงแล้วสำเร็จ!', '🌍 Enhanced 3D Globe created successfully!');
    console.log('🗺️ PaiNaiDee Enhanced 3D Map loaded successfully!');
});

// Loading spinner functions
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = userPreferences.theme;
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const themeIcon = document.getElementById('themeIcon');
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    userPreferences.theme = newTheme;
    localStorage.setItem('painaidee-preferences', JSON.stringify(userPreferences));
    
    // Add theme transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function initializeEnhanced3D() {
    globe = document.querySelector('.globe-sphere');
    const continents = document.querySelector('.continents-layer');
    
    // Enhanced mouse interaction
    addEnhancedMouseControls();
    
    // Enhanced rotation control
    updateGlobeRotation();
    
    // Add touch support for mobile
    addTouchSupport();
    
    // Add interactive click effects
    addClickEffects();
    
    console.log('🗺️ PaiNaiDee Enhanced 3D Map loaded successfully!');
    console.log('สร้างแผนที่ 3 มิติปรับปรุงแล้วสำเร็จ! Created Enhanced 3D Map successfully!');
}

function updateGlobeRotation() {
    if (isRotating) {
        const animationDuration = `${30 / rotationSpeed}s`;
        globe.style.animationDuration = animationDuration;
        globe.querySelector('.continents-layer').style.animationDuration = animationDuration;
        globe.style.animationPlayState = 'running';
    } else {
        globe.style.animationPlayState = 'paused';
        globe.querySelector('.continents-layer').style.animationPlayState = 'paused';
    }
}

function addEnhancedMouseControls() {
    let isDragging = false;
    let startX, startY;
    let currentRotationY = 0;
    let currentRotationX = -10;
    
    globe.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        globe.style.cursor = 'grabbing';
        globe.style.animationPlayState = 'paused';
        globe.querySelector('.continents-layer').style.animationPlayState = 'paused';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            currentRotationY += deltaX * 0.5;
            currentRotationX = Math.max(-45, Math.min(45, currentRotationX + deltaY * 0.5));
            
            globe.style.transform = `rotateY(${currentRotationY}deg) rotateX(${currentRotationX}deg)`;
            
            startX = e.clientX;
            startY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            globe.style.cursor = 'grab';
            
            if (isRotating) {
                // Resume rotation with current position
                globe.style.animationPlayState = 'running';
                globe.querySelector('.continents-layer').style.animationPlayState = 'running';
            }
        }
    });
    
    // Mouse wheel for zoom effect
    globe.addEventListener('wheel', (e) => {
        e.preventDefault();
        const container = document.getElementById('globe3D');
        const currentScale = container.style.transform.match(/scale\(([^)]+)\)/);
        let scale = currentScale ? parseFloat(currentScale[1]) : 1;
        
        scale += e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.max(0.5, Math.min(2, scale));
        
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });
}

function addTouchSupport() {
    let touchStartX, touchStartY;
    
    globe.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        globe.style.animationPlayState = 'paused';
        globe.querySelector('.continents-layer').style.animationPlayState = 'paused';
    });
    
    globe.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        const currentTransform = globe.style.transform || 'rotateY(0deg) rotateX(-10deg)';
        const yMatch = currentTransform.match(/rotateY\(([^)]+)deg\)/);
        const xMatch = currentTransform.match(/rotateX\(([^)]+)deg\)/);
        
        let currentY = yMatch ? parseFloat(yMatch[1]) : 0;
        let currentX = xMatch ? parseFloat(xMatch[1]) : -10;
        
        currentY += deltaX * 0.5;
        currentX = Math.max(-45, Math.min(45, currentX + deltaY * 0.5));
        
        globe.style.transform = `rotateY(${currentY}deg) rotateX(${currentX}deg)`;
        
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });
    
    globe.addEventListener('touchend', () => {
        if (isRotating) {
            globe.style.animationPlayState = 'running';
            globe.querySelector('.continents-layer').style.animationPlayState = 'running';
        }
    });
}

function addClickEffects() {
    globe.addEventListener('click', (e) => {
        // Only if not clicking on a marker
        if (!e.target.classList.contains('marker')) {
            createRippleEffect(e);
        }
    });
}

function createRippleEffect(e) {
    const rect = globe.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '4px';
    ripple.style.height = '4px';
    ripple.style.background = 'rgba(255, 255, 255, 0.8)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'rippleExpand 0.8s ease-out forwards';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';
    
    globe.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
    
    updateStatus('🎯 สำรวจพื้นผิวโลก!', '🎯 Exploring Earth surface!');
}

// Dynamic styles will be added at the end of the file to avoid conflicts

function toggleRotation() {
    isRotating = !isRotating;
    
    const button = event.target;
    button.textContent = isRotating ? '⏸️ หยุด/เล่น' : '▶️ หยุด/เล่น';
    
    updateGlobeRotation();
    
    updateStatus(isRotating ? 'กำลังหมุน...' : 'หยุดหมุน', isRotating ? 'Rotating...' : 'Paused');
}

function changeSpeed() {
    rotationSpeed = rotationSpeed === 1 ? 2 : rotationSpeed === 2 ? 0.5 : 1;
    updateGlobeRotation();
    
    const speedText = rotationSpeed === 2 ? 'เร็ว' : rotationSpeed === 0.5 ? 'ช้า' : 'ปกติ';
    const speedTextEn = rotationSpeed === 2 ? 'Fast' : rotationSpeed === 0.5 ? 'Slow' : 'Normal';
    
    updateStatus(`ความเร็ว: ${speedText}`, `Speed: ${speedTextEn}`);
}

function focusLocation(location) {
    currentFocus = location;
    const info = locations[location];
    
    if (info) {
        // Highlight the specific marker
        const marker = document.querySelector(`.marker.${location}`);
        if (marker) {
            // Add focus animation
            marker.style.animation = 'markerFocus 1s ease-in-out';
            setTimeout(() => {
                marker.style.animation = 'markerPulse 2s ease-in-out infinite';
            }, 1000);
        }
        
        updateStatus(`${info.emoji} ${info.name}`, `${info.emoji} ${info.nameEn}`);
    } else if (location === 'world') {
        // Reset all markers
        document.querySelectorAll('.marker').forEach(marker => {
            marker.style.animation = 'markerPulse 2s ease-in-out infinite';
        });
        updateStatus('🌍 มุมมองโลก', '🌍 World View');
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
        if (searchResults.children.length > 0) {
            searchResults.style.display = 'block';
        }
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }
    
    const filteredLocations = Object.keys(locations).filter(key => {
        const location = locations[key];
        return location.name.toLowerCase().includes(query) ||
               location.nameEn.toLowerCase().includes(query) ||
               (location.attractions && location.attractions.some(attraction => attraction.toLowerCase().includes(query))) ||
               (location.attractionsEn && location.attractionsEn.some(attraction => attraction.toLowerCase().includes(query)));
    });
    
    displaySearchResults(filteredLocations);
}

function displaySearchResults(filteredLocations) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    
    if (filteredLocations.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">ไม่พบผลลัพธ์ / No results found</div>';
    } else {
        filteredLocations.forEach(key => {
            const location = locations[key];
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `${location.emoji} ${location.name} (${location.nameEn})`;
            item.addEventListener('click', () => {
                focusLocation(key);
                searchResults.style.display = 'none';
                document.getElementById('searchInput').value = '';
            });
            searchResults.appendChild(item);
        });
    }
    
    searchResults.style.display = 'block';
}

// Favorites system
function initializeFavorites() {
    updateFavoritesDisplay();
    updateFavoriteButtons();
}

function toggleFavorite(locationKey) {
    const index = favorites.indexOf(locationKey);
    
    if (index === -1) {
        favorites.push(locationKey);
        showNotification('เพิ่มในรายการโปรดแล้ว! Added to favorites!', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('ลบออกจากรายการโปรดแล้ว! Removed from favorites!', 'info');
    }
    
    localStorage.setItem('painaidee-favorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const location = btn.dataset.location;
        if (favorites.includes(location)) {
            btn.classList.add('active');
            btn.innerHTML = '⭐';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '⭐';
        }
    });
}

function updateFavoritesDisplay() {
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesList = document.getElementById('favoritesList');
    
    if (!favoritesSection || !favoritesList) return;
    
    if (favorites.length === 0) {
        favoritesSection.style.display = 'none';
        return;
    }
    
    favoritesSection.style.display = 'block';
    favoritesList.innerHTML = '';
    
    favorites.forEach(locationKey => {
        const location = locations[locationKey];
        if (location) {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <span>${location.emoji} ${location.name}</span>
                <button onclick="focusLocation('${locationKey}')" style="background: transparent; border: none; color: var(--accent-color); cursor: pointer;">🎯</button>
            `;
            favoritesList.appendChild(item);
        }
    });
}

// Weather information (simulated)
function updateWeatherInfo() {
    const weatherInfo = document.getElementById('weatherInfo');
    if (!weatherInfo) return;
    
    // Simulate weather API call
    setTimeout(() => {
        const weatherData = {
            bangkok: "30°C ☀️ แจ่มใส",
            chiangmai: "25°C 🌤️ เย็นสบาย", 
            phuket: "28°C 🌊 ลมทะเล"
        };
        
        const randomLocation = Object.keys(weatherData)[Math.floor(Math.random() * 3)];
        weatherInfo.innerHTML = `🌤️ ${locations[randomLocation].name}: ${weatherData[randomLocation]}`;
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        color: var(--panel-text);
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        z-index: 1300;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 8px 32px var(--shadow-color);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleKeyboardNavigation(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        closeModal();
        return;
    }
    
    // Number keys for quick location access
    const locationKeys = {
        '1': 'bangkok',
        '2': 'chiangmai', 
        '3': 'phuket',
        '4': 'world'
    };
    
    if (locationKeys[e.key]) {
        focusLocation(locationKeys[e.key]);
        return;
    }
    
    // Space bar to toggle rotation
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        toggleRotation();
        return;
    }
    
    // Arrow keys for manual globe rotation (when auto-rotation is off)
    if (!isRotating && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        manualRotateGlobe(e.key);
    }
}

function manualRotateGlobe(key) {
    const globe = document.querySelector('.globe-sphere');
    if (!globe) return;
    
    const currentTransform = globe.style.transform || 'rotateY(0deg) rotateX(-10deg)';
    const yMatch = currentTransform.match(/rotateY\(([^)]+)deg\)/);
    const xMatch = currentTransform.match(/rotateX\(([^)]+)deg\)/);
    
    let currentY = yMatch ? parseFloat(yMatch[1]) : 0;
    let currentX = xMatch ? parseFloat(xMatch[1]) : -10;
    
    switch (key) {
        case 'ArrowLeft':
            currentY -= 10;
            break;
        case 'ArrowRight':
            currentY += 10;
            break;
        case 'ArrowUp':
            currentX = Math.max(-45, currentX - 10);
            break;
        case 'ArrowDown':
            currentX = Math.min(45, currentX + 10);
            break;
    }
    
    globe.style.transform = `rotateY(${currentY}deg) rotateX(${currentX}deg)`;
}

// Enhanced modal system for location information
function showInfo(location) {
    const info = locations[location];
    if (!info) return;
    
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalGallery = document.getElementById('modalGallery');
    
    if (!modal || !modalTitle || !modalBody || !modalGallery) {
        // Fallback to alert if modal elements don't exist
        const attractions = info.attractions ? `\n\n🎯 สถานที่น่าสนใจ:\n${info.attractions.join(', ')}` : '';
        const message = `${info.emoji} ${info.name} (${info.nameEn})\n\n📍 ${info.description}\n🌍 ${info.descriptionEn}${attractions}`;
        alert(message);
        focusLocation(location);
        return;
    }
    
    modalTitle.textContent = `${info.emoji} ${info.name} (${info.nameEn})`;
    
    modalBody.innerHTML = `
        <div class="location-details">
            <p><strong>📍 คำอธิบาย / Description:</strong></p>
            <p>${info.description}</p>
            <p><em>${info.descriptionEn}</em></p>
            
            <p><strong>🎯 สถานที่น่าสนใจ / Attractions:</strong></p>
            <ul>
                ${info.attractions ? info.attractions.map((attraction, index) => 
                    `<li>${attraction}${info.attractionsEn && info.attractionsEn[index] ? ` (${info.attractionsEn[index]})` : ''}</li>`
                ).join('') : '<li>ข้อมูลสถานที่ท่องเที่ยว / Tourist information coming soon</li>'}
            </ul>
            
            <div class="weather-info">
                <p><strong>🌤️ สภาพอากาศ / Weather:</strong> ${info.weather || 'N/A'}</p>
                <p><strong>📅 ช่วงเวลาที่เหมาะสม / Best Time:</strong> ${info.bestTime || 'Year Round'}</p>
            </div>
        </div>
    `;
    
    // Create photo gallery
    if (info.photos) {
        modalGallery.innerHTML = info.photos.map(photo => `
            <div class="gallery-item">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${photo.emoji}</div>
                <p style="font-size: 0.875rem;">${photo.name}</p>
            </div>
        `).join('');
    } else {
        modalGallery.innerHTML = '<p>🖼️ ภาพประกอบจะมาเร็วๆ นี้ / Photos coming soon</p>';
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Focus location on map
    focusLocation(location);
    
    // Add click effect to marker
    const marker = document.querySelector(`.marker.${location}`);
    if (marker) {
        marker.style.transform = 'scale(2)';
        setTimeout(() => {
            marker.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateStatus(`📍 กำลังดู: ${info.name}`, `📍 Viewing: ${info.nameEn}`);
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function updateStatus(textTh, textEn) {
    const status = document.getElementById('status');
    status.textContent = `${textTh} | ${textEn}`;
    
    // Add a brief animation to the status
    status.style.transform = 'scale(1.05)';
    setTimeout(() => {
        status.style.transform = 'scale(1)';
    }, 200);
}

function initializeMap() {
    // Self-contained enhanced 3D map
    initializeEnhanced3D();
    updateStatus('🌍 สร้างโลก 3D ปรับปรุงแล้วสำเร็จ!', '🌍 Enhanced 3D Globe created successfully!');
}

// Add all dynamic CSS animations in a single style element to avoid conflicts
const consolidatedStyle = document.createElement('style');
consolidatedStyle.textContent = `
    @keyframes rippleExpand {
        0% {
            width: 4px;
            height: 4px;
            opacity: 1;
        }
        100% {
            width: 60px;
            height: 60px;
            opacity: 0;
        }
    }
    
    @keyframes markerFocus {
        0%, 100% { 
            transform: scale(1);
        }
        50% { 
            transform: scale(2);
            box-shadow: 0 0 40px rgba(255, 215, 0, 1);
        }
    }
    
    .status {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(consolidatedStyle);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMap);