# PaiNaiDee 3D Map - Configuration Examples
# ตัวอย่างการตั้งค่าต่าง ๆ สำหรับโปรเจกต์ PaiNaiDee 3D Map

This directory contains example configuration files for different deployment platforms and development environments.

## 📁 Configuration Files Overview

### 🚀 Deployment Configurations
- `vercel.example.json` - Vercel deployment configuration
- `netlify.example.toml` - Netlify deployment configuration  
- `docker-compose.example.yml` - Docker Compose for local development
- `nginx.example.conf` - Nginx server configuration

### 🛠️ Development Configurations
- `package.example.json` - NPM package configuration template
- `eslint.example.js` - ESLint linting configuration
- `prettier.example.json` - Prettier code formatting
- `stylelint.example.json` - CSS linting configuration

### 🔒 Environment Configurations
- `.env.example` - Environment variables template
- `docker.example.env` - Docker environment variables

## 📖 How to Use / วิธีการใช้งาน

### English Instructions:
1. Copy the example file you need
2. Remove the `.example` from the filename
3. Modify the values according to your requirements
4. Follow the comments in each file for specific instructions

### คำแนะนำภาษาไทย:
1. คัดลอกไฟล์ตัวอย่างที่คุณต้องการ
2. ลบ `.example` ออกจากชื่อไฟล์
3. แก้ไขค่าต่าง ๆ ตามความต้องการของคุณ
4. ปฏิบัติตามคำอธิบายในแต่ละไฟล์สำหรับขั้นตอนเฉพาะ

## ⚠️ Security Notes / หมายเหตุความปลอดภัย

**English:**
- Never commit actual environment files (.env) to version control
- Keep sensitive information like API keys secure
- Use different configurations for development and production

**ไทย:**
- ห้ามอัปโหลดไฟล์สภาพแวดล้อมจริง (.env) ไปยัง version control
- เก็บข้อมูลสำคัญเช่น API keys ให้ปลอดภัย
- ใช้การตั้งค่าที่แตกต่างกันสำหรับการพัฒนาและการใช้งานจริง