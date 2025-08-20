// This file will mock a backend API to make the application structure more robust.
// It returns hardcoded data wrapped in Promises to simulate network requests.

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
                url: "https://picsum.photos/800/600?random=1",
                description: "The Grand Palace complex in Bangkok, Thailand's most famous landmark"
            },
            {
                name: "Wat Arun",
                emoji: "🕌",
                url: "https://picsum.photos/800/600?random=2",
                description: "Temple of Dawn, one of Bangkok's most iconic temples"
            },
            {
                name: "Floating Market",
                emoji: "🛶",
                url: "https://picsum.photos/800/600?random=3",
                description: "Traditional floating market showcasing local culture and food"
            },
            {
                name: "Tuk Tuk",
                emoji: "🛺",
                url: "https://picsum.photos/800/600?random=4",
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
                url: "https://picsum.photos/800/600?random=5",
                description: "Sacred mountain temple with panoramic city views"
            },
            {
                name: "Night Bazaar",
                emoji: "🌃",
                url: "https://picsum.photos/800/600?random=6",
                description: "Vibrant night market in the heart of Chiang Mai"
            },
            {
                name: "Elephant Sanctuary",
                emoji: "🐘",
                url: "https://picsum.photos/800/600?random=7",
                description: "Ethical elephant sanctuary in the mountains"
            },
            {
                name: "Lanna Temple",
                emoji: "🏯",
                url: "https://picsum.photos/800/600?random=8",
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
                url: "https://picsum.photos/800/600?random=9",
                description: "Popular beach destination with crystal clear waters"
            },
            {
                name: "Phi Phi Islands",
                emoji: "🏝️",
                url: "https://picsum.photos/800/600?random=10",
                description: "Stunning limestone cliffs and turquoise waters"
            },
            {
                name: "Sunset View",
                emoji: "🌅",
                url: "https://picsum.photos/800/600?random=11",
                description: "Breathtaking sunset views over the Andaman Sea"
            },
            {
                name: "Longtail Boat",
                emoji: "⛵",
                url: "https://picsum.photos/800/600?random=12",
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

// Simulate API call to fetch all data
export const fetchAllData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        locations,
        locationCategories
      });
    }, 500); // Simulate network delay
  });
};
