// PaiNaiDee Enhanced 3D Map JavaScript

let isRotating = true;
let rotationSpeed = 1;
let currentFocus = 'world';
let globe;

// Thai locations with accurate information
const locations = {
    bangkok: {
        name: "กรุงเทพมหานคร",
        nameEn: "Bangkok",
        description: "เมืองหลวงของประเทศไทย เต็มไปด้วยวัดสวยงามและวัฒนธรรม อีกทั้งยังเป็นศูนย์กลางทางเศรษฐกิจและการท่องเที่ยว",
        descriptionEn: "Capital city of Thailand, rich in temples and culture, and the economic and tourism center",
        emoji: "🏛️",
        coordinates: [100.5018, 13.7563],
        attractions: ["วัดพระแก้ว", "พระบรมมหาราชวัง", "วัดโพธิ์", "ตลาดจตุจักร"]
    },
    chiangmai: {
        name: "เชียงใหม่", 
        nameEn: "Chiang Mai",
        description: "เมืองแห่งดอยสูงและวัฒนธรรมล้านนา มีอากาศเย็นสบายและธรรมชาติที่สวยงาม",
        descriptionEn: "City of mountains and Lanna culture with cool weather and beautiful nature",
        emoji: "🏔️",
        coordinates: [98.9817, 18.7883],
        attractions: ["ดอยสุเทพ", "วัดพระธาตุ", "ตลาดวอร์กกิ้งสตรีท", "อุทยานแห่งชาติดอยอินทนนท์"]
    },
    phuket: {
        name: "ภูเก็ต",
        nameEn: "Phuket", 
        description: "เกะมุกอันดามัน ทะเลใสและหาดทรายขาว เป็นจุดหมายปลายทางการท่องเที่ยวที่มีชื่อเสียงระดับโลก",
        descriptionEn: "Pearl of Andaman with crystal clear sea and white sandy beaches, a world-famous tourist destination",
        emoji: "🏝️",
        coordinates: [98.3923, 7.8804],
        attractions: ["หาดป่าตอง", "เกาะพีพี", "หาดกะตะ", "บิ๊กบุดดา"]
    },
    europe: {
        name: "ยุโรป",
        nameEn: "Europe",
        description: "ทวีปแห่งประวัติศาสตร์และศิลปะ มีสถาปัตยกรรมที่งงามและวัฒนธรรมที่หลากหลาย",
        descriptionEn: "Continent of history and art with beautiful architecture and diverse cultures",
        emoji: "🏛️",
        coordinates: [10.0, 54.0],
        attractions: ["หอไอเฟล", "โคลอสเซี่ยม", "สะพานลอนดอน", "พิพิธภัณฑ์ลูฟร์"]
    },
    america: {
        name: "อเมริกา",
        nameEn: "America", 
        description: "ดินแดนแห่งความฝันและโอกาส มีเมืองใหญ่ที่ทันสมัยและธรรมชาติที่น่าประทับใจ",
        descriptionEn: "Land of dreams and opportunities with modern cities and impressive nature",
        emoji: "🗽",
        coordinates: [-74.0, 40.7],
        attractions: ["รูปปั้นเสรีภาพ", "ไทม์สแควร์", "แกรนด์แคนยอน", "ไนแอกราฟอลส์"]
    }
};

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
    
    globe.addEventListener('mousedown', (e) => {
        isDragging = true;
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
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            globe.style.cursor = 'grab';
            
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
    
    const button = event.target;
    button.textContent = isRotating ? '⏸️ หยุด/เล่น' : '▶️ หยุด/เล่น';
    
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

function showInfo(location) {
    const info = locations[location];
    if (info) {
        const attractions = info.attractions ? `\n\n🎯 สถานที่น่าสนใจ:\n${info.attractions.join(', ')}` : '';
        const message = `${info.emoji} ${info.name} (${info.nameEn})\n\n📍 ${info.description}\n🌍 ${info.descriptionEn}${attractions}`;
        
        alert(message);
        focusLocation(location);
        
        // Add click effect to marker
        const marker = document.querySelector(`.marker.${location}`);
        if (marker) {
            marker.style.transform = 'scale(2)';
            setTimeout(() => {
                marker.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

function updateStatus(textTh, textEn) {
    const status = document.getElementById('status');
    status.textContent = `${textTh} | ${textEn}`;
    
    // Add a brief animation to the status
    status.style.transform = 'scale(1.05)';
    setTimeout(() => {
        status.style.transform = 'scale(1)';
    }, 200);
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