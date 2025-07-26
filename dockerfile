# ใช้ base image เป็น nginx ที่มีขนาดเล็ก
FROM nginx:alpine

# ลบไฟล์ default ที่ nginx ใส่มา
RUN rm -rf /usr/share/nginx/html/*

# คัดลอก nginx configuration สำหรับ production
COPY nginx.conf /etc/nginx/nginx.conf

# คัดลอกเฉพาะไฟล์ static ที่จำเป็น
COPY src/pages/home/index.html /usr/share/nginx/html/
COPY src/assets/ /usr/share/nginx/html/assets/

# เปิดพอร์ต 80
EXPOSE 80

# สั่ง nginx ทำงานใน foreground
CMD ["nginx", "-g", "daemon off;"]