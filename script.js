// PaiNaiDee 3D Map JavaScript

let isRotating = true;
let rotationSpeed = 1;
let currentFocus = 'world';

const locations = {
    bangkok: {
        name: "กรุงเทพมหานคร",
        nameEn: "Bangkok",
        description: "เมืองหลวงของประเทศไทย เต็มไปด้วยวัดสวยงามและวัฒนธรรม",
        descriptionEn: "Capital city of Thailand, rich in temples and culture",
        emoji: "🏛️"
    },
    chiangmai: {
        name: "เชียงใหม่", 
        nameEn: "Chiang Mai",
        description: "เมืองแห่งดอยสูงและวัฒนธรรมล้านนา",
        descriptionEn: "City of mountains and Lanna culture",
        emoji: "🏔️"
    },
    phuket: {
        name: "ภูเก็ต",
        nameEn: "Phuket", 
        description: "เกะมุกอันดามัน ทะเลใสและหาดทรายขาว",
        descriptionEn: "Pearl of Andaman, crystal clear sea and white sandy beaches",
        emoji: "🏝️"
    },
    europe: {
        name: "ยุโรป",
        nameEn: "Europe",
        description: "ทวีปแห่งประวัติศาสตร์และศิลปะ",
        descriptionEn: "Continent of history and art",
        emoji: "🏛️"
    },
    america: {
        name: "อเมริกา",
        nameEn: "America", 
        description: "ดินแดนแห่งความฝันและโอกาส",
        descriptionEn: "Land of dreams and opportunities",
        emoji: "🗽"
    }
};

function updateGlobeRotation() {
    const globe = document.getElementById('globe');
    const continents = document.querySelector('.continents');
    
    if (isRotating) {
        globe.style.animationDuration = `${20 / rotationSpeed}s`;
        continents.style.animationDuration = `${20 / rotationSpeed}s`;
        globe.style.animationPlayState = 'running';
        continents.style.animationPlayState = 'running';
    } else {
        globe.style.animationPlayState = 'paused';
        continents.style.animationPlayState = 'paused';
    }
}

function toggleRotation() {
    isRotating = !isRotating;
    updateGlobeRotation();
    
    const button = event.target;
    button.textContent = isRotating ? '⏸️ หยุด/เล่น' : '▶️ หยุด/เล่น';
    
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
        updateStatus(`${info.emoji} ${info.name}`, `${info.emoji} ${info.nameEn}`);
    } else {
        updateStatus('🌍 มุมมองโลก', '🌍 World View');
    }
    
    // Visual feedback
    const globe = document.getElementById('globe');
    globe.style.transform = 'translate(-50%, -50%) scale(1.1)';
    setTimeout(() => {
        globe.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 300);
}

function showInfo(location) {
    const info = locations[location];
    if (info) {
        alert(`${info.emoji} ${info.name} (${info.nameEn})\n\n${info.description}\n${info.descriptionEn}`);
        focusLocation(location);
    }
}

function updateStatus(textTh, textEn) {
    const status = document.getElementById('status');
    status.textContent = `${textTh} | ${textEn}`;
}

function initializeMap() {
    // Initialize globe rotation
    updateGlobeRotation();
    
    // Add mouse interaction
    const globe = document.getElementById('globe');
    let isDragging = false;
    
    globe.addEventListener('mousedown', (e) => {
        isDragging = true;
        globe.style.cursor = 'grabbing';
    });
    
    globe.addEventListener('mouseup', (e) => {
        isDragging = false;
        globe.style.cursor = 'grab';
    });
    
    globe.addEventListener('mouseleave', (e) => {
        isDragging = false;
        globe.style.cursor = 'grab';
    });
    
    // Add interactive feedback
    globe.addEventListener('click', (e) => {
        if (!isDragging) {
            const rect = globe.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create a ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'pulse 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            globe.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            updateStatus('🎯 สำรวจพิกัดใหม่!', '🎯 Exploring new coordinates!');
        }
    });
    
    console.log('🗺️ PaiNaiDee 3D Map loaded successfully!');
    console.log('สร้างแผนที่ 3 มิติสำเร็จ! Created 3D Map successfully!');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMap);