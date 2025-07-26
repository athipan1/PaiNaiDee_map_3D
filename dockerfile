# PaiNaiDee 3D Map - Simplified Production Docker Build
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default nginx files and copy application
RUN rm -rf /usr/share/nginx/html/*
COPY src/pages/home/index.html /usr/share/nginx/html/
COPY src/assets/ /usr/share/nginx/html/assets/

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Labels for metadata
LABEL maintainer="PaiNaiDee" \
      version="2.0" \
      description="PaiNaiDee 3D Interactive Map - Production Container"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]