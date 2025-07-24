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

// Language system
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
        weather: "สภาพอากาศ",
        bestTime: "ช่วงเวลาที่เหมาะสม",
        travelTips: "เคล็ดลับการเดินทาง",
        description: "คำอธิบาย",
        attractionsTitle: "สถานที่น่าสนใจ",
        km: "กิโลเมตร"
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
        weather: "Weather",
        bestTime: "Best Time",
        travelTips: "Travel Tips",
        description: "Description",
        attractionsTitle: "Attractions",
        km: "kilometers"
    }
};

// Enhanced distance calculation with route planning
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

// Enhanced Thai locations with more destinations and detailed information
const locations = {
    bangkok: {
        name: "กรุงเทพมหานคร",
        nameEn: "Bangkok",
        description: "เมืองหลวงของประเทศไทย เต็มไปด้วยวัดสวยงามและวัฒนธรรม อีกทั้งยังเป็นศูนย์กลางทางเศรษฐกิจและการท่องเที่ยว",
        descriptionEn: "Capital city of Thailand, rich in temples and culture, and the economic and tourism center",
        emoji: "🏛️",
        coordinates: [100.5018, 13.7563],
        attractions: ["วัดพระแก้ว", "พระบรมมหาราชวัง", "วัดโพธิ์", "ตลาดจตุจักร", "วัดอรุณ", "เยาวราช"],
        attractionsEn: ["Wat Phra Kaew", "Grand Palace", "Wat Pho", "Chatuchak Market", "Wat Arun", "Chinatown"],
        photos: [
            { name: "Grand Palace", emoji: "🏰" },
            { name: "Wat Arun", emoji: "🕌" },
            { name: "Floating Market", emoji: "🛶" },
            { name: "Tuk Tuk", emoji: "🛺" }
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
        attractions: ["ดอยสุเทพ", "วัดพระธาตุ", "ตลาดวอร์กกิ้งสตรีท", "อุทยานแห่งชาติดอยอินทนนท์", "บ้านช้าง", "ตลาดนัดเสาร์อาทิตย์"],
        attractionsEn: ["Doi Suthep", "Wat Phra That", "Walking Street", "Doi Inthanon National Park", "Elephant Sanctuary", "Weekend Market"],
        photos: [
            { name: "Doi Suthep", emoji: "⛰️" },
            { name: "Night Bazaar", emoji: "🌃" },
            { name: "Elephant Sanctuary", emoji: "🐘" },
            { name: "Lanna Temple", emoji: "🏯" }
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
        attractions: ["หาดป่าตอง", "เกาะพีพี", "หาดกะตะ", "บิ๊กบุดดา", "เมืองเก่าภูเก็ต", "หาดไนหาน"],
        attractionsEn: ["Patong Beach", "Phi Phi Islands", "Kata Beach", "Big Buddha", "Phuket Old Town", "Nai Harn Beach"],
        photos: [
            { name: "Patong Beach", emoji: "🏖️" },
            { name: "Phi Phi Islands", emoji: "🏝️" },
            { name: "Sunset View", emoji: "🌅" },
            { name: "Longtail Boat", emoji: "⛵" }
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
        attractions: ["วัดมหาธาตุ", "วัดพระศรีสรรเพชญ์", "วัดชัยวัฒนาราม", "พระราชวังหลวง", "ตลาดน้ำอยุธยา"],
        attractionsEn: ["Wat Mahathat", "Wat Phra Si Sanphet", "Wat Chaiwatthanaram", "Royal Palace", "Ayutthaya Floating Market"],
        photos: [
            { name: "Buddha Head in Tree", emoji: "🌳" },
            { name: "Ancient Ruins", emoji: "🏛️" },
            { name: "Temple Complex", emoji: "🕌" },
            { name: "Historical Site", emoji: "📿" }
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
    europe: {
        name: "ยุโรป",
        nameEn: "Europe",
        description: "ทวีปแห่งประวัติศาสตร์และศิลปะ มีสถาปัตยกรรมที่งดงามและวัฒนธรรมที่หลากหลาย",
        descriptionEn: "Continent of history and art with beautiful architecture and diverse cultures",
        emoji: "🏛️",
        coordinates: [10.0, 54.0],
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLoadingSpinner();
    initializeEnhanced3D();
    initializeTheme();
    initializeLanguage();
    initializeSearch();
    initializeFavorites();
    initializeKeyboardNavigation();
    initializeFontLoading();
    updateWeatherInfo();
    updateInterfaceLanguage();
    setTimeout(hideLoadingSpinner, 1000);
    updateStatus(getText('globeCreated'), getText('globeCreated'));
    console.log('🗺️ PaiNaiDee Enhanced 3D Map loaded successfully!');
});

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
    
    globe.addEventListener('mousedown', (e) => {
        // Don't interfere with marker clicks
        if (e.target.classList.contains('marker')) {
            return;
        }
        
        isDragging = true;
        dragStartTime = Date.now();
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
    
    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            const dragDuration = Date.now() - dragStartTime;
            isDragging = false;
            globe.style.cursor = 'grab';
            
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

// Favorites system
function initializeFavorites() {
    updateFavoritesDisplay();
    updateFavoriteButtons();
}

function toggleFavorite(locationKey) {
    const index = favorites.indexOf(locationKey);
    
    if (index === -1) {
        favorites.push(locationKey);
        showNotification(getText('addedFavorite'), 'success');
    } else {
        favorites.splice(index, 1);
        showNotification(getText('removedFavorite'), 'info');
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

// Weather information (simulated) with error handling
function updateWeatherInfo() {
    const weatherInfo = document.getElementById('weatherInfo');
    if (!weatherInfo) return;
    
    // Simulate weather API call with error handling
    try {
        setTimeout(() => {
            const weatherData = {
                bangkok: "30°C ☀️ แจ่มใส",
                chiangmai: "25°C 🌤️ เย็นสบาย", 
                phuket: "28°C 🌊 ลมทะเล"
            };
            
            const randomLocation = Object.keys(weatherData)[Math.floor(Math.random() * 3)];
            const locationInfo = locations[randomLocation];
            
            if (locationInfo && weatherData[randomLocation]) {
                weatherInfo.innerHTML = `🌤️ ${locationInfo.name}: ${weatherData[randomLocation]}`;
            } else {
                weatherInfo.innerHTML = `🌤️ สภาพอากาศ: ปกติดี / Weather: Normal`;
            }
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
        '0': 'world'
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
    
    // Create photo gallery
    if (info.photos) {
        modalGallery.innerHTML = info.photos.map(photo => `
            <div class="gallery-item">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${photo.emoji}</div>
                <p style="font-size: 0.875rem;">${photo.name}</p>
            </div>
        `).join('');
    } else {
        modalGallery.innerHTML = `<p>🖼️ ${userPreferences.language === 'th' ? 'ภาพประกอบจะมาเร็วๆ นี้' : 'Photos coming soon'}</p>`;
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    
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
            marker.style.animation = 'markerPulse 2s ease-in-out infinite';
        }, 1000);
    }
    
    updateStatus(`📍 ${getText('description')}: ${getCurrentLocationName(info)}`, `📍 Viewing: ${getCurrentLocationName(info)}`);
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
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
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