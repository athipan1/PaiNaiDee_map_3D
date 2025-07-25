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
        mascotTipButton: "💡 คำแนะนำ"
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
        mascotTipButton: "💡 Tips"
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

// ========================================
// MASCOT SYSTEM & INTERACTIVE FEATURES
// ========================================

// Mascot Tips Database
function initializeMascotTips() {
    mascotTips = {
        th: [
            "🎯 คลิกจุดสีทองบนโลกเพื่อดูข้อมูลสถานที่!",
            "🔍 ใช้ช่องค้นหาเพื่อหาสถานที่ที่คุณสนใจ",
            "⭐ กดปุ่มดาวเพื่อเพิ่มสถานที่ในรายการโปรด",
            "🌍 ลากเมาส์เพื่อหมุนโลกและสำรวจมุมมองใหม่",
            "⚡ เปลี่ยนความเร็วการหมุนด้วยปุ่มควบคุม",
            "🗺️ ใช้ Trip Planner เพื่อวางแผนการเดินทาง",
            "📏 เปรียบเทียบระยะทางระหว่างสถานที่ต่างๆ",
            "🌙 เปลี่ยนธีมเป็นโหมดกลางคืนเพื่อประสบการณ์ใหม่",
            "🇹🇭🇬🇧 สลับภาษาไทย-อังกฤษได้ตลอดเวลา",
            "📱 แอปใช้งานได้ดีบนมือถือด้วยนะ!",
            "🏖️ ลองดูข้อมูลสภาพอากาศของแต่ละสถานที่",
            "🎨 ใช้ Category Filter เพื่อกรองสถานที่ตามประเภท"
        ],
        en: [
            "🎯 Click golden dots on the globe to explore locations!",
            "🔍 Use the search box to find places you're interested in",
            "⭐ Click the star button to add places to your favorites",
            "🌍 Drag to rotate the globe and explore new perspectives",
            "⚡ Change rotation speed with the control buttons",
            "🗺️ Use Trip Planner to organize your travels",
            "📏 Compare distances between different locations",
            "🌙 Switch to dark theme for a different experience",
            "🇹🇭🇬🇧 Toggle between Thai and English anytime",
            "📱 The app works great on mobile devices too!",
            "🏖️ Check weather information for each location",
            "🎨 Use Category Filters to find specific types of places"
        ]
    };
}

// Mascot Interactive Functions
function initializeMascot() {
    initializeMascotTips();
    
    // Setup floating mascot click handler
    const floatingMascot = document.getElementById('floatingMascot');
    if (floatingMascot) {
        floatingMascot.addEventListener('click', handleMascotClick);
        
        // Show initial tip after a delay
        setTimeout(() => {
            showMascotTip();
        }, 5000);
        
        // Periodic tip showing
        setInterval(() => {
            if (Date.now() - lastMascotInteraction > 30000) { // Show tip every 30 seconds if no interaction
                showMascotTip();
            }
        }, 30000);
    }
    
    // Update welcome mascot message
    updateWelcomeMascotMessage();
}

function handleMascotClick() {
    const floatingMascot = document.getElementById('floatingMascot');
    const mascotSpeech = document.getElementById('mascotSpeechSmall');
    
    mascotInteractionCount++;
    lastMascotInteraction = Date.now();
    
    // Add click animation
    floatingMascot.classList.add('active');
    setTimeout(() => {
        floatingMascot.classList.remove('active');
    }, 300);
    
    // Show next tip or greeting
    if (mascotInteractionCount === 1) {
        showMascotGreeting();
    } else {
        showMascotTip();
    }
    
    // Show speech bubble
    floatingMascot.classList.add('speaking');
    setTimeout(() => {
        floatingMascot.classList.remove('speaking');
    }, 4000);
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

function showMascotTip() {
    const mascotTip = document.getElementById('mascotTip');
    if (mascotTip && mascotTips[userPreferences.language]) {
        const tips = mascotTips[userPreferences.language];
        const tip = tips[currentTipIndex % tips.length];
        
        mascotTip.innerHTML = tip;
        currentTipIndex++;
        
        // Add sparkle effect to the mascot
        createMascotSparkles();
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

// Context-aware mascot responses
function showContextualMascotTip(context) {
    const contextTips = {
        th: {
            locationFocus: "ดีมาก! คุณกำลังดูข้อมูล${location} อยู่นะ 🎯<br>ลองคลิกจุดทองอื่นๆ ดูสิ!",
            searchUsed: "เก่งมาก! การค้นหาช่วยให้หาสถานที่ได้ง่ายขึ้น 🔍<br>ลองใช้ Category Filter ด้วยนะ!",
            favoriteAdded: "ยอดเยี่ยม! บันทึกสถานที่โปรดแล้ว ⭐<br>จะได้หาง่ายในครั้งหน้า!",
            tripPlanning: "สุดยอด! กำลังวางแผนทริปใช่มั้ย? 🗺️<br>อย่าลืมดูข้อมูลสภาพอากาศด้วยนะ!",
            themeChanged: "สวยใหม่เลย! ธีมใหม่ทำให้ดูดีขึ้นมาก 🎨<br>ลองเปลี่ยนไปมาดูสิ!"
        },
        en: {
            locationFocus: "Great! You're viewing ${location} 🎯<br>Try clicking other golden dots too!",
            searchUsed: "Excellent! Search makes finding places easier 🔍<br>Try the Category Filters too!",
            favoriteAdded: "Awesome! Location saved to favorites ⭐<br>Easy to find next time!",
            tripPlanning: "Perfect! Planning a trip? 🗺️<br>Don't forget to check weather info!",
            themeChanged: "Looking good! The new theme is beautiful 🎨<br>Feel free to switch back and forth!"
        }
    };
    
    const mascotTip = document.getElementById('mascotTip');
    if (mascotTip && contextTips[userPreferences.language] && contextTips[userPreferences.language][context]) {
        const tip = contextTips[userPreferences.language][context];
        mascotTip.innerHTML = tip;
        
        // Show mascot speaking
        const floatingMascot = document.getElementById('floatingMascot');
        if (floatingMascot) {
            floatingMascot.classList.add('speaking');
            setTimeout(() => {
                floatingMascot.classList.remove('speaking');
            }, 3000);
        }
        
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
        categories: ["mountain", "cultural", "adventure"],
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
        categories: ["beach", "adventure"],
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
        categories: ["historical", "cultural"],
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
            // Add focus animation
            marker.style.animation = 'markerFocus 1s ease-in-out';
            setTimeout(() => {
                marker.style.animation = 'markerPulse 2s ease-in-out infinite';
            }, 1000);
        }
        
        updateStatus(`${info.emoji} ${info.name}`, `${info.emoji} ${info.nameEn}`);
        
        // Show contextual mascot tip
        setTimeout(() => {
            showContextualMascotTip('locationFocus');
        }, 1000);
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

// Enhanced modal system for location information with improved animations
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
    
    // Initialize enhanced UX/UI features after short delay
    setTimeout(() => {
        initializeEnhancedUX();
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