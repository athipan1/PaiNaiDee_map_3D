// Central state management for the application

export let favorites = JSON.parse(localStorage.getItem('painaidee-favorites')) || [];

export let userPreferences = JSON.parse(localStorage.getItem('painaidee-preferences')) || {
    theme: 'light',
    language: 'th',
    highContrast: false
};

export let userBehavior = JSON.parse(localStorage.getItem('painaidee-user-behavior')) || {
    locationViews: {},
    categoryViews: {},
    searchQueries: [],
    timeSpent: {},
    sessionStart: Date.now(),
    totalSessions: 0,
    favoriteActions: [],
    lastRecommendationUpdate: 0
};

// We can add functions here to update state if needed, e.g.
export function updateUserPreference(key, value) {
    userPreferences[key] = value;
    localStorage.setItem('painaidee-preferences', JSON.stringify(userPreferences));
}

export function addFavorite(locationKey) {
    if (!favorites.includes(locationKey)) {
        favorites.push(locationKey);
        localStorage.setItem('painaidee-favorites', JSON.stringify(favorites));
    }
}

export function removeFavorite(locationKey) {
    favorites = favorites.filter(fav => fav !== locationKey);
    localStorage.setItem('painaidee-favorites', JSON.stringify(favorites));
}
