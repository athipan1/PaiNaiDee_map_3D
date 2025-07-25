# 🚀 PaiNaiDee 3D Map - การใช้งานและการ Deploy

## การใช้งานเบื้องต้น / Basic Usage

### 🏃‍♂️ วิธีการเริ่มต้นใช้งาน

1. **ดาวน์โหลดโปรเจค / Download Project**
   ```bash
   git clone https://github.com/athipan1/PaiNaiDee_map_3D.git
   cd PaiNaiDee_map_3D
   ```

2. **เปิดใช้งานในเครื่อง / Run Locally**
   ```bash
   # วิธีที่ 1: ใช้ Python
   python3 -m http.server 8080
   
   # วิธีที่ 2: ใช้ NPM
   npm run dev
   
   # วิธีที่ 3: เปิดไฟล์โดยตรง
   # เปิด index.html ด้วยเบราว์เซอร์
   ```

3. **เข้าใช้งาน**: เปิด `http://localhost:8080` ในเบราว์เซอร์

## 🌐 การ Deploy แอปพลิเคชัน / Deployment Options

### 1. GitHub Pages (แนะนำสำหรับผู้เริ่มต้น)

**วิธีแบบอัตโนมัติ:**
1. Fork repository นี้ไปยัง GitHub account ของคุณ
2. ไปที่ Settings → Pages
3. เลือก Source เป็น "GitHub Actions"
4. Push code ไปยัง branch `main` - ระบบจะ deploy อัตโนมัติ!

**URL ที่ได้:** `https://[username].github.io/PaiNaiDee_map_3D/`

### 2. Vercel (แนะนำสำหรับ Production)

**วิธีแบบง่าย:**
1. คลิก: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/athipan1/PaiNaiDee_map_3D)
2. เชื่อมต่อ GitHub account
3. Deploy!

**วิธีแบบ CLI:**
```bash
npm i -g vercel
vercel
```

### 3. Netlify

**วิธีแบบ Drag & Drop:**
1. ไปที่ [netlify.com](https://netlify.com)
2. ลากโฟลเดอร์โปรเจคไปวาง
3. รอการ deploy เสร็จ

**วิธีแบบ CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### 4. Docker (สำหรับ Server)

```bash
# สร้าง Docker image
docker build -t painaidee-3d-map .

# รัน container
docker run -p 8080:80 painaidee-3d-map

# หรือใช้ Docker Compose
docker-compose up -d
```

## 📱 การใช้งานแอปพลิเคชัน / How to Use

### 🎮 การควบคุม / Controls

**เมาส์และทัชสกรีน:**
- ลากเพื่อหมุนโลก
- ลูกกลิ้งเมาส์เพื่อซูมเข้า-ออก
- คลิกที่จุดต่างๆ เพื่อดูข้อมูล

**คีย์บอร์ด:**
- `1` - กรุงเทพฯ
- `2` - เชียงใหม่
- `3` - ภูเก็ต
- `4` - มุมมองโลก
- `Space` - หยุด/เริ่มการหมุนอัตโนมัติ
- `↑↓←→` - หมุนโลกด้วยตนเอง
- `Esc` - ปิดหน้าต่างข้อมูล

### 🔍 ฟีเจอร์เด่น / Key Features

1. **ค้นหาสถานที่:** พิมพ์ชื่อสถานที่ในช่องค้นหา
2. **บันทึกที่ชื่นชอบ:** คลิก ⭐ เพื่อบันทึกสถานที่
3. **เปลี่ยนธีม:** คลิก 🌙/☀️ เพื่อสลับธีมสี
4. **ข้อมูลสถานที่:** คลิกที่ปิ่นเพื่อดูข้อมูลละเอียด

## 🛠️ การพัฒนาต่อยอด / Development

### โครงสร้างไฟล์ / File Structure

```
PaiNaiDee_map_3D/
├── index.html                 # หน้าหลัก
├── script.js                  # โค้ดหลัก 3D Map
├── styles.css                 # สไตล์หลัก
├── branding-enhancements.*    # ระบบแบรนดิ้ง
├── feedback-system.*          # ระบบรับฟีดแบ็ค
├── iterative-design.*         # ระบบการออกแบบ
├── user-research-system.*     # ระบบวิจัยผู้ใช้
├── user-testing.*             # ระบบทดสอบผู้ใช้
├── ux-improvements.*          # ปรับปรุง UX
├── package.json               # ข้อมูลโปรเจค
├── vercel.json               # การตั้งค่า Vercel
├── dockerfile                # การตั้งค่า Docker
├── docker-compose.yml        # Docker Compose
└── .github/workflows/        # CI/CD workflows
```

### การปรับแต่ง / Customization

แก้ไขสีและธีมใน CSS:
```css
:root {
  --primary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-color: #48b1e8;
  --glass-bg: rgba(255, 255, 255, 0.1);
}
```

## 🐛 การแก้ไขปัญหา / Troubleshooting

### ปัญหาที่พบบ่อย:

1. **แอปไม่แสดงผล**
   - ตรวจสอบให้แน่ใจว่าเปิดผ่าน HTTP server (ไม่ใช่ file://)
   - ตรวจสอบ Console ใน Browser DevTools

2. **3D Globe ไม่ทำงาน**
   - ตรวจสอบการรองรับ WebGL ของเบราว์เซอร์
   - ลองรีเฟรชหน้าเว็บ

3. **ฟอนต์ไม่แสดงผล**
   - ตรวจสอบการเชื่อมต่อ Internet สำหรับ Google Fonts
   - ฟอนต์ fallback จะใช้งานแทนอัตโนมัติ

## 📞 การสนับสนุน / Support

- **GitHub Issues**: [https://github.com/athipan1/PaiNaiDee_map_3D/issues](https://github.com/athipan1/PaiNaiDee_map_3D/issues)
- **Documentation**: อ่านเพิ่มเติมใน README.md

## 📄 ลิขสิทธิ์ / License

โปรเจคนี้เป็น Open Source สำหรับการศึกษาและสาธิต

---

**สนุกกับการใช้งาน PaiNaiDee 3D Map! 🗺️🇹🇭**