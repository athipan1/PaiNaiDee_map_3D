#!/bin/bash
# PaiNaiDee 3D Map - Deployment Helper Script
# สคริปต์ช่วยการ Deploy สำหรับ PaiNaiDee 3D Map

set -e

# Colors for output / สีสำหรับการแสดงผล
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions / ฟังก์ชัน
print_header() {
    echo -e "${BLUE}🗺️  PaiNaiDee 3D Map Deployment Helper${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites / ตรวจสอบข้อกำหนดเบื้องต้น
check_prerequisites() {
    print_info "Checking prerequisites... / กำลังตรวจสอบข้อกำหนดเบื้องต้น..."
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js 16+ / ไม่พบ Node.js กรุณาติดตั้ง Node.js 16+"
        exit 1
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found / ไม่พบ npm"
        exit 1
    fi
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        print_success "package.json found / พบ package.json"
    else
        print_error "package.json not found / ไม่พบ package.json"
        exit 1
    fi
}

# Install dependencies / ติดตั้ง dependencies
install_dependencies() {
    print_info "Installing dependencies... / กำลังติดตั้ง dependencies..."
    npm install
    print_success "Dependencies installed / ติดตั้ง dependencies แล้ว"
}

# Build project / สร้างโปรเจกต์
build_project() {
    print_info "Building project... / กำลังสร้างโปรเจกต์..."
    npm run build
    print_success "Project built successfully / สร้างโปรเจกต์สำเร็จ"
}

# Validate project / ตรวจสอบโปรเจกต์
validate_project() {
    print_info "Validating project... / กำลังตรวจสอบโปรเจกต์..."
    npm run validate
    print_success "Project validation passed / ตรวจสอบโปรเจกต์ผ่าน"
}

# Deploy to platform / Deploy ไปยังแพลตฟอร์ม
deploy_to_platform() {
    local platform=$1
    
    case $platform in
        "vercel")
            print_info "Deploying to Vercel... / กำลัง Deploy ไปยัง Vercel..."
            if command -v vercel >/dev/null 2>&1; then
                vercel --prod
                print_success "Deployed to Vercel / Deploy ไปยัง Vercel แล้ว"
            else
                print_warning "Vercel CLI not found. Install with: npm i -g vercel"
                print_info "ไม่พบ Vercel CLI ติดตั้งด้วย: npm i -g vercel"
            fi
            ;;
        "netlify")
            print_info "Deploying to Netlify... / กำลัง Deploy ไปยัง Netlify..."
            if command -v netlify >/dev/null 2>&1; then
                netlify deploy --prod
                print_success "Deployed to Netlify / Deploy ไปยัง Netlify แล้ว"
            else
                print_warning "Netlify CLI not found. Install with: npm i -g netlify-cli"
                print_info "ไม่พบ Netlify CLI ติดตั้งด้วย: npm i -g netlify-cli"
            fi
            ;;
        "docker")
            print_info "Building Docker image... / กำลังสร้าง Docker image..."
            if command -v docker >/dev/null 2>&1; then
                docker build -t painaidee-3d-map .
                print_success "Docker image built / สร้าง Docker image แล้ว"
                print_info "Run with: docker run -p 80:80 painaidee-3d-map"
                print_info "รันด้วย: docker run -p 80:80 painaidee-3d-map"
            else
                print_error "Docker not found / ไม่พบ Docker"
                exit 1
            fi
            ;;
        "github-pages")
            print_info "GitHub Pages deployment is handled by GitHub Actions"
            print_info "การ Deploy GitHub Pages จัดการโดย GitHub Actions"
            print_info "Push to main branch to trigger deployment"
            print_info "Push ไปยัง main branch เพื่อเริ่มการ deployment"
            ;;
        *)
            print_error "Unknown platform: $platform"
            print_error "แพลตฟอร์มไม่รู้จัก: $platform"
            print_info "Available platforms: vercel, netlify, docker, github-pages"
            print_info "แพลตฟอร์มที่มี: vercel, netlify, docker, github-pages"
            exit 1
            ;;
    esac
}

# Show help / แสดงความช่วยเหลือ
show_help() {
    echo "Usage: $0 [COMMAND] [PLATFORM]"
    echo "       การใช้งาน: $0 [คำสั่ง] [แพลตฟอร์ม]"
    echo
    echo "Commands / คำสั่ง:"
    echo "  install     Install dependencies / ติดตั้ง dependencies"
    echo "  build       Build project / สร้างโปรเจกต์"
    echo "  validate    Validate project / ตรวจสอบโปรเจกต์"
    echo "  deploy      Deploy to platform / Deploy ไปยังแพลตฟอร์ม"
    echo "  full        Full deployment (install + build + validate + deploy)"
    echo "              การ deploy แบบเต็ม (ติดตั้ง + สร้าง + ตรวจสอบ + deploy)"
    echo
    echo "Platforms / แพลตฟอร์ม:"
    echo "  vercel       Deploy to Vercel"
    echo "  netlify      Deploy to Netlify"
    echo "  docker       Build Docker image"
    echo "  github-pages Deploy to GitHub Pages (via GitHub Actions)"
    echo
    echo "Examples / ตัวอย่าง:"
    echo "  $0 install"
    echo "  $0 build"
    echo "  $0 deploy vercel"
    echo "  $0 full docker"
}

# Main script / สคริปต์หลัก
main() {
    print_header
    
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    local command=$1
    local platform=$2
    
    case $command in
        "install")
            check_prerequisites
            install_dependencies
            ;;
        "build")
            check_prerequisites
            build_project
            ;;
        "validate")
            check_prerequisites
            validate_project
            ;;
        "deploy")
            if [ -z "$platform" ]; then
                print_error "Platform required for deploy command"
                print_error "ต้องระบุแพลตฟอร์มสำหรับคำสั่ง deploy"
                show_help
                exit 1
            fi
            check_prerequisites
            deploy_to_platform "$platform"
            ;;
        "full")
            if [ -z "$platform" ]; then
                print_error "Platform required for full deployment"
                print_error "ต้องระบุแพลตฟอร์มสำหรับการ deploy แบบเต็ม"
                show_help
                exit 1
            fi
            check_prerequisites
            install_dependencies
            build_project
            validate_project
            deploy_to_platform "$platform"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            print_error "คำสั่งไม่รู้จัก: $command"
            show_help
            exit 1
            ;;
    esac
    
    print_success "Operation completed successfully! / ดำเนินการสำเร็จ!"
}

# Run main function / รันฟังก์ชันหลัก
main "$@"