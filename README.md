# 🗺️ PaiNaiDee 3D Map - Enhanced UX/UI
### แผนที่ 3 มิติ PaiNaiDee - ปรับปรุง UX/UI

<div align="center">

![PaiNaiDee 3D Map](https://img.shields.io/badge/PaiNaiDee-3D%20Map-blue?style=for-the-badge&logo=globe&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**A beautiful, modern 3D interactive map application showcasing Thailand and the world with cutting-edge UX/UI design.**

**แอปพลิเคชันแผนที่ 3 มิติแบบอินเทอแรคทีฟที่สวยงามและทันสมัย แสดงประเทศไทยและโลกด้วยการออกแบบ UX/UI ที่ล้ำสมัย**

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=flat&logo=github&logoColor=white)](https://athipan1.github.io/PaiNaiDee_map_3D)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://painaidee-3d-map.vercel.app)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://hub.docker.com/r/painaidee/3d-map)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://painaidee-3d-map.netlify.app)

</div>

---

## 📋 Table of Contents / สารบัญ

### English
- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🌐 Deployment](#-deployment)
- [🎮 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

### ไทย
- [🚀 เริ่มต้นอย่างรวดเร็ว](#-เริ่มต้นอย่างรวดเร็ว)
- [✨ ฟีเจอร์](#-ฟีเจอร์)
- [🛠️ เทคโนโลยีที่ใช้](#️-เทคโนโลยีที่ใช้)
- [📦 การติดตั้ง](#-การติดตั้ง)
- [🔧 การตั้งค่า](#-การตั้งค่า)
- [🌐 การ Deploy](#-การ-deploy)
- [🎮 การใช้งาน](#-การใช้งาน)
- [🤝 การมีส่วนร่วม](#-การมีส่วนร่วม)
- [📄 สัญญาอนุญาต](#-สัญญาอนุญาต)

---

## 🚀 Quick Start

### Prerequisites / ข้อกำหนดเบื้องต้น
- **Node.js** 16+ and npm 8+ / Node.js 16+ และ npm 8+
- **Docker** (optional) / Docker (ตัวเลือก)
- Modern web browser / เว็บเบราว์เซอร์ทันสมัย

### Installation / การติดตั้ง

```bash
# Clone the repository / คลอนรีโพซิทอรี
git clone https://github.com/athipan1/PaiNaiDee_map_3D.git
cd PaiNaiDee_map_3D

# Install dependencies / ติดตั้ง dependencies
npm install

# Start development server / เริ่มเซิร์ฟเวอร์พัฒนา
npm start
```

### Docker Quick Start / เริ่มต้นด้วย Docker

```bash
# Build and run with Docker / สร้างและรันด้วย Docker
docker build -t painaidee-3d-map .
docker run -p 80:80 painaidee-3d-map

# Or use Docker Compose / หรือใช้ Docker Compose
docker-compose up --build
```

---

## ✨ Features / ฟีเจอร์

### 🎨 Modern Visual Design / การออกแบบภาพที่ทันสมัย
- **Glass-morphism Effects**: Beautiful translucent panels with backdrop blur
  **เอฟเฟกต์แก้วใส**: แผงโปร่งแสงสวยงามพร้อมเบลอพื้นหลัง
- **Dark/Light Mode Toggle**: Seamless theme switching with smooth transitions
  **สลับโหมดมืด/สว่าง**: การเปลี่ยนธีมแบบราบรื่นพร้อมทรานซิชั่นนิ่ม
- **Responsive Design**: Mobile-first approach that works on all screen sizes
  **การออกแบบที่ตอบสนอง**: แนวทางมือถือก่อนที่ทำงานได้ทุกขนาดหน้าจอ

### 🚀 Interactive User Interface / อินเทอร์เฟซผู้ใช้แบบอินเทอแรคทีฟ
- **Real-time Search**: Location search with autocomplete functionality
  **การค้นหาแบบเรียลไทม์**: ค้นหาสถานที่พร้อมการเติมข้อความอัตโนมัติ
- **Favorites System**: Save and manage favorite locations with local storage
  **ระบบรายการโปรด**: บันทึกและจัดการสถานที่โปรดด้วยการจัดเก็บในเครื่อง
- **Enhanced Information Cards**: Detailed location modals with rich content
  **การ์ดข้อมูลปรับปรุง**: โมดัลสถานที่โดยละเอียดพร้อมเนื้อหาที่หลากหลาย

### 🌟 Advanced Features / ฟีเจอร์ขั้นสูง
- **Weather Information**: Simulated real-time weather display
  **ข้อมูลสภาพอากาศ**: การแสดงสภาพอากาศแบบจำลองเรียลไทม์
- **Photo Galleries**: Visual representations of attractions
  **แกลเลอรีภาพ**: การแสดงภาพสถานที่ท่องเที่ยว
- **Keyboard Navigation**: Full keyboard support with hotkeys
  **การนำทางด้วยคีย์บอร์ด**: รองรับคีย์บอร์ดเต็มรูปแบบพร้อมปุ่มลัด

### ♿ Accessibility & Performance / การเข้าถึงและประสิทธิภาพ
- **ARIA Support**: Proper semantic HTML and accessibility attributes
  **รองรับ ARIA**: HTML เชิงความหมายและคุณลักษณะการเข้าถึงที่เหมาะสม
- **Focus Management**: Keyboard navigation and focus indicators
  **การจัดการโฟกัส**: การนำทางด้วยคีย์บอร์ดและตัวบ่งชี้โฟกัส
- **High Contrast Mode**: Enhanced visibility for accessibility
  **โหมดความคมชัดสูง**: การมองเห็นที่ดีขึ้นเพื่อการเข้าถึง

---

## 🛠️ Technology Stack / เทคโนโลยีที่ใช้

### Frontend / ส่วนหน้า
- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Modern features including CSS Grid, Flexbox, Custom Properties
- **Vanilla JavaScript**: ES6+ features with no external dependencies
- **Leaflet**: Interactive maps and geospatial functionality

### Deployment / การ Deploy
- **Docker**: Containerized deployment with Nginx
- **GitHub Pages**: Static site hosting
- **Vercel**: Serverless deployment platform
- **Netlify**: Modern web deployment

### Development Tools / เครื่องมือการพัฒนา
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Stylelint**: CSS linting
- **Lighthouse**: Performance auditing

---

## 📦 Installation / การติดตั้ง

### Method 1: NPM (Recommended) / วิธีที่ 1: NPM (แนะนำ)

```bash
# Install dependencies / ติดตั้ง dependencies
npm install

# Available scripts / สคริปต์ที่มี
npm start          # Start development server / เริ่มเซิร์ฟเวอร์พัฒนา
npm run build      # Build for production / สร้างสำหรับการใช้งานจริง
npm run lint       # Run code linting / รันการตรวจสอบโค้ด
npm test           # Run tests / รันการทดสอบ
npm run preview    # Preview production build / ดูตัวอย่างการสร้างเพื่อการใช้งานจริง
```

### Method 2: Docker / วิธีที่ 2: Docker

```bash
# Development / การพัฒนา
docker-compose up painaidee-dev

# Production / การใช้งานจริง
docker-compose up painaidee-prod

# Build custom image / สร้างอิมเมจกำหนดเอง
docker build --target production -t painaidee-3d-map:latest .
```

### Method 3: Direct File Access / วิธีที่ 3: เข้าถึงไฟล์โดยตรง

Simply open `src/pages/home/index.html` in your browser for basic functionality.
เพียงเปิด `src/pages/home/index.html` ในเบราว์เซอร์ของคุณสำหรับฟังก์ชันพื้นฐาน

---

## 🔧 Configuration / การตั้งค่า

### Environment Variables / ตัวแปรสภาพแวดล้อม

Copy the example environment file and customize:
คัดลอกไฟล์สภาพแวดล้อมตัวอย่างและปรับแต่ง:

```bash
cp config/examples/.env.example .env
```

Key configuration options / ตัวเลือกการตั้งค่าสำคัญ:

```env
NODE_ENV=development          # Environment mode / โหมดสภาพแวดล้อม
PORT=8080                     # Server port / พอร์ตเซิร์ฟเวอร์
APP_URL=http://localhost:8080 # Application URL / URL แอปพลิเคชัน
DEFAULT_LANGUAGE=th           # Default language / ภาษาเริ่มต้น
```

### Build Configuration / การตั้งค่าการสร้าง

The project includes optimized build scripts:
โปรเจกต์รวมสคริปต์การสร้างที่เพิ่มประสิทธิภาพ:

```json
{
  "scripts": {
    "build": "npm run build:prepare && npm run build:copy && npm run build:optimize",
    "build:production": "NODE_ENV=production npm run build"
  }
}
```

---

## 🌐 Deployment / การ Deploy

### GitHub Pages

Automatic deployment via GitHub Actions:
การ deploy อัตโนมัติผ่าน GitHub Actions:

```yaml
# Triggered on push to main branch
# เรียกใช้เมื่อ push ไปยัง main branch
on:
  push:
    branches: [ "main" ]
```

**Live Demo**: [https://athipan1.github.io/PaiNaiDee_map_3D](https://athipan1.github.io/PaiNaiDee_map_3D)

### Vercel

```bash
# Install Vercel CLI / ติดตั้ง Vercel CLI
npm install -g vercel

# Deploy / Deploy
vercel --prod
```

Configuration in `vercel.json` includes optimized routing and headers.
การตั้งค่าใน `vercel.json` รวมการจัดเส้นทางและส่วนหัวที่เพิ่มประสิทธิภาพ

### Netlify

```bash
# Install Netlify CLI / ติดตั้ง Netlify CLI
npm install -g netlify-cli

# Deploy / Deploy
netlify deploy --prod
```

Configuration in `netlify.toml` includes build settings and redirects.
การตั้งค่าใน `netlify.toml` รวมการตั้งค่าการสร้างและการเปลี่ยนเส้นทาง

### Docker

```bash
# Production deployment / การ deploy ใช้งานจริง
docker build --target production -t painaidee-3d-map .
docker run -d -p 80:80 --name painaidee-map painaidee-3d-map

# With Docker Compose / ด้วย Docker Compose
docker-compose -f docker-compose.yml up -d painaidee-prod
```

---

## 🎮 Usage / การใช้งาน

### Keyboard Shortcuts / ปุ่มลัดคีย์บอร์ด

| Key / ปุ่ม | Function / ฟังก์ชัน |
|------------|-------------------|
| `1-4` | Quick navigation to locations / นำทางรวดเร็วไปยังสถานที่ |
| `Space` | Toggle globe rotation / สลับการหมุนลูกโลก |
| `Arrow Keys` | Manual globe rotation / หมุนลูกโลกด้วยตนเอง |
| `Escape` | Close modal/dialog / ปิดโมดัล/ไดอะล็อก |

### Featured Locations / สถานที่แนะนำ

#### Thailand 🇹🇭
- **กรุงเทพฯ (Bangkok)**: Grand Palace, Wat Phra Kaew, Wat Pho, Chatuchak Market
- **เชียงใหม่ (Chiang Mai)**: Doi Suthep, Walking Street, Elephant Sanctuary  
- **ภูเก็ต (Phuket)**: Patong Beach, Phi Phi Islands, Big Buddha

#### International 🌍
- **Europe**: Eiffel Tower, Colosseum, Tower Bridge, Louvre Museum
- **America**: Statue of Liberty, Grand Canyon, Times Square, Disney World

### Search Functionality / ฟังก์ชันการค้นหา
- Real-time filtering as you type / การกรองแบบเรียลไทม์ขณะที่คุณพิมพ์
- Searches both Thai and English names / ค้นหาทั้งชื่อไทยและอังกฤษ
- Includes attraction names in search results / รวมชื่อสถานที่ท่องเที่ยวในผลการค้นหา

---

## 🎨 Customization / การปรับแต่ง

### Theme System / ระบบธีม

The application uses CSS custom properties for easy theming:
แอปพลิเคชันใช้คุณสมบัติ CSS แบบกำหนดเองเพื่อการปรับธีมที่ง่าย:

```css
:root {
  --primary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-color: #48b1e8;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --text-primary: #2d3748;
  --border-radius: 12px;
}

[data-theme="dark"] {
  --primary-bg: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  --text-primary: #f7fafc;
}
```

### Language Support / การรองรับภาษา

Toggle between Thai and English interfaces:
สลับระหว่างอินเทอร์เฟซไทยและอังกฤษ:

```javascript
// Set language / ตั้งค่าภาษา
setLanguage('th'); // Thai / ไทย
setLanguage('en'); // English / อังกฤษ
```

---

## 🤝 Contributing / การมีส่วนร่วม

### Development Setup / การตั้งค่าการพัฒนา

```bash
# Fork the repository / Fork รีโพซิทอรี
# Clone your fork / คลอน fork ของคุณ
git clone https://github.com/YOUR_USERNAME/PaiNaiDee_map_3D.git

# Create a feature branch / สร้าง feature branch
git checkout -b feature/amazing-feature

# Make your changes / ทำการเปลี่ยนแปลง
# Test your changes / ทดสอบการเปลี่ยนแปลง
npm test

# Commit your changes / commit การเปลี่ยนแปลง
git commit -m "Add some amazing feature"

# Push to your branch / push ไปยัง branch ของคุณ
git push origin feature/amazing-feature

# Open a Pull Request / เปิด Pull Request
```

### Code Style / รูปแบบโค้ด

- Use ESLint and Prettier for consistent formatting / ใช้ ESLint และ Prettier เพื่อการจัดรูปแบบที่สม่ำเสมอ
- Follow accessibility best practices / ปฏิบัติตามแนวปฏิบัติที่ดีที่สุดในการเข้าถึง
- Write semantic HTML / เขียน HTML เชิงความหมาย
- Include Thai and English documentation / รวมเอกสารไทยและอังกฤษ

### Testing / การทดสอบ

```bash
npm run lint          # Code linting / การตรวจสอบโค้ด
npm run test          # Run tests / รันการทดสอบ
npm run validate      # Full validation / การตรวจสอบแบบเต็ม
```

---

## 📊 Browser Compatibility / ความเข้ากันได้ของเบราว์เซอร์

| Browser / เบราว์เซอร์ | Support / รองรับ | Notes / หมายเหตุ |
|-------------------|----------------|-----------------|
| Chrome 90+ | ✅ Full / เต็ม | Recommended / แนะนำ |
| Firefox 88+ | ✅ Full / เต็ม | Full support / รองรับเต็ม |
| Safari 14+ | ✅ Full / เต็ม | iOS Safari supported / รองรับ iOS Safari |
| Edge 90+ | ✅ Full / เต็ม | Chromium-based / ใช้ Chromium |

---

## 📈 Performance / ประสิทธิภาพ

### Lighthouse Scores / คะแนน Lighthouse
- **Performance**: 95+ / ประสิทธิภาพ: 95+
- **Accessibility**: 100 / การเข้าถึง: 100
- **Best Practices**: 100 / แนวปฏิบัติที่ดี: 100
- **SEO**: 100

### Optimization Features / ฟีเจอร์การเพิ่มประสิทธิภาพ
- Lazy loading of images / การโหลดภาพแบบ lazy
- Code splitting and minification / การแบ่งโค้ดและการย่อขนาด
- Efficient caching strategies / กลยุทธ์การแคชที่มีประสิทธิภาพ
- Optimized asset delivery / การส่งมอบสินทรัพย์ที่เพิ่มประสิทธิภาพ

---

## 🆘 Troubleshooting / การแก้ไขปัญหา

### Common Issues / ปัญหาทั่วไป

**Map not loading / แผนที่ไม่โหลด**
```bash
# Check if server is running / ตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่
npm start

# Clear browser cache / ล้างแคชเบราว์เซอร์
# Check console for errors / ตรวจสอบคอนโซลสำหรับข้อผิดพลาด
```

**Build failing / การสร้างล้มเหลว**
```bash
# Clean and reinstall / ล้างและติดตั้งใหม่
npm run clean
npm install

# Check Node.js version / ตรวจสอบเวอร์ชัน Node.js
node --version # Should be 16+ / ควรเป็น 16+
```

**Docker issues / ปัญหา Docker**
```bash
# Rebuild without cache / สร้างใหม่โดยไม่ใช้แคช
docker build --no-cache -t painaidee-3d-map .

# Check container logs / ตรวจสอบ log ของคอนเทนเนอร์
docker logs painaidee-3d-map
```

---

## 📄 License / สัญญาอนุญาต

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
โปรเจกต์นี้อยู่ภายใต้สัญญาอนุญาต MIT License - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

---

## 🙏 Acknowledgments / กิตติกรรมประกาศ

- **Thai Tourism Authority** for inspiration / การท่องเที่ยวแห่งประเทศไทยสำหรับแรงบันดาลใจ
- **Open Source Community** for the amazing tools / ชุมชนโอเพนซอร์สสำหรับเครื่องมือที่ยอดเยี่ยม
- **Accessibility advocates** for inclusive design principles / ผู้สนับสนุนการเข้าถึงสำหรับหลักการออกแบบที่ครอบคลุม

---

<div align="center">

**Made with ❤️ for Thailand / สร้างด้วย ❤️ เพื่อประเทศไทย**

[![GitHub Stars](https://img.shields.io/github/stars/athipan1/PaiNaiDee_map_3D?style=social)](https://github.com/athipan1/PaiNaiDee_map_3D/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/athipan1/PaiNaiDee_map_3D?style=social)](https://github.com/athipan1/PaiNaiDee_map_3D/network/members)

**ยินดีต้อนรับสู่แผนที่ 3 มิติที่ทันสมัย! 🇹🇭**  
*Welcome to the Modern 3D Map Experience!*

</div>