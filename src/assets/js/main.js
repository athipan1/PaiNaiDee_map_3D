// Main entry point for the PaiNaiDee 3D Map application

// 1. Import state and API modules first, as other modules depend on them.
import { feedbackSystem } from './feedback-system.js';
import * as api from './api.js';
import * as state from './state.js';

// 2. Import modules that define functionality.
// The order isn't critical here as they attach to the global scope or are self-contained.
import './branding-enhancements.js';
import './ux-improvements.js';
import './iterative-design.js';
import './user-testing.js';
import './user-research-system.js';

// 3. Import the main script module which utilizes all other modules.
import * as script from './script.js';


// 4. Assign necessary functions and variables to the window object for legacy HTML compatibility.
window.feedbackSystem = feedbackSystem;

// State
window.favorites = state.favorites;
window.userPreferences = state.userPreferences;
window.userBehavior = state.userBehavior;

// API
window.fetchAllData = api.fetchAllData;

// Functions from script.js needed by HTML onclick attributes
window.startExploring = script.startExploring;
window.startGuidedTour = script.startGuidedTour;
window.skipToMap = script.skipToMap;
window.quickStartCultural = script.quickStartCultural;
window.quickStartNature = script.quickStartNature;
window.quickStartBeach = script.quickStartBeach;
window.focusLocation = script.focusLocation;
window.toggleFavorite = script.toggleFavorite;
window.toggleRotation = script.toggleRotation;
window.changeSpeed = script.changeSpeed;
window.generateTripPlan = script.generateTripPlan;
window.calculateRoute = script.calculateRoute;
window.compareLocations = script.compareLocations;
window.showInfo = script.showInfo;
window.closeModal = script.closeModal;
window.handleGlobeKeydown = script.handleGlobeKeydown;
window.toggleTheme = script.toggleTheme;
window.toggleLanguage = script.toggleLanguage;
window.toggleHighContrast = script.toggleHighContrast;

// Missing function from original code, adding a placeholder
window.toggleResearchPanel = () => {
  feedbackSystem.showInfo({ message: 'User Research Panel coming soon!' });
};

// 5. Initialize the application.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Application starting from main.js");
    script.initializeMap();
    script.initializeEnhancedStartup();
});
