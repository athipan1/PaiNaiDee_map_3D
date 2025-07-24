// PaiNaiDee Enhanced 3D Map

let isRotating = true;
let rotationSpeed = 1;
let currentFocus = 'world';
let globeElement;

const locations = {
    bangkok: {
        name: "กรุงเทพมหานคร",
        nameEn: "Bangkok",
        description: "เมืองหลวงของประเทศไทย เต็มไปด้วยวัดสวยงามและวัฒนธรรม มีพระราชวังหลวง วัดพระแก้ว และตลาดน้ำดำเนินสะดวก",
        descriptionEn: "Capital city of Thailand, rich in temples and culture. Features the Grand Palace, Wat Phra Kaew, and floating markets.",
        emoji: "🏛️",
        coordinates: [100.5018, 13.7563],
        facts: "ประชากร: 8.3 ล้านคน | Population: 8.3 million"
    },
    chiangmai: {
        name: "เชียงใหม่", 
        nameEn: "Chiang Mai",
        description: "เมืองแห่งดอยสูงและวัฒนธรรมล้านนา มีวัดดอยสุเทพ ถนนคนเดิน และภูเขาสูง",
        descriptionEn: "City of mountains and Lanna culture. Features Doi Suthep temple, walking streets, and mountain peaks.",
        emoji: "🏔️",
        coordinates: [98.9853, 18.7883],
        facts: "ความสูง: 310 เมตร | Elevation: 310 meters"
    },
    phuket: {
        name: "ภูเก็ต",
        nameEn: "Phuket", 
        description: "เกะมุกอันดามัน ทะเลใสและหาดทรายขาว มีหาดป่าตอง หาดกะตะ และอ่าวพังงา",
        descriptionEn: "Pearl of Andaman, crystal clear sea and white sandy beaches. Features Patong Beach, Kata Beach, and Phang Nga Bay.",
        emoji: "🏝️",
        coordinates: [98.3923, 7.8804],
        facts: "เกาะ: 1 ใน 39 เกาะ | Island: 1 of 39 islands"
    },
    europe: {
        name: "ยุโรป",
        nameEn: "Europe",
        description: "ทวีปแห่งประวัติศาสตร์และศิลปะ มีหอไอเฟล โคลอสเซียม และพิพิธภัณฑ์ลูฟวร์",
        descriptionEn: "Continent of history and art. Features Eiffel Tower, Colosseum, and Louvre Museum.",
        emoji: "🏛️",
        coordinates: [10.0, 54.0],
        facts: "ประเทศ: 44 ประเทศ | Countries: 44 countries"
    },
    america: {
        name: "อเมริกา",
        nameEn: "America", 
        description: "ดินแดนแห่งความฝันและโอกาส มีอนุสาวรีย์เทพีเสรีภาพ แกรนด์แคนยอน และไนแอการาฟอลส์",
        descriptionEn: "Land of dreams and opportunities. Features Statue of Liberty, Grand Canyon, and Niagara Falls.",
        emoji: "🗽",
        coordinates: [-95.0, 40.0],
        facts: "เขตเวลา: 6 เขต | Time zones: 6 zones"
    }
};

function updateGlobeRotation() {
    globeElement = document.querySelector('.globe-sphere');
    const cloudsLayer = document.querySelector('.clouds-layer');
    
    if (globeElement) {
        if (isRotating) {
            const duration = Math.round(25 / rotationSpeed);
            globeElement.style.animationDuration = `${duration}s`;
            globeElement.style.animationPlayState = 'running';
            
            if (cloudsLayer) {
                cloudsLayer.style.animationDuration = `${duration * 1.6}s`;
                cloudsLayer.style.animationPlayState = 'running';
            }
        } else {
            globeElement.style.animationPlayState = 'paused';
            if (cloudsLayer) {
                cloudsLayer.style.animationPlayState = 'paused';
            }
        }
    }
}

function toggleRotation() {
    isRotating = !isRotating;
    updateGlobeRotation();
    
    const button = event.target;
    button.textContent = isRotating ? '⏸️ หยุด/เล่น' : '▶️ หยุด/เล่น';
    
    updateStatus(isRotating ? 'กำลังหมุน...' : 'หยุดหมุน', isRotating ? 'Rotating...' : 'Paused');
    
    // Add visual feedback
    addStatusEffect(isRotating ? '🌍' : '⏸️');
}

function changeSpeed() {
    rotationSpeed = rotationSpeed === 1 ? 2 : rotationSpeed === 2 ? 0.5 : 1;
    updateGlobeRotation();
    
    const speedText = rotationSpeed === 2 ? 'เร็ว' : rotationSpeed === 0.5 ? 'ช้า' : 'ปกติ';
    const speedTextEn = rotationSpeed === 2 ? 'Fast' : rotationSpeed === 0.5 ? 'Slow' : 'Normal';
    const speedEmoji = rotationSpeed === 2 ? '⚡' : rotationSpeed === 0.5 ? '🐌' : '🌍';
    
    updateStatus(`ความเร็ว: ${speedText}`, `Speed: ${speedTextEn}`);
    addStatusEffect(speedEmoji);
}

function focusLocation(location) {
    currentFocus = location;
    const info = locations[location];
    
    if (info) {
        updateStatus(`${info.emoji} ${info.name}`, `${info.emoji} ${info.nameEn}`);
        
        // Add visual effect to the specific marker
        const marker = document.querySelector(`[data-location="${location}"]`);
        if (marker) {
            marker.style.transform = 'translate(-50%, -50%) scale(2)';
            marker.style.zIndex = '200';
            setTimeout(() => {
                marker.style.transform = 'translate(-50%, -50%) scale(1)';
                marker.style.zIndex = '101';
            }, 1000);
        }
    } else if (location === 'world') {
        updateStatus('🌍 มุมมองโลก', '🌍 World View');
    }
    
    // Add focus effect to globe
    addGlobeFocusEffect();
}

function showInfo(location) {
    const info = locations[location];
    if (info) {
        const message = `${info.emoji} ${info.name} (${info.nameEn})\n\n` +
                       `${info.description}\n\n` +
                       `${info.descriptionEn}\n\n` +
                       `📊 ${info.facts}`;
        
        alert(message);
        focusLocation(location);
    }
}

function addStatusEffect(emoji) {
    const effect = document.createElement('div');
    effect.textContent = emoji;
    effect.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 60px;
        z-index: 9999;
        pointer-events: none;
        animation: statusEffect 1.5s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes statusEffect {
            0% { opacity: 0; transform: translateX(-50%) scale(0.5); }
            50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
            100% { opacity: 0; transform: translateX(-50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
        document.head.removeChild(style);
    }, 1500);
}

function addGlobeFocusEffect() {
    const globe = document.querySelector('#enhanced3DGlobe');
    if (globe) {
        globe.style.transform = 'translate(-50%, -50%) scale(1.1)';
        setTimeout(() => {
            globe.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 500);
    }
}

function addInteractiveEffects() {
    // Add click ripple effect to globe
    const globeSphere = document.querySelector('.globe-sphere');
    if (globeSphere) {
        globeSphere.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: rippleEffect 0.8s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rippleStyle = document.createElement('style');
            rippleStyle.textContent = `
                @keyframes rippleEffect {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
                }
            `;
            document.head.appendChild(rippleStyle);
            this.appendChild(ripple);
            
            setTimeout(() => {
                this.removeChild(ripple);
                document.head.removeChild(rippleStyle);
            }, 800);
            
            updateStatus('🎯 สำรวจพิกัดใหม่!', '🎯 Exploring new coordinates!');
        });
    }
    
    // Add hover effects to continents
    const continents = document.querySelectorAll('.continent');
    continents.forEach(continent => {
        continent.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.filter = 'brightness(1.2)';
            updateStatus(`🌿 ${this.dataset.name}`, `🌿 ${this.dataset.name}`);
        });
        
        continent.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    });
}

function updateStatus(textTh, textEn) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = `${textTh} | ${textEn}`;
        
        // Add status animation
        status.style.transform = 'translateX(-50%) scale(1.1)';
        setTimeout(() => {
            status.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
    }
}

function initializeMap() {
    // Initialize globe rotation
    updateGlobeRotation();
    
    // Add interactive effects
    addInteractiveEffects();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case ' ': // Spacebar
                e.preventDefault();
                toggleRotation();
                break;
            case 'ArrowUp':
                e.preventDefault();
                changeSpeed();
                break;
            case '1':
                focusLocation('bangkok');
                break;
            case '2':
                focusLocation('chiangmai');
                break;
            case '3':
                focusLocation('phuket');
                break;
            case '0':
                focusLocation('world');
                break;
        }
    });
    
    // Add smooth transition to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.transition = 'all 0.3s ease';
    });
    
    console.log('🗺️ Enhanced PaiNaiDee 3D Map loaded successfully!');
    console.log('สร้างแผนที่ 3 มิติปรับปรุงใหม่สำเร็จ! Created Enhanced 3D Map successfully!');
    console.log('⌨️ Keyboard shortcuts: Space=pause, ↑=speed, 1-3=locations, 0=world');
    
    updateStatus('🌍 แผนที่ 3 มิติปรับปรุงใหม่พร้อมใช้งาน', '🌍 Enhanced 3D Map Ready');
    
    // Show welcome effect
    setTimeout(() => {
        addStatusEffect('🎉');
    }, 500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMap);