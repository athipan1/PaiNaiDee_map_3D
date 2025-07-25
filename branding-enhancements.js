// ========================================
// PAINAIDEE 3D MAP - BRANDING ENHANCEMENTS
// Enhanced Animations and Interactions
// ========================================

// Enhanced Cultural Animation System
class ThaiCulturalAnimations {
    constructor() {
        this.isInitialized = false;
        this.culturalThemes = {
            songkran: {
                colors: ['#4FC3F7', '#29B6F6', '#039BE5', '#0277BD'],
                pattern: 'water-splash',
                duration: 3000
            },
            loyKrathong: {
                colors: ['#FFD54F', '#FFCA28', '#FFC107', '#FF8F00'],
                pattern: 'floating-lights',
                duration: 4000
            },
            newYear: {
                colors: ['#FFD700', '#FFA500', '#FF6B35', '#DC2626'],
                pattern: 'golden-celebration',
                duration: 2000
            }
        };
        this.currentTheme = 'default';
        this.animationQueue = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Initialize enhanced animations
    init() {
        if (this.isInitialized || this.isReducedMotion) return;
        
        this.setupCulturalHoverEffects();
        this.initializeThaiPatternAnimations();
        this.setupEnhancedButtonInteractions();
        this.initializeGoldenSparkles();
        this.setupLotusBloomEffects();
        this.initializeElementalAnimations();
        
        this.isInitialized = true;
        console.log('🎨 Thai Cultural Animations initialized!');
    }

    // Setup cultural hover effects
    setupCulturalHoverEffects() {
        const thaiElements = document.querySelectorAll('.thai-temple-hover, .lotus-bloom-hover, .golden-sparkle');
        
        thaiElements.forEach(element => {
            this.addCulturalHoverEffect(element);
        });
    }

    // Add cultural hover effect to element
    addCulturalHoverEffect(element) {
        let hoverAnimation = null;
        
        element.addEventListener('mouseenter', () => {
            if (element.classList.contains('thai-temple-hover')) {
                this.createTempleShineEffect(element);
            } else if (element.classList.contains('lotus-bloom-hover')) {
                this.createLotusBloomEffect(element);
            } else if (element.classList.contains('golden-sparkle')) {
                this.createGoldenSparkleEffect(element);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (hoverAnimation) {
                hoverAnimation.cancel();
            }
        });
    }

    // Create temple shine effect
    createTempleShineEffect(element) {
        const shine = document.createElement('div');
        shine.className = 'temple-shine-overlay';
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(shine);
        
        shine.animate([
            { left: '-100%', opacity: 0 },
            { left: '0%', opacity: 1 },
            { left: '100%', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            if (shine.parentNode) {
                shine.remove();
            }
        };
        
        // Add temple bell sound effect (visual feedback)
        this.createTempleRipple(element);
    }

    // Create temple ripple effect
    createTempleRipple(element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2 - 15}px;
            top: ${rect.top + rect.height / 2 - 15}px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid var(--thai-temple-red);
            pointer-events: none;
            z-index: 1000;
            animation: temple-ripple 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 1000);
    }

    // Create lotus bloom effect
    createLotusBloomEffect(element) {
        const petals = 8;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < petals; i++) {
            setTimeout(() => {
                this.createLotusPetal(centerX, centerY, i, petals);
            }, i * 100);
        }
    }

    // Create individual lotus petal
    createLotusPetal(centerX, centerY, index, total) {
        const petal = document.createElement('div');
        const angle = (index / total) * 2 * Math.PI;
        const distance = 40;
        
        petal.textContent = '🌸';
        petal.style.cssText = `
            position: fixed;
            left: ${centerX - 10}px;
            top: ${centerY - 10}px;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: lotus-petal-bloom 2s ease-out forwards;
        `;
        
        petal.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
        petal.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
        
        document.body.appendChild(petal);
        
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
            }
        }, 2000);
    }

    // Create golden sparkle effect
    createGoldenSparkleEffect(element) {
        const sparkleCount = 12;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                this.createGoldenSparkle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 50);
        }
    }

    // Create individual golden sparkle
    createGoldenSparkle(x, y) {
        const sparkle = document.createElement('div');
        const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💎'];
        
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1000;
            animation: golden-sparkle-dance 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 1500);
    }

    // Initialize Thai pattern animations
    initializeThaiPatternAnimations() {
        const patternElements = document.querySelectorAll('.thai-pattern-bg');
        
        patternElements.forEach(element => {
            this.addThaiPatternAnimation(element);
        });
    }

    // Add Thai pattern animation
    addThaiPatternAnimation(element) {
        element.addEventListener('mouseenter', () => {
            element.style.animationDuration = '1s';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.animationDuration = '3s';
        });
    }

    // Setup enhanced button interactions
    setupEnhancedButtonInteractions() {
        const thaiButtons = document.querySelectorAll('.btn-thai-primary, .btn-thai-secondary');
        
        thaiButtons.forEach(button => {
            this.enhanceButtonInteraction(button);
        });
    }

    // Enhance individual button interaction
    enhanceButtonInteraction(button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create cultural click effect
            this.createCulturalClickEffect(button, e);
            
            // Add haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate([50, 30, 50]);
            }
            
            // Execute original click after effect
            setTimeout(() => {
                const originalHandler = button.getAttribute('onclick');
                if (originalHandler) {
                    eval(originalHandler);
                }
            }, 300);
        });
    }

    // Create cultural click effect
    createCulturalClickEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Create golden wave effect
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            left: ${clickX - 10}px;
            top: ${clickY - 10}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--thai-gold-primary) 0%, transparent 70%);
            pointer-events: none;
            z-index: 10;
            animation: cultural-wave 0.6s ease-out forwards;
        `;
        
        button.style.position = 'relative';
        button.appendChild(wave);
        
        setTimeout(() => {
            if (wave.parentNode) {
                wave.remove();
            }
        }, 600);
        
        // Add button pulse effect
        button.style.animation = 'cultural-button-pulse 0.3s ease-out';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }

    // Initialize golden sparkles for specific elements
    initializeGoldenSparkles() {
        const sparkleElements = document.querySelectorAll('.golden-sparkle');
        
        sparkleElements.forEach(element => {
            // Random sparkles every 5-10 seconds
            const sparkleInterval = setInterval(() => {
                if (document.hidden || this.isReducedMotion) return;
                
                const rect = element.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    this.createGoldenSparkle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height
                    );
                }
            }, 5000 + Math.random() * 5000);
            
            // Clean up interval when element is removed
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.removedNodes.forEach(node => {
                            if (node === element) {
                                clearInterval(sparkleInterval);
                                observer.disconnect();
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Setup lotus bloom effects
    setupLotusBloomEffects() {
        const lotusElements = document.querySelectorAll('.lotus-decoration');
        
        lotusElements.forEach(element => {
            // Periodic bloom effect
            setInterval(() => {
                if (!document.hidden && !this.isReducedMotion) {
                    this.createSubtleLotusBloom(element);
                }
            }, 8000 + Math.random() * 4000);
        });
    }

    // Create subtle lotus bloom for decoration elements
    createSubtleLotusBloom(element) {
        const rect = element.getBoundingClientRect();
        const bloom = document.createElement('div');
        
        bloom.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2 - 15}px;
            top: ${rect.top + rect.height / 2 - 15}px;
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, var(--thai-lotus-pink) 0%, transparent 70%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            pointer-events: none;
            z-index: 5;
            animation: subtle-lotus-bloom 3s ease-out forwards;
            opacity: 0.3;
        `;
        
        document.body.appendChild(bloom);
        
        setTimeout(() => {
            if (bloom.parentNode) {
                bloom.remove();
            }
        }, 3000);
    }

    // Initialize elemental animations (water, fire, earth, air)
    initializeElementalAnimations() {
        // Water flowing effect for search and input elements
        this.setupWaterFlowAnimations();
        
        // Fire glow effect for primary actions
        this.setupFireGlowAnimations();
        
        // Earth stability effect for navigation
        this.setupEarthStabilityAnimations();
        
        // Air floating effect for decorative elements
        this.setupAirFloatingAnimations();
    }

    // Setup water flow animations
    setupWaterFlowAnimations() {
        const waterElements = document.querySelectorAll('.search-input, .thai-flow');
        
        waterElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('water-active');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('water-active');
            });
        });
    }

    // Setup fire glow animations
    setupFireGlowAnimations() {
        const fireElements = document.querySelectorAll('.btn-thai-primary');
        
        fireElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addFireGlow(element);
            });
        });
    }

    // Add fire glow effect
    addFireGlow(element) {
        const glow = document.createElement('div');
        glow.className = 'fire-glow';
        glow.style.cssText = `
            position: absolute;
            inset: -5px;
            background: radial-gradient(ellipse at center, 
                rgba(255, 107, 53, 0.3) 0%, 
                rgba(255, 165, 0, 0.2) 50%, 
                transparent 70%);
            border-radius: inherit;
            pointer-events: none;
            z-index: -1;
            animation: fire-glow-pulse 2s ease-in-out infinite;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        setTimeout(() => {
            if (glow.parentNode) {
                glow.remove();
            }
        }, 3000);
    }

    // Setup earth stability animations
    setupEarthStabilityAnimations() {
        const earthElements = document.querySelectorAll('.controls, .info-panel');
        
        earthElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }

    // Setup air floating animations
    setupAirFloatingAnimations() {
        const airElements = document.querySelectorAll('.icon-thai, .mascot-elephant');
        
        airElements.forEach((element, index) => {
            element.style.animation = `air-float ${3 + index * 0.5}s ease-in-out infinite`;
        });
    }

    // Apply cultural theme
    applyCulturalTheme(themeName) {
        if (!this.culturalThemes[themeName]) return;
        
        const theme = this.culturalThemes[themeName];
        const root = document.documentElement;
        
        // Update CSS custom properties for theme
        root.style.setProperty('--cultural-primary', theme.colors[0]);
        root.style.setProperty('--cultural-secondary', theme.colors[1]);
        root.style.setProperty('--cultural-accent', theme.colors[2]);
        root.style.setProperty('--cultural-highlight', theme.colors[3]);
        
        // Add theme class to body
        document.body.classList.remove(`theme-${this.currentTheme}`);
        document.body.classList.add(`theme-${themeName}`);
        
        this.currentTheme = themeName;
        
        // Trigger theme-specific animations
        this.triggerThemeAnimation(themeName);
        
        console.log(`🎨 Applied cultural theme: ${themeName}`);
    }

    // Trigger theme-specific animation
    triggerThemeAnimation(themeName) {
        const animationElements = document.querySelectorAll('.thai-pattern-bg, .thai-golden-border');
        
        animationElements.forEach(element => {
            element.style.animation = 'none';
            requestAnimationFrame(() => {
                element.style.animation = `${themeName}-celebration 2s ease-out`;
            });
        });
    }

    // Check for special occasions and apply appropriate themes
    checkSpecialOccasions() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        
        // Songkran Festival (April 13-15)
        if (month === 4 && day >= 13 && day <= 15) {
            this.applyCulturalTheme('songkran');
            return 'songkran';
        }
        
        // Loy Krathong (Usually November, but varies)
        if (month === 11 && day >= 15 && day <= 17) {
            this.applyCulturalTheme('loyKrathong');
            return 'loyKrathong';
        }
        
        // New Year (January 1)
        if (month === 1 && day === 1) {
            this.applyCulturalTheme('newYear');
            return 'newYear';
        }
        
        return 'default';
    }

    // Cleanup animations
    cleanup() {
        this.animationQueue.forEach(animation => {
            if (animation.cancel) {
                animation.cancel();
            }
        });
        this.animationQueue = [];
    }
}

// Enhanced Thai Typography System
class ThaiTypographyEnhancer {
    constructor() {
        this.fontLoadingPromises = [];
        this.isThaiLanguage = false;
    }

    // Initialize typography enhancements
    init() {
        this.detectLanguage();
        this.loadThaiWebFonts();
        this.setupResponsiveTypography();
        this.enhanceTextAnimations();
        
        console.log('📝 Thai Typography Enhancements initialized!');
    }

    // Detect current language
    detectLanguage() {
        const html = document.documentElement;
        const lang = html.getAttribute('lang') || 'th';
        this.isThaiLanguage = lang.includes('th');
        
        // Apply appropriate font family based on language
        this.applyLanguageTypography();
    }

    // Apply language-specific typography
    applyLanguageTypography() {
        const body = document.body;
        
        if (this.isThaiLanguage) {
            body.style.fontFamily = 'var(--font-thai-primary)';
        } else {
            body.style.fontFamily = 'var(--font-primary)';
        }
        
        // Update heading fonts
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if (!heading.classList.contains('thai-heading')) {
                heading.classList.add('thai-heading');
            }
        });
    }

    // Load Thai web fonts with loading feedback
    loadThaiWebFonts() {
        const fonts = [
            { family: 'Sarabun', weight: '400' },
            { family: 'Sarabun', weight: '600' },
            { family: 'Kanit', weight: '400' },
            { family: 'Kanit', weight: '600' },
            { family: 'Charm', weight: '400' }
        ];
        
        fonts.forEach(font => {
            const fontFace = new FontFace(font.family, `url(https://fonts.googleapis.com/css2?family=${font.family}:wght@${font.weight}&display=swap)`);
            
            const loadPromise = fontFace.load().then(() => {
                document.fonts.add(fontFace);
                console.log(`✅ Loaded font: ${font.family} ${font.weight}`);
            }).catch(error => {
                console.warn(`⚠️ Failed to load font: ${font.family}`, error);
            });
            
            this.fontLoadingPromises.push(loadPromise);
        });
        
        // Wait for all fonts to load
        Promise.all(this.fontLoadingPromises).then(() => {
            this.onFontsLoaded();
        });
    }

    // Handle fonts loaded event
    onFontsLoaded() {
        document.body.classList.add('fonts-loaded');
        
        // Re-measure and adjust text elements
        this.adjustTextElements();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('thaifontsloaded'));
    }

    // Setup responsive typography
    setupResponsiveTypography() {
        const observer = new ResizeObserver(entries => {
            this.adjustResponsiveText();
        });
        
        observer.observe(document.body);
    }

    // Adjust responsive text sizing
    adjustResponsiveText() {
        const viewportWidth = window.innerWidth;
        const root = document.documentElement;
        
        // Calculate responsive font sizes using golden ratio
        const baseFontSize = Math.max(14, Math.min(20, viewportWidth / 60));
        const goldenRatio = 1.618;
        
        root.style.setProperty('--font-size-xs', `${baseFontSize / goldenRatio / goldenRatio}px`);
        root.style.setProperty('--font-size-sm', `${baseFontSize / goldenRatio}px`);
        root.style.setProperty('--font-size-md', `${baseFontSize}px`);
        root.style.setProperty('--font-size-lg', `${baseFontSize * goldenRatio}px`);
        root.style.setProperty('--font-size-xl', `${baseFontSize * goldenRatio * goldenRatio}px`);
        root.style.setProperty('--font-size-2xl', `${baseFontSize * goldenRatio * goldenRatio * goldenRatio}px`);
    }

    // Enhance text animations
    enhanceTextAnimations() {
        // Add typewriter effect to specific elements
        this.addTypewriterEffect();
        
        // Add text reveal animations
        this.addTextRevealAnimations();
        
        // Add cultural text effects
        this.addCulturalTextEffects();
    }

    // Add typewriter effect
    addTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter-effect');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--thai-gold-primary)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                
                if (i >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    // Add text reveal animations
    addTextRevealAnimations() {
        const revealElements = document.querySelectorAll('.text-reveal');
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTextReveal(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Animate text reveal
    animateTextReveal(element) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = words.map(word => `<span class="word-reveal">${word}</span>`).join(' ');
        
        const wordElements = element.querySelectorAll('.word-reveal');
        wordElements.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                word.style.transition = 'all 0.6s ease-out';
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Add cultural text effects
    addCulturalTextEffects() {
        // Add golden shimmer to headings
        const headings = document.querySelectorAll('.thai-heading');
        headings.forEach(heading => {
            this.addGoldenShimmer(heading);
        });
        
        // Add cultural emphasis to accent text
        const accentText = document.querySelectorAll('.thai-accent');
        accentText.forEach(text => {
            this.addCulturalEmphasis(text);
        });
    }

    // Add golden shimmer effect
    addGoldenShimmer(element) {
        element.addEventListener('mouseenter', () => {
            element.style.backgroundImage = 'linear-gradient(45deg, var(--thai-gold-primary) 25%, transparent 25%, transparent 75%, var(--thai-gold-primary) 75%)';
            element.style.backgroundSize = '20px 20px';
            element.style.animation = 'golden-shimmer 1s ease-in-out infinite';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.backgroundImage = '';
            element.style.animation = '';
        });
    }

    // Add cultural emphasis
    addCulturalEmphasis(element) {
        element.addEventListener('mouseenter', () => {
            element.style.textShadow = '0 0 10px var(--thai-gold-primary)';
            element.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.textShadow = '';
            element.style.transform = 'scale(1)';
        });
    }

    // Adjust text elements after font loading
    adjustTextElements() {
        // Recalculate line heights for Thai text
        const thaiText = document.querySelectorAll('.thai-body, .thai-heading');
        thaiText.forEach(element => {
            const fontSize = parseFloat(getComputedStyle(element).fontSize);
            element.style.lineHeight = this.isThaiLanguage ? `${fontSize * 1.7}px` : `${fontSize * 1.6}px`;
        });
    }
}

// Enhanced Icon Animation System
class ThaiIconAnimator {
    constructor() {
        this.iconAnimations = new Map();
        this.culturalIcons = {
            temple: '🏛️',
            elephant: '🐘',
            lotus: '🪷',
            gold: '✨',
            buddha: '🙏',
            thai: '🇹🇭'
        };
    }

    // Initialize icon animations
    init() {
        this.setupIconHoverEffects();
        this.initializeCulturalIconAnimations();
        this.setupIconInteractions();
        
        console.log('🎭 Thai Icon Animations initialized!');
    }

    // Setup icon hover effects
    setupIconHoverEffects() {
        const icons = document.querySelectorAll('.icon-thai, .icon-temple, .icon-elephant');
        
        icons.forEach(icon => {
            this.addIconHoverEffect(icon);
        });
    }

    // Add icon hover effect
    addIconHoverEffect(icon) {
        icon.addEventListener('mouseenter', () => {
            this.startIconAnimation(icon);
        });
        
        icon.addEventListener('mouseleave', () => {
            this.stopIconAnimation(icon);
        });
    }

    // Start icon animation
    startIconAnimation(icon) {
        const iconType = this.getIconType(icon);
        
        switch (iconType) {
            case 'temple':
                this.animateTempleIcon(icon);
                break;
            case 'elephant':
                this.animateElephantIcon(icon);
                break;
            case 'thai':
                this.animateThaiIcon(icon);
                break;
            default:
                this.animateDefaultIcon(icon);
        }
    }

    // Get icon type from classes
    getIconType(icon) {
        if (icon.classList.contains('icon-temple')) return 'temple';
        if (icon.classList.contains('icon-elephant')) return 'elephant';
        if (icon.classList.contains('icon-thai')) return 'thai';
        return 'default';
    }

    // Animate temple icon
    animateTempleIcon(icon) {
        const animation = icon.animate([
            { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
            { transform: 'scale(1.2) rotate(5deg)', filter: 'brightness(1.3)' },
            { transform: 'scale(1.1) rotate(-5deg)', filter: 'brightness(1.2)' },
            { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' }
        ], {
            duration: 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        this.iconAnimations.set(icon, animation);
    }

    // Animate elephant icon
    animateElephantIcon(icon) {
        const animation = icon.animate([
            { transform: 'scale(1) translateY(0)' },
            { transform: 'scale(1.1) translateY(-3px)' },
            { transform: 'scale(1.05) translateY(-1px)' },
            { transform: 'scale(1) translateY(0)' }
        ], {
            duration: 800,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        this.iconAnimations.set(icon, animation);
    }

    // Animate thai icon
    animateThaiIcon(icon) {
        const animation = icon.animate([
            { transform: 'scale(1) rotate(0deg)', boxShadow: '0 0 0 var(--thai-gold-primary)' },
            { transform: 'scale(1.15) rotate(10deg)', boxShadow: '0 0 20px var(--thai-gold-primary)' },
            { transform: 'scale(1) rotate(0deg)', boxShadow: '0 0 0 var(--thai-gold-primary)' }
        ], {
            duration: 1200,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        this.iconAnimations.set(icon, animation);
    }

    // Animate default icon
    animateDefaultIcon(icon) {
        const animation = icon.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.1)' },
            { transform: 'scale(1)' }
        ], {
            duration: 600,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        this.iconAnimations.set(icon, animation);
    }

    // Stop icon animation
    stopIconAnimation(icon) {
        const animation = this.iconAnimations.get(icon);
        if (animation) {
            animation.cancel();
            this.iconAnimations.delete(icon);
        }
    }

    // Initialize cultural icon animations
    initializeCulturalIconAnimations() {
        // Add periodic cultural animations
        setInterval(() => {
            this.triggerCulturalIconEffect();
        }, 15000); // Every 15 seconds
    }

    // Trigger cultural icon effect
    triggerCulturalIconEffect() {
        const icons = document.querySelectorAll('.icon-thai');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        if (randomIcon && !this.iconAnimations.has(randomIcon)) {
            this.createCulturalEffect(randomIcon);
        }
    }

    // Create cultural effect around icon
    createCulturalEffect(icon) {
        const rect = icon.getBoundingClientRect();
        const effectContainer = document.createElement('div');
        
        effectContainer.style.cssText = `
            position: fixed;
            left: ${rect.left - 30}px;
            top: ${rect.top - 30}px;
            width: ${rect.width + 60}px;
            height: ${rect.height + 60}px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Create cultural symbols around the icon
        const symbols = ['🙏', '✨', '🪷', '⭐'];
        symbols.forEach((symbol, index) => {
            const symbolElement = document.createElement('div');
            symbolElement.textContent = symbol;
            symbolElement.style.cssText = `
                position: absolute;
                font-size: 1.2rem;
                animation: cultural-orbit 3s ease-in-out infinite;
                animation-delay: ${index * 0.2}s;
            `;
            
            const angle = (index / symbols.length) * 2 * Math.PI;
            const radius = 40;
            symbolElement.style.left = `${30 + Math.cos(angle) * radius}px`;
            symbolElement.style.top = `${30 + Math.sin(angle) * radius}px`;
            
            effectContainer.appendChild(symbolElement);
        });
        
        document.body.appendChild(effectContainer);
        
        setTimeout(() => {
            if (effectContainer.parentNode) {
                effectContainer.remove();
            }
        }, 3000);
    }

    // Setup icon interactions
    setupIconInteractions() {
        const interactiveIcons = document.querySelectorAll('.icon-thai[data-action]');
        
        interactiveIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const action = icon.dataset.action;
                this.handleIconAction(action, icon);
            });
        });
    }

    // Handle icon action
    handleIconAction(action, icon) {
        switch (action) {
            case 'blessing':
                this.createBlessingEffect(icon);
                break;
            case 'fortune':
                this.createFortuneEffect(icon);
                break;
            case 'celebration':
                this.createCelebrationEffect(icon);
                break;
        }
    }

    // Create blessing effect
    createBlessingEffect(icon) {
        const blessings = ['🙏', '✨', '💫', '🌟'];
        const rect = icon.getBoundingClientRect();
        
        blessings.forEach((blessing, index) => {
            setTimeout(() => {
                const element = document.createElement('div');
                element.textContent = blessing;
                element.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top}px;
                    font-size: 1.5rem;
                    pointer-events: none;
                    z-index: 1000;
                    animation: blessing-rise 2s ease-out forwards;
                `;
                
                document.body.appendChild(element);
                
                setTimeout(() => {
                    if (element.parentNode) {
                        element.remove();
                    }
                }, 2000);
            }, index * 300);
        });
    }

    // Create fortune effect
    createFortuneEffect(icon) {
        const fortunes = ['💰', '💎', '🏆', '🎁'];
        const rect = icon.getBoundingClientRect();
        
        fortunes.forEach((fortune, index) => {
            const element = document.createElement('div');
            element.textContent = fortune;
            element.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                font-size: 1.3rem;
                pointer-events: none;
                z-index: 1000;
                animation: fortune-spin 1.5s ease-out forwards;
            `;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, 1500);
        });
    }

    // Create celebration effect
    createCelebrationEffect(icon) {
        const celebrations = ['🎉', '🎊', '🎆', '✨'];
        const rect = icon.getBoundingClientRect();
        
        celebrations.forEach((celebration, index) => {
            const element = document.createElement('div');
            element.textContent = celebration;
            element.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                font-size: 2rem;
                pointer-events: none;
                z-index: 1000;
                animation: celebration-burst 1s ease-out forwards;
                animation-delay: ${index * 0.1}s;
            `;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, 1000);
        });
    }
}

// Initialize all enhancement systems
document.addEventListener('DOMContentLoaded', () => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Initialize animation systems
        const culturalAnimations = new ThaiCulturalAnimations();
        culturalAnimations.init();
        
        // Check for special occasions
        const occasion = culturalAnimations.checkSpecialOccasions();
        if (occasion !== 'default') {
            console.log(`🎊 Special occasion detected: ${occasion}`);
        }
        
        // Initialize icon animations
        const iconAnimator = new ThaiIconAnimator();
        iconAnimator.init();
        
        // Store instances globally for cleanup
        window.thaiEnhancements = {
            culturalAnimations,
            iconAnimator
        };
    }
    
    // Initialize typography enhancements (always)
    const typographyEnhancer = new ThaiTypographyEnhancer();
    typographyEnhancer.init();
    
    window.thaiTypography = typographyEnhancer;
    
    console.log('🎨 Thai Branding Enhancements fully initialized!');
});

// Add dynamic CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Dynamic Animation Keyframes */
    @keyframes temple-ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes lotus-petal-bloom {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(1.2) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes golden-sparkle-dance {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: translate(-10px, -20px) scale(1.2) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: translate(20px, -40px) scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes cultural-wave {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(6);
            opacity: 0;
        }
    }
    
    @keyframes cultural-button-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes subtle-lotus-bloom {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.6;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fire-glow-pulse {
        0%, 100% {
            opacity: 0.3;
            filter: blur(5px);
        }
        50% {
            opacity: 0.6;
            filter: blur(10px);
        }
    }
    
    @keyframes air-float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-8px);
        }
    }
    
    @keyframes golden-shimmer {
        0% { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
    }
    
    @keyframes cultural-orbit {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(0.8);
            opacity: 0;
        }
        25% {
            opacity: 1;
            transform: translate(0, 0) rotate(90deg) scale(1);
        }
        75% {
            opacity: 1;
            transform: translate(0, 0) rotate(270deg) scale(1);
        }
        100% {
            transform: translate(0, 0) rotate(360deg) scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes blessing-rise {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
    
    @keyframes fortune-spin {
        0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: rotate(720deg) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes celebration-burst {
        0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: scale(1.5) translate(calc(-50px + 100px * random()), calc(-50px + 100px * random()));
            opacity: 0;
        }
    }
    
    /* Water flow active state */
    .water-active {
        background: linear-gradient(90deg, 
            rgba(72, 177, 232, 0.1) 0%, 
            rgba(72, 177, 232, 0.2) 50%, 
            rgba(72, 177, 232, 0.1) 100%);
        background-size: 200% 100%;
        animation: water-flow 2s ease-in-out infinite;
    }
    
    @keyframes water-flow {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    /* Festival celebration themes */
    @keyframes songkran-celebration {
        0%, 100% { 
            filter: hue-rotate(0deg) brightness(1); 
        }
        25% { 
            filter: hue-rotate(90deg) brightness(1.1); 
        }
        50% { 
            filter: hue-rotate(180deg) brightness(1.2); 
        }
        75% { 
            filter: hue-rotate(270deg) brightness(1.1); 
        }
    }
    
    @keyframes loyKrathong-celebration {
        0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        50% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 165, 0, 0.4);
        }
    }
    
    @keyframes newYear-celebration {
        0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
        }
        25% { 
            transform: scale(1.02);
            filter: brightness(1.1);
        }
        50% { 
            transform: scale(1.05);
            filter: brightness(1.2);
        }
        75% { 
            transform: scale(1.02);
            filter: brightness(1.1);
        }
    }
`;

document.head.appendChild(dynamicStyles);

// Cleanup function for performance
window.addEventListener('beforeunload', () => {
    if (window.thaiEnhancements) {
        window.thaiEnhancements.culturalAnimations.cleanup();
    }
});