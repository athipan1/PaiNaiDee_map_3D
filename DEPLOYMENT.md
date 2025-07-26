# 🚀 PaiNaiDee 3D Map - Deployment Guide
## คู่มือการ Deploy PaiNaiDee 3D Map

This guide provides comprehensive instructions for deploying the PaiNaiDee 3D Map project to various platforms.

คู่มือนี้ให้คำแนะนำที่ครอบคลุมสำหรับการ deploy โปรเจกต์ PaiNaiDee 3D Map ไปยังแพลตฟอร์มต่าง ๆ

---

## 📋 Table of Contents / สารบัญ

1. [Prerequisites / ข้อกำหนดเบื้องต้น](#prerequisites--ข้อกำหนดเบื้องต้น)
2. [Quick Deployment / การ Deploy อย่างรวดเร็ว](#quick-deployment--การ-deploy-อย่างรวดเร็ว)
3. [Platform-Specific Instructions / คำแนะนำเฉพาะแพลตฟอร์ม](#platform-specific-instructions--คำแนะนำเฉพาะแพลตฟอร์ม)
4. [Configuration / การตั้งค่า](#configuration--การตั้งค่า)
5. [Troubleshooting / การแก้ไขปัญหา](#troubleshooting--การแก้ไขปัญหา)

---

## Prerequisites / ข้อกำหนดเบื้องต้น

### Required Software / ซอฟต์แวร์ที่จำเป็น
- **Node.js** 16+ and **npm** 8+
- **Git** for version control
- Modern web browser for testing

### Optional Tools / เครื่องมือเสริม
- **Docker** for containerized deployment
- **Vercel CLI** for Vercel deployment
- **Netlify CLI** for Netlify deployment

### Installation Check / ตรวจสอบการติดตั้ง
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
git --version
```

---

## Quick Deployment / การ Deploy อย่างรวดเร็ว

### Using Deployment Script / ใช้สคริปต์ Deploy

The project includes a deployment helper script for easy deployment:
โปรเจกต์มีสคริปต์ช่วยการ deploy เพื่อการ deploy ที่ง่าย:

```bash
# Make script executable / ทำให้สคริปต์รันได้
chmod +x scripts/deploy.sh

# Full deployment to Docker / Deploy เต็มรูปแบบไปยัง Docker
./scripts/deploy.sh full docker

# Full deployment to Vercel / Deploy เต็มรูปแบบไปยัง Vercel
./scripts/deploy.sh full vercel

# Individual commands / คำสั่งแยก
./scripts/deploy.sh install   # Install dependencies / ติดตั้ง dependencies
./scripts/deploy.sh build     # Build project / สร้างโปรเจกต์
./scripts/deploy.sh validate  # Validate project / ตรวจสอบโปรเจกต์
```

### Manual Deployment / การ Deploy ด้วยตนเอง

```bash
# 1. Install dependencies / ติดตั้ง dependencies
npm install

# 2. Build project / สร้างโปรเจกต์
npm run build

# 3. Validate / ตรวจสอบ
npm run validate

# 4. Deploy to your chosen platform / Deploy ไปยังแพลตฟอร์มที่เลือก
```

---

## Platform-Specific Instructions / คำแนะนำเฉพาะแพลตฟอร์ม

### 1. 🌐 GitHub Pages

**Automatic Deployment / การ Deploy อัตโนมัติ**

GitHub Pages deployment is handled automatically via GitHub Actions:
การ deploy GitHub Pages จัดการโดยอัตโนมัติผ่าน GitHub Actions:

```yaml
# Triggered on push to main branch
# เรียกใช้เมื่อ push ไปยัง main branch
on:
  push:
    branches: [ "main" ]
```

**Steps / ขั้นตอน:**
1. Push your changes to the `main` branch / Push การเปลี่ยนแปลงไปยัง branch `main`
2. GitHub Actions will automatically build and deploy / GitHub Actions จะสร้างและ deploy อัตโนมัติ
3. Visit your site at: `https://username.github.io/PaiNaiDee_map_3D`

**Manual Configuration / การตั้งค่าด้วยตนเอง:**
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will handle the rest

### 2. ▲ Vercel

**One-Click Deployment / การ Deploy คลิกเดียว**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/athipan1/PaiNaiDee_map_3D)

**CLI Deployment / การ Deploy ผ่าน CLI**

```bash
# Install Vercel CLI / ติดตั้ง Vercel CLI
npm install -g vercel

# Login to Vercel / เข้าสู่ระบบ Vercel
vercel login

# Deploy / Deploy
vercel --prod

# Or use npm script / หรือใช้ npm script
npm run deploy:vercel
```

**Configuration / การตั้งค่า:**
- The `vercel.json` file is already configured
- ไฟล์ `vercel.json` ถูกตั้งค่าแล้ว
- Supports custom domains and environment variables
- รองรับโดเมนกำหนดเองและตัวแปรสภาพแวดล้อม

### 3. 🌊 Netlify

**Drag & Drop Deployment / การ Deploy แบบลากและวาง**

1. Build the project: `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

**Git-based Deployment / การ Deploy ผ่าน Git**

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:production`
3. Set publish directory: `dist`

**CLI Deployment / การ Deploy ผ่าน CLI**

```bash
# Install Netlify CLI / ติดตั้ง Netlify CLI
npm install -g netlify-cli

# Login to Netlify / เข้าสู่ระบบ Netlify
netlify login

# Deploy / Deploy
netlify deploy --prod

# Or use npm script / หรือใช้ npm script
npm run deploy:netlify
```

**Configuration Files / ไฟล์การตั้งค่า:**
- `netlify.toml` - Main configuration / การตั้งค่าหลัก
- `_redirects` - Redirect rules / กฎการเปลี่ยนเส้นทาง

### 4. 🐳 Docker

**Quick Start / เริ่มต้นอย่างรวดเร็ว**

```bash
# Build Docker image / สร้าง Docker image
docker build -t painaidee-3d-map .

# Run container / รันคอนเทนเนอร์
docker run -p 80:80 painaidee-3d-map

# Visit http://localhost / เยี่ยมชม http://localhost
```

**Docker Compose / Docker Compose**

```bash
# Development environment / สภาพแวดล้อมการพัฒนา
docker-compose up painaidee-dev

# Production environment / สภาพแวดล้อมการใช้งานจริง
docker-compose up painaidee-map

# Build and run / สร้างและรัน
docker-compose up --build
```

**Production Deployment / การ Deploy ใช้งานจริง**

```bash
# Build production image / สร้าง production image
docker build -t painaidee-3d-map:latest .

# Tag for registry / แท็กสำหรับ registry
docker tag painaidee-3d-map:latest your-registry/painaidee-3d-map:latest

# Push to registry / Push ไปยัง registry
docker push your-registry/painaidee-3d-map:latest

# Deploy to production server / Deploy ไปยังเซิร์ฟเวอร์ใช้งานจริง
docker run -d -p 80:80 --name painaidee-map your-registry/painaidee-3d-map:latest
```

---

## Configuration / การตั้งค่า

### Environment Variables / ตัวแปรสภาพแวดล้อม

Copy and customize the environment file:
คัดลอกและปรับแต่งไฟล์สภาพแวดล้อม:

```bash
cp config/examples/.env.example .env
```

**Key Variables / ตัวแปรสำคัญ:**

```env
NODE_ENV=production           # Environment mode / โหมดสภาพแวดล้อม
APP_URL=https://your-app.com  # Your app URL / URL แอปของคุณ
DEFAULT_LANGUAGE=th           # Default language / ภาษาเริ่มต้น
```

### Platform-Specific Settings / การตั้งค่าเฉพาะแพลตฟอร์ม

**Vercel Environment Variables:**
```bash
vercel env add NODE_ENV production
vercel env add DEFAULT_LANGUAGE th
```

**Netlify Environment Variables:**
Set in Netlify dashboard: Site Settings → Environment Variables

**Docker Environment Variables:**
```bash
docker run -e NODE_ENV=production -e DEFAULT_LANGUAGE=th -p 80:80 painaidee-3d-map
```

### Build Optimization / การเพิ่มประสิทธิภาพการสร้าง

**For Production / สำหรับการใช้งานจริง:**
```bash
# Build with production optimizations
npm run build:production

# Environment variable method
NODE_ENV=production npm run build
```

---

## Troubleshooting / การแก้ไขปัญหา

### Common Issues / ปัญหาที่พบบ่อย

#### 1. Build Failures / การสร้างล้มเหลว

**Problem:** Build process fails / กระบวนการสร้างล้มเหลว
```bash
# Solution: Clean and reinstall / วิธีแก้: ล้างและติดตั้งใหม่
npm run clean
npm install
npm run build
```

#### 2. Node.js Version Issues / ปัญหาเวอร์ชัน Node.js

**Problem:** "Node.js version not supported" / "เวอร์ชัน Node.js ไม่รองรับ"
```bash
# Check version / ตรวจสอบเวอร์ชัน
node --version

# Update to Node.js 16+ / อัปเดตเป็น Node.js 16+
# Use nvm or download from nodejs.org
```

#### 3. Docker Build Issues / ปัญหาการสร้าง Docker

**Problem:** Docker build fails / การสร้าง Docker ล้มเหลว
```bash
# Build without cache / สร้างโดยไม่ใช้แคช
docker build --no-cache -t painaidee-3d-map .

# Check Dockerfile syntax / ตรวจสอบไวยากรณ์ Dockerfile
docker build --help
```

#### 4. Deployment Permission Issues / ปัญหาสิทธิ์การ Deploy

**Problem:** Permission denied during deployment / ปฏิเสธสิทธิ์ระหว่างการ deploy
```bash
# Make deployment script executable / ทำให้สคริปต์ deploy รันได้
chmod +x scripts/deploy.sh

# Check authentication / ตรวจสอบการรับรองความถูกต้อง
vercel whoami    # For Vercel
netlify status   # For Netlify
```

### Performance Issues / ปัญหาประสิทธิภาพ

#### Slow Loading / โหลดช้า
1. Enable compression in server configuration
2. Optimize images and assets
3. Use CDN for static assets
4. Enable browser caching

#### High Memory Usage / ใช้หน่วยความจำสูง
1. Optimize JavaScript code
2. Reduce image sizes
3. Use lazy loading
4. Implement code splitting

### Getting Help / การขอความช่วยเหลือ

If you encounter issues not covered here:
หากคุณพบปัญหาที่ไม่ได้กล่าวถึงที่นี่:

1. **Check the logs** / ตรวจสอบ log:
   ```bash
   # Vercel logs
   vercel logs
   
   # Netlify logs
   netlify logs
   
   # Docker logs
   docker logs container-name
   ```

2. **Validate project structure** / ตรวจสอบโครงสร้างโปรเจกต์:
   ```bash
   npm run validate
   ```

3. **Test locally** / ทดสอบในเครื่อง:
   ```bash
   npm start
   npm run preview
   ```

4. **Open an issue** on GitHub with:
   - Error messages / ข้อความข้อผิดพลาด
   - Steps to reproduce / ขั้นตอนการทำซ้ำ
   - Environment details / รายละเอียดสภาพแวดล้อม

---

## 📚 Additional Resources / แหล่งข้อมูลเพิ่มเติม

### Official Documentation / เอกสารอย่างเป็นทางการ
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

### Community Resources / แหล่งข้อมูลชุมชน
- [GitHub Discussions](https://github.com/athipan1/PaiNaiDee_map_3D/discussions)
- [Issues Tracker](https://github.com/athipan1/PaiNaiDee_map_3D/issues)

---

<div align="center">

**Happy Deploying! / Deploy อย่างมีความสุข! 🚀**

Made with ❤️ for Thailand / สร้างด้วย ❤️ เพื่อประเทศไทย

</div>