// ========================================
// UX/UI IMPROVEMENTS - SMART DEFAULTS & AUTOFILL
// ========================================

// Smart defaults and user preference detection
class UXSmartDefaults {
    constructor() {
        this.userLocation = null;
        this.browserPreferences = {};
        this.userHistory = JSON.parse(localStorage.getItem('painaidee-user-history')) || {
            searchQueries: [],
            visitedLocations: [],
            commonRoutes: [],
            preferredDuration: '5',
            lastTripType: 'cultural'
        };
        this.init();
    }

    init() {
        this.detectBrowserPreferences();
        this.detectUserLocation();
        this.setupSmartDefaults();
        this.initializeAutofill();
    }

    // Detect browser preferences for smart defaults
    detectBrowserPreferences() {
        // Detect preferred language
        const browserLang = navigator.language || navigator.userLanguage;
        this.browserPreferences.language = browserLang.startsWith('th') ? 'th' : 'en';
        
        // Detect timezone for smart trip suggestions
        this.browserPreferences.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Detect dark mode preference
        this.browserPreferences.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Detect reduced motion preference
        this.browserPreferences.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        console.log('🧠 Browser preferences detected:', this.browserPreferences);
    }

    // Auto-detect user location for smart suggestions
    async detectUserLocation() {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 10000,
                        enableHighAccuracy: false
                    });
                });
                
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                // Determine if user is in Thailand or nearby
                this.userLocation.inThailand = this.isInThailand(this.userLocation.lat, this.userLocation.lng);
                this.userLocation.nearbyDestination = this.findNearestDestination(this.userLocation.lat, this.userLocation.lng);
                
                console.log('📍 User location detected:', this.userLocation);
                this.applyLocationBasedDefaults();
                
            } catch (error) {
                console.log('📍 Location detection failed, using fallback suggestions');
                this.useLocationFallback();
            }
        } else {
            this.useLocationFallback();
        }
    }

    // Check if coordinates are within Thailand bounds
    isInThailand(lat, lng) {
        return lat >= 5.6 && lat <= 20.5 && lng >= 97.3 && lng <= 105.6;
    }

    // Find nearest destination to user location
    findNearestDestination(lat, lng) {
        let nearestDest = null;
        let minDistance = Infinity;
        
        Object.entries(locations).forEach(([key, location]) => {
            if (location.coordinates) {
                const distance = this.calculateDistance(lat, lng, location.coordinates[1], location.coordinates[0]);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestDest = {
                        key: key,
                        distance: distance,
                        location: location
                    };
                }
            }
        });
        
        return nearestDest;
    }

    // Calculate distance between two points
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Apply smart defaults based on user location
    applyLocationBasedDefaults() {
        if (this.userLocation.inThailand && this.userLocation.nearbyDestination) {
            // Auto-focus on nearest destination
            setTimeout(() => {
                if (typeof focusLocation === 'function') {
                    focusLocation(this.userLocation.nearbyDestination.key);
                }
                
                // Show suggestion notification
                this.showLocationSuggestion(this.userLocation.nearbyDestination);
            }, 3000);
        }
    }

    // Fallback when location detection fails
    useLocationFallback() {
        // Use popular destinations as defaults
        this.userLocation = {
            fallback: true,
            nearbyDestination: {
                key: 'bangkok',
                location: locations.bangkok
            }
        };
    }

    // Show smart location suggestion
    showLocationSuggestion(nearestDest) {
        const isThaiLang = userPreferences.language === 'th';
        const locationName = isThaiLang ? nearestDest.location.name : nearestDest.location.nameEn;
        const distance = Math.round(nearestDest.distance);
        
        const message = isThaiLang ? 
            `📍 เราพบว่าคุณอยู่ใกล้${locationName} (${distance} กม.) อยากดูข้อมูลมั้ย?` :
            `📍 We found you're near ${locationName} (${distance} km). Want to explore?`;
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        }
    }

    // Setup smart defaults for various UI elements
    setupSmartDefaults() {
        // Set language default
        if (!localStorage.getItem('painaidee-preferences')) {
            userPreferences.language = this.browserPreferences.language;
            localStorage.setItem('painaidee-preferences', JSON.stringify(userPreferences));
        }

        // Set theme default
        if (this.browserPreferences.darkMode && !localStorage.getItem('painaidee-theme')) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('painaidee-theme', 'dark');
        }

        // Set trip duration default based on history
        this.setTripDurationDefault();
        
        // Setup route planning defaults
        this.setupRouteDefaults();
    }

    // Set smart default for trip duration
    setTripDurationDefault() {
        const tripDurationSelect = document.getElementById('tripDuration');
        if (tripDurationSelect && this.userHistory.preferredDuration) {
            tripDurationSelect.value = this.userHistory.preferredDuration;
        }
    }

    // Setup route planning with smart defaults
    setupRouteDefaults() {
        const fromSelect = document.getElementById('fromLocation');
        const toSelect = document.getElementById('toLocation');
        
        if (fromSelect && toSelect) {
            // If user has location, set as default starting point
            if (this.userLocation && this.userLocation.nearbyDestination) {
                fromSelect.value = this.userLocation.nearbyDestination.key;
            } else if (this.userHistory.commonRoutes.length > 0) {
                // Use most common starting point from history
                const commonStart = this.userHistory.commonRoutes[0].from;
                fromSelect.value = commonStart;
            }
        }
    }

    // Initialize autofill features
    initializeAutofill() {
        this.setupSearchAutofill();
        this.setupFormMemory();
        this.setupSmartSuggestions();
    }

    // Setup intelligent search autofill
    setupSearchAutofill() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        // Create suggestion dropdown
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'smart-suggestions';
        suggestionsList.style.display = 'none';
        searchInput.parentNode.appendChild(suggestionsList);

        // Add smart placeholder with user's nearest location
        if (this.userLocation && this.userLocation.nearbyDestination) {
            const isThaiLang = userPreferences.language === 'th';
            const locationName = isThaiLang ? 
                this.userLocation.nearbyDestination.location.name :
                this.userLocation.nearbyDestination.location.nameEn;
            
            searchInput.placeholder = isThaiLang ?
                `🔍 ค้นหาสถานที่... เช่น ${locationName}` :
                `🔍 Search location... e.g. ${locationName}`;
        }

        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.showSmartSuggestions(e.target.value, suggestionsList);
            }, 300);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.style.display = 'none';
            }
        });
    }

    // Show smart suggestions based on user history and behavior
    showSmartSuggestions(query, suggestionsList) {
        if (query.length < 2) {
            suggestionsList.style.display = 'none';
            return;
        }

        const suggestions = this.generateSmartSuggestions(query);
        
        if (suggestions.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }

        suggestionsList.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-location="${suggestion.key}" data-type="${suggestion.type}">
                <div class="suggestion-content">
                    <div class="suggestion-icon">${suggestion.icon}</div>
                    <div class="suggestion-text">
                        <div class="suggestion-name">${suggestion.name}</div>
                        <div class="suggestion-description">${suggestion.description}</div>
                    </div>
                    <div class="suggestion-meta">
                        ${suggestion.badge || ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const locationKey = item.dataset.location;
                if (typeof showInfo === 'function') {
                    showInfo(locationKey);
                }
                suggestionsList.style.display = 'none';
                
                // Track user selection for future suggestions
                this.trackSearchSelection(query, locationKey);
            });
        });

        suggestionsList.style.display = 'block';
    }

    // Generate smart suggestions based on various factors
    generateSmartSuggestions(query) {
        const suggestions = [];
        const isThaiLang = userPreferences.language === 'th';
        
        // 1. Exact matches from locations
        Object.entries(locations).forEach(([key, location]) => {
            const name = isThaiLang ? location.name : location.nameEn;
            if (name.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({
                    key: key,
                    name: name,
                    description: isThaiLang ? location.description : location.descriptionEn,
                    icon: location.emoji,
                    type: 'exact',
                    priority: 10
                });
            }
        });

        // 2. Previously searched items
        this.userHistory.searchQueries.forEach(prevQuery => {
            if (prevQuery.query.toLowerCase().includes(query.toLowerCase()) && 
                prevQuery.resultClicked) {
                const location = locations[prevQuery.resultClicked];
                if (location && !suggestions.find(s => s.key === prevQuery.resultClicked)) {
                    const name = isThaiLang ? location.name : location.nameEn;
                    suggestions.push({
                        key: prevQuery.resultClicked,
                        name: name,
                        description: isThaiLang ? 'เคยค้นหาแล้ว' : 'Previously searched',
                        icon: location.emoji,
                        type: 'history',
                        badge: '🔍',
                        priority: 8
                    });
                }
            }
        });

        // 3. Popular destinations for new users
        if (this.userHistory.visitedLocations.length < 3) {
            const popularDestinations = ['bangkok', 'chiangmai', 'phuket'];
            popularDestinations.forEach(key => {
                const location = locations[key];
                if (location && !suggestions.find(s => s.key === key)) {
                    const name = isThaiLang ? location.name : location.nameEn;
                    if (name.toLowerCase().includes(query.toLowerCase())) {
                        suggestions.push({
                            key: key,
                            name: name,
                            description: isThaiLang ? 'จุดหมายยอดนิยม' : 'Popular destination',
                            icon: location.emoji,
                            type: 'popular',
                            badge: '⭐',
                            priority: 7
                        });
                    }
                }
            });
        }

        // 4. Nearby suggestions if user location is available
        if (this.userLocation && this.userLocation.nearbyDestination) {
            const nearbyKey = this.userLocation.nearbyDestination.key;
            const location = locations[nearbyKey];
            if (location && !suggestions.find(s => s.key === nearbyKey)) {
                const name = isThaiLang ? location.name : location.nameEn;
                if (name.toLowerCase().includes(query.toLowerCase())) {
                    suggestions.push({
                        key: nearbyKey,
                        name: name,
                        description: isThaiLang ? 'ใกล้คุณ' : 'Near you',
                        icon: location.emoji,
                        type: 'nearby',
                        badge: '📍',
                        priority: 9
                    });
                }
            }
        }

        // Sort by priority and limit results
        return suggestions
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 5);
    }

    // Track user selections for learning
    trackSearchSelection(query, locationKey) {
        this.userHistory.searchQueries.push({
            query: query,
            resultClicked: locationKey,
            timestamp: Date.now()
        });

        // Keep only last 20 searches
        if (this.userHistory.searchQueries.length > 20) {
            this.userHistory.searchQueries = this.userHistory.searchQueries.slice(-20);
        }

        this.saveUserHistory();
    }

    // Setup form memory for user convenience
    setupFormMemory() {
        // Remember trip planning preferences
        const tripCheckboxes = document.querySelectorAll('#destinationCheckboxes input[type="checkbox"]');
        tripCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveFormState();
            });
        });

        // Remember route planning choices
        const routeSelects = document.querySelectorAll('#fromLocation, #toLocation');
        routeSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.saveFormState();
            });
        });

        // Restore previous form states
        this.restoreFormState();
    }

    // Save current form state
    saveFormState() {
        const formState = {
            selectedDestinations: Array.from(document.querySelectorAll('#destinationCheckboxes input:checked')).map(cb => cb.value),
            tripDuration: document.getElementById('tripDuration')?.value,
            fromLocation: document.getElementById('fromLocation')?.value,
            toLocation: document.getElementById('toLocation')?.value,
            timestamp: Date.now()
        };

        localStorage.setItem('painaidee-form-state', JSON.stringify(formState));
    }

    // Restore previous form state
    restoreFormState() {
        const formState = JSON.parse(localStorage.getItem('painaidee-form-state'));
        if (!formState || Date.now() - formState.timestamp > 24 * 60 * 60 * 1000) {
            return; // Don't restore if older than 24 hours
        }

        // Restore trip planning selections
        if (formState.selectedDestinations) {
            formState.selectedDestinations.forEach(destination => {
                const checkbox = document.querySelector(`#destinationCheckboxes input[value="${destination}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        // Restore duration
        if (formState.tripDuration) {
            const durationSelect = document.getElementById('tripDuration');
            if (durationSelect) {
                durationSelect.value = formState.tripDuration;
            }
        }

        // Show restoration notification
        const isThaiLang = userPreferences.language === 'th';
        const message = isThaiLang ? 
            '💾 คืนค่าการเลือกครั้งล่าสุดแล้ว' : 
            '💾 Restored your previous selections';
        
        if (typeof showNotification === 'function') {
            setTimeout(() => showNotification(message, 'info'), 2000);
        }
    }

    // Setup smart suggestions throughout the app
    setupSmartSuggestions() {
        this.addQuickTripSuggestions();
        this.addSmartRouteSuggestions();
        this.addContextualHelp();
    }

    // Add quick trip suggestions
    addQuickTripSuggestions() {
        const tripWizardSection = document.getElementById('tripWizardSection');
        if (!tripWizardSection) return;

        const quickTripsContainer = document.createElement('div');
        quickTripsContainer.className = 'quick-trips-container';
        quickTripsContainer.innerHTML = `
            <h5>⚡ ${userPreferences.language === 'th' ? 'ทริปแนะนำ' : 'Quick Trip Ideas'}</h5>
            <div class="quick-trip-buttons">
                ${this.generateQuickTripButtons()}
            </div>
        `;

        tripWizardSection.insertBefore(quickTripsContainer, tripWizardSection.firstChild);
    }

    // Generate quick trip suggestion buttons
    generateQuickTripButtons() {
        const isThaiLang = userPreferences.language === 'th';
        const quickTrips = [
            {
                name: isThaiLang ? 'วัฒนธรรม 3 วัน' : 'Cultural 3 Days',
                destinations: ['bangkok', 'ayutthaya'],
                duration: '3',
                icon: '🏛️'
            },
            {
                name: isThaiLang ? 'ธรรมชาติ 5 วัน' : 'Nature 5 Days', 
                destinations: ['chiangmai', 'chiangrai'],
                duration: '5',
                icon: '🏔️'
            },
            {
                name: isThaiLang ? 'ทะเล 7 วัน' : 'Beach 7 Days',
                destinations: ['phuket', 'krabi'],
                duration: '7',
                icon: '🏝️'
            }
        ];

        return quickTrips.map(trip => `
            <button class="quick-trip-btn" data-destinations="${trip.destinations.join(',')}" data-duration="${trip.duration}">
                <span class="quick-trip-icon">${trip.icon}</span>
                <span class="quick-trip-name">${trip.name}</span>
            </button>
        `).join('');
    }

    // Add smart route suggestions
    addSmartRouteSuggestions() {
        const routePlanningSection = document.getElementById('routePlanningSection');
        if (!routePlanningSection) return;

        // Add popular routes section
        const popularRoutesContainer = document.createElement('div');
        popularRoutesContainer.className = 'popular-routes-container';
        popularRoutesContainer.innerHTML = `
            <h5>🔥 ${userPreferences.language === 'th' ? 'เส้นทางยอดนิยม' : 'Popular Routes'}</h5>
            <div class="popular-route-buttons">
                ${this.generatePopularRouteButtons()}
            </div>
        `;

        routePlanningSection.insertBefore(popularRoutesContainer, routePlanningSection.querySelector('.route-inputs'));
    }

    // Generate popular route buttons
    generatePopularRouteButtons() {
        const isThaiLang = userPreferences.language === 'th';
        const popularRoutes = [
            {
                name: isThaiLang ? 'กรุงเทพ → เชียงใหม่' : 'Bangkok → Chiang Mai',
                from: 'bangkok',
                to: 'chiangmai',
                icon: '✈️'
            },
            {
                name: isThaiLang ? 'กรุงเทพ → ภูเก็ต' : 'Bangkok → Phuket',
                from: 'bangkok', 
                to: 'phuket',
                icon: '🏝️'
            },
            {
                name: isThaiLang ? 'เชียงใหม่ → เชียงราย' : 'Chiang Mai → Chiang Rai',
                from: 'chiangmai',
                to: 'chiangrai', 
                icon: '🚗'
            }
        ];

        return popularRoutes.map(route => `
            <button class="popular-route-btn" data-from="${route.from}" data-to="${route.to}">
                <span class="route-icon">${route.icon}</span>
                <span class="route-name">${route.name}</span>
            </button>
        `).join('');
    }

    // Add contextual help based on user behavior
    addContextualHelp() {
        // Monitor user interactions and provide contextual suggestions
        this.setupHelpTriggers();
    }

    // Setup help triggers based on user behavior
    setupHelpTriggers() {
        let inactivityTimer;
        let lastInteraction = Date.now();

        // Reset timer on any user interaction
        document.addEventListener('click', () => {
            lastInteraction = Date.now();
            clearTimeout(inactivityTimer);
            this.scheduleContextualHelp();
        });

        document.addEventListener('input', () => {
            lastInteraction = Date.now();
            clearTimeout(inactivityTimer);
            this.scheduleContextualHelp();
        });

        this.scheduleContextualHelp();
    }

    // Schedule contextual help based on user behavior
    scheduleContextualHelp() {
        const helpTimer = setTimeout(() => {
            this.showContextualHelp();
        }, 30000); // Show help after 30 seconds of inactivity
    }

    // Show contextual help based on current state
    showContextualHelp() {
        const currentLocation = window.location.hash;
        const hasInteracted = this.userHistory.visitedLocations.length > 0;
        
        if (!hasInteracted) {
            this.showFirstTimeHelp();
        } else {
            this.showAdvancedHelp();
        }
    }

    // Show help for first-time users
    showFirstTimeHelp() {
        const isThaiLang = userPreferences.language === 'th';
        const message = isThaiLang ?
            '💡 เคล็ดลับ: ลองคลิกที่จุดสีทองบนโลกหรือใช้ปุ่มทริปแนะนำด้านซ้าย' :
            '💡 Tip: Try clicking golden dots on the globe or use quick trip suggestions on the left';
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        }
    }

    // Show help for experienced users
    showAdvancedHelp() {
        const isThaiLang = userPreferences.language === 'th';
        const message = isThaiLang ?
            '🚀 ลองใช้ Trip Planner หรือ Route Planning เพื่อวางแผนการเดินทาง' :
            '🚀 Try the Trip Planner or Route Planning features for advanced travel planning';
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        }
    }

    // Save user history
    saveUserHistory() {
        localStorage.setItem('painaidee-user-history', JSON.stringify(this.userHistory));
    }
}

// Auto-complete and suggestion enhancements
class UXAutoComplete {
    constructor() {
        this.suggestions = new Map();
        this.userPatterns = new Map();
        this.init();
    }

    init() {
        this.setupAutoCompleteFeatures();
        this.learnFromUserBehavior();
    }

    // Setup auto-complete features
    setupAutoCompleteFeatures() {
        this.enhanceSearchBox();
        this.enhanceFormInputs();
        this.addSmartButtons();
    }

    // Enhance search box with advanced auto-complete
    enhanceSearchBox() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        // Add search history dropdown
        this.createSearchHistoryDropdown(searchInput);
        
        // Add real-time suggestions
        this.addRealTimeSuggestions(searchInput);
        
        // Add voice search if available
        this.addVoiceSearch(searchInput);
    }

    // Create search history dropdown
    createSearchHistoryDropdown(searchInput) {
        const historyButton = document.createElement('button');
        historyButton.className = 'search-history-btn';
        historyButton.innerHTML = '🕐';
        historyButton.title = 'Search History';
        historyButton.type = 'button';
        
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(historyButton);
        
        historyButton.addEventListener('click', () => {
            this.showSearchHistory(searchInput);
        });
    }

    // Show search history
    showSearchHistory(searchInput) {
        const history = JSON.parse(localStorage.getItem('painaidee-user-history')) || {};
        const recentSearches = (history.searchQueries || []).slice(-5);
        
        if (recentSearches.length === 0) {
            const isThaiLang = userPreferences.language === 'th';
            if (typeof showNotification === 'function') {
                showNotification(
                    isThaiLang ? 'ยังไม่มีประวัติการค้นหา' : 'No search history yet',
                    'info'
                );
            }
            return;
        }

        // Create history dropdown
        const historyDropdown = document.createElement('div');
        historyDropdown.className = 'search-history-dropdown';
        historyDropdown.innerHTML = `
            <div class="history-header">
                ${userPreferences.language === 'th' ? 'ประวัติการค้นหา' : 'Search History'}
            </div>
            ${recentSearches.map(search => `
                <div class="history-item" data-query="${search.query}">
                    <span class="history-icon">🔍</span>
                    <span class="history-query">${search.query}</span>
                    <span class="history-time">${this.formatTimeAgo(search.timestamp)}</span>
                </div>
            `).join('')}
        `;

        // Position and show dropdown
        searchInput.parentNode.appendChild(historyDropdown);
        
        // Add click handlers
        historyDropdown.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                searchInput.value = item.dataset.query;
                searchInput.dispatchEvent(new Event('input'));
                historyDropdown.remove();
            });
        });

        // Remove on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeHistory(e) {
                if (!historyDropdown.contains(e.target)) {
                    historyDropdown.remove();
                    document.removeEventListener('click', closeHistory);
                }
            });
        }, 100);
    }

    // Format time ago
    formatTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return userPreferences.language === 'th' ? 'เมื่อกี้' : 'just now';
        if (minutes < 60) return userPreferences.language === 'th' ? `${minutes} นาทีที่แล้ว` : `${minutes}m ago`;
        if (hours < 24) return userPreferences.language === 'th' ? `${hours} ชั่วโมงที่แล้ว` : `${hours}h ago`;
        return userPreferences.language === 'th' ? `${days} วันที่แล้ว` : `${days}d ago`;
    }

    // Add voice search capability
    addVoiceSearch(searchInput) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return; // Voice search not supported
        }

        const voiceButton = document.createElement('button');
        voiceButton.className = 'voice-search-btn';
        voiceButton.innerHTML = '🎤';
        voiceButton.title = 'Voice Search';
        voiceButton.type = 'button';
        
        searchInput.parentNode.appendChild(voiceButton);
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = userPreferences.language === 'th' ? 'th-TH' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceButton.addEventListener('click', () => {
            voiceButton.classList.add('listening');
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            searchInput.dispatchEvent(new Event('input'));
            voiceButton.classList.remove('listening');
        };

        recognition.onerror = () => {
            voiceButton.classList.remove('listening');
        };

        recognition.onend = () => {
            voiceButton.classList.remove('listening');
        };
    }

    // Learn from user behavior patterns
    learnFromUserBehavior() {
        // Monitor user interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.marker')) {
                this.recordLocationInteraction(e.target.closest('.marker'));
            }
        });

        // Learn from search patterns
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.recordSearchPattern(e.target.value);
            });
        }
    }

    // Record location interaction patterns
    recordLocationInteraction(marker) {
        const locationKey = marker.classList[1]; // Assuming second class is location key
        const currentTime = Date.now();
        
        if (!this.userPatterns.has(locationKey)) {
            this.userPatterns.set(locationKey, {
                clicks: 0,
                lastClick: 0,
                timeSpent: 0
            });
        }
        
        const pattern = this.userPatterns.get(locationKey);
        pattern.clicks++;
        pattern.lastClick = currentTime;
        
        // Update user history
        const history = JSON.parse(localStorage.getItem('painaidee-user-history')) || {};
        if (!history.visitedLocations.includes(locationKey)) {
            history.visitedLocations.push(locationKey);
            localStorage.setItem('painaidee-user-history', JSON.stringify(history));
        }
    }

    // Record search patterns for learning
    recordSearchPattern(query) {
        if (query.length < 2) return;
        
        const pattern = {
            query: query,
            timestamp: Date.now(),
            location: window.location.hash
        };
        
        if (!this.suggestions.has(query)) {
            this.suggestions.set(query, []);
        }
        
        this.suggestions.get(query).push(pattern);
    }
}

// One-click features for reducing user steps
class UXOneClickFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.addQuickActionButtons();
        this.addHoverActions();
        this.addGestureSupport();
        this.addKeyboardShortcuts();
    }

    // Add quick action buttons throughout the interface
    addQuickActionButtons() {
        this.addQuickTripButtons();
        this.addQuickRouteButtons(); 
        this.addQuickFavoriteActions();
    }

    // Add quick trip buttons
    addQuickTripButtons() {
        // Add event listeners to quick trip buttons created by UXSmartDefaults
        setTimeout(() => {
            document.querySelectorAll('.quick-trip-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const destinations = e.target.closest('.quick-trip-btn').dataset.destinations.split(',');
                    const duration = e.target.closest('.quick-trip-btn').dataset.duration;
                    
                    // Auto-select destinations
                    destinations.forEach(dest => {
                        const checkbox = document.querySelector(`#destinationCheckboxes input[value="${dest}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                    
                    // Set duration
                    const durationSelect = document.getElementById('tripDuration');
                    if (durationSelect) {
                        durationSelect.value = duration;
                    }
                    
                    // Auto-generate trip plan
                    if (typeof generateTripPlan === 'function') {
                        generateTripPlan();
                    }
                    
                    // Show success notification
                    const isThaiLang = userPreferences.language === 'th';
                    const message = isThaiLang ? 
                        '✨ สร้างแผนทริปแล้ว!' : 
                        '✨ Trip plan created!';
                    
                    if (typeof showNotification === 'function') {
                        showNotification(message, 'success');
                    }
                });
            });
        }, 1000);
    }

    // Add quick route buttons
    addQuickRouteButtons() {
        setTimeout(() => {
            document.querySelectorAll('.popular-route-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const from = e.target.closest('.popular-route-btn').dataset.from;
                    const to = e.target.closest('.popular-route-btn').dataset.to;
                    
                    // Auto-fill route selects
                    const fromSelect = document.getElementById('fromLocation');
                    const toSelect = document.getElementById('toLocation');
                    
                    if (fromSelect) fromSelect.value = from;
                    if (toSelect) toSelect.value = to;
                    
                    // Auto-calculate route
                    if (typeof calculateRoute === 'function') {
                        calculateRoute();
                    }
                    
                    // Show success notification
                    const isThaiLang = userPreferences.language === 'th';
                    const message = isThaiLang ? 
                        '🗺️ คำนวณเส้นทางแล้ว!' : 
                        '🗺️ Route calculated!';
                    
                    if (typeof showNotification === 'function') {
                        showNotification(message, 'success');
                    }
                });
            });
        }, 1000);
    }

    // Add quick favorite actions with hover
    addQuickFavoriteActions() {
        // Add hover actions for quicker favoriting
        document.querySelectorAll('.button-row').forEach(row => {
            row.addEventListener('mouseenter', () => {
                this.showQuickActions(row);
            });
            
            row.addEventListener('mouseleave', () => {
                this.hideQuickActions(row);
            });
        });
    }

    // Show quick actions on hover
    showQuickActions(row) {
        if (row.querySelector('.quick-actions')) return; // Already showing
        
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        quickActions.innerHTML = `
            <button class="quick-action-btn quick-view" title="${userPreferences.language === 'th' ? 'ดูข้อมูล' : 'Quick View'}">
                👁️
            </button>
            <button class="quick-action-btn quick-favorite" title="${userPreferences.language === 'th' ? 'เพิ่มรายการโปรด' : 'Quick Favorite'}">
                ⚡⭐
            </button>
        `;
        
        row.appendChild(quickActions);
        
        // Add click handlers
        quickActions.querySelector('.quick-view').addEventListener('click', (e) => {
            e.stopPropagation();
            const locationBtn = row.querySelector('button:not(.favorite-btn):not(.quick-action-btn)');
            if (locationBtn) {
                locationBtn.click();
            }
        });
        
        quickActions.querySelector('.quick-favorite').addEventListener('click', (e) => {
            e.stopPropagation();
            const favoriteBtn = row.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.click();
            }
        });
    }

    // Hide quick actions
    hideQuickActions(row) {
        const quickActions = row.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.remove();
        }
    }

    // Add gesture support for mobile users
    addGestureSupport() {
        if (!('ontouchstart' in window)) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    // Handle swipe gestures
    handleSwipeRight() {
        // Swipe right: Show favorites panel
        this.showFavoritesPanel();
    }

    handleSwipeLeft() {
        // Swipe left: Show quick actions
        this.showQuickActionsPanel();
    }

    // Show favorites panel
    showFavoritesPanel() {
        const favoritesSection = document.getElementById('favoritesSection');
        if (favoritesSection) {
            favoritesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Show quick actions panel
    showQuickActionsPanel() {
        const tripWizardSection = document.getElementById('tripWizardSection');
        if (tripWizardSection) {
            tripWizardSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Add keyboard shortcuts for power users
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'f':
                    e.preventDefault();
                    this.focusSearch();
                    break;
                case 't':
                    e.preventDefault();
                    this.quickTripPlanning();
                    break;
                case 'r':
                    e.preventDefault();
                    this.quickRouteCalculation();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showKeyboardHelp();
                    break;
            }
        });
    }

    // Focus search box
    focusSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // Quick trip planning
    quickTripPlanning() {
        const tripSection = document.getElementById('tripWizardSection');
        if (tripSection) {
            tripSection.scrollIntoView({ behavior: 'smooth' });
            
            // Auto-select popular trip
            const quickTripBtn = document.querySelector('.quick-trip-btn');
            if (quickTripBtn) {
                quickTripBtn.click();
            }
        }
    }

    // Quick route calculation
    quickRouteCalculation() {
        const routeSection = document.getElementById('routePlanningSection');
        if (routeSection) {
            routeSection.scrollIntoView({ behavior: 'smooth' });
            
            // Auto-select popular route
            const popularRouteBtn = document.querySelector('.popular-route-btn');
            if (popularRouteBtn) {
                popularRouteBtn.click();
            }
        }
    }

    // Show keyboard shortcuts help
    showKeyboardHelp() {
        const isThaiLang = userPreferences.language === 'th';
        const shortcuts = isThaiLang ? [
            'F - เน้นการค้นหา',
            'T - วางแผนทริปด่วน', 
            'R - คำนวณเส้นทางด่วน',
            'H - แสดงคำสั่งคีย์บอร์ด',
            '1-4 - เลือกสถานที่'
        ] : [
            'F - Focus Search',
            'T - Quick Trip Planning',
            'R - Quick Route Calculation', 
            'H - Show Keyboard Help',
            '1-4 - Select Locations'
        ];
        
        const helpMessage = shortcuts.join('\n');
        alert(helpMessage);
    }
}

// Initialize all UX improvements
function initializeUXImprovements() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new UXSmartDefaults();
            new UXAutoComplete();
            new UXOneClickFeatures();
        });
    } else {
        new UXSmartDefaults();
        new UXAutoComplete();
        new UXOneClickFeatures();
    }
    
    console.log('🚀 UX Improvements initialized successfully!');
}

// Auto-initialize when script loads
initializeUXImprovements();