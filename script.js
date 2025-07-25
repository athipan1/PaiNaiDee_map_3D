// PaiNaiDee Enhanced 3D Map JavaScript with Modern UX/UI Features and Mascot System

let isRotating = true;
let rotationSpeed = 1;
let currentFocus = 'world';
let globe;
let favorites = JSON.parse(localStorage.getItem('painaidee-favorites')) || [];
let userPreferences = JSON.parse(localStorage.getItem('painaidee-preferences')) || {
    theme: 'light',
    language: 'th',
    highContrast: false
};

// User Behavior Tracking for Personalized Recommendations
let userBehavior = JSON.parse(localStorage.getItem('painaidee-user-behavior')) || {
    locationViews: {},
    categoryViews: {},
    searchQueries: [],
    timeSpent: {},
    sessionStart: Date.now(),
    totalSessions: 0,
    favoriteActions: [],
    lastRecommendationUpdate: 0
};

// Mascot System Variables
let mascotTips = [];
let currentTipIndex = 0;
let mascotInteractionCount = 0;
let lastMascotInteraction = 0;

// Enhanced Language system with mascot support
const texts = {
    th: {
        welcome: "ยินดีต้อนรับสู่แผนที่ 3 มิติ!",
        showing: "กำลังแสดง: โลกและประเทศไทย",
        clickGold: "คลิกจุดทองเพื่อสำรวจ",
        autoRotate: "โลกหมุนอัตโนมัติ",
        weatherLoading: "กำลังโหลดข้อมูลสภาพอากาศ...",
        attractions: "สถานที่ท่องเที่ยว",
        searchPlaceholder: "ค้นหาสถานที่...",
        world: "โลก",
        stopPlay: "หยุด/เล่น",
        fastSlow: "เร็ว/ช้า",
        favorites: "รายการโปรด",
        distance: "ระยะทาง",
        addedFavorite: "เพิ่มในรายการโปรดแล้ว!",
        removedFavorite: "ลบออกจากรายการโปรดแล้ว!",
        noResults: "ไม่พบผลลัพธ์",
        globeCreated: "สร้างโลก 3D ปรับปรุงแล้วสำเร็จ!",
        exploring: "กำลังสำรวจโลก...",
        startReady: "พร้อมเริ่มต้นแล้ว!",
        weather: "สภาพอากาศ",
        bestTime: "ช่วงเวลาที่เหมาะสม",
        travelTips: "เคล็ดลับการเดินทาง",
        description: "คำอธิบาย",
        attractionsTitle: "สถานที่น่าสนใจ",
        km: "กิโลเมตร",
        mascotGreeting: "สวัสดีค่ะ! ฉันชื่อ PaiNai ช้างน้อยผู้นำทาง 🐘",
        mascotWelcome: "ยินดีต้อนรับสู่แผนที่ 3 มิติของเรา!",
        mascotClickForTips: "คลิกที่ฉันเพื่อรับคำแนะนำการใช้งาน!",
        mascotTipButton: "💡 คำแนะนำ",
        recommendationsTitle: "แนะนำสำหรับคุณ",
        basedOnInterest: "ตามความสนใจของคุณ",
        popularDestination: "จุดหมายยอดนิยม",
        recommendedForYou: "แนะนำสำหรับคุณ",
        previouslyViewed: "เคยดูแล้ว",
        miniMapTitle: "แผนที่ย่อย",
        showMap: "แสดงแผนที่",
        hideMap: "ซ่อนแผนที่",
        nearbyAttractions: "สถานที่ใกล้เคียง",
        viewDetails: "ดูรายละเอียด",
        centerMap: "กลับไปจุดกลาง",
        toggleAttractions: "เปิด/ปิดสถานที่ท่องเที่ยว",
        loadingMap: "กำลังโหลดแผนที่...",
        mapError: "ไม่สามารถโหลดแผนที่ได้",
        retry: "ลองใหม่"
    },
    en: {
        welcome: "Welcome to the 3D Interactive Globe!",
        showing: "Showing: World and Thailand",
        clickGold: "Click golden dots to explore",
        autoRotate: "Globe auto-rotating",
        weatherLoading: "Loading weather information...",
        attractions: "Tourist Attractions",
        searchPlaceholder: "Search location...",
        world: "World",
        stopPlay: "Stop/Play",
        fastSlow: "Fast/Slow",
        favorites: "Favorites",
        distance: "Distance",
        addedFavorite: "Added to favorites!",
        removedFavorite: "Removed from favorites!",
        noResults: "No results found",
        globeCreated: "Enhanced 3D Globe created successfully!",
        exploring: "Exploring the World...",
        startReady: "Ready to Start!",
        weather: "Weather",
        bestTime: "Best Time",
        travelTips: "Travel Tips",
        description: "Description",
        attractionsTitle: "Attractions",
        km: "kilometers",
        mascotGreeting: "Hello! I'm PaiNai, your little elephant guide 🐘",
        mascotWelcome: "Welcome to our 3D interactive map!",
        mascotClickForTips: "Click me for helpful tips!",
        mascotTipButton: "💡 Tips",
        recommendationsTitle: "Recommended for You",
        basedOnInterest: "Based on your interests",
        popularDestination: "Popular destination",
        recommendedForYou: "Recommended for you",
        previouslyViewed: "Previously viewed",
        miniMapTitle: "Mini-Map",
        showMap: "Show Map",
        hideMap: "Hide Map",
        nearbyAttractions: "Nearby Attractions",
        viewDetails: "View Details",
        centerMap: "Center Map",
        toggleAttractions: "Toggle Attractions",
        loadingMap: "Loading map...",
        mapError: "Unable to load map",
        retry: "Retry"
    }
};

// ========================================
// LAZY LOADING SYSTEM FOR PERFORMANCE
// ========================================

// Intersection Observer for lazy loading
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('lazy-loaded');
            observer.unobserve(img);
        }
    });
}, {
    // Load images when they're 100px away from viewport
    rootMargin: '100px 0px',
    threshold: 0.01
});

// Initialize lazy loading for images
function initializeLazyLoading() {
    // Lazy load images in gallery
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        lazyImageObserver.observe(img);
    });
    
    // Lazy load background images
    document.querySelectorAll('[data-bg]').forEach(element => {
        lazyImageObserver.observe(element);
    });
}

// Enhanced image loading with progressive enhancement
function createLazyImage(src, alt, className = '') {
    const img = document.createElement('img');
    
    // Create placeholder (low quality image placeholder)
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23f0f0f0"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial, sans-serif" font-size="24"%3ELoading...%3C/text%3E%3C/svg%3E';
    
    img.src = placeholder;
    img.dataset.src = src;
    img.alt = alt;
    img.className = `lazy ${className}`;
    img.loading = 'lazy'; // Native lazy loading as fallback
    
    // Add loading state
    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '0.7';
    
    // Enhanced error handling
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f8f9fa" stroke="%23dee2e6"/%3E%3Ctext x="50%" y="45%" text-anchor="middle" fill="%23666" font-family="Arial, sans-serif" font-size="14"%3EImage not available%3C/text%3E%3Ctext x="50%" y="60%" text-anchor="middle" fill="%23999" font-family="Arial, sans-serif" font-size="12"%3E📷%3C/text%3E%3C/svg%3E';
        this.classList.add('image-error');
    };
    
    // When image loads successfully
    img.onload = function() {
        if (this.src !== placeholder && !this.classList.contains('image-error')) {
            this.style.opacity = '1';
            this.classList.add('lazy-loaded');
        }
    };
    
    return img;
}

// Preload critical images for better performance
function preloadCriticalImages() {
    const criticalImages = [
        // Add any critical images that should load immediately
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Performance monitoring for images
function trackImagePerformance() {
    const imageLoadTimes = new Map();
    
    document.addEventListener('DOMContentLoaded', () => {
        const startTime = performance.now();
        
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                const loadTime = performance.now() - startTime;
                imageLoadTimes.set(img.src, loadTime);
                
                // Log slow loading images (> 2 seconds)
                if (loadTime > 2000) {
                    console.warn(`Slow image load: ${img.src} took ${loadTime.toFixed(2)}ms`);
                }
            });
        });
    });
    
    return imageLoadTimes;
}

// ========================================
// ENHANCED TOUCH & MOBILE INTERACTIONS
// ========================================

// Touch handling for better mobile experience
function initializeTouchEnhancements() {
    // Disable default touch behaviors that interfere with custom interactions
    document.addEventListener('touchstart', function(e) {
        // Allow pinch-to-zoom but prevent other default behaviors on interactive elements
        if (e.target.closest('.marker, button, .interactive-element')) {
            if (e.touches.length === 1) {
                // Single touch - allow custom handling
                e.target.style.touchAction = 'manipulation';
            }
        }
    }, { passive: false });
    
    // Enhanced touch feedback for markers
    document.querySelectorAll('.marker').forEach(marker => {
        marker.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('touch-active');
            // Provide haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, { passive: false });
        
        marker.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.classList.remove('touch-active');
            // Simulate click
            this.click();
        }, { passive: false });
    });
    
    // Improved touch scrolling for panels
    document.querySelectorAll('.controls, .info-panel, .location-modal').forEach(panel => {
        panel.style.webkitOverflowScrolling = 'touch';
        panel.style.overflowScrolling = 'touch';
    });
}

// Responsive design adjustments based on device capabilities
function initializeResponsiveEnhancements() {
    // Detect device capabilities
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isTablet = hasTouch && window.innerWidth >= 768 && window.innerWidth <= 1024;
    const isMobile = hasTouch && window.innerWidth < 768;
    
    // Add device-specific classes
    if (hasTouch) {
        document.body.classList.add('touch-device');
    }
    if (isTablet) {
        document.body.classList.add('tablet-device');
    }
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Adjust globe size based on screen dimensions
    adjustGlobeSize();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            adjustGlobeSize();
            // Force re-render of globe
            const globeElement = document.getElementById('globe3D');
            if (globeElement) {
                globeElement.style.transform = 'scale(0.99)';
                requestAnimationFrame(() => {
                    globeElement.style.transform = '';
                });
            }
        }, 100);
    });
    
    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustGlobeSize();
            updateResponsiveLayout();
        }, 250);
    });
}

// Dynamic globe size adjustment
function adjustGlobeSize() {
    const globe = document.getElementById('globe3D');
    if (!globe) return;
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const isLandscape = window.innerWidth > window.innerHeight;
    
    let size;
    
    if (containerWidth <= 360) {
        size = 200;
    } else if (containerWidth <= 480) {
        size = 240;
    } else if (containerWidth <= 768) {
        size = isLandscape ? 250 : 280;
    } else if (containerWidth <= 1024) {
        size = 350;
    } else if (containerWidth <= 1200) {
        size = 400;
    } else if (containerWidth <= 1400) {
        size = 500;
    } else {
        size = 600;
    }
    
    // Ensure globe doesn't exceed container height
    const maxHeight = containerHeight * 0.6;
    if (size > maxHeight) {
        size = maxHeight;
    }
    
    globe.style.width = `${size}px`;
    globe.style.height = `${size}px`;
}

// Update layout based on current viewport
function updateResponsiveLayout() {
    const container = document.getElementById('mapContainer');
    if (!container) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    // Adjust grid layout for different orientations and sizes
    if (width <= 768 && isLandscape) {
        container.style.gridTemplateAreas = '"info globe controls" "status status status"';
        container.style.gridTemplateColumns = '300px 1fr 300px';
    } else if (width <= 1200) {
        container.style.gridTemplateAreas = '"info" "controls" "globe" "status"';
        container.style.gridTemplateColumns = '1fr';
    } else {
        container.style.gridTemplateAreas = '"info controls" "globe globe" "status status"';
        container.style.gridTemplateColumns = '1fr 1fr';
    }
}

// Performance monitoring and optimization
function initializePerformanceMonitoring() {
    // Monitor frame rate and adjust animations if needed
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Reduce animation complexity if FPS is low
            if (fps < 30) {
                document.body.classList.add('low-performance');
                // Reduce animation duration for better performance
                document.querySelectorAll('.marker').forEach(marker => {
                    marker.style.animationDuration = '6s'; // Slower animation
                });
            } else if (fps > 45) {
                document.body.classList.remove('low-performance');
            }
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
    
    // Monitor memory usage if available
    if (performance.memory) {
        setInterval(() => {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
            
            // Warn if memory usage is high
            if (usedMB > limitMB * 0.8) {
                console.warn(`High memory usage: ${usedMB}MB / ${limitMB}MB`);
            }
        }, 10000); // Check every 10 seconds
    }
}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}

// Travel time calculation based on distance and transport type
function calculateTravelTime(distance, transportType = 'car') {
    const speeds = {
        car: 60,      // km/h average including traffic
        bus: 50,      // km/h intercity bus
        train: 80,    // km/h train
        plane: 500    // km/h for flights
    };
    
    const speed = speeds[transportType] || speeds.car;
    const timeHours = distance / speed;
    
    if (timeHours < 1) {
        return `${Math.round(timeHours * 60)} minutes`;
    } else if (timeHours < 24) {
        const hours = Math.floor(timeHours);
        const minutes = Math.round((timeHours - hours) * 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
        const days = Math.floor(timeHours / 24);
        const hours = Math.round(timeHours % 24);
        return `${days}d ${hours}h`;
    }
}

// Route planning system
function planRoute(fromLocation, toLocation) {
    const from = locations[fromLocation];
    const to = locations[toLocation];
    
    if (!from || !to || !from.coordinates || !to.coordinates) {
        return null;
    }
    
    const distance = calculateDistance(
        from.coordinates[1], from.coordinates[0],
        to.coordinates[1], to.coordinates[0]
    );
    
    // Determine best transport type based on distance
    let recommendedTransport = 'car';
    if (distance > 500) {
        recommendedTransport = 'plane';
    } else if (distance > 200) {
        recommendedTransport = 'bus';
    }
    
    const travelTime = calculateTravelTime(distance, recommendedTransport);
    
    return {
        from: from,
        to: to,
        distance: distance,
        travelTime: travelTime,
        recommendedTransport: recommendedTransport,
        estimatedCost: estimateTravelCost(distance, recommendedTransport)
    };
}

// Travel cost estimation
function estimateTravelCost(distance, transportType) {
    const baseCosts = {
        car: { base: 500, perKm: 3 },      // Fuel + tolls (THB)
        bus: { base: 150, perKm: 1.5 },    // Bus ticket (THB)
        train: { base: 200, perKm: 2 },    // Train ticket (THB)
        plane: { base: 2000, perKm: 0.5 }  // Flight (THB)
    };
    
    const cost = baseCosts[transportType] || baseCosts.car;
    const totalCost = cost.base + (distance * cost.perKm);
    
    return Math.round(totalCost);
}

function getText(key) {
    return texts[userPreferences.language] ? texts[userPreferences.language][key] || key : key;
}

// ========================================
// USER BEHAVIOR TRACKING & RECOMMENDATIONS
// ========================================

// Track user interactions for personalized recommendations
function trackUserBehavior(action, data) {
    const timestamp = Date.now();
    
    switch (action) {
        case 'location_view':
            // Track location views
            if (!userBehavior.locationViews[data.location]) {
                userBehavior.locationViews[data.location] = { count: 0, lastViewed: 0, totalTime: 0 };
            }
            userBehavior.locationViews[data.location].count++;
            userBehavior.locationViews[data.location].lastViewed = timestamp;
            
            // Track category views based on location
            if (data.categories && Array.isArray(data.categories)) {
                data.categories.forEach(category => {
                    if (!userBehavior.categoryViews[category]) {
                        userBehavior.categoryViews[category] = { count: 0, lastViewed: 0 };
                    }
                    userBehavior.categoryViews[category].count++;
                    userBehavior.categoryViews[category].lastViewed = timestamp;
                });
            }
            break;
            
        case 'search_query':
            // Track search patterns
            userBehavior.searchQueries.push({
                query: data.query,
                timestamp: timestamp,
                resultClicked: data.resultClicked || null
            });
            
            // Keep only last 50 searches
            if (userBehavior.searchQueries.length > 50) {
                userBehavior.searchQueries = userBehavior.searchQueries.slice(-50);
            }
            break;
            
        case 'favorite_toggle':
            // Track favorite actions
            userBehavior.favoriteActions.push({
                location: data.location,
                action: data.action, // 'add' or 'remove'
                timestamp: timestamp
            });
            
            // Keep only last 30 favorite actions
            if (userBehavior.favoriteActions.length > 30) {
                userBehavior.favoriteActions = userBehavior.favoriteActions.slice(-30);
            }
            break;
            
        case 'time_spent':
            // Track time spent on locations
            if (!userBehavior.timeSpent[data.location]) {
                userBehavior.timeSpent[data.location] = 0;
            }
            userBehavior.timeSpent[data.location] += data.duration;
            break;
    }
    
    // Save to localStorage
    saveBehaviorData();
}

// Save behavior data to localStorage
function saveBehaviorData() {
    try {
        localStorage.setItem('painaidee-user-behavior', JSON.stringify(userBehavior));
    } catch (error) {
        console.warn('Could not save user behavior data:', error);
    }
}

// Generate personalized recommendations based on user behavior
function generatePersonalizedRecommendations() {
    const recommendations = [];
    const currentTime = Date.now();
    
    // Don't update recommendations too frequently (once per hour)
    if (currentTime - userBehavior.lastRecommendationUpdate < 3600000) {
        return getStoredRecommendations();
    }
    
    try {
        // 1. Most viewed categories - recommend similar locations
        const categoryScores = calculateCategoryPreferences();
        const categoryBasedRecs = getRecommendationsByCategory(categoryScores);
        recommendations.push(...categoryBasedRecs);
        
        // 2. Similar locations to frequently viewed ones
        const locationScores = calculateLocationPreferences();
        const similarLocationRecs = getSimilarLocationRecommendations(locationScores);
        recommendations.push(...similarLocationRecs);
        
        // 3. Popular destinations not yet explored
        const unexploredRecs = getUnexploredPopularDestinations();
        recommendations.push(...unexploredRecs);
        
        // 4. Based on search patterns
        const searchBasedRecs = getSearchBasedRecommendations();
        recommendations.push(...searchBasedRecs);
        
        // Remove duplicates and limit to top 6 recommendations
        const uniqueRecs = [...new Set(recommendations)];
        const finalRecs = uniqueRecs.slice(0, 6);
        
        // Store recommendations
        userBehavior.lastRecommendations = finalRecs;
        userBehavior.lastRecommendationUpdate = currentTime;
        saveBehaviorData();
        
        return finalRecs;
        
    } catch (error) {
        console.warn('Error generating recommendations:', error);
        return getDefaultRecommendations();
    }
}

// Calculate user's category preferences based on behavior
function calculateCategoryPreferences() {
    const categoryScores = {};
    
    // Score based on category views
    Object.entries(userBehavior.categoryViews).forEach(([category, data]) => {
        const recencyScore = Math.max(0, 1 - (Date.now() - data.lastViewed) / (30 * 24 * 60 * 60 * 1000)); // 30 days
        categoryScores[category] = (data.count * 2) + (recencyScore * 3);
    });
    
    // Score based on favorite locations' categories
    favorites.forEach(locationKey => {
        const location = locations[locationKey];
        if (location && location.categories) {
            location.categories.forEach(category => {
                categoryScores[category] = (categoryScores[category] || 0) + 1.5;
            });
        }
    });
    
    return categoryScores;
}

// Calculate user's location preferences
function calculateLocationPreferences() {
    const locationScores = {};
    
    Object.entries(userBehavior.locationViews).forEach(([location, data]) => {
        const recencyScore = Math.max(0, 1 - (Date.now() - data.lastViewed) / (7 * 24 * 60 * 60 * 1000)); // 7 days
        const timeScore = (userBehavior.timeSpent[location] || 0) / 60000; // Convert to minutes
        locationScores[location] = (data.count * 2) + (recencyScore * 3) + (timeScore * 0.1);
    });
    
    return locationScores;
}

// Get recommendations based on preferred categories
function getRecommendationsByCategory(categoryScores) {
    const recommendations = [];
    const sortedCategories = Object.entries(categoryScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3); // Top 3 categories
    
    sortedCategories.forEach(([category]) => {
        Object.entries(locations).forEach(([locationKey, locationData]) => {
            if (locationData.categories && locationData.categories.includes(category)) {
                // Don't recommend already heavily viewed locations
                const viewCount = userBehavior.locationViews[locationKey]?.count || 0;
                if (viewCount < 5 && !recommendations.includes(locationKey)) {
                    recommendations.push(locationKey);
                }
            }
        });
    });
    
    return recommendations.slice(0, 3);
}

// Get recommendations for similar locations
function getSimilarLocationRecommendations(locationScores) {
    const recommendations = [];
    const topLocations = Object.entries(locationScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2); // Top 2 viewed locations
    
    topLocations.forEach(([viewedLocation]) => {
        const viewedLocationData = locations[viewedLocation];
        if (!viewedLocationData || !viewedLocationData.categories) return;
        
        Object.entries(locations).forEach(([locationKey, locationData]) => {
            if (locationKey === viewedLocation) return;
            
            // Find locations with similar categories
            if (locationData.categories) {
                const commonCategories = viewedLocationData.categories.filter(cat => 
                    locationData.categories.includes(cat)
                );
                
                if (commonCategories.length >= 2 && !recommendations.includes(locationKey)) {
                    const viewCount = userBehavior.locationViews[locationKey]?.count || 0;
                    if (viewCount < 3) {
                        recommendations.push(locationKey);
                    }
                }
            }
        });
    });
    
    return recommendations.slice(0, 2);
}

// Get popular destinations that user hasn't explored much
function getUnexploredPopularDestinations() {
    const popularDestinations = ['bangkok', 'chiangmai', 'phuket', 'ayutthaya', 'krabi'];
    const recommendations = [];
    
    popularDestinations.forEach(location => {
        const viewCount = userBehavior.locationViews[location]?.count || 0;
        if (viewCount < 2 && !favorites.includes(location)) {
            recommendations.push(location);
        }
    });
    
    return recommendations.slice(0, 2);
}

// Get recommendations based on search patterns
function getSearchBasedRecommendations() {
    const recommendations = [];
    const recentSearches = userBehavior.searchQueries.slice(-10);
    
    recentSearches.forEach(search => {
        const query = search.query.toLowerCase();
        
        Object.entries(locations).forEach(([locationKey, locationData]) => {
            // Check if search matches location name or attractions
            const nameMatch = locationData.name.toLowerCase().includes(query) || 
                             locationData.nameEn.toLowerCase().includes(query);
            
            const attractionMatch = locationData.attractions?.some(attraction => 
                attraction.toLowerCase().includes(query)
            ) || locationData.attractionsEn?.some(attraction => 
                attraction.toLowerCase().includes(query)
            );
            
            if ((nameMatch || attractionMatch) && !recommendations.includes(locationKey)) {
                const viewCount = userBehavior.locationViews[locationKey]?.count || 0;
                if (viewCount < 3) {
                    recommendations.push(locationKey);
                }
            }
        });
    });
    
    return recommendations.slice(0, 2);
}

// Get stored recommendations or default ones
function getStoredRecommendations() {
    return userBehavior.lastRecommendations || getDefaultRecommendations();
}

// Default recommendations for new users
function getDefaultRecommendations() {
    return ['bangkok', 'chiangmai', 'phuket', 'ayutthaya', 'krabi', 'sukhothai'];
}

// Update recommendations UI
function updateRecommendationsUI() {
    const recommendations = generatePersonalizedRecommendations();
    const recommendationsSection = document.getElementById('recommendationsSection');
    
    if (!recommendationsSection) return;
    
    const isThaiLang = userPreferences.language === 'th';
    
    // Show section if we have recommendations
    if (recommendations.length > 0) {
        recommendationsSection.style.display = 'block';
        
        const recommendationsList = document.getElementById('recommendationsList');
        if (recommendationsList) {
            recommendationsList.innerHTML = recommendations.map(locationKey => {
                const location = locations[locationKey];
                if (!location) return '';
                
                const locationName = isThaiLang ? location.name : location.nameEn;
                const viewCount = userBehavior.locationViews[locationKey]?.count || 0;
                const isFavorite = favorites.includes(locationKey);
                
                return `
                    <div class="recommendation-item" data-location="${locationKey}">
                        <div class="recommendation-content" onclick="showInfo('${locationKey}')">
                            <div class="recommendation-icon">${location.emoji}</div>
                            <div class="recommendation-details">
                                <h5 class="recommendation-title">${locationName}</h5>
                                <p class="recommendation-reason">${getRecommendationReason(locationKey, isThaiLang)}</p>
                                ${viewCount > 0 ? `<span class="recommendation-badge">${isThaiLang ? 'เคยดูแล้ว' : 'Previously viewed'}</span>` : ''}
                            </div>
                        </div>
                        <button class="recommendation-favorite ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite('${locationKey}')" 
                                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                            ${isFavorite ? '⭐' : '☆'}
                        </button>
                    </div>
                `;
            }).join('');
        }
    } else {
        recommendationsSection.style.display = 'none';
    }
}

// Get reason text for recommendation
function getRecommendationReason(locationKey, isThaiLang) {
    const location = locations[locationKey];
    const reasons = [];
    
    // Check if it's based on category preference
    if (location.categories) {
        const topCategory = Object.entries(userBehavior.categoryViews)
            .sort(([,a], [,b]) => b.count - a.count)[0];
        
        if (topCategory && location.categories.includes(topCategory[0])) {
            const categoryName = locationCategories[topCategory[0]];
            reasons.push(isThaiLang ? 
                `คุณสนใจ${categoryName?.nameTh || topCategory[0]}` : 
                `Based on your interest in ${categoryName?.nameEn || topCategory[0]}`
            );
        }
    }
    
    // Check if it's popular
    const popularDestinations = ['bangkok', 'chiangmai', 'phuket'];
    if (popularDestinations.includes(locationKey)) {
        reasons.push(isThaiLang ? 'จุดหมายยอดนิยม' : 'Popular destination');
    }
    
    // Default reason
    if (reasons.length === 0) {
        reasons.push(isThaiLang ? 'แนะนำสำหรับคุณ' : 'Recommended for you');
    }
    
    return reasons[0];
}

// Enhanced Mascot Tips Database with AI-like Intelligence
function initializeMascotTips() {
    mascotTips = {
        th: [
            // Basic navigation tips
            "🎯 คลิกจุดสีทองบนโลกเพื่อดูข้อมูลสถานที่!",
            "🔍 ใช้ช่องค้นหาเพื่อหาสถานที่ที่คุณสนใจ",
            "⭐ กดปุ่มดาวเพื่อเพิ่มสถานที่ในรายการโปรด",
            "🌍 ลากเมาส์เพื่อหมุนโลกและสำรวจมุมมองใหม่",
            "⚡ เปลี่ยนความเร็วการหมุนด้วยปุ่มควบคุม",
            
            // Advanced features
            "🗺️ ใช้ Trip Planner เพื่อวางแผนการเดินทาง",
            "📏 เปรียบเทียบระยะทางระหว่างสถานที่ต่างๆ",
            "🌙 เปลี่ยนธีมเป็นโหมดกลางคืนเพื่อประสบการณ์ใหม่",
            "🇹🇭🇬🇧 สลับภาษาไทย-อังกฤษได้ตลอดเวลา",
            "📱 แอปใช้งานได้ดีบนมือถือด้วยนะ!",
            "🏖️ ลองดูข้อมูลสภาพอากาศของแต่ละสถานที่",
            "🎨 ใช้ Category Filter เพื่อกรองสถานที่ตามประเภท",
            
            // AI-like personalized tips
            "🤖 ฉันจำความชอบของคุณได้นะ! มาดูสถานที่ที่แนะนำกัน",
            "🎪 คุณชอบประเภทไหน? ชายหาด ภูเขา หรือประวัติศาสตร์?",
            "🌟 จากที่คุณเคยดู ฉันคิดว่าคุณจะชอบ${location}",
            "🎭 มาลองสำรวจวัฒนธรรมไทยกันไหม? แนะนำ${culturalSite}",
            "🍜 หิวไหม? สถานที่นี้มีอาหารอร่อยมากเลย!",
            "🏨 คุณกำลังวางแผนเที่ยวใช่มั้ย? ให้ฉันช่วยหาที่พักดีๆ",
            "📸 สถานที่นี้ถ่ายรูปสวยมาก! เหมาะสำหรับอินสตาแกรม",
            "🌅 ตอนนี้เป็นช่วงเวลาที่ดีสำหรับไป${destination}",
            "💡 เคล็ดลับ: ${tip} จะทำให้ทริปคุณสนุกขึ้น!",
            "🎯 ดูเหมือนคุณจะสนใจ${category} ลองดู${recommendation}สิ",
            
            // Seasonal and time-based tips
            "🌸 ช่วงนี้เป็นฤดูที่ดีสำหรับไป${seasonalDestination}",
            "🎆 มีเทศกาลพิเศษที่${festivalLocation}ในช่วงนี้นะ!",
            "🌧️ หน่วยฝนแล้ว แนะนำสถานที่ในร่มที่น่าสนใจ",
            "☀️ อากาศดีแบบนี้เหมาะไปเที่ยวธรรมชาติมาก!",
            
            // Interactive encouragement
            "🎮 เก่งมาก! คุณเริ่มเป็นนักสำรวจแล้วเนี่ย",
            "🏆 คุณดูแล้ว${count}สถานที่แล้ว! ยอดเยี่ยม!",
            "💫 ฉันชอบความอยากรู้อยากเห็นของคุณ!",
            "🌈 การเดินทางคือการเรียนรู้ มาเรียนรู้ไปด้วยกัน!"
        ],
        en: [
            // Basic navigation tips
            "🎯 Click golden dots on the globe to explore locations!",
            "🔍 Use the search box to find places you're interested in",
            "⭐ Click the star button to add places to your favorites",
            "🌍 Drag to rotate the globe and explore new perspectives",
            "⚡ Change rotation speed with the control buttons",
            
            // Advanced features
            "🗺️ Use Trip Planner to organize your travels",
            "📏 Compare distances between different locations",
            "🌙 Switch to dark theme for a different experience",
            "🇹🇭🇬🇧 Toggle between Thai and English anytime",
            "📱 The app works great on mobile devices too!",
            "🏖️ Check weather information for each location",
            "🎨 Use Category Filters to find specific types of places",
            
            // AI-like personalized tips
            "🤖 I remember your preferences! Check out my recommendations",
            "🎪 What's your style? Beaches, mountains, or historical sites?",
            "🌟 Based on what you've viewed, I think you'd love ${location}",
            "🎭 Want to explore Thai culture? I recommend ${culturalSite}",
            "🍜 Feeling hungry? This place has amazing local food!",
            "🏨 Planning a trip? Let me help you find great accommodations",
            "📸 This spot is Instagram-perfect! Great for photos",
            "🌅 Now is a perfect time to visit ${destination}",
            "💡 Pro tip: ${tip} will make your trip even better!",
            "🎯 You seem interested in ${category}, try ${recommendation}",
            
            // Seasonal and time-based tips
            "🌸 This season is perfect for visiting ${seasonalDestination}",
            "🎆 There's a special festival at ${festivalLocation} right now!",
            "🌧️ Rainy season ahead, here are great indoor attractions",
            "☀️ Perfect weather for outdoor adventures!",
            
            // Interactive encouragement
            "🎮 Great job! You're becoming a real explorer",
            "🏆 You've viewed ${count} locations! Impressive!",
            "💫 I love your curiosity and sense of adventure!",
            "🌈 Travel is learning, let's learn together!"
        ]
    };
    
    // AI-Enhanced contextual tip categories
    mascotContextualTips = {
        th: {
            firstVisit: "สวัสดีครั้งแรก! ฉันคือ PaiNai ผู้ช่วยน้อยของคุณ 🐘",
            returning: "ยินดีต้อนรับกลับมา! มีสถานที่ใหม่ๆ ให้สำรวจเยอะเลย",
            morning: "สวัสดีตอนเช้า! พร้อมสำรวจโลกกันหรือยัง? ☀️",
            afternoon: "สวัสดีตอนบ่าย! มาดูสถานที่สวยๆ กันเถอะ 🌤️",
            evening: "สวัสดีตอนเย็น! ลองดูสถานที่ที่สวยยามค่ำคืนกันไหม? 🌙",
            searchActive: "เห็นคุณค้นหาอยู่ ให้ฉันช่วยแนะนำมั้ย? 🔍",
            favoriteAdded: "เยี่ยม! เพิ่มในรายการโปรดแล้ว ฉันจะจำไว้ให้ ⭐",
            categorySelected: "หมวดหมู่ที่เลือกน่าสนใจมาก! มีอีกหลายที่เลย",
            tripPlanning: "วางแผนทริปหรือ? ให้ฉันช่วยคำนวณเส้นทางดีที่สุด 🗺️",
            locationFocus: "สถานที่นี้ดีมาก! อยากรู้เรื่องราวเพิ่มเติมมั้ย?",
            longSession: "เล่นมานานแล้วนะ! พักสายตาบ้างไหม? 😊",
            mobileUser: "ใช้มือถือสะดวกดีนะ! ลองใช้สองนิ้วซูมดูสิ 📱",
            weatherCheck: "อยากรู้สภาพอากาศมั้ย? คลิกดูในแต่ละสถานที่ได้เลย 🌤️",
            similarInterests: "เห็นคุณชอบ${category} ลองดู${suggestion}ไหม?",
            timeBasedTip: "ช่วงเวลานี้เหมาะสำหรับ${activity}มาก!"
        },
        en: {
            firstVisit: "First time here! I'm PaiNai, your little travel assistant 🐘",
            returning: "Welcome back! There are many new places to explore",
            morning: "Good morning! Ready to explore the world? ☀️",
            afternoon: "Good afternoon! Let's discover beautiful places 🌤️",
            evening: "Good evening! How about places that shine at night? 🌙",
            searchActive: "I see you're searching! Want me to help suggest places? 🔍",
            favoriteAdded: "Excellent! Added to favorites, I'll remember this ⭐",
            categorySelected: "Great category choice! There are many more like this",
            tripPlanning: "Planning a trip? Let me help calculate the best routes 🗺️",
            locationFocus: "Great choice! Want to know more about this place?",
            longSession: "You've been exploring for a while! Maybe take a break? 😊",
            mobileUser: "Mobile works great! Try pinch-to-zoom on the globe 📱",
            weatherCheck: "Want weather info? Click on any location to check 🌤️",
            similarInterests: "I see you like ${category}, how about ${suggestion}?",
            timeBasedTip: "This time is perfect for ${activity}!"
        }
    };
}

// Enhanced AI-like Mascot Interactive Functions
function initializeMascot() {
    initializeMascotTips();
    
    // Setup floating mascot click handler
    const floatingMascot = document.getElementById('floatingMascot');
    if (floatingMascot) {
        floatingMascot.addEventListener('click', handleMascotClick);
        
        // AI-like initial greeting based on time and user status
        setTimeout(() => {
            showContextualGreeting();
        }, 3000);
        
        // Intelligent tip showing based on user behavior
        setInterval(() => {
            if (Date.now() - lastMascotInteraction > 25000) { // More frequent, AI-like interaction
                showIntelligentTip();
            }
        }, 25000);
        
        // Monitor user behavior for contextual responses
        initializeBehaviorMonitoring();
    }
    
    // Update welcome mascot message
    updateWelcomeMascotMessage();
}

// AI-like behavior monitoring
function initializeBehaviorMonitoring() {
    let userActivity = {
        searchCount: 0,
        locationViews: 0,
        favoritesAdded: 0,
        sessionDuration: 0,
        lastActivity: Date.now()
    };
    
    // Monitor search usage
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            userActivity.searchCount++;
            userActivity.lastActivity = Date.now();
            
            if (userActivity.searchCount === 3) {
                setTimeout(() => showContextualTip('searchActive'), 1000);
            }
        });
    }
    
    // Monitor location focus
    window.addEventListener('locationFocused', (e) => {
        userActivity.locationViews++;
        userActivity.lastActivity = Date.now();
        
        if (userActivity.locationViews === 5) {
            setTimeout(() => showContextualTip('locationExplorer'), 2000);
        }
    });
    
    // Monitor favorites
    window.addEventListener('favoriteToggled', (e) => {
        if (e.detail.action === 'add') {
            userActivity.favoritesAdded++;
            showContextualTip('favoriteAdded');
        }
    });
    
    // Monitor session duration for helpful breaks
    setInterval(() => {
        userActivity.sessionDuration++;
        if (userActivity.sessionDuration === 30) { // 5 minutes (30 * 10 seconds)
            showContextualTip('longSession');
        }
    }, 10000);
    
    // Detect mobile users
    if (window.innerWidth <= 768) {
        setTimeout(() => showContextualTip('mobileUser'), 8000);
    }
}

// Enhanced mascot click handler with AI-like responses
function handleMascotClick() {
    const floatingMascot = document.getElementById('floatingMascot');
    const mascotSpeech = document.getElementById('mascotSpeechSmall');
    
    mascotInteractionCount++;
    lastMascotInteraction = Date.now();
    
    // Enhanced click animation with personality
    floatingMascot.classList.add('active');
    floatingMascot.style.transform = 'scale(1.2) rotate(5deg)';
    
    // Add click sound effect (visual feedback)
    createEnhancedClickEffect();
    
    setTimeout(() => {
        floatingMascot.classList.remove('active');
        floatingMascot.style.transform = '';
    }, 300);
    
    // AI-like response selection based on interaction history and context
    if (mascotInteractionCount === 1) {
        showMascotGreeting();
    } else if (mascotInteractionCount % 5 === 0) {
        // Every 5th click, show personalized insight
        showPersonalizedInsight();
    } else if (Date.now() - userBehavior.sessionStart > 300000) { // 5 minutes
        // Long session, offer break or encouragement
        showSessionBasedTip();
    } else {
        // Regular intelligent tip
        showIntelligentTip();
    }
    
    // Enhanced speaking animation
    showMascotSpeaking();
}

// Show personalized insights based on user behavior
function showPersonalizedInsight() {
    const mascotTip = document.getElementById('mascotTip');
    if (!mascotTip) return;
    
    const isThaiLang = userPreferences.language === 'th';
    const totalLocations = Object.keys(userBehavior.locationViews).length;
    const totalSearches = userBehavior.searchQueries.length;
    const favoritesCount = favorites.length;
    
    let insight = '';
    
    if (totalLocations > 10) {
        insight = isThaiLang ?
            `🏆 วาว! คุณเป็นนักสำรวจตัวจริง ดูไป ${totalLocations} สถานที่แล้ว! คุณชอบการผจญภัยจริงๆ` :
            `🏆 Wow! You're a true explorer with ${totalLocations} locations viewed! You really love adventure`;
    } else if (favoritesCount > 5) {
        insight = isThaiLang ?
            `⭐ คุณมีรายการโปรด ${favoritesCount} สถานที่! ฉันเห็นว่าคุณวางแผนดีมาก` :
            `⭐ You have ${favoritesCount} favorite places! I can see you're a great planner`;
    } else if (totalSearches > 5) {
        insight = isThaiLang ?
            `🔍 คุณชอบค้นคว้าข้อมูลจริงๆ! ค้นหาไปแล้ว ${totalSearches} ครั้ง ฉันชอบความอยากรู้ของคุณ` :
            `🔍 You really love researching! ${totalSearches} searches show your curiosity`;
    } else {
        insight = isThaiLang ?
            `🌟 คุณเริ่มต้นได้ดีมาก! มาสำรวจสถานที่ใหม่ๆ กันต่อเถอะ` :
            `🌟 You're off to a great start! Let's discover more amazing places`;
    }
    
    mascotTip.innerHTML = insight;
}

// Session-based tips for long-time users
function showSessionBasedTip() {
    const mascotTip = document.getElementById('mascotTip');
    if (!mascotTip) return;
    
    const isThaiLang = userPreferences.language === 'th';
    const sessionMinutes = Math.floor((Date.now() - userBehavior.sessionStart) / 60000);
    
    const sessionTips = {
        th: [
            `⏰ เล่นมา ${sessionMinutes} นาทีแล้ว! พักสายตาบ้างไหม? สุขภาพสำคัญนะ`,
            `💪 ความอยากรู้ของคุณน่าชื่นชม! แต่อย่าลืมพักผ่อนบ้างนะ`,
            `🎯 คุณสำรวจมาเยอะแล้ว! ลองใช้ Trip Planner วางแผนจริงๆ ไหม?`,
            `☕ ช่วงพักการสำรวจ! ดื่มน้ำแล้วกลับมาเที่ยวต่อกันนะ`
        ],
        en: [
            `⏰ You've been exploring for ${sessionMinutes} minutes! How about a quick break?`,
            `💪 Your curiosity is admirable! But don't forget to rest your eyes`,
            `🎯 Great exploration session! Ready to plan a real trip with our Trip Planner?`,
            `☕ Break time! Stay hydrated and come back for more adventures`
        ]
    };
    
    const tips = sessionTips[userPreferences.language];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    mascotTip.innerHTML = randomTip;
}

// Enhanced click effect with visual feedback
function createEnhancedClickEffect() {
    const floatingMascot = document.getElementById('floatingMascot');
    if (!floatingMascot) return;
    
    // Create multiple sparkle effects
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#98FB98', '#DDA0DD'];
    const rect = floatingMascot.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = ['✨', '💫', '⭐', '🌟', '💖'][i];
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 1001;
                animation: enhancedSparkle 2s ease-out forwards;
                filter: drop-shadow(0 0 10px ${colors[i]});
            `;
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 2000);
        }, i * 100);
    }
    
    // Add pulsing effect to mascot
    floatingMascot.style.animation = 'none';
    floatingMascot.style.animation = 'mascotPulse 0.6s ease-out';
    
    setTimeout(() => {
        floatingMascot.style.animation = 'floatingMascotBounce 4s ease-in-out infinite';
    }, 600);
}

function showMascotGreeting() {
    const mascotTip = document.getElementById('mascotTip');
    if (mascotTip) {
        const isThaiLang = userPreferences.language === 'th';
        const greeting = isThaiLang ? 
            `${getText('mascotGreeting')}<br>${getText('mascotWelcome')}` :
            `${getText('mascotGreeting')}<br>${getText('mascotWelcome')}`;
        
        mascotTip.innerHTML = greeting;
        
        // Add some personality with random greetings
        const greetings = {
            th: [
                "สวัสดีค่ะ! ฉันคือ PaiNai ช้างน้อยผู้ช่วย 🐘<br>พร้อมช่วยคุณสำรวจโลกแล้ว!",
                "หวัดดีจ้า! ฉันจะคอยให้คำแนะนำดีๆ นะ 💫<br>มาสำรวจไปด้วยกัน!",
                "ยินดีที่ได้รู้จักค่ะ! 🌟<br>ฉันจะช่วยให้การเดินทางของคุณสนุกขึ้น!"
            ],
            en: [
                "Hello! I'm PaiNai, your little elephant assistant 🐘<br>Ready to help you explore the world!",
                "Hi there! I'll give you helpful tips 💫<br>Let's explore together!",
                "Nice to meet you! 🌟<br>I'll make your journey more fun!"
            ]
        };
        
        const randomGreeting = greetings[userPreferences.language][Math.floor(Math.random() * greetings[userPreferences.language].length)];
        mascotTip.innerHTML = randomGreeting;
    }
}

// Enhanced AI-like contextual greeting
function showContextualGreeting() {
    const hour = new Date().getHours();
    const isFirstVisit = !localStorage.getItem('painaidee-seen-welcome');
    const isReturning = localStorage.getItem('painaidee-user-behavior');
    
    let contextKey = 'firstVisit';
    
    if (!isFirstVisit && isReturning) {
        contextKey = 'returning';
    } else if (hour >= 5 && hour < 12) {
        contextKey = 'morning';
    } else if (hour >= 12 && hour < 17) {
        contextKey = 'afternoon';
    } else {
        contextKey = 'evening';
    }
    
    showContextualTip(contextKey);
}

// Smart tip selection based on user behavior and context
function showIntelligentTip() {
    const mascotTip = document.getElementById('mascotTip');
    if (!mascotTip) return;
    
    const recentSearches = userBehavior.searchQueries.slice(-3);
    const recentViews = Object.keys(userBehavior.locationViews).slice(-3);
    const userPreferredCategories = Object.keys(userBehavior.categoryViews)
        .sort((a, b) => userBehavior.categoryViews[b].count - userBehavior.categoryViews[a].count)
        .slice(0, 2);
    
    let intelligentTip = '';
    const isThaiLang = userPreferences.language === 'th';
    
    // AI-like tip selection based on behavior patterns
    if (recentSearches.length > 0) {
        // User has been searching
        const lastSearch = recentSearches[recentSearches.length - 1].query;
        intelligentTip = isThaiLang ? 
            `🔍 เห็นคุณค้นหา "${lastSearch}" ลองดูหมวดหมู่ที่เกี่ยวข้องไหม?` :
            `🔍 I saw you searched for "${lastSearch}", want to explore related categories?`;
    } else if (userPreferredCategories.length > 0) {
        // User has category preferences
        const topCategory = userPreferredCategories[0];
        const categoryInfo = locationCategories[topCategory];
        if (categoryInfo) {
            intelligentTip = isThaiLang ?
                `🎯 คุณดูเหมือนจะชอบ${categoryInfo.nameTh} มีสถานที่ใหม่ๆ ให้สำรวจอีกเยอะ!` :
                `🎯 You seem to love ${categoryInfo.nameEn}, there are more amazing places to discover!`;
        }
    } else if (recentViews.length > 0) {
        // User has viewed locations
        const lastLocation = recentViews[recentViews.length - 1];
        const locationData = locations[lastLocation];
        if (locationData) {
            intelligentTip = isThaiLang ?
                `💫 คุณเพิ่งดู${locationData.name} ลองดูสถานที่ใกล้เคียงไหม?` :
                `💫 You just viewed ${locationData.nameEn}, want to see nearby places?`;
        }
    } else {
        // Fallback to regular tips
        const tips = mascotTips[userPreferences.language];
        intelligentTip = tips[Math.floor(Math.random() * tips.length)];
    }
    
    // Add personalization variables
    intelligentTip = personalizeTip(intelligentTip);
    
    mascotTip.innerHTML = intelligentTip;
    currentTipIndex++;
    
    // Add sparkle effect for intelligent tips
    createMascotSparkles();
    showMascotSpeaking();
}

// Enhanced contextual tip showing
function showContextualTip(context) {
    const mascotTip = document.getElementById('mascotTip');
    if (mascotTip && mascotContextualTips[userPreferences.language] && mascotContextualTips[userPreferences.language][context]) {
        let tip = mascotContextualTips[userPreferences.language][context];
        
        // Personalize the tip
        tip = personalizeTip(tip);
        
        mascotTip.innerHTML = tip;
        
        // Show mascot speaking with enhanced animation
        showMascotSpeaking();
        
        lastMascotInteraction = Date.now();
    }
}

// Personalize tips with dynamic content
function personalizeTip(tip) {
    const userPreferredCategories = Object.keys(userBehavior.categoryViews)
        .sort((a, b) => userBehavior.categoryViews[b].count - userBehavior.categoryViews[a].count);
    
    const recentViews = Object.keys(userBehavior.locationViews);
    const totalViews = recentViews.length;
    
    // Replace placeholders with dynamic content
    tip = tip.replace('${count}', totalViews);
    
    if (userPreferredCategories.length > 0) {
        const topCategory = userPreferredCategories[0];
        const categoryInfo = locationCategories[topCategory];
        if (categoryInfo) {
            const isThaiLang = userPreferences.language === 'th';
            tip = tip.replace('${category}', isThaiLang ? categoryInfo.nameTh : categoryInfo.nameEn);
        }
    }
    
    // Add location suggestions based on preferences
    if (tip.includes('${location}') || tip.includes('${recommendation}')) {
        const suggestions = generateSmartSuggestions();
        if (suggestions.length > 0) {
            const suggestion = suggestions[0];
            const locationData = locations[suggestion];
            if (locationData) {
                const isThaiLang = userPreferences.language === 'th';
                const locationName = isThaiLang ? locationData.name : locationData.nameEn;
                tip = tip.replace(/\$\{location\}|\$\{recommendation\}/g, locationName);
            }
        }
    }
    
    // Add time-based suggestions
    const hour = new Date().getHours();
    if (tip.includes('${activity}')) {
        const activities = {
            th: hour < 12 ? 'ชมพระอาทิตย์ขึ้น' : hour < 18 ? 'เที่ยวกลางวัน' : 'ดูพระอาทิตย์ตก',
            en: hour < 12 ? 'sunrise viewing' : hour < 18 ? 'daytime exploration' : 'sunset watching'
        };
        tip = tip.replace('${activity}', activities[userPreferences.language]);
    }
    
    return tip;
}

// Generate smart location suggestions based on user behavior
function generateSmartSuggestions() {
    const userCategories = Object.keys(userBehavior.categoryViews)
        .sort((a, b) => userBehavior.categoryViews[b].count - userBehavior.categoryViews[a].count);
    
    const viewedLocations = Object.keys(userBehavior.locationViews);
    const suggestions = [];
    
    // Find locations that match user preferences but haven't been viewed much
    Object.keys(locations).forEach(locationKey => {
        const location = locations[locationKey];
        if (!location.categories) return;
        
        const viewCount = userBehavior.locationViews[locationKey]?.count || 0;
        if (viewCount < 2) { // Not heavily viewed
            // Check if location matches user's preferred categories
            const matchingCategories = location.categories.filter(cat => 
                userCategories.includes(cat)
            );
            
            if (matchingCategories.length > 0) {
                suggestions.push(locationKey);
            }
        }
    });
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
}

// Enhanced speaking animation
function showMascotSpeaking() {
    const floatingMascot = document.getElementById('floatingMascot');
    if (floatingMascot) {
        floatingMascot.classList.add('speaking');
        
        // Add enhanced speaking animation
        floatingMascot.style.animation = 'floatingMascotTalk 0.5s ease-in-out 3';
        
        setTimeout(() => {
            floatingMascot.classList.remove('speaking');
            floatingMascot.style.animation = 'floatingMascotBounce 4s ease-in-out infinite';
        }, 4000);
    }
}

function createMascotSparkles() {
    const floatingMascot = document.getElementById('floatingMascot');
    if (!floatingMascot) return;
    
    const sparkles = ['✨', '💫', '⭐', '🌟'];
    const rect = floatingMascot.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                font-size: 1.2rem;
                pointer-events: none;
                z-index: 1001;
                animation: mascotSparkle 2s ease-out forwards;
            `;
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 2000);
        }, i * 200);
    }
}

function updateWelcomeMascotMessage() {
    const mascotMessage = document.getElementById('mascotMessage');
    if (mascotMessage) {
        const isThaiLang = userPreferences.language === 'th';
        const message = isThaiLang ?
            `${getText('mascotGreeting')}<br>${getText('mascotWelcome')}` :
            `${getText('mascotGreeting')}<br>${getText('mascotWelcome')}`;
        
        mascotMessage.innerHTML = message;
    }
}

function updateMascotLanguage() {
    updateWelcomeMascotMessage();
    
    const mascotTip = document.getElementById('mascotTip');
    if (mascotTip) {
        const isThaiLang = userPreferences.language === 'th';
        const message = isThaiLang ? 
            `${getText('mascotClickForTips')}` : 
            `${getText('mascotClickForTips')}`;
        mascotTip.innerHTML = message;
    }
}

// Context-aware mascot responses for specific events
function showContextualMascotTip(context, data = {}) {
    const contextTips = {
        th: {
            locationFocus: `ดีมาก! คุณกำลังดู${data.location ? locations[data.location]?.name || data.location : 'สถานที่นี้'} 🎯\nลองคลิกจุดทองอื่นๆ ดูสิ!`,
            searchActive: "เห็นคุณค้นหาอยู่ ให้ฉันช่วยแนะนำมั้ย? 🔍\nลองใช้ Category Filter ด้วยนะ!",
            favoriteAdded: `ยอดเยี่ยม! บันทึก${data.location ? locations[data.location]?.name || 'สถานที่' : 'สถานที่'}ไว้แล้ว ⭐\nจะได้หาง่ายในครั้งหน้า!`,
            tripPlanning: "สุดยอด! กำลังวางแผนทริปใช่มั้ย? 🗺️\nอย่าลืมดูข้อมูลสภาพอากาศด้วยนะ!",
            themeChanged: "สวยใหม่เลย! ธีมใหม่ทำให้ดูดีขึ้นมาก 🎨\nลองเปลี่ยนไปมาดูสิ!",
            locationExplorer: "เยี่ยมมาก! คุณเป็นนักสำรวจตัวจริง 🏆\nมาดูสถานที่ใหม่ๆ กันต่อเถอะ!",
            longSession: "เล่นมานานแล้วนะ! พักสายตาบ้างไหม? 😊\nสุขภาพสำคัญนะคะ",
            mobileUser: "ใช้มือถือสะดวกดีนะ! 📱\nลองใช้สองนิ้วซูมและปัดดูโลกสิ"
        },
        en: {
            locationFocus: `Great! You're viewing ${data.location ? locations[data.location]?.nameEn || data.location : 'this location'} 🎯\nTry clicking other golden dots too!`,
            searchActive: "I see you're searching! Want me to help suggest places? 🔍\nTry the Category Filters too!",
            favoriteAdded: `Awesome! ${data.location ? locations[data.location]?.nameEn || 'Location' : 'Location'} saved to favorites ⭐\nEasy to find next time!`,
            tripPlanning: "Perfect! Planning a trip? 🗺️\nDon't forget to check weather info!",
            themeChanged: "Looking good! The new theme is beautiful 🎨\nFeel free to switch back and forth!",
            locationExplorer: "Amazing! You're a true explorer 🏆\nLet's discover more places together!",
            longSession: "You've been exploring for a while! How about a break? 😊\nTake care of your eyes!",
            mobileUser: "Mobile works great! 📱\nTry pinch-to-zoom and swipe to explore the globe"
        }
    };
    
    const mascotTip = document.getElementById('mascotTip');
    if (mascotTip && contextTips[userPreferences.language] && contextTips[userPreferences.language][context]) {
        let tip = contextTips[userPreferences.language][context];
        
        mascotTip.innerHTML = tip;
        
        // Show mascot speaking with enhanced animation
        showMascotSpeaking();
        
        lastMascotInteraction = Date.now();
    }
}

// Add CSS animation for sparkles
const mascotSparkleStyle = document.createElement('style');
mascotSparkleStyle.textContent = `
    @keyframes mascotSparkle {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) rotate(180deg) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(mascotSparkleStyle);

// Location categories for enhanced filtering
const locationCategories = {
    beach: {
        nameEn: "Beaches & Islands",
        nameTh: "ชายหาดและเกาะ",
        emoji: "🏖️",
        color: "#00bcd4"
    },
    mountain: {
        nameEn: "Mountains & Nature",
        nameTh: "ภูเขาและธรรมชาติ",
        emoji: "🏔️",
        color: "#4caf50"
    },
    historical: {
        nameEn: "Historical Sites",
        nameTh: "แหล่งประวัติศาสตร์",
        emoji: "🏛️",
        color: "#ff9800"
    },
    cultural: {
        nameEn: "Cultural Centers",
        nameTh: "ศูนย์วัฒนธรรม",
        emoji: "🏯",
        color: "#9c27b0"
    },
    urban: {
        nameEn: "Urban Areas",
        nameTh: "เขตเมือง",
        emoji: "🏙️",
        color: "#2196f3"
    },
    adventure: {
        nameEn: "Adventure & Activities",
        nameTh: "ผจญภัยและกิจกรรม",
        emoji: "🧗",
        color: "#f44336"
    }
};

// Enhanced Thai locations with more destinations and detailed information
const locations = {
    bangkok: {
        name: "กรุงเทพมหานคร",
        nameEn: "Bangkok",
        description: "เมืองหลวงของประเทศไทย เต็มไปด้วยวัดสวยงามและวัฒนธรรม อีกทั้งยังเป็นศูนย์กลางทางเศรษฐกิจและการท่องเที่ยว",
        descriptionEn: "Capital city of Thailand, rich in temples and culture, and the economic and tourism center",
        emoji: "🏛️",
        coordinates: [100.5018, 13.7563],
        categories: ["urban", "cultural", "historical"],
        attractions: ["วัดพระแก้ว", "พระบรมมหาราชวัง", "วัดโพธิ์", "ตลาดจตุจักร", "วัดอรุณ", "เยาวราช"],
        attractionsEn: ["Wat Phra Kaew", "Grand Palace", "Wat Pho", "Chatuchak Market", "Wat Arun", "Chinatown"],
        photos: [
            { 
                name: "Grand Palace", 
                emoji: "🏰",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjRkZEQjAwIDAlLCAjRkY4NzAwIDUwJSwgI0ZGNEUwMCAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PsDwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R3JhbmQgUGFsYWNlPC90ZXh0Pgo8L3N2Zz4K",
                description: "The Grand Palace complex in Bangkok, Thailand's most famous landmark"
            },
            { 
                name: "Wat Arun", 
                emoji: "🕌",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjc0RUEgMCUsICM3NjRCQTIgNTAlLCAjNEU1NEMyIDEwMCUpIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQ0IiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5aM4oOpPC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjM0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XYXQgQXJ1bjwvdGV4dD4KPC9zdmc+Cg==", 
                description: "Temple of Dawn, one of Bangkok's most iconic temples"
            },
            { 
                name: "Floating Market", 
                emoji: "🛶",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMEJBQjY0IDAlLCAjMDU5NjY5IDUwJSwgIzA4N0Y4RiAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RtjwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RmxvYXRpbmcgTWFya2V0PC90ZXh0Pgo8L3N2Zz4K",
                description: "Traditional floating market showcasing local culture and food"
            },
            { 
                name: "Tuk Tuk", 
                emoji: "🛺",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjRkZENzAwIDAlLCAjRkYxOTQ0IDUwJSwgI0ZGMDAwMCAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RujwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VHVrIFR1azwvdGV4dD4KPC9zdmc+Cg==",
                description: "Iconic three-wheeled taxi, a symbol of Bangkok transportation"
            }
        ],
        weather: "30°C ☀️",
        bestTime: "November - February",
        travelTips: "ใช้รถไฟฟ้า BTS และ MRT เดินทางสะดวก / Use BTS and MRT for convenient travel"
    },
    chiangmai: {
        name: "เชียงใหม่", 
        nameEn: "Chiang Mai",
        description: "เมืองแห่งดอยสูงและวัฒนธรรมล้านนา มีอากาศเย็นสบายและธรรมชาติที่สวยงาม",
        descriptionEn: "City of mountains and Lanna culture with cool weather and beautiful nature",
        emoji: "🏔️",
        coordinates: [98.9817, 18.7883],
        categories: ["mountain", "cultural", "adventure"],
        attractions: ["ดอยสุเทพ", "วัดพระธาตุ", "ตลาดวอร์กกิ้งสตรีท", "อุทยานแห่งชาติดอยอินทนนท์", "บ้านช้าง", "ตลาดนัดเสาร์อาทิตย์"],
        attractionsEn: ["Doi Suthep", "Wat Phra That", "Walking Street", "Doi Inthanon National Park", "Elephant Sanctuary", "Weekend Market"],
        photos: [
            { 
                name: "Doi Suthep", 
                emoji: "⛰️",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNEY0NjQxIDAlLCAjOEI0NTEzIDUwJSwgI0Q2OTNBNiAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4ruuvve+uDwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RG9pIFN1dGhlcDwvdGV4dD4KPC9zdmc+Cg==",
                description: "Sacred mountain temple with panoramic city views"
            },
            { 
                name: "Night Bazaar", 
                emoji: "🌃",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMUUxRTFFIDAlLCAjNjM0M0E2IDUwJSwgI0ZGOEM1QSAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+MnDwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TmlnaHQgQmF6YWFyPC90ZXh0Pgo8L3N2Zz4K",
                description: "Vibrant night market in the heart of Chiang Mai"
            },
            { 
                name: "Elephant Sanctuary", 
                emoji: "🐘",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMjJDNTVFIDAlLCAjMTY1MDBCIDUwJSwgIzRGRkY0MSAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QmDwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RWxlcGhhbnQgU2FuY3R1YXJ5PC90ZXh0Pgo8L3N2Zz4K",
                description: "Ethical elephant sanctuary in the mountains"
            },
            { 
                name: "Lanna Temple", 
                emoji: "🏯",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjOEEyQkUyIDAlLCAjNjQ3NEU0IDUwJSwgI0Y0M0Y1RSAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PlzwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGFubmEgVGVtcGxlPC90ZXh0Pgo8L3N2Zz4K",
                description: "Traditional Lanna architecture temple"
            }
        ],
        weather: "25°C 🌤️",
        bestTime: "October - March",
        travelTips: "เช่ารถจักรยานยนต์สำรวจเมืองเก่า / Rent a motorbike to explore the old city"
    },
    phuket: {
        name: "ภูเก็ต",
        nameEn: "Phuket", 
        description: "เกะมุกอันดามัน ทะเลใสและหาดทรายขาว เป็นจุดหมายปลายทางการท่องเที่ยวที่มีชื่อเสียงระดับโลก",
        descriptionEn: "Pearl of Andaman with crystal clear sea and white sandy beaches, a world-famous tourist destination",
        emoji: "🏝️",
        coordinates: [98.3923, 7.8804],
        categories: ["beach", "adventure"],
        attractions: ["หาดป่าตอง", "เกาะพีพี", "หาดกะตะ", "บิ๊กบุดดา", "เมืองเก่าภูเก็ต", "หาดไนหาน"],
        attractionsEn: ["Patong Beach", "Phi Phi Islands", "Kata Beach", "Big Buddha", "Phuket Old Town", "Nai Harn Beach"],
        photos: [
            { 
                name: "Patong Beach", 
                emoji: "🏖️",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDA5RkZEIDAlLCAjMDBCQ0Y0IDUwJSwgIzAwRTBGMyAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PluKPuWYgPC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjM0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QYXR1bmcgQmVhY2g8L3RleHQ+Cjwvc3ZnPgo=",
                description: "Popular beach destination with crystal clear waters"
            },
            { 
                name: "Phi Phi Islands", 
                emoji: "🏝️",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDAzOTFCIDAlLCAjMDBCNzk4IDUwJSwgIzAwRkZCNyAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PnSw8L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iMzQwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBoaSBQaGkgSXNsYW5kczwvdGV4dD4KPC9zdmc+Cg==",
                description: "Stunning limestone cliffs and turquoise waters"
            },
            { 
                name: "Sunset View", 
                emoji: "🌅",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjRkY2RjAwIDAlLCAjRkZBNTAwIDUwJSwgI0ZGNzMwMCAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+MhTwvdGV4dD4KPHR5cGUgeD0iNDAwIiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3Vuc2V0IFZpZXc8L3RleHQ+Cjwvc3ZnPgo=",
                description: "Breathtaking sunset views over the Andaman Sea"
            },
            { 
                name: "Longtail Boat", 
                emoji: "⛵",
                url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMjE5NEYzIDAlLCAjMUU4OEU1IDUwJSwgIzU5ODdEQiAxMDAlKSIvPgo8dGV4dCB4PSI0MDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+46e1PC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjM0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb25ndGFpbCBCb2F0PC90ZXh0Pgo8L3N2Zz4K",
                description: "Traditional longtail boats at Maya Bay"
            }
        ],
        weather: "28°C 🌊",
        bestTime: "November - April",
        travelTips: "จองทัวร์เกาะล่วงหน้า / Book island tours in advance"
    },
    ayutthaya: {
        name: "พระนครศรีอยุธยา",
        nameEn: "Ayutthaya",
        description: "อดีตราชธานีของไทย มรดกโลกที่เต็มไปด้วยซากปรักหักพังของวัดและพระราชวัง",
        descriptionEn: "Former capital of Thailand, UNESCO World Heritage site with ancient temple ruins and palaces",
        emoji: "🏺",
        coordinates: [100.5692, 14.3532],
        categories: ["historical", "cultural"],
        attractions: ["วัดมหาธาตุ", "วัดพระศรีสรรเพชญ์", "วัดชัยวัฒนาราม", "พระราชวังหลวง", "ตลาดน้ำอยุธยา"],
        attractionsEn: ["Wat Mahathat", "Wat Phra Si Sanphet", "Wat Chaiwatthanaram", "Royal Palace", "Ayutthaya Floating Market"],
        photos: [
            { 
                name: "Buddha Head in Tree", 
                emoji: "🌳",
                url: "https://picsum.photos/800/600?random=13",
                description: "Famous Buddha head entwined in tree roots at Wat Mahathat"
            },
            { 
                name: "Ancient Ruins", 
                emoji: "🏛️",
                url: "https://picsum.photos/800/600?random=14",
                description: "Magnificent ancient temple ruins showcasing Ayutthaya's golden age"
            },
            { 
                name: "Temple Complex", 
                emoji: "🕌",
                url: "https://picsum.photos/800/600?random=15",
                description: "Well-preserved temple complex with intricate architecture"
            },
            { 
                name: "Historical Site", 
                emoji: "📿",
                url: "https://picsum.photos/800/600?random=16",
                description: "UNESCO World Heritage site with centuries of history"
            }
        ],
        weather: "29°C ☀️",
        bestTime: "November - February",
        travelTips: "เช่าจักรยานเที่ยวชมซากปรักหักพัง / Rent bicycles to explore the ruins"
    },
    krabi: {
        name: "กระบี่",
        nameEn: "Krabi",
        description: "จังหวัดที่มีธรรมชาติสวยงาม หาดทรายขาว น้ำทะเลใส และหน้าผาปูนขาวที่งดงาม",
        descriptionEn: "Province with beautiful nature, white sand beaches, crystal clear sea, and stunning limestone cliffs",
        emoji: "🌊",
        coordinates: [98.9063, 8.0863],
        categories: ["beach", "adventure", "mountain"],
        attractions: ["อ่าวไร่เลย์", "เกาะพีพี", "เกาะฮ่องอิสลาม", "ถ้ำพระนาง", "น้ำตกน้ำหยดธรรมชาติ"],
        attractionsEn: ["Railay Bay", "Phi Phi Islands", "Hong Island", "Phra Nang Cave", "Namtok Namyod Nature"],
        photos: [
            { name: "Railay Beach", emoji: "🏖️" },
            { name: "Rock Climbing", emoji: "🧗" },
            { name: "Sea Kayaking", emoji: "🛶" },
            { name: "Limestone Cliffs", emoji: "⛰️" }
        ],
        weather: "27°C 🌴",
        bestTime: "November - April",
        travelTips: "ลองปีนหน้าผาและพายเรือคายัค / Try rock climbing and sea kayaking"
    },
    sukhothai: {
        name: "สุโขทัย",
        nameEn: "Sukhothai",
        description: "อุทยานประวัติศาสตร์สุโขทัย เมืองแรกของไทย มรดกโลกที่อนุรักษ์ซากปรักหักพังโบราณ",
        descriptionEn: "Sukhothai Historical Park, first capital of Thailand, UNESCO site preserving ancient ruins",
        emoji: "🏛️",
        coordinates: [99.8230, 17.0238],
        categories: ["historical", "cultural"],
        attractions: ["วัดมหาธาตุ", "วัดศรีชุม", "วัดสระศรี", "วัดศรีสวาย", "ประตูนาคนาต"],
        attractionsEn: ["Wat Mahathat", "Wat Sri Chum", "Wat Sa Sri", "Wat Sri Sawai", "Nakonart Gate"],
        photos: [
            { name: "Giant Buddha", emoji: "🧘" },
            { name: "Ancient Pagoda", emoji: "🗼" },
            { name: "Lotus Pond", emoji: "🪷" },
            { name: "Historical Park", emoji: "🏞️" }
        ],
        weather: "28°C ☀️",
        bestTime: "November - February",
        travelTips: "เช่าจักรยานเที่ยวในอุทยาน / Rent a bicycle to tour the historical park"
    },
    chonburi: {
        name: "ชลบุรี",
        nameEn: "Chonburi",
        description: "เมืองท่องเที่ยวชายทะเลที่มีทั้งหาดพัทยาและเกาะล้าน พร้อมกิจกรรมทางน้ำที่หลากหลาย",
        descriptionEn: "Coastal tourist city featuring Pattaya Beach and Koh Larn with diverse water activities",
        emoji: "🏖️",
        coordinates: [100.9847, 13.3611],
        categories: ["beach", "adventure", "urban"],
        attractions: ["หาดพัทยา", "เกาะล้าน", "สวนนงนุช", "ตลาดลอยน้ำสี่ภาค", "วัดใหญ่อินทราราม"],
        attractionsEn: ["Pattaya Beach", "Koh Larn", "Nong Nooch Garden", "Four Regions Floating Market", "Wat Yai Inthararam"],
        photos: [
            { name: "Pattaya Beach", emoji: "🏖️" },
            { name: "Coral Island", emoji: "🐠" },
            { name: "Water Sports", emoji: "🏄" },
            { name: "Floating Market", emoji: "🛶" }
        ],
        weather: "30°C 🌊",
        bestTime: "November - March",
        travelTips: "หลีกเลี่ยงช่วงวันหยุดยาว เนื่องจากคนเยอะ / Avoid long holidays due to crowds"
    },
    kanchanaburi: {
        name: "กาญจนบุรี",
        nameEn: "Kanchanaburi",
        description: "เมืองประวัติศาสตร์ริมแควน้อย มีสะพานข้ามแควใหญ่และธรรมชาติที่งดงาม",
        descriptionEn: "Historic city by the River Kwai with the famous bridge and beautiful nature",
        emoji: "🌉",
        coordinates: [99.5328, 14.0227],
        categories: ["historical", "mountain", "adventure"],
        attractions: ["สะพานข้ามแควใหญ่", "อุทยานแห่งชาติเอราวัณ", "ถ้ำกระแซ", "พิพิธภัณฑ์สงคราม", "ตลาดน้ำดอนวาย"],
        attractionsEn: ["Bridge over River Kwai", "Erawan National Park", "Kaeng Krachan Cave", "War Museum", "Don Wai Floating Market"],
        photos: [
            { name: "Historic Bridge", emoji: "🌉" },
            { name: "Erawan Falls", emoji: "💧" },
            { name: "Train Ride", emoji: "🚂" },
            { name: "River View", emoji: "🏞️" }
        ],
        weather: "29°C 🌤️",
        bestTime: "December - February",
        travelTips: "ขึ้นรถไฟสาย Death Railway ชมวิวธรรมชาติ / Take the Death Railway train for scenic views"
    },
    lopburi: {
        name: "ลพบุรี",
        nameEn: "Lopburi",
        description: "เมืองลิงแห่งประเทศไทย เต็มไปด้วยโบราณสถานขอมและวัฒนธรรมที่น่าสนใจ",
        descriptionEn: "Thailand's monkey city filled with ancient Khmer ruins and fascinating culture",
        emoji: "🐵",
        coordinates: [100.6531, 14.7995],
        categories: ["historical", "cultural"],
        attractions: ["พระปรางค์สามยอด", "วัดพระศรีรัตนมหาธาตุ", "พระราชวังสมเด็จพระนารายณ์", "ศาลเจ้าแม่ชีจินดา"],
        attractionsEn: ["Phra Prang Sam Yot", "Wat Phra Sri Rattana Mahathat", "King Narai Palace", "Mae Chi Jinda Shrine"],
        photos: [
            { name: "Monkey Temple", emoji: "🐵" },
            { name: "Khmer Ruins", emoji: "🏯" },
            { name: "Ancient Palace", emoji: "🏰" },
            { name: "Historic Site", emoji: "📿" }
        ],
        weather: "31°C ☀️",
        bestTime: "November - January",
        travelTips: "ระวังลิงแย่งอาหาร เก็บของมีค่าให้ดี / Beware of monkeys snatching food, secure valuables"
    },
    huahin: {
        name: "หัวหิน",
        nameEn: "Hua Hin",
        description: "เมืองท่องเที่ยวชายทะเลที่เป็นที่ประทับของพระราชวัง มีหาดทรายขาวและอากาศเย็นสบาย",
        descriptionEn: "Royal seaside resort town with white sandy beaches and pleasant weather",
        emoji: "🏖️",
        coordinates: [99.9588, 12.5683],
        categories: ["beach", "cultural"],
        attractions: ["พระราชวังไกลกังวล", "หาดหัวหิน", "ตลาดน้ำอัมพวา", "เขาตะเกียบ", "วัดห้วยมงคล"],
        attractionsEn: ["Klaikangwon Palace", "Hua Hin Beach", "Amphawa Floating Market", "Khao Takiab", "Wat Huay Mongkol"],
        photos: [
            { name: "Royal Beach", emoji: "👑" },
            { name: "Fishing Boats", emoji: "🎣" },
            { name: "Night Market", emoji: "🌃" },
            { name: "Temple View", emoji: "⛩️" }
        ],
        weather: "29°C 🌊",
        bestTime: "November - April",
        travelTips: "เที่ยวตลาดน้ำเช้าตรู่ เย็นเดินชายหาด / Visit floating market early morning, evening beach walks"
    },
    kohsamui: {
        name: "เกาะสมุย",
        nameEn: "Koh Samui",
        description: "เกาะในอ่าวไทยที่มีชื่อเสียงระดับโลก มีหาดทรายขาวและน้ำทะเลใสสวยงาม",
        descriptionEn: "World-famous island in the Gulf of Thailand with pristine beaches and crystal clear waters",
        emoji: "🥥",
        coordinates: [100.0629, 9.5018],
        categories: ["beach", "adventure"],
        attractions: ["หาดเฉวง", "หาดละไม", "วัดพระใหญ่", "หินตาหินยาย", "น้ำตกนาเมือง"],
        attractionsEn: ["Chaweng Beach", "Lamai Beach", "Big Buddha Temple", "Hin Ta Hin Yai", "Na Muang Waterfall"],
        photos: [
            { name: "Paradise Beach", emoji: "🏝️" },
            { name: "Coconut Trees", emoji: "🥥" },
            { name: "Sunset View", emoji: "🌅" },
            { name: "Beach Resort", emoji: "🏨" }
        ],
        weather: "30°C 🌴",
        bestTime: "December - April",
        travelTips: "เช่ารถจักรยานยนต์เที่ยวรอบเกาะ / Rent a motorbike to explore the island"
    },
    chiangrai: {
        name: "เชียงราย",
        nameEn: "Chiang Rai",
        description: "จังหวัดเหนือสุดของไทย มีวัดสีขาวและสีน้ำเงินที่มีชื่อเสียง พร้อมวัฒนธรรมล้านนาที่งดงาม",
        descriptionEn: "Thailand's northernmost province famous for white and blue temples and beautiful Lanna culture",
        emoji: "⛩️",
        coordinates: [99.8325, 19.9105],
        categories: ["cultural", "mountain", "historical"],
        attractions: ["วัดร่องขุ่น", "วัดร่องเสือเต้น", "สามเหลี่ยมทองคำ", "หมู่บ้านกะเหรี่ยงคอยาว", "ดอยตุง"],
        attractionsEn: ["Wat Rong Khun (White Temple)", "Wat Rong Suea Ten (Blue Temple)", "Golden Triangle", "Long Neck Karen Village", "Doi Tung"],
        photos: [
            { name: "White Temple", emoji: "⛩️" },
            { name: "Blue Temple", emoji: "💙" },
            { name: "Golden Triangle", emoji: "🔺" },
            { name: "Hill Tribes", emoji: "🏔️" }
        ],
        weather: "26°C 🌤️",
        bestTime: "November - February",
        travelTips: "เที่ยวสามเหลี่ยมทองคำและชมวิวโขง / Visit Golden Triangle and view the Mekong River"
    },
    pattaya: {
        name: "พัทยา",
        nameEn: "Pattaya",
        description: "เมืองท่องเที่ยวชายทะเลที่มีชีวิตชีวาตลอด 24 ชั่วโมง มีกิจกรรมทางน้ำและความบันเทิงมากมาย",
        descriptionEn: "Vibrant 24-hour beach city with abundant water activities and entertainment",
        emoji: "🌃",
        coordinates: [100.8868, 12.9236],
        categories: ["beach", "urban", "adventure"],
        attractions: ["หาดพัทยา", "เกาะล้าน", "สวนนงนุช", "อุทยานโบราณสถาน", "วอล์กกิ้งสตรีท"],
        attractionsEn: ["Pattaya Beach", "Koh Larn", "Nong Nooch Garden", "Sanctuary of Truth", "Walking Street"],
        photos: [
            { name: "City Beach", emoji: "🏙️" },
            { name: "Coral Island", emoji: "🐠" },
            { name: "Night Life", emoji: "🌃" },
            { name: "Water Sports", emoji: "🚤" }
        ],
        weather: "31°C 🌊",
        bestTime: "November - March",
        travelTips: "หลีกเลี่ยงวันหยุดยาว ทำกิจกรรมน้ำตอนเช้า / Avoid long holidays, do water activities in the morning"
    },
    europe: {
        name: "ยุโรป",
        nameEn: "Europe",
        description: "ทวีปแห่งประวัติศาสตร์และศิลปะ มีสถาปัตยกรรมที่งดงามและวัฒนธรรมที่หลากหลาย",
        descriptionEn: "Continent of history and art with beautiful architecture and diverse cultures",
        emoji: "🏛️",
        coordinates: [10.0, 54.0],
        categories: ["historical", "cultural", "urban"],
        attractions: ["หอไอเฟล", "โคลอสเซี่ยม", "สะพานลอนดอน", "พิพิธภัณฑ์ลูฟร์", "พระราชวังวีเมอร์", "บิ๊กเบน"],
        attractionsEn: ["Eiffel Tower", "Colosseum", "Tower Bridge", "Louvre Museum", "Buckingham Palace", "Big Ben"],
        photos: [
            { name: "Eiffel Tower", emoji: "🗼" },
            { name: "Colosseum", emoji: "🏟️" },
            { name: "Big Ben", emoji: "🕰️" },
            { name: "Louvre", emoji: "🖼️" }
        ],
        weather: "15°C 🌤️",
        bestTime: "April - October",
        travelTips: "ซื้อ Eurail Pass สำหรับเดินทางข้ามประเทศ / Get Eurail Pass for cross-country travel"
    },
    america: {
        name: "อเมริกา",
        nameEn: "America", 
        description: "ดินแดนแห่งความฝันและโอกาส มีเมืองใหญ่ที่ทันสมัยและธรรมชาติที่น่าประทับใจ",
        descriptionEn: "Land of dreams and opportunities with modern cities and impressive nature",
        emoji: "🗽",
        coordinates: [-95.0, 37.0],
        categories: ["urban", "mountain", "adventure"],
        attractions: ["เทพีเสรีภาพ", "แกรนด์แคนยอน", "ไทม์สแควร์", "โลกดิสนีย์", "โกลเดนเกต", "เยลโลสโตน"],
        attractionsEn: ["Statue of Liberty", "Grand Canyon", "Times Square", "Disney World", "Golden Gate", "Yellowstone"],
        photos: [
            { name: "Statue of Liberty", emoji: "🗽" },
            { name: "Grand Canyon", emoji: "🏔️" },
            { name: "Times Square", emoji: "🌃" },
            { name: "Golden Gate", emoji: "🌉" }
        ],
        weather: "20°C 🌤️",
        bestTime: "Year Round",
        travelTips: "วางแผนเดินทางล่วงหน้าเนื่องจากขนาดใหญ่ / Plan trips in advance due to vast distances"
    }
};

// Initialize the application - removed duplicate, consolidated into initializeMap()

// Font loading with fallback handling
function initializeFontLoading() {
    // Check if Inter font loaded successfully, fallback to system fonts if not
    if (document.fonts && document.fonts.check) {
        const interLoaded = document.fonts.check('1rem Inter');
        if (!interLoaded) {
            console.log('ℹ️ Inter font not loaded, using system fonts as fallback');
            document.body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        }
    }
}

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

// Language management
function initializeLanguage() {
    const languageToggle = document.getElementById('languageToggle');
    const languageIcon = document.getElementById('languageIcon');
    
    // Set initial language icon
    languageIcon.textContent = userPreferences.language === 'th' ? '🇬🇧' : '🇹🇭';
    
    languageToggle.addEventListener('click', toggleLanguage);
}

function toggleLanguage() {
    const currentLang = userPreferences.language;
    const newLang = currentLang === 'th' ? 'en' : 'th';
    const languageIcon = document.getElementById('languageIcon');
    
    userPreferences.language = newLang;
    localStorage.setItem('painaidee-preferences', JSON.stringify(userPreferences));
    
    // Update language icon
    languageIcon.textContent = newLang === 'th' ? '🇬🇧' : '🇹🇭';
    
    // Update interface language
    updateInterfaceLanguage();
    
    // Update mascot language
    updateMascotLanguage();
    
    showNotification(
        newLang === 'th' ? 'เปลี่ยนเป็นภาษาไทยแล้ว' : 'Changed to English',
        'info'
    );
}

function updateInterfaceLanguage() {
    // Update static text elements
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
        const welcomeText = infoPanel.querySelector('p strong');
        if (welcomeText) {
            welcomeText.textContent = getText('welcome');
        }
        
        const descriptionTexts = infoPanel.querySelectorAll('.info-stats p');
        if (descriptionTexts.length >= 3) {
            descriptionTexts[0].innerHTML = `📍 ${getText('showing')}`;
            descriptionTexts[1].innerHTML = `🎮 ${getText('clickGold')}`;
            descriptionTexts[2].innerHTML = `🌍 ${getText('autoRotate')}`;
        }
    }
    
    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = `🔍 ${getText('searchPlaceholder')}`;
    }
    
    // Update controls heading
    const controlsHeading = document.querySelector('.controls h3');
    if (controlsHeading) {
        controlsHeading.textContent = `🧭 ${getText('attractions')}`;
    }
    
    // Update button texts
    updateButtonTexts();
    
    // Update favorites section if visible
    const favoritesHeading = document.querySelector('.favorites-section h4');
    if (favoritesHeading) {
        favoritesHeading.textContent = `⭐ ${getText('favorites')}`;
    }
}

function updateButtonTexts() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const text = button.textContent.trim();
        
        // Update location buttons based on current language
        if (text.includes('กรุงเทพฯ') || text.includes('Bangkok')) {
            const location = locations.bangkok;
            button.textContent = `🏛️ ${getCurrentLocationName(location)}`;
        } else if (text.includes('เชียงใหม่') || text.includes('Chiang Mai')) {
            const location = locations.chiangmai;
            button.textContent = `🏔️ ${getCurrentLocationName(location)}`;
        } else if (text.includes('ภูเก็ต') || text.includes('Phuket')) {
            const location = locations.phuket;
            button.textContent = `🏝️ ${getCurrentLocationName(location)}`;
        } else if (text.includes('อยุธยา') || text.includes('Ayutthaya')) {
            const location = locations.ayutthaya;
            button.textContent = `🏺 ${getCurrentLocationName(location)}`;
        } else if (text.includes('กระบี่') || text.includes('Krabi')) {
            const location = locations.krabi;
            button.textContent = `🌊 ${getCurrentLocationName(location)}`;
        } else if (text.includes('สุโขทัย') || text.includes('Sukhothai')) {
            const location = locations.sukhothai;
            button.textContent = `🏛️ ${getCurrentLocationName(location)}`;
        } else if (text.includes('โลก') || text.includes('World')) {
            button.textContent = `🌍 ${getText('world')}`;
        } else if (text.includes('หยุด/เล่น') || text.includes('Stop/Play')) {
            button.textContent = `⏸️ ${getText('stopPlay')}`;
        } else if (text.includes('เร็ว/ช้า') || text.includes('Fast/Slow')) {
            button.textContent = `⚡ ${getText('fastSlow')}`;
        }
    });
}
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const contrastToggle = document.getElementById('contrastToggle');
    const contrastIcon = document.getElementById('contrastIcon');
    const savedTheme = userPreferences.theme;
    const savedHighContrast = userPreferences.highContrast;
    
    // Apply theme and high contrast
    if (savedHighContrast) {
        document.documentElement.setAttribute('data-theme', 'contrast');
        contrastIcon.textContent = '🔆';
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
        contrastIcon.textContent = '🎨';
    }
    
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', toggleTheme);
    contrastToggle.addEventListener('click', toggleHighContrast);
    
    // Add keyboard support
    themeToggle.addEventListener('keydown', handleToggleKeyDown);
    contrastToggle.addEventListener('keydown', handleToggleKeyDown);
}

function toggleTheme() {
    // If high contrast is enabled, disable it first
    if (userPreferences.highContrast) {
        toggleHighContrast();
        return;
    }
    
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
    
    // Show contextual mascot tip
    setTimeout(() => {
        showContextualMascotTip('themeChanged');
    }, 500);
    
    // Announce theme change for screen readers
    announceToScreenReader(`Theme changed to ${newTheme} mode`);
}

function toggleHighContrast() {
    const currentContrast = userPreferences.highContrast;
    const newContrast = !currentContrast;
    const contrastIcon = document.getElementById('contrastIcon');
    
    userPreferences.highContrast = newContrast;
    
    if (newContrast) {
        document.documentElement.setAttribute('data-theme', 'contrast');
        contrastIcon.textContent = '🔆';
    } else {
        document.documentElement.setAttribute('data-theme', userPreferences.theme);
        contrastIcon.textContent = '🎨';
    }
    
    localStorage.setItem('painaidee-preferences', JSON.stringify(userPreferences));
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    // Show notification
    const message = newContrast ? 
        (userPreferences.language === 'th' ? 'เปิดโหมดสีคมชัดแล้ว' : 'High contrast mode enabled') :
        (userPreferences.language === 'th' ? 'ปิดโหมดสีคมชัดแล้ว' : 'High contrast mode disabled');
    
    showNotification(message, 'info');
    
    // Announce contrast change for screen readers
    announceToScreenReader(message);
}

// Handle keyboard navigation for toggle buttons
function handleToggleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.target.click();
    }
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
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
    
    // Add stable marker click handling
    addMarkerClickHandling();
    
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
    let dragStartTime = 0;
    let momentum = { x: 0, y: 0 };
    let lastDragX = 0, lastDragY = 0;
    
    globe.addEventListener('mousedown', (e) => {
        // Don't interfere with marker clicks
        if (e.target.classList.contains('marker')) {
            return;
        }
        
        isDragging = true;
        dragStartTime = Date.now();
        startX = e.clientX;
        startY = e.clientY;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        momentum = { x: 0, y: 0 };
        globe.style.cursor = 'grabbing';
        globe.style.animationPlayState = 'paused';
        globe.querySelector('.continents-layer').style.animationPlayState = 'paused';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Calculate momentum for physics
            momentum.x = e.clientX - lastDragX;
            momentum.y = e.clientY - lastDragY;
            
            currentRotationY += deltaX * 0.5;
            currentRotationX = Math.max(-45, Math.min(45, currentRotationX + deltaY * 0.5));
            
            globe.style.transform = `rotateY(${currentRotationY}deg) rotateX(${currentRotationX}deg)`;
            
            startX = e.clientX;
            startY = e.clientY;
            lastDragX = e.clientX;
            lastDragY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            const dragDuration = Date.now() - dragStartTime;
            isDragging = false;
            globe.style.cursor = 'grab';
            
            // Add momentum effect
            if (Math.abs(momentum.x) > 5 || Math.abs(momentum.y) > 5) {
                addMomentumEffect(momentum);
            }
            
            // If it was a very short drag (likely a click), don't prevent marker clicks
            if (dragDuration < 200) {
                e.stopPropagation();
            }
            
            if (isRotating) {
                // Resume rotation with current position
                globe.style.animationPlayState = 'running';
                globe.querySelector('.continents-layer').style.animationPlayState = 'running';
            }
        }
    });
    
    // Enhanced mouse wheel for zoom effect with smoother transitions
    globe.addEventListener('wheel', (e) => {
        e.preventDefault();
        const container = document.getElementById('globe3D');
        const currentScale = container.style.transform.match(/scale\(([^)]+)\)/);
        let scale = currentScale ? parseFloat(currentScale[1]) : 1;
        
        scale += e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.max(0.5, Math.min(2.5, scale));
        
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
        container.style.transition = 'transform 0.2s ease';
        
        // Show zoom level feedback
        showNotification(
            `🔍 ${userPreferences.language === 'th' ? 'ขยาย' : 'Zoom'}: ${Math.round(scale * 100)}%`,
            'info'
        );
    });
}

// Add momentum physics effect
function addMomentumEffect(momentum) {
    let frames = 30;
    const decay = 0.95;
    
    function animateMomentum() {
        if (frames > 0 && !isDragging) {
            const currentTransform = globe.style.transform || 'rotateY(0deg) rotateX(-10deg)';
            const yMatch = currentTransform.match(/rotateY\(([^)]+)deg\)/);
            const xMatch = currentTransform.match(/rotateX\(([^)]+)deg\)/);
            
            let currentY = yMatch ? parseFloat(yMatch[1]) : 0;
            let currentX = xMatch ? parseFloat(xMatch[1]) : -10;
            
            currentY += momentum.x * 0.3;
            currentX = Math.max(-45, Math.min(45, currentX + momentum.y * 0.3));
            
            globe.style.transform = `rotateY(${currentY}deg) rotateX(${currentX}deg)`;
            
            momentum.x *= decay;
            momentum.y *= decay;
            frames--;
            
            requestAnimationFrame(animateMomentum);
        }
    }
    
    animateMomentum();
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

function addMarkerClickHandling() {
    // Use event delegation for more reliable marker clicking
    globe.addEventListener('click', (e) => {
        // Check if click was on a marker or its area
        const marker = e.target.closest('.marker');
        if (marker) {
            e.stopPropagation();
            e.preventDefault();
            
            // Get location from marker classes
            const location = Array.from(marker.classList).find(cls => cls !== 'marker');
            if (location && locations[location]) {
                // Temporarily stabilize the marker
                marker.style.animation = 'none';
                marker.style.transform = 'scale(1.2)';
                marker.style.zIndex = '300';
                
                setTimeout(() => {
                    marker.style.transform = '';
                    marker.style.zIndex = '100';
                    marker.style.animation = 'markerPulse 2s ease-in-out infinite';
                }, 800);
                
                showInfo(location);
                updateStatus(`🎯 ${getText('description')}: ${getCurrentLocationName(locations[location])}`, `🎯 Opening info: ${getCurrentLocationName(locations[location])}`);
            }
        }
    });
    
    // Add hover effects for better user feedback
    globe.addEventListener('mouseover', (e) => {
        const marker = e.target.closest('.marker');
        if (marker) {
            marker.style.transform = 'scale(1.3)';
            marker.style.zIndex = '200';
            marker.style.animation = 'none'; // Stop animation on hover for stability
        }
    });
    
    globe.addEventListener('mouseout', (e) => {
        const marker = e.target.closest('.marker');
        if (marker) {
            marker.style.transform = '';
            marker.style.zIndex = '100';
            marker.style.animation = 'markerPulse 2s ease-in-out infinite'; // Resume animation
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
    
    // Find the toggle button and update its text
    const toggleButtons = document.querySelectorAll('button');
    toggleButtons.forEach(button => {
        if (button.textContent.includes('หยุด/เล่น')) {
            button.textContent = isRotating ? '⏸️ หยุด/เล่น' : '▶️ หยุด/เล่น';
        }
    });
    
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
            // Enhanced focus animation
            marker.style.animation = 'markerFocus 1s ease-in-out';
            setTimeout(() => {
                marker.style.animation = 'markerPulse 2s ease-in-out infinite';
            }, 1000);
        }
        
        updateStatus(`${info.emoji} ${info.name}`, `${info.emoji} ${info.nameEn}`);
        
        // Show contextual mascot tip with location info
        setTimeout(() => {
            showContextualMascotTip('locationFocus', { location: location });
        }, 1000);
        
        // Dispatch custom event for behavior monitoring
        window.dispatchEvent(new CustomEvent('locationFocused', { 
            detail: { location: location } 
        }));
        
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
    
    // Track search behavior for recommendations
    trackUserBehavior('search_query', { query: query });
    
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
        searchResults.innerHTML = `<div class="search-result-item">${getText('noResults')}</div>`;
    } else {
        filteredLocations.forEach(key => {
            const location = locations[key];
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `${location.emoji} ${getCurrentLocationName(location)}`;
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

// Enhanced category filtering system
let activeCategories = new Set();

function initializeCategoryFilter() {
    const categoryContainer = document.getElementById('categoryFilters');
    if (!categoryContainer) return;
    
    // Create category filter buttons
    Object.keys(locationCategories).forEach(categoryKey => {
        const category = locationCategories[categoryKey];
        const button = document.createElement('button');
        button.className = 'category-filter-btn';
        button.setAttribute('data-category', categoryKey);
        button.innerHTML = `${category.emoji} <span class="category-name">${getCurrentCategoryName(category)}</span>`;
        button.setAttribute('aria-label', `Filter by ${category.nameEn}`);
        
        button.addEventListener('click', () => toggleCategoryFilter(categoryKey));
        categoryContainer.appendChild(button);
    });
    
    // Add "All Categories" button
    const allButton = document.createElement('button');
    allButton.className = 'category-filter-btn active';
    allButton.setAttribute('data-category', 'all');
    allButton.innerHTML = `🌍 <span class="category-name">${userPreferences.language === 'th' ? 'ทั้งหมด' : 'All'}</span>`;
    allButton.setAttribute('aria-label', 'Show all categories');
    allButton.addEventListener('click', () => showAllCategories());
    categoryContainer.insertBefore(allButton, categoryContainer.firstChild);
}

function getCurrentCategoryName(category) {
    return userPreferences.language === 'th' ? category.nameTh : category.nameEn;
}

function toggleCategoryFilter(categoryKey) {
    const button = document.querySelector(`[data-category="${categoryKey}"]`);
    const allButton = document.querySelector('[data-category="all"]');
    
    if (activeCategories.has(categoryKey)) {
        activeCategories.delete(categoryKey);
        button.classList.remove('active');
    } else {
        activeCategories.add(categoryKey);
        button.classList.add('active');
        allButton.classList.remove('active');
    }
    
    if (activeCategories.size === 0) {
        showAllCategories();
    } else {
        applyLocationFilters();
    }
}

function showAllCategories() {
    activeCategories.clear();
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-category="all"]').classList.add('active');
    applyLocationFilters();
}

function applyLocationFilters() {
    const locationButtons = document.querySelectorAll('.button-row');
    
    locationButtons.forEach(row => {
        const locationBtn = row.querySelector('button[onclick]');
        if (!locationBtn) return;
        
        const onclick = locationBtn.getAttribute('onclick');
        const locationKey = onclick.match(/focusLocation\('(.+)'\)/)?.[1];
        
        if (!locationKey || !locations[locationKey]) return;
        
        const location = locations[locationKey];
        const shouldShow = activeCategories.size === 0 || 
                          (location.categories && location.categories.some(cat => activeCategories.has(cat)));
        
        row.style.display = shouldShow ? 'flex' : 'none';
    });
    
    // Update filtered count
    const visibleCount = document.querySelectorAll('.button-row[style*="flex"], .button-row:not([style])').length;
    const totalCount = Object.keys(locations).length;
    
    showNotification(
        userPreferences.language === 'th' ? 
        `🎯 แสดง ${visibleCount} จาก ${totalCount} สถานที่` :
        `🎯 Showing ${visibleCount} of ${totalCount} locations`,
        'info'
    );
}

// Enhanced location comparison system
function initializeLocationComparison() {
    const compareBtn = document.querySelector('button[onclick*="เปรียบเทียบ"]') ||
                      document.querySelector('button[onclick*="comparison"]');
    
    if (compareBtn) {
        compareBtn.addEventListener('click', performLocationComparison);
    }
    
    // Replace button onclick with our enhanced function
    const comparisonButton = document.querySelector('.comparison-section button:last-child');
    if (comparisonButton) {
        comparisonButton.onclick = performLocationComparison;
    }
}

function performLocationComparison() {
    const location1Select = document.querySelector('.comparison-section select:first-of-type');
    const location2Select = document.querySelector('.comparison-section select:last-of-type');
    
    if (!location1Select || !location2Select) {
        showNotification(
            userPreferences.language === 'th' ? 
            '❌ ไม่พบเครื่องมือเปรียบเทียบ' : 
            '❌ Comparison tool not found',
            'error'
        );
        return;
    }
    
    const loc1Key = location1Select.value;
    const loc2Key = location2Select.value;
    
    if (loc1Key === loc2Key || !loc1Key || !loc2Key || 
        loc1Key.includes('เลือก') || loc2Key.includes('เลือก') ||
        loc1Key.includes('Select') || loc2Key.includes('Select')) {
        showNotification(
            userPreferences.language === 'th' ? 
            '⚠️ กรุณาเลือกสถานที่ 2 แห่งที่แตกต่างกัน' : 
            '⚠️ Please select 2 different locations',
            'warning'
        );
        return;
    }
    
    const location1 = locations[loc1Key];
    const location2 = locations[loc2Key];
    
    if (!location1 || !location2) {
        showNotification(
            userPreferences.language === 'th' ? 
            '❌ ไม่พบข้อมูลสถานที่' : 
            '❌ Location data not found',
            'error'
        );
        return;
    }
    
    // Calculate distance and travel info
    let distanceInfo = '';
    let travelTime = '';
    let recommendedTransport = '';
    
    if (location1.coordinates && location2.coordinates) {
        const distance = calculateDistance(
            location1.coordinates[1], location1.coordinates[0],
            location2.coordinates[1], location2.coordinates[0]
        );
        
        travelTime = calculateTravelTime(distance, 'car');
        const estimatedCost = estimateTravelCost(distance, 'car');
        
        if (distance > 500) {
            recommendedTransport = userPreferences.language === 'th' ? 'เครื่องบิน' : 'Airplane';
        } else if (distance > 200) {
            recommendedTransport = userPreferences.language === 'th' ? 'รถบัส' : 'Bus';
        } else {
            recommendedTransport = userPreferences.language === 'th' ? 'รถยนต์' : 'Car';
        }
        
        distanceInfo = `
            <div class="comparison-distance">
                <h4>📏 ${getText('distance')}</h4>
                <p><strong>${distance} ${getText('km')}</strong></p>
                <p>⏱️ ${userPreferences.language === 'th' ? 'เวลาเดินทาง' : 'Travel Time'}: ${travelTime}</p>
                <p>🚗 ${userPreferences.language === 'th' ? 'แนะนำ' : 'Recommended'}: ${recommendedTransport}</p>
                <p>💰 ${userPreferences.language === 'th' ? 'ประมาณค่าใช้จ่าย' : 'Estimated Cost'}: ${estimatedCost} THB</p>
            </div>
        `;
    }
    
    // Create comparison modal
    const modalHtml = `
        <div class="comparison-modal" id="comparisonModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center;">
            <div class="comparison-modal-content" style="background: var(--panel-bg); border-radius: var(--radius-xl); padding: 2rem; max-width: 90vw; max-height: 90vh; overflow-y: auto; border: 1px solid var(--glass-border);">
                <div class="comparison-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: var(--panel-text);">⚖️ ${userPreferences.language === 'th' ? 'เปรียบเทียบสถานที่' : 'Location Comparison'}</h2>
                    <button class="close-btn" onclick="closeComparisonModal()" style="background: none; border: none; font-size: 1.5rem; color: var(--panel-text); cursor: pointer;">×</button>
                </div>
                
                <div class="comparison-content">
                    <div class="location-comparison" style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div class="location-card" style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-lg); color: var(--panel-text);">
                            <h3 style="margin-bottom: 1rem; color: var(--accent-color);">${location1.emoji} ${getCurrentLocationName(location1)}</h3>
                            <div class="location-details">
                                <p><strong>📍 ${getText('description')}:</strong></p>
                                <p style="margin-bottom: 1rem; opacity: 0.9;">${getCurrentLocationDescription(location1)}</p>
                                
                                <p><strong>🌤️ ${getText('weather')}:</strong> ${location1.weather || 'N/A'}</p>
                                <p style="margin-bottom: 1rem;"><strong>📅 ${getText('bestTime')}:</strong> ${location1.bestTime || 'Year Round'}</p>
                                
                                <div class="attractions-list" style="margin-bottom: 1rem;">
                                    <p><strong>🎯 ${getText('attractionsTitle')}:</strong></p>
                                    <ul style="margin-left: 1rem;">
                                        ${location1.attractions ? location1.attractions.slice(0, 3).map((attraction, index) => 
                                            `<li>${getCurrentAttractionName(location1, index)}</li>`
                                        ).join('') : '<li>N/A</li>'}
                                    </ul>
                                </div>
                                
                                <div class="categories-display">
                                    <p><strong>🏷️ ${userPreferences.language === 'th' ? 'ประเภท' : 'Categories'}:</strong></p>
                                    <div class="category-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                                        ${location1.categories ? location1.categories.map(cat => 
                                            `<span class="category-tag" style="background: var(--accent-color); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem;">${locationCategories[cat]?.emoji} ${getCurrentCategoryName(locationCategories[cat])}</span>`
                                        ).join('') : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="comparison-divider" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 150px;">
                            <div class="vs-badge" style="background: var(--accent-color); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 1rem;">VS</div>
                            ${distanceInfo}
                        </div>
                        
                        <div class="location-card" style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-lg); color: var(--panel-text);">
                            <h3 style="margin-bottom: 1rem; color: var(--accent-color);">${location2.emoji} ${getCurrentLocationName(location2)}</h3>
                            <div class="location-details">
                                <p><strong>📍 ${getText('description')}:</strong></p>
                                <p style="margin-bottom: 1rem; opacity: 0.9;">${getCurrentLocationDescription(location2)}</p>
                                
                                <p><strong>🌤️ ${getText('weather')}:</strong> ${location2.weather || 'N/A'}</p>
                                <p style="margin-bottom: 1rem;"><strong>📅 ${getText('bestTime')}:</strong> ${location2.bestTime || 'Year Round'}</p>
                                
                                <div class="attractions-list" style="margin-bottom: 1rem;">
                                    <p><strong>🎯 ${getText('attractionsTitle')}:</strong></p>
                                    <ul style="margin-left: 1rem;">
                                        ${location2.attractions ? location2.attractions.slice(0, 3).map((attraction, index) => 
                                            `<li>${getCurrentAttractionName(location2, index)}</li>`
                                        ).join('') : '<li>N/A</li>'}
                                    </ul>
                                </div>
                                
                                <div class="categories-display">
                                    <p><strong>🏷️ ${userPreferences.language === 'th' ? 'ประเภท' : 'Categories'}:</strong></p>
                                    <div class="category-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                                        ${location2.categories ? location2.categories.map(cat => 
                                            `<span class="category-tag" style="background: var(--accent-color); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem;">${locationCategories[cat]?.emoji} ${getCurrentCategoryName(locationCategories[cat])}</span>`
                                        ).join('') : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comparison-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button onclick="focusLocation('${loc1Key}'); closeComparisonModal();" style="background: var(--button-bg); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-lg); cursor: pointer;">
                            📍 ${userPreferences.language === 'th' ? 'ดู' : 'View'} ${getCurrentLocationName(location1)}
                        </button>
                        <button onclick="focusLocation('${loc2Key}'); closeComparisonModal();" style="background: var(--button-bg); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-lg); cursor: pointer;">
                            📍 ${userPreferences.language === 'th' ? 'ดู' : 'View'} ${getCurrentLocationName(location2)}
                        </button>
                        <button onclick="closeComparisonModal();" style="background: var(--card-bg); color: var(--panel-text); border: 1px solid var(--glass-border); padding: 0.75rem 1.5rem; border-radius: var(--radius-lg); cursor: pointer;">
                            ✕ ${userPreferences.language === 'th' ? 'ปิด' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('comparisonModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Highlight compared locations on map
    highlightComparisonLocations(loc1Key, loc2Key);
    
    showNotification(
        userPreferences.language === 'th' ? 
        `⚖️ เปรียบเทียบ ${getCurrentLocationName(location1)} และ ${getCurrentLocationName(location2)}` :
        `⚖️ Comparing ${getCurrentLocationName(location1)} and ${getCurrentLocationName(location2)}`,
        'info'
    );
}

function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    if (modal) {
        modal.remove();
    }
    
    // Remove location highlights
    document.querySelectorAll('.comparison-highlight').forEach(el => {
        el.classList.remove('comparison-highlight');
    });
}

// Add missing highlight function
function highlightComparisonLocations(loc1Key, loc2Key) {
    // Remove any existing highlights first
    document.querySelectorAll('.comparison-highlight').forEach(el => {
        el.classList.remove('comparison-highlight');
    });
    
    // Add highlights to the compared locations
    const marker1 = document.querySelector(`.marker.${loc1Key}`);
    const marker2 = document.querySelector(`.marker.${loc2Key}`);
    
    if (marker1) marker1.classList.add('comparison-highlight');
    if (marker2) marker2.classList.add('comparison-highlight');
}

// Favorites system
function initializeFavorites() {
    updateFavoritesDisplay();
    updateFavoriteButtons();
}

function toggleFavorite(locationKey) {
    const index = favorites.indexOf(locationKey);
    const action = index === -1 ? 'add' : 'remove';
    
    if (index === -1) {
        favorites.push(locationKey);
        showNotification(getText('addedFavorite'), 'success');
        
        // Trigger contextual mascot response for adding favorites
        setTimeout(() => {
            showContextualMascotTip('favoriteAdded', { location: locationKey });
        }, 500);
    } else {
        favorites.splice(index, 1);
        showNotification(getText('removedFavorite'), 'info');
    }
    
    // Track favorite action for recommendations
    trackUserBehavior('favorite_toggle', {
        location: locationKey,
        action: action
    });
    
    // Dispatch event for behavior monitoring
    window.dispatchEvent(new CustomEvent('favoriteToggled', { 
        detail: { location: locationKey, action: action } 
    }));
    
    localStorage.setItem('painaidee-favorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
    updateFavoriteButtons();
    
    // Update recommendations after favorite change
    setTimeout(() => {
        updateRecommendationsUI();
    }, 300);
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

// Enhanced weather information (simulated) with error handling
function updateWeatherInfo() {
    const weatherInfo = document.getElementById('weatherInfo');
    if (!weatherInfo) return;
    
    // Simulate weather API call with error handling
    try {
        setTimeout(() => {
            const weatherData = {
                bangkok: "30°C ☀️ แจ่มใส / Sunny",
                chiangmai: "25°C 🌤️ เย็นสบาย / Cool", 
                phuket: "28°C 🌊 ลมทะเล / Sea Breeze",
                ayutthaya: "31°C ☀️ ร้อน / Hot",
                krabi: "27°C 🌴 ชื้น / Humid",
                sukhothai: "29°C 🌤️ ปกติ / Normal",
                chonburi: "30°C 🌊 ลมทะเล / Coastal",
                kanchanaburi: "28°C 🌲 เย็น / Cool",
                lopburi: "32°C ☀️ ร้อน / Hot",
                huahin: "29°C 🌊 สบาย / Pleasant",
                kohsamui: "28°C 🌴 ชื้น / Tropical",
                chiangrai: "24°C 🌤️ เย็น / Cool",
                pattaya: "30°C 🌊 ชื้น / Humid"
            };
            
            // Rotate through different destinations every time
            const locations = Object.keys(weatherData);
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            const locationInfo = locations[randomLocation];
            
            if (locationInfo && weatherData[randomLocation]) {
                const displayName = locations[randomLocation] ? getCurrentLocationName(locations[randomLocation]) : randomLocation;
                weatherInfo.innerHTML = `🌤️ ${displayName}: ${weatherData[randomLocation]}`;
            } else {
                weatherInfo.innerHTML = `🌤️ สภาพอากาศ: ปกติดี / Weather: Normal`;
            }
            
            // Update weather every 10 seconds
            setTimeout(updateWeatherInfo, 10000);
        }, 2000);
    } catch (error) {
        console.warn('Weather update failed:', error);
        weatherInfo.innerHTML = `🌤️ สภาพอากาศ: ไม่สามารถโหลดได้ / Weather: Unable to load`;
    }
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
    
    // Don't interfere with input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Number keys for quick location access - Enhanced with new destinations
    const locationKeys = {
        '1': 'bangkok',
        '2': 'chiangmai', 
        '3': 'phuket',
        '4': 'ayutthaya',
        '5': 'krabi',
        '6': 'sukhothai',
        '7': 'chonburi',
        '8': 'kanchanaburi',
        '9': 'lopburi',
        '0': 'world',
        'q': 'huahin',
        'w': 'kohsamui',
        'e': 'chiangrai',
        'r': 'pattaya'
    };
    
    if (locationKeys[e.key]) {
        focusLocation(locationKeys[e.key]);
        const locationName = locations[locationKeys[e.key]] ? getCurrentLocationName(locations[locationKeys[e.key]]) : getText('world');
        showNotification(
            userPreferences.language === 'th' ? `🎯 ไปยัง: ${locationName}` : `🎯 Going to: ${locationName}`,
            'info'
        );
        return;
    }
    
    // Space bar to toggle rotation
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        toggleRotation();
        return;
    }
    
    // Enter key to open focused marker info
    if (e.key === 'Enter' && e.target.classList.contains('marker')) {
        e.preventDefault();
        const location = Array.from(e.target.classList).find(cls => cls !== 'marker');
        if (location) {
            showInfo(location);
        }
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

// Trip planning system
function generateTripPlan() {
    const checkboxes = document.querySelectorAll('#destinationCheckboxes input[type="checkbox"]:checked');
    const selectedDestinations = Array.from(checkboxes).map(cb => cb.value);
    const tripDuration = parseInt(document.getElementById('tripDuration').value);
    
    if (selectedDestinations.length === 0) {
        showNotification(
            userPreferences.language === 'th' ? 'กรุณาเลือกสถานที่อย่างน้อย 1 แห่ง' : 'Please select at least 1 destination',
            'warning'
        );
        return;
    }
    
    if (selectedDestinations.length > tripDuration) {
        showNotification(
            userPreferences.language === 'th' ? 'จำนวนสถานที่มากเกินไปสำหรับระยะเวลาที่เลือก' : 'Too many destinations for selected duration',
            'warning'
        );
        return;
    }
    
    const tripPlan = createOptimalTripPlan(selectedDestinations, tripDuration);
    displayTripPlan(tripPlan);
    
    // Animate through the destinations on the globe
    animateTripRoute(selectedDestinations);
    
    showNotification(
        userPreferences.language === 'th' ? 'สร้างแผนการเดินทางสำเร็จ!' : 'Trip plan created successfully!',
        'success'
    );
}

// Create optimal trip plan with suggested itinerary
function createOptimalTripPlan(destinations, duration) {
    // Get recommended days for each destination
    const recommendedDays = {
        bangkok: 2,
        chiangmai: 3,
        phuket: 3,
        ayutthaya: 1,
        krabi: 3,
        sukhothai: 1,
        chonburi: 2,
        kanchanaburi: 2,
        lopburi: 1,
        huahin: 2,
        kohsamui: 3,
        chiangrai: 2,
        pattaya: 2
    };
    
    // Optimize route to minimize travel time
    const optimizedOrder = optimizeDestinationOrder(destinations);
    
    // Calculate days allocation
    const totalRecommendedDays = optimizedOrder.reduce((sum, dest) => sum + recommendedDays[dest], 0);
    const scaleFactor = duration / totalRecommendedDays;
    
    let currentDay = 1;
    const itinerary = [];
    let totalDistance = 0;
    let totalCost = 0;
    
    for (let i = 0; i < optimizedOrder.length; i++) {
        const destination = optimizedOrder[i];
        const location = locations[destination];
        const allocatedDays = Math.max(1, Math.round(recommendedDays[destination] * scaleFactor));
        
        // Calculate travel from previous destination
        let travelInfo = null;
        if (i > 0) {
            const previousDest = optimizedOrder[i - 1];
            const route = planRoute(previousDest, destination);
            if (route) {
                totalDistance += route.distance;
                totalCost += route.estimatedCost;
                travelInfo = route;
            }
        }
        
        itinerary.push({
            destination: destination,
            location: location,
            startDay: currentDay,
            endDay: currentDay + allocatedDays - 1,
            days: allocatedDays,
            travelInfo: travelInfo
        });
        
        currentDay += allocatedDays;
    }
    
    return {
        itinerary: itinerary,
        totalDays: duration,
        totalDestinations: destinations.length,
        totalDistance: totalDistance,
        totalCost: totalCost,
        optimizedOrder: optimizedOrder
    };
}

// Optimize destination order to minimize travel distance
function optimizeDestinationOrder(destinations) {
    if (destinations.length <= 1) return destinations;
    
    // Simple nearest neighbor algorithm starting from Bangkok if included
    let startPoint = destinations.includes('bangkok') ? 'bangkok' : destinations[0];
    let remaining = destinations.filter(d => d !== startPoint);
    let route = [startPoint];
    
    while (remaining.length > 0) {
        let currentLocation = route[route.length - 1];
        let nearest = null;
        let shortestDistance = Infinity;
        
        remaining.forEach(dest => {
            const current = locations[currentLocation];
            const target = locations[dest];
            
            if (current && target && current.coordinates && target.coordinates) {
                const distance = calculateDistance(
                    current.coordinates[1], current.coordinates[0],
                    target.coordinates[1], target.coordinates[0]
                );
                
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearest = dest;
                }
            }
        });
        
        if (nearest) {
            route.push(nearest);
            remaining = remaining.filter(d => d !== nearest);
        } else {
            // Fallback: add remaining destinations in original order
            route.push(...remaining);
            break;
        }
    }
    
    return route;
}

// Display trip plan
function displayTripPlan(tripPlan) {
    const tripResult = document.getElementById('tripPlanResult');
    const isThaiLang = userPreferences.language === 'th';
    
    let itineraryHTML = `
        <h5>${isThaiLang ? '🗓️ แผนการเดินทาง' : '🗓️ Trip Itinerary'}</h5>
    `;
    
    tripPlan.itinerary.forEach((item, index) => {
        const dayText = item.days === 1 ? 
            `${isThaiLang ? 'วันที่' : 'Day'} ${item.startDay}` : 
            `${isThaiLang ? 'วันที่' : 'Days'} ${item.startDay}-${item.endDay}`;
        
        let travelHTML = '';
        if (item.travelInfo && index > 0) {
            const transport = item.travelInfo.recommendedTransport;
            const transportIcons = { car: '🚗', bus: '🚌', train: '🚆', plane: '✈️' };
            travelHTML = `
                <div style="margin-bottom: var(--spacing-sm); font-size: var(--font-size-xs); color: var(--accent-color);">
                    ${transportIcons[transport]} ${isThaiLang ? 'เดินทาง' : 'Travel'}: ${item.travelInfo.distance}km, ${item.travelInfo.travelTime}
                </div>
            `;
        }
        
        itineraryHTML += `
            <div class="trip-day">
                <div class="trip-day-header">${dayText}: ${item.location.emoji} ${isThaiLang ? item.location.name : item.location.nameEn}</div>
                ${travelHTML}
                <div class="trip-day-details">
                    <p><strong>${isThaiLang ? 'กิจกรรมแนะนำ:' : 'Recommended Activities:'}</strong></p>
                    <ul>
                        ${item.location.attractions ? item.location.attractions.slice(0, 3).map((attraction, i) => 
                            `<li>${isThaiLang ? attraction : (item.location.attractionsEn && item.location.attractionsEn[i] ? item.location.attractionsEn[i] : attraction)}</li>`
                        ).join('') : `<li>${isThaiLang ? 'สำรวจเมือง' : 'Explore the city'}</li>`}
                    </ul>
                    ${item.location.travelTips ? `<p><small>💡 ${item.location.travelTips}</small></p>` : ''}
                </div>
            </div>
        `;
    });
    
    // Enhanced budget breakdown
    const budgetBreakdown = calculateDetailedBudget(tripPlan);
    
    itineraryHTML += `
        <div class="trip-summary">
            <h5>${isThaiLang ? '📊 สรุปการเดินทาง' : '📊 Trip Summary'}</h5>
            <div class="trip-stats">
                <div><strong>${isThaiLang ? 'ระยะเวลา:' : 'Duration:'}</strong> ${tripPlan.totalDays} ${isThaiLang ? 'วัน' : 'days'}</div>
                <div><strong>${isThaiLang ? 'สถานที่:' : 'Destinations:'}</strong> ${tripPlan.totalDestinations} ${isThaiLang ? 'แห่ง' : 'places'}</div>
                <div><strong>${isThaiLang ? 'ระยะทาง:' : 'Total Distance:'}</strong> ${tripPlan.totalDistance}km</div>
                <div><strong>${isThaiLang ? 'ค่าใช้จ่าย:' : 'Est. Cost:'}</strong> ฿${tripPlan.totalCost.toLocaleString()}</div>
            </div>
            
            <div class="budget-breakdown">
                <h6>${isThaiLang ? '💰 รายละเอียดค่าใช้จ่าย' : '💰 Detailed Budget Breakdown'}</h6>
                <div class="budget-items">
                    <div class="budget-item">
                        <span>🚗 ${isThaiLang ? 'การเดินทาง' : 'Transportation'}:</span>
                        <span>฿${budgetBreakdown.transportation.toLocaleString()}</span>
                    </div>
                    <div class="budget-item">
                        <span>🏨 ${isThaiLang ? 'ที่พัก' : 'Accommodation'}:</span>
                        <span>฿${budgetBreakdown.accommodation.toLocaleString()}</span>
                    </div>
                    <div class="budget-item">
                        <span>🍽️ ${isThaiLang ? 'อาหาร' : 'Food & Dining'}:</span>
                        <span>฿${budgetBreakdown.food.toLocaleString()}</span>
                    </div>
                    <div class="budget-item">
                        <span>🎯 ${isThaiLang ? 'กิจกรรม' : 'Activities'}:</span>
                        <span>฿${budgetBreakdown.activities.toLocaleString()}</span>
                    </div>
                    <div class="budget-item">
                        <span>🛍️ ${isThaiLang ? 'ช้อปปิ้ง' : 'Shopping'}:</span>
                        <span>฿${budgetBreakdown.shopping.toLocaleString()}</span>
                    </div>
                    <div class="budget-item total-budget">
                        <span><strong>${isThaiLang ? 'รวมทั้งหมด' : 'Total'}:</strong></span>
                        <span><strong>฿${budgetBreakdown.total.toLocaleString()}</strong></span>
                    </div>
                </div>
                
                <div class="budget-tips">
                    <h6>${isThaiLang ? '💡 เคล็ดลับประหยัด' : '💡 Money Saving Tips'}</h6>
                    <ul>
                        <li>${isThaiLang ? 'จองล่วงหน้าเพื่อราคาดีกว่า' : 'Book in advance for better prices'}</li>
                        <li>${isThaiLang ? 'ใช้ระบบขนส่งสาธารณะ' : 'Use public transportation'}</li>
                        <li>${isThaiLang ? 'ลองอาหารท้องถิ่น' : 'Try local street food'}</li>
                        <li>${isThaiLang ? 'เปรียบเทียบราคาที่พัก' : 'Compare accommodation prices'}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    tripResult.innerHTML = itineraryHTML;
    tripResult.style.display = 'block';
}

// Enhanced budget calculation with detailed breakdown
function calculateDetailedBudget(tripPlan) {
    const days = tripPlan.totalDays;
    
    // Budget categories per person per day (in THB)
    const dailyRates = {
        accommodation: {
            budget: 800,      // Hostels, budget hotels
            mid: 2000,        // Mid-range hotels
            luxury: 5000      // Luxury hotels
        },
        food: {
            budget: 500,      // Street food, local restaurants
            mid: 1200,        // Nice restaurants
            luxury: 2500      // Fine dining
        },
        activities: {
            budget: 300,      // Free/cheap activities
            mid: 800,         // Tours, attractions
            luxury: 2000      // Premium experiences
        },
        shopping: {
            budget: 200,      // Souvenirs
            mid: 800,         // Shopping
            luxury: 2000      // Luxury shopping
        }
    };
    
    // Determine budget level based on total destinations (more destinations = higher budget)
    const budgetLevel = tripPlan.totalDestinations <= 2 ? 'budget' : 
                       tripPlan.totalDestinations <= 4 ? 'mid' : 'luxury';
    
    const accommodation = dailyRates.accommodation[budgetLevel] * days;
    const food = dailyRates.food[budgetLevel] * days;
    const activities = dailyRates.activities[budgetLevel] * days;
    const shopping = dailyRates.shopping[budgetLevel] * days;
    const transportation = tripPlan.totalCost; // Already calculated transportation cost
    
    const total = accommodation + food + activities + shopping + transportation;
    
    return {
        transportation,
        accommodation,
        food,
        activities,
        shopping,
        total
    };
}

// Animate through trip destinations on the globe
function animateTripRoute(destinations) {
    let currentIndex = 0;
    
    function showNextDestination() {
        if (currentIndex < destinations.length) {
            focusLocation(destinations[currentIndex]);
            currentIndex++;
            
            if (currentIndex < destinations.length) {
                setTimeout(showNextDestination, 1500);
            }
        }
    }
    
    showNextDestination();
}

// Route calculation function
function calculateRoute() {
    const fromSelect = document.getElementById('fromLocation');
    const toSelect = document.getElementById('toLocation');
    const routeResult = document.getElementById('routeResult');
    
    const fromLocation = fromSelect.value;
    const toLocation = toSelect.value;
    
    if (!fromLocation || !toLocation) {
        showNotification(
            userPreferences.language === 'th' ? 'กรุณาเลือกจุดเริ่มต้นและปลายทาง' : 'Please select origin and destination',
            'warning'
        );
        return;
    }
    
    if (fromLocation === toLocation) {
        showNotification(
            userPreferences.language === 'th' ? 'จุดเริ่มต้นและปลายทางต้องไม่เหมือนกัน' : 'Origin and destination must be different',
            'warning'
        );
        return;
    }
    
    const route = planRoute(fromLocation, toLocation);
    
    if (!route) {
        showNotification(
            userPreferences.language === 'th' ? 'ไม่สามารถคำนวณเส้นทางได้' : 'Cannot calculate route',
            'error'
        );
        return;
    }
    
    displayRoute(route);
    
    // Show route on globe by focusing both locations
    focusLocation(fromLocation);
    setTimeout(() => focusLocation(toLocation), 1000);
    
    showNotification(
        userPreferences.language === 'th' ? 'คำนวณเส้นทางสำเร็จ!' : 'Route calculated successfully!',
        'success'
    );
}

// Display route information
function displayRoute(route) {
    const routeResult = document.getElementById('routeResult');
    
    const transportIcons = {
        car: '🚗',
        bus: '🚌', 
        train: '🚆',
        plane: '✈️'
    };
    
    const transportNames = {
        th: {
            car: 'รถยนต์',
            bus: 'รถบัส',
            train: 'รถไฟ',
            plane: 'เครื่องบิน'
        },
        en: {
            car: 'Car',
            bus: 'Bus',
            train: 'Train',
            plane: 'Plane'
        }
    };
    
    const currentLang = userPreferences.language;
    const isThaiLang = currentLang === 'th';
    
    routeResult.innerHTML = `
        <h5>${isThaiLang ? '📍 เส้นทางการเดินทาง' : '📍 Travel Route'}</h5>
        <div class="route-info">
            <div class="route-info-item">
                <strong>${isThaiLang ? 'จาก:' : 'From:'}</strong>
                <span>${route.from.emoji} ${isThaiLang ? route.from.name : route.from.nameEn}</span>
            </div>
            <div class="route-info-item">
                <strong>${isThaiLang ? 'ไป:' : 'To:'}</strong>
                <span>${route.to.emoji} ${isThaiLang ? route.to.name : route.to.nameEn}</span>
            </div>
            <div class="route-info-item">
                <strong>${isThaiLang ? 'ระยะทาง:' : 'Distance:'}</strong>
                <span>📏 ${route.distance} ${isThaiLang ? 'กิโลเมตร' : 'km'}</span>
            </div>
            <div class="route-info-item">
                <strong>${isThaiLang ? 'เวลาเดินทาง:' : 'Travel Time:'}</strong>
                <span>⏱️ ${route.travelTime}</span>
            </div>
            <div class="route-info-item">
                <strong>${isThaiLang ? 'แนะนำ:' : 'Recommended:'}</strong>
                <span>${transportIcons[route.recommendedTransport]} ${transportNames[currentLang][route.recommendedTransport]}</span>
            </div>
            <div class="route-info-item">
                <strong>${isThaiLang ? 'ค่าใช้จ่าย:' : 'Est. Cost:'}</strong>
                <span>💰 ฿${route.estimatedCost.toLocaleString()}</span>
            </div>
        </div>
    `;
    
    routeResult.style.display = 'block';
    
    // Add visual route line on the globe
    addRouteVisualization(route.from, route.to);
}

// New function to add visual route lines on the globe
function addRouteVisualization(fromLocation, toLocation) {
    // Remove any existing route lines
    clearRouteLines();
    
    // Find location keys
    const fromKey = Object.keys(locations).find(key => locations[key] === fromLocation);
    const toKey = Object.keys(locations).find(key => locations[key] === toLocation);
    
    // Get marker elements
    const fromMarker = document.querySelector(`.marker.${fromKey}`);
    const toMarker = document.querySelector(`.marker.${toKey}`);
    
    if (!fromMarker || !toMarker) return;
    
    // Get globe container
    const globe = document.querySelector('.globe-sphere');
    if (!globe) return;
    
    // Create route line container
    const routeContainer = document.createElement('div');
    routeContainer.className = 'route-container';
    routeContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
    `;
    
    // Create animated route line
    const routeLine = document.createElement('div');
    routeLine.className = 'route-line';
    
    // Get marker positions (from CSS positioning)
    const fromStyle = window.getComputedStyle(fromMarker);
    const toStyle = window.getComputedStyle(toMarker);
    
    const fromX = parseFloat(fromStyle.left);
    const fromY = parseFloat(fromStyle.top);
    const toX = parseFloat(toStyle.left);
    const toY = parseFloat(toStyle.top);
    
    // Calculate distance and angle
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Style the route line
    routeLine.style.cssText = `
        position: absolute;
        left: ${fromX}%;
        top: ${fromY}%;
        width: ${distance}%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-color), #FFD700, var(--accent-color));
        transform: rotate(${angle}deg);
        transform-origin: left center;
        border-radius: 2px;
        animation: routeGlow 2s ease-in-out infinite, routePulse 3s ease-in-out infinite;
        box-shadow: 0 0 10px var(--accent-color);
    `;
    
    // Add travel direction arrow
    const arrow = document.createElement('div');
    arrow.className = 'route-arrow';
    arrow.style.cssText = `
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid var(--accent-color);
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        animation: arrowBlink 1.5s ease-in-out infinite;
    `;
    
    routeLine.appendChild(arrow);
    routeContainer.appendChild(routeLine);
    globe.appendChild(routeContainer);
    
    // Auto-remove route line after 10 seconds
    setTimeout(() => {
        clearRouteLines();
    }, 10000);
}

// Function to clear existing route lines
function clearRouteLines() {
    const globe = document.querySelector('.globe-sphere');
    if (globe) {
        const existingRoutes = globe.querySelectorAll('.route-container');
        existingRoutes.forEach(route => route.remove());
    }
}

// Enhanced Location Comparison Feature
function compareLocations() {
    const location1Key = document.getElementById('compareLocation1').value;
    const location2Key = document.getElementById('compareLocation2').value;
    const comparisonResult = document.getElementById('comparisonResult');
    
    if (!location1Key || !location2Key) {
        showNotification(
            userPreferences.language === 'th' ? 'กรุณาเลือกสถานที่ 2 แห่งเพื่อเปรียบเทียบ' : 'Please select 2 locations to compare',
            'warning'
        );
        return;
    }
    
    if (location1Key === location2Key) {
        showNotification(
            userPreferences.language === 'th' ? 'กรุณาเลือกสถานที่ที่แตกต่างกัน' : 'Please select different locations',
            'warning'
        );
        return;
    }
    
    const location1 = locations[location1Key];
    const location2 = locations[location2Key];
    const isThaiLang = userPreferences.language === 'th';
    
    // Calculate distance between locations
    const distance = location1.coordinates && location2.coordinates ? 
        calculateDistance(
            location1.coordinates[1], location1.coordinates[0],
            location2.coordinates[1], location2.coordinates[0]
        ) : 'N/A';
    
    // Generate comparison data
    const comparison = generateLocationComparison(location1, location2);
    
    const comparisonHTML = `
        <h5>${isThaiLang ? '⚖️ เปรียบเทียบสถานที่' : '⚖️ Location Comparison'}</h5>
        
        <div class="comparison-cards">
            <div class="comparison-card">
                <div class="location-header">
                    <h6>${location1.emoji} ${isThaiLang ? location1.name : location1.nameEn}</h6>
                </div>
                <div class="comparison-details">
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'สภาพอากาศ:' : 'Weather:'}</span>
                        <span>${location1.weather || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'ช่วงเวลาที่ดี:' : 'Best Time:'}</span>
                        <span>${location1.bestTime || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'สถานที่ท่องเที่ยว:' : 'Attractions:'}</span>
                        <span>${location1.attractions ? location1.attractions.length : 0} ${isThaiLang ? 'แห่ง' : 'places'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'ประเภท:' : 'Type:'}</span>
                        <span>${comparison.location1.type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'ค่าใช้จ่าย:' : 'Cost Level:'}</span>
                        <span>${comparison.location1.costLevel}</span>
                    </div>
                </div>
            </div>
            
            <div class="vs-divider">
                <div class="vs-circle">VS</div>
                <div class="distance-info">
                    📏 ${distance !== 'N/A' ? distance + ' km' : 'N/A'}
                </div>
            </div>
            
            <div class="comparison-card">
                <div class="location-header">
                    <h6>${location2.emoji} ${isThaiLang ? location2.name : location2.nameEn}</h6>
                </div>
                <div class="comparison-details">
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'สภาพอากาศ:' : 'Weather:'}</span>
                        <span>${location2.weather || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'ช่วงเวลาที่ดี:' : 'Best Time:'}</span>
                        <span>${location2.bestTime || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'สถานที่ท่องเที่ยว:' : 'Attractions:'}</span>
                        <span>${location2.attractions ? location2.attractions.length : 0} ${isThaiLang ? 'แห่ง' : 'places'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'ประเภท:' : 'Type:'}</span>
                        <span>${comparison.location2.type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${isThaiLang ? 'ค่าใช้จ่าย:' : 'Cost Level:'}</span>
                        <span>${comparison.location2.costLevel}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="comparison-summary">
            <h6>${isThaiLang ? '💡 คำแนะนำ' : '💡 Recommendations'}</h6>
            <div class="recommendation-list">
                ${comparison.recommendations.map(rec => `<div class="recommendation-item">• ${rec}</div>`).join('')}
            </div>
        </div>
    `;
    
    comparisonResult.innerHTML = comparisonHTML;
    comparisonResult.style.display = 'block';
    
    // Visual feedback: highlight compared locations on globe
    highlightComparedLocations(location1Key, location2Key);
    
    showNotification(
        isThaiLang ? 'เปรียบเทียบสถานที่เสร็จแล้ว!' : 'Location comparison completed!',
        'success'
    );
}

// Generate comparison data with recommendations
function generateLocationComparison(loc1, loc2) {
    const isThaiLang = userPreferences.language === 'th';
    
    // Categorize locations
    const categorizeLocation = (location) => {
        const name = location.name.toLowerCase();
        if (name.includes('กรุงเทพ') || name.includes('bangkok')) {
            return {
                type: isThaiLang ? 'เมืองหลวง/วัฒนธรรม' : 'Capital/Cultural',
                costLevel: isThaiLang ? 'ปานกลาง-สูง' : 'Medium-High'
            };
        } else if (name.includes('ภูเก็ต') || name.includes('กระบี่') || name.includes('เกาะสมุย')) {
            return {
                type: isThaiLang ? 'ชายทะเล/เกาะ' : 'Beach/Island',
                costLevel: isThaiLang ? 'สูง' : 'High'
            };
        } else if (name.includes('เชียงใหม่') || name.includes('เชียงราย')) {
            return {
                type: isThaiLang ? 'ภูเขา/ธรรมชาติ' : 'Mountain/Nature',
                costLevel: isThaiLang ? 'ปานกลาง' : 'Medium'
            };
        } else if (name.includes('อยุธยา') || name.includes('สุโขทัย')) {
            return {
                type: isThaiLang ? 'ประวัติศาสตร์' : 'Historical',
                costLevel: isThaiLang ? 'ต่ำ-ปานกลาง' : 'Low-Medium'
            };
        } else {
            return {
                type: isThaiLang ? 'ทั่วไป' : 'General',
                costLevel: isThaiLang ? 'ปานกลาง' : 'Medium'
            };
        }
    };
    
    const cat1 = categorizeLocation(loc1);
    const cat2 = categorizeLocation(loc2);
    
    // Generate recommendations
    const recommendations = [];
    
    if (cat1.type !== cat2.type) {
        recommendations.push(
            isThaiLang ? 'สถานที่ทั้งสองแห่งมีลักษณะแตกต่างกัน เหมาะสำหรับการเดินทางที่หลากหลาย' :
            'These locations offer different experiences, perfect for diverse travel'
        );
    }
    
    if (loc1.attractions && loc2.attractions) {
        if (loc1.attractions.length > loc2.attractions.length) {
            recommendations.push(
                isThaiLang ? `${loc1.name} มีสถานที่ท่องเที่ยวมากกว่า` :
                `${loc1.nameEn} has more attractions to visit`
            );
        } else if (loc2.attractions.length > loc1.attractions.length) {
            recommendations.push(
                isThaiLang ? `${loc2.name} มีสถานที่ท่องเที่ยวมากกว่า` :
                `${loc2.nameEn} has more attractions to visit`
            );
        }
    }
    
    recommendations.push(
        isThaiLang ? 'แนะนำให้ตรวจสอบสภาพอากาศก่อนเดินทาง' :
        'Check weather conditions before traveling'
    );
    
    if (cat1.costLevel !== cat2.costLevel) {
        recommendations.push(
            isThaiLang ? 'ระดับค่าใช้จ่ายแตกต่างกัน แนะนำให้วางแผนงบประมาณ' :
            'Different cost levels - plan your budget accordingly'
        );
    }
    
    return {
        location1: cat1,
        location2: cat2,
        recommendations
    };
}

// Highlight compared locations on the globe
function highlightComparedLocations(loc1Key, loc2Key) {
    // Clear any existing highlights
    document.querySelectorAll('.marker').forEach(marker => {
        marker.classList.remove('comparison-highlight');
    });
    
    // Add highlight to compared locations
    const marker1 = document.querySelector(`.marker.${loc1Key}`);
    const marker2 = document.querySelector(`.marker.${loc2Key}`);
    
    if (marker1 && marker2) {
        marker1.classList.add('comparison-highlight');
        marker2.classList.add('comparison-highlight');
        
        // Remove highlights after 5 seconds
        setTimeout(() => {
            marker1.classList.remove('comparison-highlight');
            marker2.classList.remove('comparison-highlight');
        }, 5000);
    }
}

// Custom Enhanced Gallery System with Swipe and Zoom functionality
let currentGallery = null;
let currentSlide = 0;
let currentZoomLevel = 1;
let isZoomed = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

function initializeCustomGallery() {
    const gallery = document.querySelector('.custom-gallery');
    if (!gallery) return;
    
    currentGallery = gallery;
    currentSlide = 0;
    currentZoomLevel = 1;
    isZoomed = false;
    
    // Setup navigation
    setupGalleryNavigation();
    
    // Setup touch/swipe gestures
    setupSwipeGestures();
    
    // Setup zoom functionality
    setupZoomControls();
    setupImageZoomHandlers();
    setupTouchZoomGestures();
    setupWheelZoom();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    console.log('🖼️ Custom gallery with swipe and zoom ready!');
}

function setupGalleryNavigation() {
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const dots = document.querySelectorAll('.pagination-dot');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToPreviousSlide());
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToNextSlide());
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

function setupSwipeGestures() {
    const gallery = currentGallery;
    if (!gallery) return;
    
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let threshold = 40; // reduced threshold for better responsiveness
    let velocity = 0;
    let lastMoveTime = 0;
    let lastMoveX = 0;
    
    // Enhanced touch events with velocity tracking
    gallery.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && !isZoomed) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            lastMoveX = startX;
            lastMoveTime = Date.now();
            isDragging = true;
            velocity = 0;
            
            // Add visual feedback
            gallery.style.transition = 'none';
            addTouchFeedback();
        }
    });
    
    gallery.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1 || isZoomed) return;
        
        const currentX = e.touches[0].clientX;
        const currentTime = Date.now();
        const deltaTime = currentTime - lastMoveTime;
        
        if (deltaTime > 0) {
            velocity = (currentX - lastMoveX) / deltaTime;
            lastMoveX = currentX;
            lastMoveTime = currentTime;
        }
        
        // Prevent scrolling when swiping horizontally
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    });
    
    gallery.addEventListener('touchend', (e) => {
        if (!isDragging || isZoomed) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Restore transition
        gallery.style.transition = '';
        removeTouchFeedback();
        
        // Check for swipe with velocity consideration
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const hasMinimumDistance = Math.abs(deltaX) > threshold;
        const hasVelocity = Math.abs(velocity) > 0.3;
        
        if (isHorizontalSwipe && (hasMinimumDistance || hasVelocity)) {
            if (deltaX > 0) {
                goToPreviousSlide();
            } else {
                goToNextSlide();
            }
            
            // Add haptic feedback on supported devices
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
        
        isDragging = false;
        velocity = 0;
    });
    
    // Enhanced mouse events for desktop
    let mouseDown = false;
    let mouseStartX = 0;
    let mouseVelocity = 0;
    let lastMouseMoveTime = 0;
    let lastMouseX = 0;
    
    gallery.addEventListener('mousedown', (e) => {
        if (!isZoomed) {
            mouseDown = true;
            mouseStartX = e.clientX;
            lastMouseX = e.clientX;
            lastMouseMoveTime = Date.now();
            mouseVelocity = 0;
            gallery.style.cursor = 'grabbing';
            gallery.style.transition = 'none';
        }
    });
    
    gallery.addEventListener('mousemove', (e) => {
        if (!mouseDown || isZoomed) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - lastMouseMoveTime;
        
        if (deltaTime > 0) {
            mouseVelocity = (e.clientX - lastMouseX) / deltaTime;
            lastMouseX = e.clientX;
            lastMouseMoveTime = currentTime;
        }
        
        e.preventDefault();
    });
    
    gallery.addEventListener('mouseup', (e) => {
        if (!mouseDown || isZoomed) return;
        
        const deltaX = e.clientX - mouseStartX;
        const hasMinimumDistance = Math.abs(deltaX) > threshold;
        const hasVelocity = Math.abs(mouseVelocity) > 0.5;
        
        gallery.style.cursor = 'grab';
        gallery.style.transition = '';
        
        if (hasMinimumDistance || hasVelocity) {
            if (deltaX > 0) {
                goToPreviousSlide();
            } else {
                goToNextSlide();
            }
        }
        
        mouseDown = false;
        mouseVelocity = 0;
    });
    
    // Prevent dragging when mouse leaves gallery
    gallery.addEventListener('mouseleave', () => {
        if (mouseDown) {
            gallery.style.cursor = 'grab';
            gallery.style.transition = '';
            mouseDown = false;
        }
    });
}

// Add visual feedback for touch interactions
function addTouchFeedback() {
    const gallery = currentGallery;
    if (gallery) {
        gallery.style.transform = 'scale(0.98)';
        gallery.style.filter = 'brightness(0.95)';
    }
}

function removeTouchFeedback() {
    const gallery = currentGallery;
    if (gallery) {
        gallery.style.transform = '';
        gallery.style.filter = '';
    }
}
            if (deltaX > 0) {
                goToPreviousSlide();
            } else {
                goToNextSlide();
            }
        }
        
        mouseDown = false;
        gallery.style.cursor = 'grab';
    });
    
    gallery.addEventListener('mouseleave', () => {
        mouseDown = false;
        gallery.style.cursor = 'grab';
    });
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.pagination-dot');
    const totalSlides = slides.length;
    
    if (index < 0 || index >= totalSlides || index === currentSlide) return;
    
    // Reset zoom when changing slides
    resetZoom();
    
    // Add slide animation with direction detection
    const direction = index > currentSlide ? 'next' : 'prev';
    const track = document.querySelector('.gallery-track');
    
    // Enhanced transition with custom easing
    if (track) {
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = `translateX(-${index * 100}%)`;
    }
    
    // Update current slide
    const oldSlide = currentSlide;
    currentSlide = index;
    
    // Enhanced slide updates with staggered animations
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        
        // Add direction classes for enhanced animations
        slide.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
        
        if (i === index) {
            setTimeout(() => {
                slide.classList.add('active');
                slide.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
            }, 50);
        } else if (i === oldSlide) {
            slide.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
        }
    });
    
    // Enhanced pagination dots with ripple effect
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            setTimeout(() => {
                dot.classList.add('active');
                addRippleEffect(dot);
            }, 100);
        }
    });
    
    // Update navigation buttons with visual feedback
    updateNavigationButtons();
    
    // Update counter with animation
    updateImageCounter();
    
    // Add subtle vibration on mobile for better feedback
    if (navigator.vibrate && 'ontouchstart' in window) {
        navigator.vibrate(30);
    }
    
    // Preload adjacent images for smoother experience
    preloadAdjacentImages(index);
}

function goToNextSlide() {
    const totalSlides = document.querySelectorAll('.gallery-slide').length;
    const nextIndex = (currentSlide + 1) % totalSlides;
    
    // Add slide direction animation
    addSlideAnimation('next');
    goToSlide(nextIndex);
}

function goToPreviousSlide() {
    const totalSlides = document.querySelectorAll('.gallery-slide').length;
    const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    
    // Add slide direction animation
    addSlideAnimation('prev');
    goToSlide(prevIndex);
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const totalSlides = document.querySelectorAll('.gallery-slide').length;
    
    if (prevBtn && nextBtn) {
        // Add visual feedback with pulse animation
        prevBtn.style.opacity = '0.8';
        nextBtn.style.opacity = '0.8';
        
        // Enhance button state with animations
        prevBtn.style.transform = 'translateY(-50%) scale(1)';
        nextBtn.style.transform = 'translateY(-50%) scale(1)';
        
        // Enable hover effects
        prevBtn.addEventListener('mouseenter', () => {
            prevBtn.style.transform = 'translateY(-50%) scale(1.1)';
            prevBtn.style.opacity = '1';
        });
        
        nextBtn.addEventListener('mouseenter', () => {
            nextBtn.style.transform = 'translateY(-50%) scale(1.1)';
            nextBtn.style.opacity = '1';
        });
    }
}

// Helper functions for enhanced animations
function addSlideAnimation(direction) {
    const gallery = currentGallery;
    if (gallery) {
        gallery.classList.add(`sliding-${direction}`);
        setTimeout(() => {
            gallery.classList.remove(`sliding-${direction}`);
        }, 500);
    }
}

function addRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function preloadAdjacentImages(currentIndex) {
    const slides = document.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    
    // Preload previous and next images
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    const nextIndex = (currentIndex + 1) % totalSlides;
    
    [prevIndex, nextIndex].forEach(index => {
        const slide = slides[index];
        if (slide) {
            const img = slide.querySelector('.gallery-image[data-src]');
            if (img && img.dataset.src) {
                const preloadImg = new Image();
                preloadImg.src = img.dataset.src;
                
                preloadImg.onload = () => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy');
                };
            }
        }
    });
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (!currentGallery) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPreviousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNextSlide();
                break;
            case 'Escape':
                closeModal();
                break;
        }
    });
}

function setupImageZoomHandlers() {
    const images = document.querySelectorAll('.gallery-image');
    
    images.forEach((img, index) => {
        // Handle image load
        img.addEventListener('load', () => {
            const loader = img.parentElement.querySelector('.image-loader');
            if (loader) loader.style.display = 'none';
        });
        
        // Double tap to zoom (mobile)
        let lastTap = 0;
        img.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
                toggleZoom();
            }
            lastTap = currentTime;
        });
        
        // Double click to zoom (desktop)
        img.addEventListener('dblclick', (e) => {
            e.preventDefault();
            toggleZoom();
        });
    });
}

function setupZoomControls() {
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const zoomResetBtn = document.querySelector('.zoom-reset');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => zoomIn());
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => zoomOut());
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => resetZoom());
    }
}

function setupTouchZoomGestures() {
    const gallery = currentGallery;
    if (!gallery) return;
    
    let initialDistance = 0;
    let initialScale = 1;
    
    gallery.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.sqrt(
                Math.pow(touch2.pageX - touch1.pageX, 2) + 
                Math.pow(touch2.pageY - touch1.pageY, 2)
            );
            initialScale = currentZoomLevel;
        }
    });
    
    gallery.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.pageX - touch1.pageX, 2) + 
                Math.pow(touch2.pageY - touch1.pageY, 2)
            );
            
            const scale = (currentDistance / initialDistance) * initialScale;
            setZoom(Math.max(1, Math.min(3, scale)));
        }
    });
}

function setupWheelZoom() {
    const gallery = currentGallery;
    if (!gallery) return;
    
    gallery.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newZoom = Math.max(1, Math.min(3, currentZoomLevel + delta));
            setZoom(newZoom);
        }
    });
}

function zoomIn() {
    const newZoom = Math.min(3, currentZoomLevel + 0.2);
    setZoom(newZoom);
}

function zoomOut() {
    const newZoom = Math.max(1, currentZoomLevel - 0.2);
    setZoom(newZoom);
}

function toggleZoom() {
    if (currentZoomLevel > 1) {
        resetZoom();
    } else {
        setZoom(2);
    }
}

function setZoom(level) {
    currentZoomLevel = level;
    isZoomed = level > 1;
    
    const activeSlide = document.querySelector('.gallery-slide.active .gallery-image');
    if (activeSlide) {
        activeSlide.style.transform = `scale(${level})`;
        activeSlide.style.transition = 'transform 0.3s ease';
        
        // Update container overflow for zoom
        const container = activeSlide.closest('.gallery-image-container');
        if (container) {
            container.style.overflow = isZoomed ? 'hidden' : 'visible';
        }
    }
    
    // Update zoom button states
    updateZoomButtonStates();
}

function resetZoom() {
    setZoom(1);
}

function updateZoomButtonStates() {
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const zoomResetBtn = document.querySelector('.zoom-reset');
    
    if (zoomInBtn) {
        zoomInBtn.disabled = currentZoomLevel >= 3;
        zoomInBtn.style.opacity = currentZoomLevel >= 3 ? '0.5' : '1';
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.disabled = currentZoomLevel <= 1;
        zoomOutBtn.style.opacity = currentZoomLevel <= 1 ? '0.5' : '1';
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.style.opacity = currentZoomLevel > 1 ? '1' : '0.5';
    }
}

function updateImageCounter() {
    const activeSlide = document.querySelector('.gallery-slide.active');
    if (activeSlide) {
        const counter = activeSlide.querySelector('.image-counter');
        const index = parseInt(activeSlide.dataset.slide);
        const total = document.querySelectorAll('.gallery-slide').length;
        if (counter) {
            counter.textContent = `${index + 1} / ${total}`;
        }
    }
}

// ========================================
// INTERACTIVE MINI-MAP FUNCTIONALITY
// ========================================

let miniMap = null;
let miniMapVisible = false;
let miniMapMarkers = [];
let mainLocationMarker = null;

// Initialize mini-map functionality
function initializeMiniMap() {
    const miniMapToggle = document.getElementById('miniMapToggle');
    const centerMapBtn = document.getElementById('centerMapBtn');
    const toggleAttractionsBtn = document.getElementById('toggleAttractionsBtn');
    
    if (miniMapToggle) {
        miniMapToggle.addEventListener('click', toggleMiniMap);
    }
    
    if (centerMapBtn) {
        centerMapBtn.addEventListener('click', centerMiniMapOnLocation);
    }
    
    if (toggleAttractionsBtn) {
        toggleAttractionsBtn.addEventListener('click', toggleAttractionMarkers);
    }
}

// Toggle mini-map visibility
function toggleMiniMap() {
    const miniMapContainer = document.getElementById('miniMapContainer');
    const miniMapToggle = document.getElementById('miniMapToggle');
    const miniMapSection = document.getElementById('miniMapSection');
    
    miniMapVisible = !miniMapVisible;
    
    if (miniMapVisible) {
        miniMapContainer.classList.remove('collapsed');
        miniMapToggle.textContent = '📍 Hide Map';
        miniMapToggle.classList.add('active');
        miniMapSection.classList.add('active');
        
        // Initialize map if not already done
        if (!miniMap) {
            setTimeout(() => {
                initializeLeafletMap();
            }, 300); // Wait for container to expand
        } else {
            // Invalidate size to handle container resize
            setTimeout(() => {
                miniMap.invalidateSize();
            }, 300);
        }
        
        // Announce to screen readers
        announceToScreenReader('Mini-map opened. Use arrow keys to navigate the map.');
    } else {
        miniMapContainer.classList.add('collapsed');
        miniMapToggle.textContent = '📍 Show Map';
        miniMapToggle.classList.remove('active');
        
        // Announce to screen readers
        announceToScreenReader('Mini-map closed.');
    }
}

// Initialize Leaflet map
function initializeLeafletMap() {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer || miniMap) return;
    
    try {
        // Show loading state
        showMiniMapLoading();
        
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            console.warn('Leaflet library not available, using fallback SVG map');
            setTimeout(() => {
                hideMiniMapLoading();
                initializeFallbackMap();
            }, 1000);
            return;
        }
        
        // Initialize map with default center (Bangkok)
        miniMap = L.map('miniMap', {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
            keyboard: true,
            dragging: true
        }).setView([13.7563, 100.5018], 10);
        
        // Add tile layer with a nice style
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(miniMap);
        
        // Add custom zoom control
        L.control.zoom({
            position: 'bottomleft'
        }).addTo(miniMap);
        
        // Wait for map to load, then show current location
        miniMap.whenReady(() => {
            hideMiniMapLoading();
            
            // Get current location from window context if available
            if (window.currentLocationView && window.currentLocationView.location) {
                showLocationOnMiniMap(window.currentLocationView.location);
            }
        });
        
        // Handle map events
        miniMap.on('click', handleMiniMapClick);
        miniMap.on('zoomend', updateMiniMapControls);
        
        console.log('🗺️ Mini-map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing mini-map:', error);
        hideMiniMapLoading();
        setTimeout(() => {
            initializeFallbackMap();
        }, 500);
    }
}

// Fallback SVG map implementation
function initializeFallbackMap() {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer) return;
    
    // Create SVG-based mini-map
    const svgMap = createSVGMap();
    mapContainer.innerHTML = svgMap;
    
    // Add click handlers for SVG map
    const svgElement = mapContainer.querySelector('svg');
    if (svgElement) {
        svgElement.addEventListener('click', handleSVGMapClick);
    }
    
    // Show current location on SVG map
    if (window.currentLocationView && window.currentLocationView.location) {
        showLocationOnSVGMap(window.currentLocationView.location);
    }
    
    console.log('🗺️ Fallback SVG mini-map initialized');
}

// Create SVG-based map
function createSVGMap() {
    return `
        <svg viewBox="0 0 400 300" class="svg-mini-map" style="width: 100%; height: 100%; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);">
            <!-- Thailand outline -->
            <path d="M200 50 L250 80 L280 120 L270 160 L250 200 L220 240 L180 250 L150 230 L130 200 L120 160 L140 120 L170 80 Z" 
                  fill="#4caf50" stroke="#2e7d3e" stroke-width="2" opacity="0.8"/>
            
            <!-- Bangkok area -->
            <circle cx="200" cy="140" r="8" fill="#f44336" stroke="#fff" stroke-width="2" class="svg-location-marker main-location" data-location="bangkok">
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Nearby attractions around Bangkok -->
            <circle cx="190" cy="130" r="4" fill="#ff9800" stroke="#fff" stroke-width="1" class="svg-attraction-marker" data-attraction="วัดพระแก้ว" title="วัดพระแก้ว / Wat Phra Kaew"/>
            <circle cx="210" cy="135" r="4" fill="#ff9800" stroke="#fff" stroke-width="1" class="svg-attraction-marker" data-attraction="พระบรมมหาราชวัง" title="พระบรมมหาราชวัง / Grand Palace"/>
            <circle cx="185" cy="150" r="4" fill="#ff9800" stroke="#fff" stroke-width="1" class="svg-attraction-marker" data-attraction="วัดโพธิ์" title="วัดโพธิ์ / Wat Pho"/>
            <circle cx="220" cy="125" r="4" fill="#ff9800" stroke="#fff" stroke-width="1" class="svg-attraction-marker" data-attraction="ตลาดจตุจักร" title="ตลาดจตุจักร / Chatuchak Market"/>
            <circle cx="180" cy="155" r="4" fill="#ff9800" stroke="#fff" stroke-width="1" class="svg-attraction-marker" data-attraction="วัดอรุณ" title="วัดอรุณ / Wat Arun"/>
            <circle cx="215" cy="145" r="4" fill="#ff9800" stroke="#fff" stroke-width="1" class="svg-attraction-marker" data-attraction="เยาวราช" title="เยาวราช / Chinatown"/>
            
            <!-- Other major cities for context -->
            <circle cx="180" cy="90" r="5" fill="#2196f3" stroke="#fff" stroke-width="1" class="svg-location-marker other-location" data-location="chiangmai" title="เชียงใหม่ / Chiang Mai"/>
            <circle cx="160" cy="220" r="5" fill="#2196f3" stroke="#fff" stroke-width="1" class="svg-location-marker other-location" data-location="phuket" title="ภูเก็ต / Phuket"/>
            
            <!-- Legend -->
            <g transform="translate(10, 10)" class="svg-legend">
                <rect x="0" y="0" width="120" height="70" fill="rgba(255,255,255,0.9)" stroke="#ccc" rx="5"/>
                <text x="10" y="15" font-size="12" font-weight="bold" fill="#333">Legend</text>
                <circle cx="15" cy="28" r="4" fill="#f44336"/>
                <text x="25" y="32" font-size="10" fill="#333">Main Location</text>
                <circle cx="15" cy="42" r="3" fill="#ff9800"/>
                <text x="25" y="46" font-size="10" fill="#333">Attractions</text>
                <circle cx="15" cy="56" r="3" fill="#2196f3"/>
                <text x="25" y="60" font-size="10" fill="#333">Other Cities</text>
            </g>
            
            <!-- Scale indicator -->
            <g transform="translate(300, 260)" class="svg-scale">
                <line x1="0" y1="0" x2="50" y2="0" stroke="#333" stroke-width="2"/>
                <line x1="0" y1="-3" x2="0" y2="3" stroke="#333" stroke-width="2"/>
                <line x1="50" y1="-3" x2="50" y2="3" stroke="#333" stroke-width="2"/>
                <text x="25" y="15" font-size="10" text-anchor="middle" fill="#333">~10km</text>
            </g>
            
            <!-- Compass -->
            <g transform="translate(350, 50)" class="svg-compass">
                <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.9)" stroke="#333"/>
                <path d="M0,-15 L5,0 L0,15 L-5,0 Z" fill="#f44336"/>
                <text x="0" y="-25" font-size="12" text-anchor="middle" fill="#333">N</text>
            </g>
        </svg>
    `;
}

// Show location on mini-map
function showLocationOnMiniMap(locationKey) {
    if (!miniMap || !locations[locationKey]) return;
    
    const location = locations[locationKey];
    if (!location.coordinates) return;
    
    const [lng, lat] = location.coordinates;
    
    // Clear existing markers
    clearMiniMapMarkers();
    
    // Center map on location
    miniMap.setView([lat, lng], 12);
    
    // Add main location marker
    mainLocationMarker = L.marker([lat, lng], {
        icon: createMainLocationIcon()
    }).addTo(miniMap);
    
    const locationName = getCurrentLocationName(location);
    mainLocationMarker.bindPopup(`
        <div class="mini-map-popup">
            <h5>${location.emoji} ${locationName}</h5>
            <p>${getCurrentLocationDescription(location)}</p>
        </div>
    `);
    
    // Add nearby attractions
    addNearbyAttractions(locationKey, lat, lng);
    
    // Update map title
    updateMiniMapTitle(locationName);
}

// Create custom icon for main location
function createMainLocationIcon() {
    return L.divIcon({
        className: 'main-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

// Create custom icon for attractions
function createAttractionIcon(attraction) {
    return L.divIcon({
        className: 'attraction-marker',
        html: `<span style="font-size: 8px; line-height: 16px; text-align: center; display: block;">${getAttractionEmoji(attraction)}</span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
    });
}

// Get appropriate emoji for attraction type
function getAttractionEmoji(attraction) {
    const attractionLower = attraction.toLowerCase();
    
    if (attractionLower.includes('temple') || attractionLower.includes('วัด')) return '🏛️';
    if (attractionLower.includes('palace') || attractionLower.includes('วัง')) return '🏰';
    if (attractionLower.includes('beach') || attractionLower.includes('หาด')) return '🏖️';
    if (attractionLower.includes('market') || attractionLower.includes('ตลาด')) return '🛍️';
    if (attractionLower.includes('park') || attractionLower.includes('อุทยาน')) return '🌳';
    if (attractionLower.includes('museum') || attractionLower.includes('พิพิธภัณฑ์')) return '🏛️';
    if (attractionLower.includes('bridge') || attractionLower.includes('สะพาน')) return '🌉';
    if (attractionLower.includes('waterfall') || attractionLower.includes('น้ำตก')) return '💧';
    if (attractionLower.includes('island') || attractionLower.includes('เกาะ')) return '🏝️';
    if (attractionLower.includes('mountain') || attractionLower.includes('ดอย') || attractionLower.includes('เขา')) return '⛰️';
    
    return '📍'; // Default icon
}

// Add nearby attractions to the map
function addNearbyAttractions(locationKey, centerLat, centerLng) {
    const location = locations[locationKey];
    if (!location || !location.attractions) return;
    
    // Generate approximate coordinates for attractions around the main location
    location.attractions.forEach((attraction, index) => {
        const attractionName = getCurrentAttractionName(location, index);
        
        // Generate coordinates in a radius around the main location
        const radius = 0.05; // ~5km radius
        const angle = (index * (360 / location.attractions.length)) * (Math.PI / 180);
        const offsetRadius = radius * (0.3 + Math.random() * 0.7); // Random distance within radius
        
        const attractionLat = centerLat + (offsetRadius * Math.cos(angle));
        const attractionLng = centerLng + (offsetRadius * Math.sin(angle));
        
        const marker = L.marker([attractionLat, attractionLng], {
            icon: createAttractionIcon(attractionName)
        }).addTo(miniMap);
        
        // Create popup with attraction details
        const popupContent = `
            <div class="mini-map-popup">
                <h5>${getAttractionEmoji(attractionName)} ${attractionName}</h5>
                <p>${getAttractionDescription(attractionName, locationKey)}</p>
                <button onclick="showAttractionDetails('${locationKey}', ${index})" class="attraction-details-btn">
                    ${userPreferences.language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Store marker for later management
        miniMapMarkers.push(marker);
        
        // Add enhanced click handler with feedback
        marker.on('click', () => {
            trackUserBehavior('attraction_view', {
                location: locationKey,
                attraction: attractionName
            });
            
            // Add visual feedback
            announceToScreenReader(`${attractionName} selected`);
        });
        
        // Add discovery animation with delay
        setTimeout(() => {
            const markerElement = marker.getElement();
            if (markerElement) {
                markerElement.classList.add('discovered');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    markerElement.classList.remove('discovered');
                }, 1000);
            }
        }, index * 200); // Stagger animations
        
        // Enhanced mobile touch support
        marker.on('touchstart', (e) => {
            e.originalEvent.preventDefault();
            marker.openPopup();
        });
    });
    
    // Announce attractions loaded to screen readers
    announceToScreenReader(`${location.attractions.length} nearby attractions loaded on map`);
}

// Get attraction description
function getAttractionDescription(attractionName, locationKey) {
    const descriptions = {
        th: {
            'วัดพระแก้ว': 'วัดศักดิ์สิทธิ์ที่สำคัญที่สุดของไทย',
            'พระบรมมหาราชวัง': 'พระราชวังหลวงที่งดงามของไทย',
            'วัดโพธิ์': 'วัดเก่าแก่ที่มีพระพุทธรูปนอนขนาดใหญ่',
            'ตลาดจตุจักร': 'ตลาดสุดสัปดาห์ที่ใหญ่ที่สุดในโลก',
            'วัดอรุณ': 'วัดแห่งรุ่งอรุณริมแม่น้ำเจ้าพระยา'
        },
        en: {
            'Wat Phra Kaew': 'Thailand\'s most sacred temple',
            'Grand Palace': 'Magnificent royal palace complex',
            'Wat Pho': 'Ancient temple with giant reclining Buddha',
            'Chatuchak Market': 'World\'s largest weekend market',
            'Wat Arun': 'Temple of Dawn by the Chao Phraya River'
        }
    };
    
    const langDescriptions = descriptions[userPreferences.language] || descriptions.en;
    return langDescriptions[attractionName] || 
           (userPreferences.language === 'th' ? 'สถานที่ท่องเที่ยวที่น่าสนใจ' : 'Interesting tourist attraction');
}

// Show attraction details
function showAttractionDetails(locationKey, attractionIndex) {
    const location = locations[locationKey];
    if (!location || !location.attractions || !location.attractions[attractionIndex]) return;
    
    const attractionName = getCurrentAttractionName(location, attractionIndex);
    const description = getAttractionDescription(attractionName, locationKey);
    
    // Create a detailed popup or modal
    const content = `
        <div class="attraction-detail-modal">
            <h4>${getAttractionEmoji(attractionName)} ${attractionName}</h4>
            <p>${description}</p>
            <div class="attraction-actions">
                <button onclick="centerOnAttraction('${locationKey}', ${attractionIndex})" class="btn-primary">
                    ${userPreferences.language === 'th' ? 'ไปที่สถานที่' : 'Go to Location'}
                </button>
            </div>
        </div>
    `;
    
    // Show in a notification or update existing popup
    showNotification(`${attractionName}: ${description}`, 'info');
}

// Center map on specific attraction
function centerOnAttraction(locationKey, attractionIndex) {
    // This would center the map on the specific attraction marker
    if (miniMapMarkers[attractionIndex]) {
        const marker = miniMapMarkers[attractionIndex];
        miniMap.setView(marker.getLatLng(), 15);
        marker.openPopup();
    }
}

// Clear all markers from mini-map
function clearMiniMapMarkers() {
    if (!miniMap) return;
    
    // Remove main location marker
    if (mainLocationMarker) {
        miniMap.removeLayer(mainLocationMarker);
        mainLocationMarker = null;
    }
    
    // Remove attraction markers
    miniMapMarkers.forEach(marker => {
        miniMap.removeLayer(marker);
    });
    miniMapMarkers = [];
}

// Center mini-map on current location
function centerMiniMapOnLocation() {
    if (!miniMap || !mainLocationMarker) return;
    
    const latLng = mainLocationMarker.getLatLng();
    miniMap.setView(latLng, 12);
    
    // Add visual feedback
    const btn = document.getElementById('centerMapBtn');
    if (btn) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }
    
    showNotification(
        userPreferences.language === 'th' ? 'กลับไปที่ตำแหน่งหลัก' : 'Centered on main location',
        'info'
    );
}

// Toggle attraction markers visibility
function toggleAttractionMarkers() {
    const btn = document.getElementById('toggleAttractionsBtn');
    if (!btn || !miniMap) return;
    
    const isHidden = btn.classList.contains('active');
    
    miniMapMarkers.forEach(marker => {
        if (isHidden) {
            marker.addTo(miniMap);
        } else {
            miniMap.removeLayer(marker);
        }
    });
    
    btn.classList.toggle('active');
    btn.title = isHidden ? 
        (userPreferences.language === 'th' ? 'ซ่อนสถานที่ท่องเที่ยว' : 'Hide attractions') :
        (userPreferences.language === 'th' ? 'แสดงสถานที่ท่องเที่ยว' : 'Show attractions');
    
    showNotification(
        isHidden ? 
            (userPreferences.language === 'th' ? 'แสดงสถานที่ท่องเที่ยว' : 'Attractions shown') :
            (userPreferences.language === 'th' ? 'ซ่อนสถานที่ท่องเที่ยว' : 'Attractions hidden'),
        'info'
    );
}

// Update mini-map controls
function updateMiniMapControls() {
    // Update any controls based on zoom level or other map state
    const zoomLevel = miniMap ? miniMap.getZoom() : 0;
    
    // You can add logic here to show/hide certain features based on zoom level
    if (zoomLevel > 14) {
        // Show more detailed markers at high zoom
    } else {
        // Show simplified markers at low zoom
    }
}

// Handle SVG map click events
function handleSVGMapClick(event) {
    const target = event.target;
    
    // Add ripple effect at click location
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    createSVGRippleEffect(x, y, event.currentTarget);
    
    if (target.classList.contains('svg-attraction-marker')) {
        const attractionName = target.getAttribute('data-attraction');
        const title = target.getAttribute('title');
        
        // Add interaction feedback
        target.style.transform = 'scale(1.5)';
        setTimeout(() => {
            target.style.transform = '';
        }, 200);
        
        // Show attraction info
        showNotification(`${attractionName}: ${getAttractionDescription(attractionName, 'bangkok')}`, 'info');
        
        // Track interaction
        trackUserBehavior('svg_attraction_click', {
            attraction: attractionName
        });
        
        // Announce to screen readers
        announceToScreenReader(`Selected attraction: ${attractionName}`);
    } else if (target.classList.contains('svg-location-marker')) {
        const locationKey = target.getAttribute('data-location');
        if (locationKey && locationKey !== 'bangkok') {
            showNotification(
                userPreferences.language === 'th' ? 
                `คลิกเพื่อดูข้อมูล${target.getAttribute('title')}` :
                `Click to view ${target.getAttribute('title')}`,
                'info'
            );
        }
    }
}

// Create ripple effect on SVG map
function createSVGRippleEffect(x, y, svgElement) {
    // Create ripple circle
    const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ripple.setAttribute('cx', x);
    ripple.setAttribute('cy', y);
    ripple.setAttribute('r', '0');
    ripple.setAttribute('fill', 'none');
    ripple.setAttribute('stroke', '#48b1e8');
    ripple.setAttribute('stroke-width', '2');
    ripple.setAttribute('opacity', '0.8');
    
    // Add animation
    const animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animation.setAttribute('attributeName', 'r');
    animation.setAttribute('values', '0;30');
    animation.setAttribute('dur', '0.6s');
    
    const opacityAnimation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    opacityAnimation.setAttribute('attributeName', 'opacity');
    opacityAnimation.setAttribute('values', '0.8;0');
    opacityAnimation.setAttribute('dur', '0.6s');
    
    ripple.appendChild(animation);
    ripple.appendChild(opacityAnimation);
    svgElement.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Create ripple effect on map click
function createMapRippleEffect(point) {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer) return;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        left: ${point.x - 10}px;
        top: ${point.y - 10}px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(72, 177, 232, 0.6);
        transform: scale(0);
        animation: mapRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    mapContainer.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show mini-map loading state
function showMiniMapLoading() {
    const miniMapContainer = document.getElementById('miniMapContainer');
    if (!miniMapContainer) return;
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'mini-map-loading';
    loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <p style="margin-top: 1rem; color: var(--panel-text);">
            ${userPreferences.language === 'th' ? 'กำลังโหลดแผนที่...' : 'Loading map...'}
        </p>
    `;
    
    miniMapContainer.appendChild(loadingOverlay);
}

// Hide mini-map loading state
function hideMiniMapLoading() {
    const loadingOverlay = document.querySelector('.mini-map-loading');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Show mini-map error state
function showMiniMapError() {
    const miniMapContainer = document.getElementById('miniMapContainer');
    if (!miniMapContainer) return;
    
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'mini-map-loading';
    errorOverlay.innerHTML = `
        <div style="text-align: center; color: var(--panel-text);">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <p>${userPreferences.language === 'th' ? 'ไม่สามารถโหลดแผนที่ได้' : 'Unable to load map'}</p>
            <button onclick="retryMiniMapLoad()" class="retry-btn" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                ${userPreferences.language === 'th' ? 'ลองใหม่' : 'Retry'}
            </button>
        </div>
    `;
    
    miniMapContainer.appendChild(errorOverlay);
}

// Retry mini-map loading
function retryMiniMapLoad() {
    const errorOverlay = document.querySelector('.mini-map-loading');
    if (errorOverlay) {
        errorOverlay.remove();
    }
    
    // Reset map
    miniMap = null;
    
    // Try to initialize again
    setTimeout(() => {
        initializeLeafletMap();
    }, 500);
}

// Update mini-map title
function updateMiniMapTitle(locationName) {
    const miniMapTitle = document.getElementById('miniMapTitle');
    if (miniMapTitle) {
        miniMapTitle.textContent = `🗺️ ${userPreferences.language === 'th' ? 'แผนที่ย่อย' : 'Mini-Map'}: ${locationName}`;
    }
}

// Cleanup mini-map when modal closes
function cleanupMiniMap() {
    if (miniMap) {
        clearMiniMapMarkers();
        // Reset map view
        miniMap.setView([13.7563, 100.5018], 10);
    }
    
    // Reset toggle state
    const miniMapToggle = document.getElementById('miniMapToggle');
    const miniMapContainer = document.getElementById('miniMapContainer');
    const miniMapSection = document.getElementById('miniMapSection');
    
    if (miniMapToggle && miniMapContainer) {
        miniMapVisible = false;
        miniMapContainer.classList.add('collapsed');
        miniMapToggle.textContent = '📍 Show Map';
        miniMapToggle.classList.remove('active');
        if (miniMapSection) {
            miniMapSection.classList.remove('active');
        }
    }
}

// Handle SVG map click events
function handleSVGMapClick(e) {
    const target = e.target;
    
    if (target.classList.contains('svg-attraction-marker')) {
        const attraction = target.dataset.attraction;
        const title = target.getAttribute('title');
        
        // Create popup for attraction
        showSVGPopup(e.clientX, e.clientY, attraction, title);
        
        // Track interaction
        trackUserBehavior('attraction_view', {
            attraction: attraction,
            mapType: 'svg_fallback'
        });
    } else if (target.classList.contains('svg-location-marker')) {
        const location = target.dataset.location;
        if (location && location !== window.currentLocationView?.location) {
            // Navigate to different location
            showInfo(location);
        }
    }
    
    // Add ripple effect
    createSVGRippleEffect(e);
}

// Show location on SVG map
function showLocationOnSVGMap(locationKey) {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer) return;
    
    const location = locations[locationKey];
    if (!location) return;
    
    // Find the SVG and update it to show the correct location
    const svg = mapContainer.querySelector('svg');
    if (!svg) return;
    
    // Remove existing main location markers
    const existingMain = svg.querySelectorAll('.main-location');
    existingMain.forEach(marker => {
        marker.classList.remove('main-location');
        marker.setAttribute('r', '5');
        marker.setAttribute('fill', '#2196f3');
    });
    
    // Find and highlight the current location
    const currentMarker = svg.querySelector(`[data-location="${locationKey}"]`);
    if (currentMarker) {
        currentMarker.classList.add('main-location');
        currentMarker.setAttribute('r', '8');
        currentMarker.setAttribute('fill', '#f44336');
        
        // Add pulsing animation
        const animate = currentMarker.querySelector('animate');
        if (!animate) {
            const newAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            newAnimate.setAttribute('attributeName', 'r');
            newAnimate.setAttribute('values', '8;12;8');
            newAnimate.setAttribute('dur', '2s');
            newAnimate.setAttribute('repeatCount', 'indefinite');
            currentMarker.appendChild(newAnimate);
        }
    }
    
    // Update attractions around the location
    updateSVGAttractions(locationKey);
}

// Update SVG attractions based on location
function updateSVGAttractions(locationKey) {
    const mapContainer = document.getElementById('miniMap');
    const svg = mapContainer?.querySelector('svg');
    if (!svg) return;
    
    const location = locations[locationKey];
    if (!location || !location.attractions) return;
    
    // Remove existing attraction markers
    const existingAttractions = svg.querySelectorAll('.svg-attraction-marker');
    existingAttractions.forEach(marker => marker.remove());
    
    // Add new attraction markers around the main location
    const mainMarker = svg.querySelector('.main-location');
    if (!mainMarker) return;
    
    const centerX = parseFloat(mainMarker.getAttribute('cx'));
    const centerY = parseFloat(mainMarker.getAttribute('cy'));
    const radius = 20; // Radius around main location
    
    location.attractions.forEach((attraction, index) => {
        const angle = (index * (360 / location.attractions.length)) * (Math.PI / 180);
        const x = centerX + (radius * Math.cos(angle));
        const y = centerY + (radius * Math.sin(angle));
        
        const attractionMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        attractionMarker.setAttribute('cx', x);
        attractionMarker.setAttribute('cy', y);
        attractionMarker.setAttribute('r', '4');
        attractionMarker.setAttribute('fill', '#ff9800');
        attractionMarker.setAttribute('stroke', '#fff');
        attractionMarker.setAttribute('stroke-width', '1');
        attractionMarker.className.baseVal = 'svg-attraction-marker';
        attractionMarker.dataset.attraction = attraction;
        attractionMarker.setAttribute('title', `${attraction} / ${getCurrentAttractionName(location, index)}`);
        attractionMarker.style.cursor = 'pointer';
        
        // Add hover effect
        attractionMarker.addEventListener('mouseenter', function() {
            this.setAttribute('r', '6');
            this.setAttribute('fill', '#f57c00');
        });
        
        attractionMarker.addEventListener('mouseleave', function() {
            this.setAttribute('r', '4');
            this.setAttribute('fill', '#ff9800');
        });
        
        svg.appendChild(attractionMarker);
    });
}

// Show SVG popup
function showSVGPopup(x, y, attraction, title) {
    // Remove existing popup
    const existingPopup = document.querySelector('.svg-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popup = document.createElement('div');
    popup.className = 'svg-popup';
    popup.innerHTML = `
        <div class="svg-popup-content">
            <h5>${getAttractionEmoji(attraction)} ${attraction}</h5>
            <p>${title || attraction}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="popup-close">×</button>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        left: ${x + 10}px;
        top: ${y - 50}px;
        background: var(--panel-bg);
        color: var(--panel-text);
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 25px var(--shadow-color);
        backdrop-filter: blur(15px);
        border: 1px solid var(--glass-border);
        z-index: 1000;
        max-width: 200px;
        animation: popupFadeIn 0.3s ease-out;
        pointer-events: auto;
    `;
    
    document.body.appendChild(popup);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 3000);
}

// Create ripple effect for SVG map
function createSVGRippleEffect(e) {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer) return;
    
    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        left: ${x - 10}px;
        top: ${y - 10}px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(72, 177, 232, 0.6);
        transform: scale(0);
        animation: mapRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    mapContainer.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ========================================
// ENHANCED MODAL SYSTEM FOR LOCATION INFORMATION
// ========================================
function showInfo(location) {
    const info = locations[location];
    if (!info) return;
    
    // Track user behavior for recommendations
    const viewStartTime = Date.now();
    trackUserBehavior('location_view', {
        location: location,
        categories: info.categories || []
    });
    
    // Track time spent when modal is closed
    window.currentLocationView = {
        location: location,
        startTime: viewStartTime
    };
    
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalGallery = document.getElementById('modalGallery');
    
    if (!modal || !modalTitle || !modalBody || !modalGallery) {
        // Fallback to alert if modal elements don't exist
        const attractions = info.attractions ? `\n\n🎯 ${getText('attractionsTitle')}:\n${info.attractions.join(', ')}` : '';
        const message = `${info.emoji} ${getCurrentLocationName(info)}\n\n📍 ${getCurrentLocationDescription(info)}${attractions}`;
        alert(message);
        focusLocation(location);
        return;
    }
    
    modalTitle.textContent = `${info.emoji} ${getCurrentLocationName(info)}`;
    
    // Calculate distance from Bangkok (reference point)
    let distanceInfo = '';
    if (location !== 'bangkok' && locations.bangkok && info.coordinates) {
        const distance = calculateDistance(
            locations.bangkok.coordinates[1], locations.bangkok.coordinates[0],
            info.coordinates[1], info.coordinates[0]
        );
        distanceInfo = `
            <div class="distance-info" style="background: var(--card-bg); padding: var(--spacing-md); border-radius: var(--radius-lg); margin: var(--spacing-md) 0;">
                <p><strong>📏 ${getText('distance')} ${getText('description')} ${locations.bangkok.name}:</strong> ${distance} ${getText('km')}</p>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="location-details">
            <p><strong>📍 ${getText('description')}:</strong></p>
            <p>${getCurrentLocationDescription(info)}</p>
            
            ${distanceInfo}
            
            <p><strong>🎯 ${getText('attractionsTitle')}:</strong></p>
            <ul>
                ${info.attractions ? info.attractions.map((attraction, index) => 
                    `<li>${getCurrentAttractionName(info, index)}</li>`
                ).join('') : `<li>${getText('noResults')}</li>`}
            </ul>
            
            <div class="weather-info" style="background: var(--card-bg); padding: var(--spacing-md); border-radius: var(--radius-lg); margin: var(--spacing-md) 0;">
                <p><strong>🌤️ ${getText('weather')}:</strong> ${info.weather || 'N/A'}</p>
                <p><strong>📅 ${getText('bestTime')}:</strong> ${info.bestTime || 'Year Round'}</p>
                ${info.travelTips ? `<p><strong>💡 ${getText('travelTips')}:</strong> ${info.travelTips}</p>` : ''}
            </div>
        </div>
    `;
    
    // Show mini-map section if location has coordinates
    const miniMapSection = document.getElementById('miniMapSection');
    if (miniMapSection && info.coordinates) {
        miniMapSection.style.display = 'block';
        // Update mini-map title
        updateMiniMapTitle(getCurrentLocationName(info));
    }
    
    // Create enhanced photo gallery with swipe and zoom functionality
    if (info.photos) {
        const galleryHtml = `
            <div class="enhanced-gallery-container">
                <div class="custom-gallery" data-current-slide="0">
                    <div class="gallery-track">
                        ${info.photos.map((photo, index) => `
                            <div class="gallery-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
                                <div class="gallery-slide-content" data-photo-index="${index}">
                                    <div class="gallery-image-container">
                                        <img 
                                            data-src="${photo.url}" 
                                            alt="${photo.name}"
                                            class="gallery-image lazy"
                                            loading="lazy"
                                            onerror="this.parentElement.innerHTML='<div class=\\"photo-fallback\\"><div class=\\"fallback-emoji\\">${photo.emoji}</div><p>${photo.name}</p></div>'"
                                        >
                                        <div class="image-loader">
                                            <div class="loader-spinner"></div>
                                        </div>
                                    </div>
                                    <div class="gallery-image-info">
                                        <h4 class="image-title">${photo.name}</h4>
                                        <p class="image-description">${photo.description || ''}</p>
                                        <div class="image-counter">${index + 1} / ${info.photos.length}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Navigation buttons -->
                    <button class="gallery-nav gallery-prev" aria-label="Previous image">‹</button>
                    <button class="gallery-nav gallery-next" aria-label="Next image">›</button>
                    
                    <!-- Pagination dots -->
                    <div class="gallery-pagination">
                        ${info.photos.map((_, index) => `
                            <button class="pagination-dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Go to image ${index + 1}"></button>
                        `).join('')}
                    </div>
                    
                    <!-- Zoom controls -->
                    <div class="gallery-zoom-controls">
                        <button class="zoom-btn zoom-in" aria-label="Zoom in">
                            <span>🔍+</span>
                        </button>
                        <button class="zoom-btn zoom-out" aria-label="Zoom out">
                            <span>🔍-</span>
                        </button>
                        <button class="zoom-btn zoom-reset" aria-label="Reset zoom">
                            <span>⚖️</span>
                        </button>
                    </div>
                </div>
                
                <!-- Gallery instructions -->
                <div class="gallery-instructions">
                    <p>💡 ${userPreferences.language === 'th' ? 
                        'ปัดซ้าย-ขวาเพื่อดูรูป, ใช้นิ้วสองนิ้วซูม หรือกดปุ่มซูม' : 
                        'Swipe left-right to navigate, pinch to zoom, or use zoom buttons'
                    }</p>
                </div>
            </div>
        `;
        modalGallery.innerHTML = galleryHtml;
        
        // Initialize custom gallery with enhanced features
        setTimeout(() => {
            initializeCustomGallery();
            // Initialize lazy loading for gallery images
            initializeLazyLoading();
        }, 100);
    } else {
        modalGallery.innerHTML = `<p>🖼️ ${userPreferences.language === 'th' ? 'ภาพประกอบจะมาเร็วๆ นี้' : 'Photos coming soon'}</p>`;
    }
    
    // Enhanced modal animation sequence
    modal.style.display = 'flex';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Set focus to modal for screen readers
    setTimeout(() => {
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        } else {
            modal.focus();
        }
    }, 100);
    
    // Trigger animations with proper timing
    requestAnimationFrame(() => {
        modal.classList.add('show');
        
        // Add fade-in animations to modal content elements
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.add('fade-in');
            }
            
            // Animate gallery items with stagger effect
            const galleryItems = modal.querySelectorAll('.gallery-item');
            galleryItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.4s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        }, 100);
    });
    
    // Focus location on map
    focusLocation(location);
    
    // Stabilize marker click with improved handling
    const marker = document.querySelector(`.marker.${location}`);
    if (marker) {
        // Stop animation temporarily for stable interaction
        marker.style.animation = 'none';
        marker.style.transform = 'scale(1.5)';
        marker.style.zIndex = '300';
        setTimeout(() => {
            marker.style.transform = '';
            marker.style.zIndex = '100';
            marker.style.animation = 'markerPulseGentle 3s ease-in-out infinite';
        }, 1000);
    }
    
    updateStatus(`📍 ${getText('description')}: ${getCurrentLocationName(info)}`, `📍 Viewing: ${getCurrentLocationName(info)}`);
    
    // Initialize mini-map after modal is fully shown
    setTimeout(() => {
        initializeMiniMap();
        // Show location on mini-map if coordinates are available
        if (info.coordinates) {
            showLocationOnMiniMap(location);
        }
    }, 500);
}

// Enhanced keyboard navigation and accessibility
function initializeKeyboardNavigation() {
    // Add keyboard support for markers
    document.querySelectorAll('.marker').forEach(marker => {
        marker.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                marker.click();
            }
        });
    });
    
    // Add keyboard support for search results
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        let selectedIndex = -1;
        
        searchInput.addEventListener('keydown', (e) => {
            const items = searchResults.querySelectorAll('.search-result-item');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSearchSelection(items, selectedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSearchSelection(items, selectedIndex);
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                items[selectedIndex].click();
                selectedIndex = -1;
            } else if (e.key === 'Escape') {
                searchResults.style.display = 'none';
                selectedIndex = -1;
            }
        });
    }
    
    // Add modal keyboard navigation
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('modalOverlay');
        if (modal && modal.style.display !== 'none') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'Tab') {
                trapFocusInModal(e, modal);
            }
        }
    });
}

function updateSearchSelection(items, selectedIndex) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.setAttribute('aria-selected', 'true');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        }
    });
}

function trapFocusInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Helper functions for multilingual support
function getCurrentLocationName(info) {
    return userPreferences.language === 'en' ? info.nameEn : info.name;
}

function getCurrentLocationDescription(info) {
    return userPreferences.language === 'en' ? info.descriptionEn : info.description;
}

function getCurrentAttractionName(info, index) {
    if (userPreferences.language === 'en' && info.attractionsEn && info.attractionsEn[index]) {
        return info.attractionsEn[index];
    }
    return info.attractions[index];
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        // Track time spent on modal if we have viewStartTime stored
        if (window.currentLocationView) {
            const timeSpent = Date.now() - window.currentLocationView.startTime;
            trackUserBehavior('time_spent', {
                location: window.currentLocationView.location,
                duration: timeSpent
            });
            window.currentLocationView = null;
        }
        
        // Clean up gallery
        if (currentGallery) {
            currentGallery = null;
        }
        
        // Clean up mini-map
        cleanupMiniMap();
        
        // Reset zoom state
        currentZoomLevel = 1;
        isZoomed = false;
        currentSlide = 0;
        
        // Add exit animation
        const modalContent = modal.querySelector('.location-modal');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideOut 0.3s ease-in forwards';
        }
        
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to the element that opened the modal
        const focusedMarker = document.querySelector('.marker:focus');
        if (focusedMarker) {
            focusedMarker.focus();
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            if (modalContent) {
                modalContent.style.animation = '';
            }
        }, 300);
        
        // Announce modal closure to screen readers
        announceToScreenReader('Location information dialog closed');
        
        // Update recommendations after viewing location
        setTimeout(() => {
            updateRecommendationsUI();
        }, 500);
    }
}

function updateStatus(textTh, textEn) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = `${textTh} | ${textEn}`;
        
        // Add a brief animation to the status
        status.style.transform = 'scale(1.05)';
        setTimeout(() => {
            status.style.transform = 'scale(1)';
        }, 200);
    }
}

function initializeMap() {
    // Show loading spinner immediately
    showLoadingSpinner();
    
    // Initialize user behavior tracking
    userBehavior.totalSessions++;
    userBehavior.sessionStart = Date.now();
    saveBehaviorData();
    
    // Initialize core features first
    initializeTheme();
    initializeLanguage();
    initializeFontLoading();
    
    // Initialize mascot system
    initializeMascot();
    
    // Self-contained enhanced 3D map
    initializeEnhanced3D();
    
    // Initialize other UI features
    initializeSearch();
    initializeCategoryFilter();
    initializeLocationComparison();
    initializeFavorites();
    initializeKeyboardNavigation();
    updateWeatherInfo();
    updateInterfaceLanguage();
    
    // Initialize performance features
    preloadCriticalImages();
    initializeLazyLoading();
    
    // Initialize responsive and touch enhancements
    initializeTouchEnhancements();
    initializeResponsiveEnhancements();
    initializePerformanceMonitoring();
    
    // Initialize enhanced UX/UI features after short delay
    setTimeout(() => {
        initializeEnhancedUX();
        
        // Initialize recommendations system
        updateRecommendationsUI();
        
        hideLoadingSpinner();
        updateStatus('🌍 สร้างโลก 3D ปรับปรุงแล้วสำเร็จ!', '🌍 Enhanced 3D Globe created successfully!');
        console.log('🗺️ PaiNaiDee Enhanced 3D Map with Mascot loaded successfully!');
    }, 1000);
    
    // Show welcome notification
    setTimeout(() => {
        showNotification(getText('globeCreated'), 'success');
    }, 2000);
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

// ========================================
// ENHANCED UX/UI IMPROVEMENTS
// ========================================

// Enhanced marker click handling for better stability
function enhanceMarkerInteractions() {
    const markers = document.querySelectorAll('.marker');
    
    markers.forEach(marker => {
        // Add larger click area
        const clickArea = document.createElement('div');
        clickArea.style.cssText = `
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            cursor: pointer;
            z-index: 101;
        `;
        marker.appendChild(clickArea);
        
        // Pause animation on hover for stable clicking
        marker.addEventListener('mouseenter', () => {
            marker.style.animationPlayState = 'paused';
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.style.animationPlayState = 'running';
        });
        
        // Add ripple effect on click
        marker.addEventListener('click', (e) => {
            createRippleEffect(e.target, e.clientX, e.clientY);
        });
    });
}

// Create ripple effect for better click feedback
function createRippleEffect(element, x, y) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        left: ${x - rect.left - size/2}px;
        top: ${y - rect.top - size/2}px;
        z-index: 1000;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced favorite button animations
function enhanceFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Add bounce animation
            this.style.animation = 'favorite-bounce 0.6s ease';
            
            // Toggle favorited state
            const locationKey = this.dataset.location;
            const isFavorited = favorites.includes(locationKey);
            
            if (!isFavorited) {
                // Add sparkle effect
                createSparkleEffect(this);
                this.innerHTML = '⭐';
                showNotification(getText('addedFavorite'), 'success');
            } else {
                this.innerHTML = '☆';
                showNotification(getText('removedFavorite'), 'info');
            }
            
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// Create sparkle effect for favorite actions
function createSparkleEffect(element) {
    const sparkles = ['✨', '⭐', '💫'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                font-size: 1rem;
                pointer-events: none;
                z-index: 1000;
                animation: sparkle-float 1s ease-out forwards;
            `;
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 100);
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        color: var(--panel-text);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-lg);
        z-index: 1200;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        font-weight: 500;
    `;
    
    if (type === 'success') {
        notification.style.borderColor = '#4ade80';
    } else if (type === 'error') {
        notification.style.borderColor = '#f87171';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Enhanced loading states
function showLoadingState(element, text = 'Loading...') {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
        <div class="loading-text">${text}</div>
    `;
    
    loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999;
        border-radius: inherit;
    `;
    
    element.style.position = 'relative';
    element.appendChild(loadingOverlay);
    
    return loadingOverlay;
}

// Enhanced button interactions with animations
function enhanceButtonInteractions() {
    const buttons = document.querySelectorAll('button:not(.enhanced)');
    
    buttons.forEach((button, index) => {
        button.classList.add('enhanced');
        
        // Add staggered entrance animation
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        setTimeout(() => {
            button.style.transition = 'all 0.4s ease-out';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 50 * index);
        
        // Add loading state capability
        button.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) return;
            
            // Add ripple effect
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'button-ripple';
            ripple.style.cssText = `
                position: absolute;
                left: ${e.clientX - rect.left - 10}px;
                top: ${e.clientY - rect.top - 10}px;
                width: 20px;
                height: 20px;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Function to add fade-in animations to content sections
function addContentAnimations() {
    // Add fade-in classes to main content sections
    const infoPanel = document.querySelector('.info-panel');
    const controls = document.querySelector('.controls');
    const globe = document.querySelector('#globe3D');
    
    if (infoPanel) {
        infoPanel.classList.add('slide-in-left');
    }
    
    if (controls) {
        controls.classList.add('slide-in-right');
    }
    
    if (globe) {
        globe.classList.add('scale-in-center');
    }
    
    // Add staggered animations to category filter buttons
    const categoryButtons = document.querySelectorAll('.category-filter-btn');
    categoryButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        setTimeout(() => {
            btn.style.transition = 'all 0.3s ease-out';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
    
    // Add animations to location buttons
    const locationButtons = document.querySelectorAll('.button-row');
    locationButtons.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            row.style.transition = 'all 0.4s ease-out';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 200 + (index * 80));
    });
}

// Initialize enhanced interactions
function initializeEnhancedUX() {
    enhanceMarkerInteractions();
    enhanceFavoriteButtons();
    enhanceButtonInteractions();
    addContentAnimations();
    
    // Add interactive classes to elements
    document.querySelectorAll('.info-panel, .controls, button').forEach(el => {
        el.classList.add('interactive-element');
    });
    
    // Initialize search input enhancements
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.transform = 'scale(1.02)';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.transform = 'scale(1)';
        });
    }
    
    console.log('🎨 Enhanced UX/UI features initialized!');
}

// Add CSS animations for enhanced features
const enhancedAnimations = document.createElement('style');
enhancedAnimations.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes sparkle-float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) rotate(180deg);
            opacity: 0;
        }
    }
    
    .loading-overlay .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid var(--accent-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }
    
    .loading-text {
        color: white;
        font-size: 14px;
        font-weight: 500;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(enhancedAnimations);

// Enhanced startup and welcome experience functions
function startExploring() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const mainContainer = document.getElementById('mapContainer');
    
    markWelcomeSeen();
    
    // Add fade out animation to welcome screen
    welcomeOverlay.classList.add('fade-out');
    
    // Show the main map after animation
    setTimeout(() => {
        welcomeOverlay.style.display = 'none';
        mainContainer.style.opacity = '1';
        mainContainer.style.pointerEvents = 'auto';
        
        // Start globe rotation and show notification
        isRotating = true;
        updateStatus(
            `🚀 ${getText('exploring')} | เริ่มต้นการสำรวจแล้ว!`,
            `🚀 ${getText('exploring')} | Exploration started!`
        );
        
        // Show welcome notification with enhanced start guidance
        showNotification(
            userPreferences.language === 'th' ? 
            '🎉 ยินดีต้อนรับ! เริ่มสำรวจโลก 3D ได้เลย' : 
            '🎉 Welcome! Start exploring the 3D world',
            'success'
        );
        
        // Add gentle hint for first interaction after 3 seconds
        setTimeout(() => {
            showStartHint();
        }, 3000);
        
        console.log('🚀 Welcome experience completed - Starting exploration!');
    }, 800);
}

// Add a gentle hint system for new users after starting
function showStartHint() {
    const hasSeenHint = localStorage.getItem('painaidee-seen-start-hint');
    if (hasSeenHint === 'true') {
        return; // Don't show hint if user has seen it before
    }
    
    const isThaiLang = userPreferences.language === 'th';
    const hintMessage = isThaiLang ? 
        '💡 เคล็ดลับ: ลองคลิกที่จุดสีทองบนโลกเพื่อดูข้อมูลสถานที่!' :
        '💡 Tip: Try clicking the golden dots on the globe to see location details!';
    
    showNotification(hintMessage, 'info');
    
    // Mark hint as seen
    localStorage.setItem('painaidee-seen-start-hint', 'true');
    
    // Add subtle visual indicator to first marker for 10 seconds
    const bangkokMarker = document.querySelector('.marker.bangkok');
    if (bangkokMarker) {
        bangkokMarker.style.animation = 'markerStartHint 3s ease-in-out 3';
        setTimeout(() => {
            bangkokMarker.style.animation = 'markerPulseGentle 3s ease-in-out infinite';
        }, 9000);
    }
}

function startGuidedTour() {
    // Start the guided tour experience
    startExploring();
    
    // Begin automated tour after a short delay
    setTimeout(() => {
        startAutoTour();
    }, 1500);
}

function startAutoTour() {
    const tourLocations = ['bangkok', 'chiangmai', 'phuket'];
    let currentTourIndex = 0;
    
    const nextLocation = () => {
        if (currentTourIndex < tourLocations.length) {
            const location = tourLocations[currentTourIndex];
            
            // Add tour progress notification
            showNotification(
                userPreferences.language === 'th' ? 
                `🎯 ทัวร์แนะนำ (${currentTourIndex + 1}/${tourLocations.length}): ${locations[location].name}` : 
                `🎯 Guided Tour (${currentTourIndex + 1}/${tourLocations.length}): ${locations[location].nameEn}`,
                'info'
            );
            
            focusLocation(location);
            
            // Show info after focusing
            setTimeout(() => {
                showInfo(location);
            }, 1000);
            
            currentTourIndex++;
            
            // Move to next location after 6 seconds (increased time for better user experience)
            if (currentTourIndex < tourLocations.length) {
                setTimeout(nextLocation, 6000);
            } else {
                // Tour completed - wait a bit then show completion message
                setTimeout(() => {
                    // Close any open modal first
                    const modal = document.querySelector('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                    
                    showNotification(
                        userPreferences.language === 'th' ? 
                        '✨ ทัวร์แนะนำเสร็จสิ้น! สำรวจต่อได้ตามใจชอบ' : 
                        '✨ Guided tour completed! Explore freely now',
                        'success'
                    );
                }, 6000);
            }
        }
    };
    
    showNotification(
        userPreferences.language === 'th' ? 
        '🎯 เริ่มทัวร์แนะนำแล้ว...' : 
        '🎯 Starting guided tour...',
        'info'
    );
    
    // Start the tour after a short delay
    setTimeout(nextLocation, 1000);
}

function skipToMap() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const mainContainer = document.getElementById('mapContainer');
    
    // Quick fade out animation
    welcomeOverlay.classList.add('fade-out');
    
    setTimeout(() => {
        welcomeOverlay.style.display = 'none';
        mainContainer.style.opacity = '1';
        mainContainer.style.pointerEvents = 'auto';
        
        console.log('⚡ Skipped to map directly');
    }, 400);
}

// Enhanced initialization with welcome screen
function initializeEnhancedStartup() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const mainContainer = document.getElementById('mapContainer');
    
    // Initially hide the main container
    mainContainer.style.opacity = '0';
    mainContainer.style.pointerEvents = 'none';
    
    // Show loading spinner first with enhanced start message
    loadingSpinner.style.display = 'flex';
    
    // Update status to indicate ready to start
    updateStatus(
        `🚀 ${getText('startReady')} | กำลังเริ่มต้น...`,
        `🚀 ${getText('startReady')} | Initializing...`
    );
    
    // Hide loading spinner after 2 seconds and show welcome screen
    setTimeout(() => {
        loadingSpinner.classList.add('fade-out');
        
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            welcomeOverlay.style.display = 'flex';
            
            // Update status when welcome screen is shown
            updateStatus(
                `🎉 ยินดีต้อนรับ! เริ่มสำรวจได้เลย`,
                `🎉 Welcome! Ready to start exploring`
            );
            
            console.log('🎨 Enhanced welcome screen displayed!');
        }, 500);
    }, 1800); // Slightly faster loading for better start experience
    
    // Check if user has seen welcome before
    const hasSeenWelcome = localStorage.getItem('painaidee-seen-welcome');
    if (hasSeenWelcome === 'true') {
        // Skip welcome for returning users but still show loading
        setTimeout(() => {
            skipToMap();
        }, 2200); // Optimized timing for returning users
    }
}

// Save welcome seen status
function markWelcomeSeen() {
    localStorage.setItem('painaidee-seen-welcome', 'true');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeEnhancedStartup();
});

// Add CSS animations for mini-map features
const mapRippleStyle = document.createElement('style');
mapRippleStyle.textContent = `
    @keyframes mapRipple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes popupFadeIn {
        0% {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .svg-mini-map {
        cursor: crosshair;
    }
    
    .svg-attraction-marker {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .svg-location-marker {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .svg-location-marker:hover {
        stroke-width: 3 !important;
    }
    
    .svg-popup-content {
        position: relative;
    }
    
    .popup-close {
        position: absolute;
        top: -10px;
        right: -10px;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .popup-close:hover {
        background: #ff4444;
        transform: scale(1.1);
    }
`;
document.head.appendChild(mapRippleStyle);