// Enhanced Feedback System for PaiNaiDee 3D Map
// ระบบ Feedback ที่ครอบคลุม สำหรับ Loading, Success, Error, Warning และ Info

// ========================================
// FEEDBACK SYSTEM CORE
// ========================================

class FeedbackSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
        this.defaultDuration = 4000;
        this.container = null;
        this.loadingStates = new Map();
        this.confirmationQueue = [];
        this.init();
    }

    init() {
        this.createContainer();
        this.setupEventListeners();
        this.setupGlobalErrorHandling();
    }

    createContainer() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('feedback-container')) {
            this.container = document.createElement('div');
            this.container.id = 'feedback-container';
            this.container.className = 'feedback-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'false');
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('feedback-container');
        }
    }

    setupEventListeners() {
        // Listen for custom feedback events
        document.addEventListener('feedback:show', (e) => {
            this.show(e.detail);
        });

        document.addEventListener('feedback:loading', (e) => {
            this.showLoading(e.detail);
        });

        document.addEventListener('feedback:success', (e) => {
            this.showSuccess(e.detail);
        });

        document.addEventListener('feedback:error', (e) => {
            this.showError(e.detail);
        });

        document.addEventListener('feedback:confirm', (e) => {
            this.showConfirmation(e.detail);
        });
    }

    setupGlobalErrorHandling() {
        // Catch unhandled errors and show user-friendly messages
        window.addEventListener('error', (e) => {
            console.error('Global error caught:', e.error);
            this.showError({
                message: userPreferences.language === 'th' ? 
                    'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง' :
                    'An unexpected error occurred. Please try again.',
                action: () => window.location.reload(),
                actionText: userPreferences.language === 'th' ? 'รีเฟรชหน้า' : 'Refresh Page'
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showError({
                message: userPreferences.language === 'th' ? 
                    'การเชื่อมต่อมีปัญหา กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต' :
                    'Connection issue. Please check your internet connection.',
                action: () => window.location.reload(),
                actionText: userPreferences.language === 'th' ? 'ลองใหม่' : 'Retry'
            });
        });
    }

    // ========================================
    // CORE NOTIFICATION METHODS
    // ========================================

    show(options) {
        const notification = this.createNotification(options);
        this.addToQueue(notification);
        return notification.id;
    }

    showLoading(options) {
        const loadingOptions = {
            ...options,
            type: 'loading',
            duration: 0, // Loading notifications don't auto-dismiss
            dismissible: false,
            showProgress: true
        };
        return this.show(loadingOptions);
    }

    showSuccess(options) {
        const successOptions = {
            ...options,
            type: 'success',
            duration: options.duration || 3000,
            icon: '✅',
            showCelebration: true
        };
        return this.show(successOptions);
    }

    showError(options) {
        const errorOptions = {
            ...options,
            type: 'error',
            duration: options.duration || 6000, // Longer duration for errors
            icon: '❌',
            dismissible: true,
            persistent: options.persistent || false
        };
        return this.show(errorOptions);
    }

    showWarning(options) {
        const warningOptions = {
            ...options,
            type: 'warning',
            duration: options.duration || 5000,
            icon: '⚠️',
            dismissible: true
        };
        return this.show(warningOptions);
    }

    showInfo(options) {
        const infoOptions = {
            ...options,
            type: 'info',
            duration: options.duration || 4000,
            icon: 'ℹ️',
            dismissible: true
        };
        return this.show(infoOptions);
    }

    // ========================================
    // SPECIALIZED FEEDBACK METHODS
    // ========================================

    showConfirmation(options) {
        return new Promise((resolve) => {
            const modal = this.createConfirmationModal(options, resolve);
            document.body.appendChild(modal);
            // Focus on the modal for accessibility
            setTimeout(() => {
                const firstButton = modal.querySelector('button');
                if (firstButton) firstButton.focus();
            }, 100);
        });
    }

    showProgress(options) {
        const progressOptions = {
            ...options,
            type: 'progress',
            duration: 0,
            dismissible: false,
            showProgress: true,
            progress: options.progress || 0
        };
        return this.show(progressOptions);
    }

    updateProgress(notificationId, progress, message) {
        const notification = document.getElementById(`notification-${notificationId}`);
        if (notification) {
            const progressBar = notification.querySelector('.progress-bar-fill');
            const progressText = notification.querySelector('.progress-text');
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            if (progressText) {
                progressText.textContent = message || `${progress}%`;
            }
            
            // Auto-complete and convert to success when 100%
            if (progress >= 100) {
                setTimeout(() => {
                    this.dismiss(notificationId);
                    this.showSuccess({
                        message: message || (userPreferences.language === 'th' ? 'เสร็จสิ้น!' : 'Complete!')
                    });
                }, 500);
            }
        }
    }

    // ========================================
    // LOADING STATE MANAGEMENT
    // ========================================

    startLoading(key, options = {}) {
        const loadingId = this.showLoading({
            message: options.message || (userPreferences.language === 'th' ? 'กำลังโหลด...' : 'Loading...'),
            ...options
        });
        
        this.loadingStates.set(key, {
            id: loadingId,
            startTime: Date.now(),
            ...options
        });
        
        return loadingId;
    }

    stopLoading(key, result = 'success', message = null) {
        const loadingState = this.loadingStates.get(key);
        if (loadingState) {
            this.dismiss(loadingState.id);
            this.loadingStates.delete(key);
            
            // Show result notification
            if (result === 'success') {
                this.showSuccess({
                    message: message || (userPreferences.language === 'th' ? 'โหลดเสร็จสิ้น' : 'Loaded successfully')
                });
            } else if (result === 'error') {
                this.showError({
                    message: message || (userPreferences.language === 'th' ? 'เกิดข้อผิดพลาดในการโหลด' : 'Loading failed')
                });
            }
        }
    }

    updateLoadingMessage(key, message) {
        const loadingState = this.loadingStates.get(key);
        if (loadingState) {
            const notification = document.getElementById(`notification-${loadingState.id}`);
            if (notification) {
                const messageElement = notification.querySelector('.notification-message');
                if (messageElement) {
                    messageElement.textContent = message;
                }
            }
        }
    }

    // ========================================
    // NOTIFICATION CREATION AND MANAGEMENT
    // ========================================

    createNotification(options) {
        const id = this.generateId();
        const notification = {
            id,
            type: options.type || 'info',
            message: options.message || '',
            title: options.title || '',
            duration: options.duration !== undefined ? options.duration : this.defaultDuration,
            dismissible: options.dismissible !== false,
            persistent: options.persistent || false,
            icon: options.icon || this.getDefaultIcon(options.type),
            action: options.action,
            actionText: options.actionText,
            showProgress: options.showProgress || false,
            progress: options.progress || 0,
            showCelebration: options.showCelebration || false,
            element: null,
            timer: null
        };

        notification.element = this.createNotificationElement(notification);
        return notification;
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.id = `notification-${notification.id}`;
        element.className = `notification notification-${notification.type}`;
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-live', 'assertive');

        // Build notification content
        let content = `
            <div class="notification-content">
                <div class="notification-header">
                    ${notification.icon ? `<span class="notification-icon" role="img" aria-label="${notification.type}">${notification.icon}</span>` : ''}
                    ${notification.title ? `<h4 class="notification-title">${notification.title}</h4>` : ''}
                    ${notification.dismissible ? `<button class="notification-close" aria-label="Close notification" onclick="feedbackSystem.dismiss('${notification.id}')">&times;</button>` : ''}
                </div>
                <div class="notification-body">
                    <p class="notification-message">${notification.message}</p>
                    ${notification.action ? `<button class="notification-action" onclick="feedbackSystem.executeAction('${notification.id}')">${notification.actionText || 'Action'}</button>` : ''}
                </div>
                ${notification.showProgress ? this.createProgressBar(notification.progress) : ''}
            </div>
        `;

        element.innerHTML = content;

        // Add celebration effect for success notifications
        if (notification.showCelebration && notification.type === 'success') {
            this.addCelebrationEffect(element);
        }

        // Add loading animation for loading notifications
        if (notification.type === 'loading') {
            element.classList.add('notification-loading');
        }

        return element;
    }

    createProgressBar(progress = 0) {
        return `
            <div class="notification-progress">
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${progress}%</span>
            </div>
        `;
    }

    createConfirmationModal(options, resolve) {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal confirmation-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');

        const title = options.title || (userPreferences.language === 'th' ? 'ยืนยันการกระทำ' : 'Confirm Action');
        const message = options.message || (userPreferences.language === 'th' ? 'คุณแน่ใจหรือไม่?' : 'Are you sure?');
        const confirmText = options.confirmText || (userPreferences.language === 'th' ? 'ยืนยัน' : 'Confirm');
        const cancelText = options.cancelText || (userPreferences.language === 'th' ? 'ยกเลิก' : 'Cancel');

        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title">${title}</h3>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" data-action="cancel">${cancelText}</button>
                    <button class="btn btn-primary" data-action="confirm">${confirmText}</button>
                </div>
            </div>
        `;

        // Add event listeners
        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeConfirmation(modal, resolve, false);
        });
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeConfirmation(modal, resolve, false);
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            this.closeConfirmation(modal, resolve, false);
        });
        
        modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
            this.closeConfirmation(modal, resolve, true);
        });

        // Add escape key handler
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeConfirmation(modal, resolve, false);
            }
        });

        return modal;
    }

    closeConfirmation(modal, resolve, confirmed) {
        modal.classList.add('fade-out');
        setTimeout(() => {
            if (modal.parentElement) {
                modal.parentElement.removeChild(modal);
            }
            resolve(confirmed);
        }, 300);
    }

    addCelebrationEffect(element) {
        // Add confetti effect for success notifications
        const confetti = document.createElement('div');
        confetti.className = 'celebration-confetti';
        confetti.innerHTML = '🎉✨🎊⭐🌟';
        element.appendChild(confetti);

        // Animate confetti
        setTimeout(() => {
            confetti.classList.add('animate');
        }, 100);

        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentElement) {
                confetti.parentElement.removeChild(confetti);
            }
        }, 2000);
    }

    addToQueue(notification) {
        // Remove oldest notification if we exceed max
        if (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.removeNotification(oldest);
        }

        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // Animate in
        setTimeout(() => {
            notification.element.classList.add('show');
        }, 10);

        // Set auto-dismiss timer
        if (notification.duration > 0 && !notification.persistent) {
            notification.timer = setTimeout(() => {
                this.dismiss(notification.id);
            }, notification.duration);
        }

        // Announce to screen readers
        this.announceToScreenReader(notification);
    }

    dismiss(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            this.removeNotification(notification);
        }
    }

    dismissAll() {
        [...this.notifications].forEach(notification => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        if (notification.timer) {
            clearTimeout(notification.timer);
        }

        if (notification.element && notification.element.parentElement) {
            notification.element.classList.add('hide');
            setTimeout(() => {
                if (notification.element.parentElement) {
                    notification.element.parentElement.removeChild(notification.element);
                }
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== notification.id);
    }

    executeAction(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && notification.action) {
            try {
                notification.action();
                this.dismiss(notificationId);
            } catch (error) {
                console.error('Error executing notification action:', error);
                this.showError({
                    message: userPreferences.language === 'th' ? 
                        'เกิดข้อผิดพลาดในการดำเนินการ' : 
                        'Error executing action'
                });
            }
        }
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getDefaultIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            loading: '⏳',
            progress: '📊'
        };
        return icons[type] || 'ℹ️';
    }

    announceToScreenReader(notification) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `${notification.type}: ${notification.message}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentElement) {
                announcement.parentElement.removeChild(announcement);
            }
        }, 1000);
    }

    // ========================================
    // PUBLIC API FOR COMMON SCENARIOS
    // ========================================

    // Search feedback
    searchStarted() {
        return this.startLoading('search', {
            message: userPreferences.language === 'th' ? 'กำลังค้นหา...' : 'Searching...'
        });
    }

    searchCompleted(results) {
        this.stopLoading('search', 'success', 
            userPreferences.language === 'th' ? 
                `พบผลการค้นหา ${results} รายการ` : 
                `Found ${results} results`
        );
    }

    searchFailed() {
        this.stopLoading('search', 'error', 
            userPreferences.language === 'th' ? 
                'ไม่พบผลการค้นหา' : 
                'No results found'
        );
    }

    // Location loading feedback
    locationLoadStarted(locationName) {
        return this.startLoading('location', {
            message: userPreferences.language === 'th' ? 
                `กำลังโหลดข้อมูล ${locationName}...` : 
                `Loading ${locationName} data...`
        });
    }

    locationLoadCompleted(locationName) {
        this.stopLoading('location', 'success', 
            userPreferences.language === 'th' ? 
                `โหลดข้อมูล ${locationName} เสร็จสิ้น` : 
                `${locationName} data loaded`
        );
    }

    locationLoadFailed(locationName) {
        this.stopLoading('location', 'error', 
            userPreferences.language === 'th' ? 
                `ไม่สามารถโหลดข้อมูล ${locationName} ได้` : 
                `Failed to load ${locationName} data`
        );
    }

    // Favorites feedback
    addedToFavorites(locationName) {
        this.showSuccess({
            message: userPreferences.language === 'th' ? 
                `เพิ่ม ${locationName} ในรายการโปรดแล้ว` : 
                `Added ${locationName} to favorites`,
            showCelebration: true
        });
    }

    removedFromFavorites(locationName) {
        this.showInfo({
            message: userPreferences.language === 'th' ? 
                `ลบ ${locationName} ออกจากรายการโปรดแล้ว` : 
                `Removed ${locationName} from favorites`
        });
    }

    // Connection feedback
    connectionLost() {
        this.showError({
            message: userPreferences.language === 'th' ? 
                'การเชื่อมต่ออินเทอร์เน็ตขาดหายไป' : 
                'Internet connection lost',
            persistent: true,
            action: () => window.location.reload(),
            actionText: userPreferences.language === 'th' ? 'ลองใหม่' : 'Retry'
        });
    }

    connectionRestored() {
        this.showSuccess({
            message: userPreferences.language === 'th' ? 
                'เชื่อมต่ออินเทอร์เน็ตแล้ว' : 
                'Internet connection restored'
        });
    }

    // Feature feedback
    featureNotAvailable() {
        this.showWarning({
            message: userPreferences.language === 'th' ? 
                'ฟีเจอร์นี้จะเปิดให้ใช้งานเร็วๆ นี้' : 
                'This feature will be available soon'
        });
    }

    // Data save feedback
    dataSaved() {
        this.showSuccess({
            message: userPreferences.language === 'th' ? 
                'บันทึกข้อมูลเรียบร้อยแล้ว' : 
                'Data saved successfully'
        });
    }

    dataSaveFailed() {
        this.showError({
            message: userPreferences.language === 'th' ? 
                'ไม่สามารถบันทึกข้อมูลได้' : 
                'Failed to save data',
            action: () => {
                // Retry save logic here
                this.showInfo({
                    message: userPreferences.language === 'th' ? 
                        'กำลังลองบันทึกอีกครั้ง...' : 
                        'Retrying save...'
                });
            },
            actionText: userPreferences.language === 'th' ? 'ลองใหม่' : 'Retry'
        });
    }
}

// ========================================
// INITIALIZE GLOBAL FEEDBACK SYSTEM
// ========================================

// Create global instance
const feedbackSystem = new FeedbackSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackSystem;
}

// ========================================
// INTEGRATION WITH EXISTING NOTIFICATION SYSTEM
// ========================================

// Override existing showNotification function to use new system
function showNotification(message, type = 'info', duration = 4000) {
    return feedbackSystem.show({
        message,
        type,
        duration
    });
}

// Enhanced loading functions
function showLoadingSpinner(message) {
    const existingSpinner = document.getElementById('loadingSpinner');
    if (existingSpinner) {
        existingSpinner.style.display = 'flex';
        const messageElement = existingSpinner.querySelector('.loading-message');
        if (messageElement) {
            messageElement.textContent = message || 'Loading...';
        }
    }
    
    // Also show toast notification for longer operations
    return feedbackSystem.startLoading('global', { message });
}

function hideLoadingSpinner() {
    const existingSpinner = document.getElementById('loadingSpinner');
    if (existingSpinner) {
        existingSpinner.style.display = 'none';
    }
    
    feedbackSystem.stopLoading('global', 'success');
}

console.log('🔔 Enhanced Feedback System initialized successfully!');