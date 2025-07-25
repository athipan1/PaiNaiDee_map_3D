// PaiNaiDee Iterative Design System for User Testing and Feedback Collection
// สร้าง Prototype หรือ Mockup เพื่อทดสอบกับผู้ใช้จริง รับ Feedback และปรับปรุงการออกแบบ UX/UI

// ========================================
// ITERATIVE DESIGN SYSTEM CONFIGURATION
// ========================================

let iterativeDesign = {
    initialized: false,
    currentVariant: 'A', // Default design variant
    testingMode: false,
    feedbackEnabled: true,
    analyticsEnabled: true,
    userSession: {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        variant: 'A',
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    },
    metrics: {
        interactions: [],
        feedbackSubmissions: [],
        taskCompletions: [],
        errorEvents: [],
        performanceMetrics: {}
    }
};

// ========================================
// USER FEEDBACK COLLECTION SYSTEM
// ========================================

function initializeFeedbackSystem() {
    createFeedbackWidgets();
    initializeUserSurveys();
    initializeQuickFeedback();
    initializeRatingSystem();
    setupFeedbackTriggers();
    
    console.log('📝 User Feedback Collection System initialized');
}

// Create floating feedback widgets
function createFeedbackWidgets() {
    // Main feedback button
    const feedbackButton = document.createElement('div');
    feedbackButton.id = 'feedbackWidget';
    feedbackButton.className = 'feedback-widget';
    feedbackButton.innerHTML = `
        <div class="feedback-button" onclick="openFeedbackModal()">
            <span class="feedback-icon">💬</span>
            <span class="feedback-text">${userPreferences.language === 'th' ? 'แสดงความคิดเห็น' : 'Feedback'}</span>
        </div>
    `;
    
    // Quick feedback mini-widget
    const quickFeedback = document.createElement('div');
    quickFeedback.id = 'quickFeedbackWidget';
    quickFeedback.className = 'quick-feedback-widget';
    quickFeedback.innerHTML = `
        <div class="quick-feedback-content">
            <p>${userPreferences.language === 'th' ? 'ใช้งานง่ายไหม?' : 'Easy to use?'}</p>
            <div class="quick-rating">
                <button onclick="submitQuickFeedback('easy')" class="quick-btn positive">😊</button>
                <button onclick="submitQuickFeedback('difficult')" class="quick-btn negative">😕</button>
            </div>
        </div>
        <button class="quick-close" onclick="closeQuickFeedback()">×</button>
    `;
    
    document.body.appendChild(feedbackButton);
    document.body.appendChild(quickFeedback);
    
    // Show quick feedback after user interaction
    setTimeout(() => {
        if (!localStorage.getItem('painaidee-quick-feedback-shown')) {
            showQuickFeedback();
        }
    }, 30000); // Show after 30 seconds
}

// Create comprehensive feedback modal
function openFeedbackModal() {
    const modal = document.createElement('div');
    modal.id = 'feedbackModal';
    modal.className = 'feedback-modal-overlay';
    modal.innerHTML = `
        <div class="feedback-modal">
            <div class="feedback-modal-header">
                <h2>${userPreferences.language === 'th' ? '📝 ช่วยเราปรับปรุงได้ไหม?' : '📝 Help Us Improve'}</h2>
                <button class="feedback-close" onclick="closeFeedbackModal()">×</button>
            </div>
            <div class="feedback-modal-body">
                <!-- Overall Experience Rating -->
                <div class="feedback-section">
                    <h3>${userPreferences.language === 'th' ? '⭐ ประสบการณ์โดยรวม' : '⭐ Overall Experience'}</h3>
                    <div class="star-rating" data-rating="0">
                        ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}">☆</span>`).join('')}
                    </div>
                </div>
                
                <!-- Usability Questions -->
                <div class="feedback-section">
                    <h3>${userPreferences.language === 'th' ? '🎯 การใช้งาน' : '🎯 Usability'}</h3>
                    <div class="feedback-question">
                        <label>${userPreferences.language === 'th' ? 'หาสถานที่ได้ง่ายไหม?' : 'Easy to find locations?'}</label>
                        <div class="rating-scale">
                            ${[1,2,3,4,5].map(i => `
                                <input type="radio" name="ease_of_use" value="${i}" id="ease_${i}">
                                <label for="ease_${i}">${i}</label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="feedback-question">
                        <label>${userPreferences.language === 'th' ? 'ข้อมูลครบถ้วนไหม?' : 'Information comprehensive?'}</label>
                        <div class="rating-scale">
                            ${[1,2,3,4,5].map(i => `
                                <input type="radio" name="information_quality" value="${i}" id="info_${i}">
                                <label for="info_${i}">${i}</label>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Feature Feedback -->
                <div class="feedback-section">
                    <h3>${userPreferences.language === 'th' ? '🔧 ฟีเจอร์ที่ชอบ' : '🔧 Favorite Features'}</h3>
                    <div class="feature-checkboxes">
                        <label><input type="checkbox" value="3d_globe"> ${userPreferences.language === 'th' ? 'โลก 3D' : '3D Globe'}</label>
                        <label><input type="checkbox" value="search"> ${userPreferences.language === 'th' ? 'การค้นหา' : 'Search'}</label>
                        <label><input type="checkbox" value="favorites"> ${userPreferences.language === 'th' ? 'รายการโปรด' : 'Favorites'}</label>
                        <label><input type="checkbox" value="trip_planner"> ${userPreferences.language === 'th' ? 'วางแผนทริป' : 'Trip Planner'}</label>
                        <label><input type="checkbox" value="mascot"> ${userPreferences.language === 'th' ? 'ช้างน้อย PaiNai' : 'PaiNai Mascot'}</label>
                        <label><input type="checkbox" value="themes"> ${userPreferences.language === 'th' ? 'ธีมสี' : 'Color Themes'}</label>
                    </div>
                </div>
                
                <!-- Improvement Suggestions -->
                <div class="feedback-section">
                    <h3>${userPreferences.language === 'th' ? '💡 ข้อเสนอแนะ' : '💡 Suggestions'}</h3>
                    <textarea 
                        id="suggestionText" 
                        placeholder="${userPreferences.language === 'th' ? 'บอกเราได้ว่าอยากให้ปรับปรุงอะไร หรือเพิ่มฟีเจอร์อะไร...' : 'Tell us what you\'d like us to improve or add...'}"
                        rows="4"
                    ></textarea>
                </div>
                
                <!-- User Info -->
                <div class="feedback-section">
                    <h3>${userPreferences.language === 'th' ? '👤 ข้อมูล (ไม่บังคับ)' : '👤 Info (Optional)'}</h3>
                    <div class="user-info-inputs">
                        <input type="text" id="userAge" placeholder="${userPreferences.language === 'th' ? 'อายุ' : 'Age'}">
                        <select id="userType">
                            <option value="">${userPreferences.language === 'th' ? 'ประเภทผู้ใช้' : 'User Type'}</option>
                            <option value="tourist">${userPreferences.language === 'th' ? 'นักท่องเที่ยว' : 'Tourist'}</option>
                            <option value="local">${userPreferences.language === 'th' ? 'คนท้องถิ่น' : 'Local'}</option>
                            <option value="business">${userPreferences.language === 'th' ? 'ธุรกิจ' : 'Business'}</option>
                            <option value="student">${userPreferences.language === 'th' ? 'นักเรียน/นักศึกษา' : 'Student'}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="feedback-modal-footer">
                <button class="feedback-submit-btn" onclick="submitFeedback()">
                    ${userPreferences.language === 'th' ? '📤 ส่งความคิดเห็น' : '📤 Submit Feedback'}
                </button>
                <button class="feedback-cancel-btn" onclick="closeFeedbackModal()">
                    ${userPreferences.language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize star rating
    initializeStarRating();
    
    // Track modal open
    trackUserInteraction('feedback_modal_opened', {
        trigger: 'manual',
        timestamp: Date.now()
    });
}

// Initialize star rating interaction
function initializeStarRating() {
    const starRating = document.querySelector('.star-rating');
    const stars = starRating.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            starRating.dataset.rating = rating;
            
            stars.forEach((s, i) => {
                s.textContent = i < rating ? '★' : '☆';
                s.classList.toggle('active', i < rating);
            });
        });
        
        star.addEventListener('mouseover', () => {
            stars.forEach((s, i) => {
                s.textContent = i <= index ? '★' : '☆';
            });
        });
    });
    
    starRating.addEventListener('mouseleave', () => {
        const currentRating = parseInt(starRating.dataset.rating);
        stars.forEach((s, i) => {
            s.textContent = i < currentRating ? '★' : '☆';
        });
    });
}

// Submit comprehensive feedback
function submitFeedback() {
    const feedbackData = {
        timestamp: Date.now(),
        sessionId: iterativeDesign.userSession.sessionId,
        variant: iterativeDesign.currentVariant,
        overallRating: document.querySelector('.star-rating').dataset.rating,
        easeOfUse: document.querySelector('input[name="ease_of_use"]:checked')?.value,
        informationQuality: document.querySelector('input[name="information_quality"]:checked')?.value,
        favoriteFeatures: Array.from(document.querySelectorAll('.feature-checkboxes input:checked')).map(cb => cb.value),
        suggestions: document.getElementById('suggestionText').value,
        userAge: document.getElementById('userAge').value,
        userType: document.getElementById('userType').value,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        language: userPreferences.language
    };
    
    // Store feedback locally and send to analytics
    storeFeedbackData(feedbackData);
    sendFeedbackToAnalytics(feedbackData);
    
    // Show thank you message
    showFeedbackThankYou();
    
    // Close modal
    closeFeedbackModal();
    
    // Track submission
    trackUserInteraction('feedback_submitted', feedbackData);
    
    console.log('📊 User feedback submitted:', feedbackData);
}

// Quick feedback system
function showQuickFeedback() {
    const widget = document.getElementById('quickFeedbackWidget');
    if (widget) {
        widget.style.display = 'block';
        setTimeout(() => widget.classList.add('show'), 100);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (widget.classList.contains('show')) {
                closeQuickFeedback();
            }
        }, 10000);
    }
}

function submitQuickFeedback(rating) {
    const quickFeedbackData = {
        type: 'quick_feedback',
        rating: rating,
        timestamp: Date.now(),
        sessionId: iterativeDesign.userSession.sessionId,
        variant: iterativeDesign.currentVariant,
        pageUrl: window.location.href,
        timeOnPage: Date.now() - iterativeDesign.userSession.startTime
    };
    
    storeFeedbackData(quickFeedbackData);
    sendFeedbackToAnalytics(quickFeedbackData);
    
    // Show thank you message
    const widget = document.getElementById('quickFeedbackWidget');
    if (widget) {
        widget.innerHTML = `
            <div class="thank-you-message">
                <p>🙏 ${userPreferences.language === 'th' ? 'ขอบคุณค่ะ!' : 'Thank you!'}</p>
            </div>
        `;
        setTimeout(() => closeQuickFeedback(), 2000);
    }
    
    localStorage.setItem('painaidee-quick-feedback-shown', 'true');
    
    trackUserInteraction('quick_feedback_submitted', quickFeedbackData);
}

function closeQuickFeedback() {
    const widget = document.getElementById('quickFeedbackWidget');
    if (widget) {
        widget.classList.remove('show');
        setTimeout(() => widget.style.display = 'none', 300);
    }
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => modal.remove(), 300);
    }
}

// ========================================
// A/B TESTING FRAMEWORK
// ========================================

function initializeABTesting() {
    // Determine which variant to show this user
    determineUserVariant();
    
    // Apply variant-specific changes
    applyDesignVariant(iterativeDesign.currentVariant);
    
    // Track variant assignment
    trackUserInteraction('variant_assigned', {
        variant: iterativeDesign.currentVariant,
        assignmentMethod: 'random',
        timestamp: Date.now()
    });
    
    console.log(`🧪 A/B Testing initialized - User assigned to variant: ${iterativeDesign.currentVariant}`);
}

function determineUserVariant() {
    // Check if user already has an assigned variant
    const storedVariant = localStorage.getItem('painaidee-ab-variant');
    
    if (storedVariant && ['A', 'B', 'C'].includes(storedVariant)) {
        iterativeDesign.currentVariant = storedVariant;
    } else {
        // Randomly assign variant (33.33% each)
        const variants = ['A', 'B', 'C'];
        const randomIndex = Math.floor(Math.random() * variants.length);
        iterativeDesign.currentVariant = variants[randomIndex];
        
        // Store assignment
        localStorage.setItem('painaidee-ab-variant', iterativeDesign.currentVariant);
    }
    
    // Update session info
    iterativeDesign.userSession.variant = iterativeDesign.currentVariant;
}

function applyDesignVariant(variant) {
    const body = document.body;
    
    // Remove existing variant classes
    body.classList.remove('variant-a', 'variant-b', 'variant-c');
    
    // Apply current variant
    body.classList.add(`variant-${variant.toLowerCase()}`);
    
    switch(variant) {
        case 'A': // Original design
            applyVariantA();
            break;
        case 'B': // Enhanced mascot interaction
            applyVariantB();
            break;
        case 'C': // Simplified interface
            applyVariantC();
            break;
    }
    
    console.log(`🎨 Applied design variant: ${variant}`);
}

function applyVariantA() {
    // Original design - no changes needed
    console.log('🅰️ Variant A: Original design applied');
}

function applyVariantB() {
    // Enhanced mascot with more proactive guidance
    console.log('🅱️ Variant B: Enhanced mascot interaction applied');
    
    // More frequent mascot tips
    if (window.mascotInteractionInterval) {
        clearInterval(window.mascotInteractionInterval);
    }
    
    window.mascotInteractionInterval = setInterval(() => {
        if (Date.now() - lastMascotInteraction > 15000) { // More frequent tips
            showIntelligentTip();
        }
    }, 15000);
    
    // Enhanced mascot animations
    const mascot = document.getElementById('floatingMascot');
    if (mascot) {
        mascot.style.animation = 'floatingMascotBounce 2s ease-in-out infinite';
    }
}

function applyVariantC() {
    // Simplified interface with reduced clutter
    console.log('🅲️ Variant C: Simplified interface applied');
    
    // Hide some advanced features for simpler experience
    const advancedSections = document.querySelectorAll(
        '.comparison-section, .trip-wizard-section, .route-planning-section'
    );
    
    advancedSections.forEach(section => {
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Simplify controls panel
    const controlsPanel = document.querySelector('.controls h3');
    if (controlsPanel) {
        controlsPanel.textContent = userPreferences.language === 'th' ? 
            '🗺️ เลือกสถานที่' : '🗺️ Choose Location';
    }
}

// ========================================
// ANALYTICS AND INTERACTION TRACKING
// ========================================

function initializeAnalytics() {
    setupInteractionTracking();
    setupPerformanceMonitoring();
    startSessionTracking();
    
    console.log('📊 Analytics and interaction tracking initialized');
}

function setupInteractionTracking() {
    // Track clicks on all interactive elements
    document.addEventListener('click', (e) => {
        const element = e.target;
        
        // Track different types of interactions
        if (element.classList.contains('marker')) {
            trackUserInteraction('marker_click', {
                location: element.className.split(' ').find(cls => cls !== 'marker'),
                timestamp: Date.now(),
                coordinates: [e.clientX, e.clientY]
            });
        } else if (element.closest('button')) {
            const button = element.closest('button');
            trackUserInteraction('button_click', {
                buttonText: button.textContent.trim(),
                buttonClass: button.className,
                timestamp: Date.now()
            });
        } else if (element.classList.contains('search-result-item')) {
            trackUserInteraction('search_result_click', {
                searchTerm: document.getElementById('searchInput')?.value,
                resultText: element.textContent.trim(),
                timestamp: Date.now()
            });
        }
    });
    
    // Track search behavior
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                trackUserInteraction('search_query', {
                    query: e.target.value,
                    queryLength: e.target.value.length,
                    timestamp: Date.now()
                });
            }, 1000);
        });
    }
    
    // Track scroll behavior in modal
    document.addEventListener('scroll', debounce((e) => {
        if (e.target.closest('.location-modal')) {
            trackUserInteraction('modal_scroll', {
                scrollTop: e.target.scrollTop,
                timestamp: Date.now()
            });
        }
    }, 500));
    
    // Track hover time on important elements
    const importantElements = document.querySelectorAll('.marker, .info-panel, .controls');
    importantElements.forEach(element => {
        let hoverStart = 0;
        
        element.addEventListener('mouseenter', () => {
            hoverStart = Date.now();
        });
        
        element.addEventListener('mouseleave', () => {
            if (hoverStart > 0) {
                const hoverDuration = Date.now() - hoverStart;
                if (hoverDuration > 1000) { // Track hovers longer than 1 second
                    trackUserInteraction('element_hover', {
                        elementClass: element.className,
                        hoverDuration: hoverDuration,
                        timestamp: Date.now()
                    });
                }
            }
        });
    });
}

function trackUserInteraction(type, data) {
    const interaction = {
        type: type,
        timestamp: Date.now(),
        sessionId: iterativeDesign.userSession.sessionId,
        variant: iterativeDesign.currentVariant,
        url: window.location.href,
        userAgent: navigator.userAgent,
        data: data
    };
    
    // Store in local storage
    iterativeDesign.metrics.interactions.push(interaction);
    
    // Keep only last 1000 interactions to prevent storage overflow
    if (iterativeDesign.metrics.interactions.length > 1000) {
        iterativeDesign.metrics.interactions = iterativeDesign.metrics.interactions.slice(-1000);
    }
    
    // Save to local storage
    saveAnalyticsData();
    
    // Send to external analytics service (placeholder)
    sendToAnalyticsService(interaction);
}

function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            trackUserInteraction('page_performance', {
                loadTime: perfData.loadEventEnd - perfData.fetchStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
            });
        }, 1000);
    });
    
    // Monitor JavaScript errors
    window.addEventListener('error', (e) => {
        trackUserInteraction('javascript_error', {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno,
            stack: e.error?.stack
        });
    });
    
    // Monitor resource loading errors
    window.addEventListener('error', (e) => {
        if (e.target !== window) {
            trackUserInteraction('resource_error', {
                tagName: e.target.tagName,
                src: e.target.src || e.target.href,
                type: e.target.type
            });
        }
    }, true);
}

// ========================================
// DATA STORAGE AND EXPORT
// ========================================

function storeFeedbackData(feedbackData) {
    const existingFeedback = JSON.parse(localStorage.getItem('painaidee-feedback-data') || '[]');
    existingFeedback.push(feedbackData);
    
    // Keep only last 100 feedback entries
    if (existingFeedback.length > 100) {
        existingFeedback.splice(0, existingFeedback.length - 100);
    }
    
    localStorage.setItem('painaidee-feedback-data', JSON.stringify(existingFeedback));
}

function saveAnalyticsData() {
    try {
        localStorage.setItem('painaidee-analytics-data', JSON.stringify(iterativeDesign.metrics));
    } catch (e) {
        console.warn('Analytics data storage full, clearing old data');
        // Clear old data if storage is full
        iterativeDesign.metrics.interactions = iterativeDesign.metrics.interactions.slice(-500);
        localStorage.setItem('painaidee-analytics-data', JSON.stringify(iterativeDesign.metrics));
    }
}

function exportAnalyticsData() {
    const allData = {
        feedback: JSON.parse(localStorage.getItem('painaidee-feedback-data') || '[]'),
        analytics: iterativeDesign.metrics,
        userSession: iterativeDesign.userSession,
        exportTimestamp: Date.now()
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `painaidee-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('📁 Analytics data exported');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function sendFeedbackToAnalytics(feedbackData) {
    // Placeholder for sending to external analytics service
    console.log('📡 Feedback sent to analytics:', feedbackData);
    
    // In a real implementation, this would send data to:
    // - Google Analytics
    // - Mixpanel
    // - Custom analytics server
    // - User feedback aggregation service
}

function sendToAnalyticsService(interactionData) {
    // Placeholder for sending to external analytics service
    // Only send important interactions to avoid spam
    const importantInteractions = [
        'marker_click', 'feedback_submitted', 'variant_assigned', 
        'javascript_error', 'page_performance'
    ];
    
    if (importantInteractions.includes(interactionData.type)) {
        console.log('📡 Interaction sent to analytics:', interactionData.type);
    }
}

function showFeedbackThankYou() {
    const thankYouMessage = document.createElement('div');
    thankYouMessage.className = 'thank-you-notification';
    thankYouMessage.innerHTML = `
        <div class="thank-you-content">
            <h3>🙏 ${userPreferences.language === 'th' ? 'ขอบคุณมากค่ะ!' : 'Thank You!'}</h3>
            <p>${userPreferences.language === 'th' ? 
                'ความคิดเห็นของคุณมีคุณค่ามาก เราจะนำไปปรับปรุงให้ดีขึ้น' : 
                'Your feedback is valuable and will help us improve the experience'}</p>
        </div>
    `;
    
    thankYouMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        text-align: center;
        z-index: 1300;
        animation: thankYouFadeIn 0.5s ease-out;
    `;
    
    document.body.appendChild(thankYouMessage);
    
    setTimeout(() => {
        thankYouMessage.style.animation = 'thankYouFadeOut 0.5s ease-out';
        setTimeout(() => thankYouMessage.remove(), 500);
    }, 3000);
}

function startSessionTracking() {
    // Track session duration
    setInterval(() => {
        const sessionDuration = Date.now() - iterativeDesign.userSession.startTime;
        
        // Track milestone durations
        const milestones = [60000, 300000, 600000, 1800000]; // 1min, 5min, 10min, 30min
        milestones.forEach(milestone => {
            if (sessionDuration >= milestone && !iterativeDesign.userSession[`milestone_${milestone}`]) {
                iterativeDesign.userSession[`milestone_${milestone}`] = true;
                trackUserInteraction('session_milestone', {
                    milestone: milestone,
                    sessionDuration: sessionDuration
                });
            }
        });
    }, 30000); // Check every 30 seconds
    
    // Track when user leaves the page
    window.addEventListener('beforeunload', () => {
        const sessionData = {
            sessionId: iterativeDesign.userSession.sessionId,
            variant: iterativeDesign.currentVariant,
            duration: Date.now() - iterativeDesign.userSession.startTime,
            interactions: iterativeDesign.metrics.interactions.length,
            timestamp: Date.now()
        };
        
        localStorage.setItem('painaidee-session-end', JSON.stringify(sessionData));
    });
}

// ========================================
// ADMIN DASHBOARD FOR VIEWING ANALYTICS
// ========================================

function createAnalyticsDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'analyticsDashboard';
    dashboard.className = 'analytics-dashboard hidden';
    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h2>📊 Analytics Dashboard</h2>
            <div class="dashboard-controls">
                <button onclick="exportAnalyticsData()">📁 Export Data</button>
                <button onclick="clearAnalyticsData()">🗑️ Clear Data</button>
                <button onclick="toggleAnalyticsDashboard()">×</button>
            </div>
        </div>
        <div class="dashboard-content">
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Current Variant</h3>
                    <p class="stat-value">${iterativeDesign.currentVariant}</p>
                </div>
                <div class="stat-card">
                    <h3>Session Duration</h3>
                    <p class="stat-value" id="sessionDuration">0m</p>
                </div>
                <div class="stat-card">
                    <h3>Interactions</h3>
                    <p class="stat-value">${iterativeDesign.metrics.interactions.length}</p>
                </div>
                <div class="stat-card">
                    <h3>Feedback Count</h3>
                    <p class="stat-value">${JSON.parse(localStorage.getItem('painaidee-feedback-data') || '[]').length}</p>
                </div>
            </div>
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>Interaction Types</h3>
                    <div id="interactionChart"></div>
                </div>
                <div class="chart-container">
                    <h3>Recent Activity</h3>
                    <div id="activityTimeline"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dashboard);
    
    // Update session duration every second
    setInterval(() => {
        const duration = Math.floor((Date.now() - iterativeDesign.userSession.startTime) / 60000);
        const durationElement = document.getElementById('sessionDuration');
        if (durationElement) {
            durationElement.textContent = `${duration}m`;
        }
    }, 1000);
}

function toggleAnalyticsDashboard() {
    const dashboard = document.getElementById('analyticsDashboard');
    if (dashboard) {
        dashboard.classList.toggle('hidden');
    } else {
        createAnalyticsDashboard();
    }
}

function clearAnalyticsData() {
    if (confirm('Clear all analytics data? This cannot be undone.')) {
        localStorage.removeItem('painaidee-analytics-data');
        localStorage.removeItem('painaidee-feedback-data');
        iterativeDesign.metrics = {
            interactions: [],
            feedbackSubmissions: [],
            taskCompletions: [],
            errorEvents: [],
            performanceMetrics: {}
        };
        console.log('🗑️ Analytics data cleared');
        location.reload();
    }
}

// ========================================
// INITIALIZATION
// ========================================

function initializeIterativeDesign() {
    if (iterativeDesign.initialized) return;
    
    console.log('🚀 Initializing Iterative Design System...');
    
    // Initialize all components
    initializeFeedbackSystem();
    initializeABTesting();
    initializeAnalytics();
    
    // Add keyboard shortcut for admin dashboard (Ctrl+Shift+A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            toggleAnalyticsDashboard();
        }
    });
    
    iterativeDesign.initialized = true;
    console.log('✅ Iterative Design System initialized successfully!');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIterativeDesign);
} else {
    initializeIterativeDesign();
}

// Export for global access
window.iterativeDesign = iterativeDesign;
window.initializeIterativeDesign = initializeIterativeDesign;
window.exportAnalyticsData = exportAnalyticsData;
window.toggleAnalyticsDashboard = toggleAnalyticsDashboard;
window.openFeedbackModal = openFeedbackModal;
window.submitQuickFeedback = submitQuickFeedback;
window.closeQuickFeedback = closeQuickFeedback;
window.closeFeedbackModal = closeFeedbackModal;
window.submitFeedback = submitFeedback;