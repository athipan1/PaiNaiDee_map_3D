// ESLint Configuration for PaiNaiDee 3D Map
// การตั้งค่า ESLint สำหรับ PaiNaiDee 3D Map

module.exports = {
  // Environment settings / การตั้งค่าสภาพแวดล้อม
  env: {
    browser: true,     // Browser environment / สภาพแวดล้อมเบราว์เซอร์
    es2021: true,      // ES2021 features / ฟีเจอร์ ES2021
    node: false        // Node.js environment / สภาพแวดล้อม Node.js
  },

  // Parser options / ตัวเลือกตัววิเคราะห์
  parserOptions: {
    ecmaVersion: 'latest',  // Latest ECMAScript version / เวอร์ชัน ECMAScript ล่าสุด
    sourceType: 'module'    // ES6 modules / โมดูล ES6
  },

  // Extends base configurations / ขยายการตั้งค่าพื้นฐาน
  extends: [
    'eslint:recommended'    // ESLint recommended rules / กฎที่แนะนำของ ESLint
  ],

  // Custom rules / กฎที่กำหนดเอง
  rules: {
    // Possible Problems / ปัญหาที่เป็นไปได้
    'no-console': 'warn',              // Warn on console.log / เตือนเมื่อใช้ console.log
    'no-debugger': 'error',            // Error on debugger / ข้อผิดพลาดเมื่อใช้ debugger
    'no-unused-vars': 'warn',          // Warn on unused variables / เตือนตัวแปรที่ไม่ได้ใช้

    // Best Practices / แนวปฏิบัติที่ดี
    'eqeqeq': 'error',                 // Require === and !== / ต้องใช้ === และ !==
    'no-eval': 'error',                // Disallow eval() / ห้ามใช้ eval()
    'no-implied-globals': 'error',     // Disallow implied globals / ห้ามตัวแปรโกลบอลโดยนัย
    'prefer-const': 'warn',            // Prefer const over let / แนะนำ const มากกว่า let

    // Stylistic Issues / ประเด็นเชิงสไตล์
    'indent': ['error', 2],            // 2 space indentation / เยื้อง 2 ช่องว่าง
    'quotes': ['error', 'single'],     // Single quotes / เครื่องหมายคำพูดเดี่ยว
    'semi': ['error', 'always'],       // Require semicolons / ต้องใช้เซมิโคลอน
    'comma-dangle': ['error', 'never'], // No trailing commas / ไม่ใช้จุลภาคตาม

    // ES6 Features / ฟีเจอร์ ES6
    'arrow-spacing': 'error',          // Require space around arrow / ต้องมีช่องว่างรอบลูกศร
    'no-var': 'error',                 // Disallow var / ห้ามใช้ var
    'prefer-arrow-callback': 'warn',   // Prefer arrow functions / แนะนำ arrow functions

    // Accessibility / การเข้าถึง
    'no-alert': 'warn'                 // Warn on alert() usage / เตือนเมื่อใช้ alert()
  },

  // Global variables / ตัวแปรโกลบอล
  globals: {
    // Global variables used in the application
    // ตัวแปรโกลบอลที่ใช้ในแอปพลิเคชัน
    'L': 'readonly',           // Leaflet library / ไลบรารี Leaflet
    'anime': 'readonly',       // Anime.js library / ไลบรารี Anime.js
    'THREE': 'readonly'        // Three.js library (if used) / ไลบรารี Three.js (หากใช้)
  },

  // Override rules for specific files / กำหนดกฎเฉพาะสำหรับไฟล์เฉพาะ
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true  // Jest testing environment / สภาพแวดล้อมการทดสอบ Jest
      },
      rules: {
        'no-console': 'off'  // Allow console in tests / อนุญาต console ในการทดสอบ
      }
    },
    {
      files: ['config/**/*.js'],
      env: {
        node: true  // Node.js environment for config files / สภาพแวดล้อม Node.js สำหรับไฟล์ config
      }
    }
  ],

  // Settings for specific environments / การตั้งค่าสำหรับสภาพแวดล้อมเฉพาะ
  settings: {
    // Add any plugin-specific settings here
    // เพิ่มการตั้งค่าเฉพาะปลั๊กอินที่นี่
  }
};

/*
 * How to use this configuration / วิธีใช้การตั้งค่านี้:
 * 
 * English:
 * 1. Copy this file to .eslintrc.js in your project root
 * 2. Install ESLint: npm install --save-dev eslint
 * 3. Run linting: npx eslint src/
 * 4. Auto-fix issues: npx eslint src/ --fix
 * 
 * ไทย:
 * 1. คัดลอกไฟล์นี้เป็น .eslintrc.js ในรูทของโปรเจกต์
 * 2. ติดตั้ง ESLint: npm install --save-dev eslint
 * 3. รันการตรวจสอบ: npx eslint src/
 * 4. แก้ไขอัตโนมัติ: npx eslint src/ --fix
 */