# ใช้ base image เป็น nginx ที่มีขนาดเล็ก
FROM nginx:alpine

# ลบไฟล์ default ที่ nginx ใส่มา
RUN rm -rf /usr/share/nginx/html/*

# คัดลอก nginx configuration สำหรับ production
COPY nginx.conf /etc/nginx/nginx.conf

# คัดลอกไฟล์ static ทั้งหมดที่จำเป็น
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# คัดลอกไฟล์ CSS และ JS เพิ่มเติม
COPY branding-enhancements.css /usr/share/nginx/html/
COPY branding-enhancements.js /usr/share/nginx/html/
COPY feedback-system.css /usr/share/nginx/html/
COPY feedback-system.js /usr/share/nginx/html/
COPY iterative-design.css /usr/share/nginx/html/
COPY iterative-design.js /usr/share/nginx/html/
COPY user-research-system.css /usr/share/nginx/html/
COPY user-research-system.js /usr/share/nginx/html/
COPY user-testing.css /usr/share/nginx/html/
COPY user-testing.js /usr/share/nginx/html/
COPY ux-improvements.css /usr/share/nginx/html/
COPY ux-improvements.js /usr/share/nginx/html/

# สร้าง favicon จาก SVG inline ที่มีอยู่ใน HTML
RUN echo '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🗺️</text></svg>' > /usr/share/nginx/html/favicon.svg

# เปิดพอร์ต 80
EXPOSE 80

# เพิ่ม health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# สั่ง nginx ทำงานใน foreground
CMD ["nginx", "-g", "daemon off;"]