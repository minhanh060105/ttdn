# Substack Clone - Backend API Service

Dịch vụ Backend xây dựng bằng **Next.js (App Router)** và **Prisma ORM**, kết nối cơ sở dữ liệu **MySQL** nhằm cung cấp toàn bộ RESTful API cho nền tảng blog Substack Clone (hỗ trợ xác thực người dùng, quản lý bài viết, danh mục, kiểm duyệt nội dung và hỗ trợ đa ngôn ngữ).

---

## 🛠 Công nghệ sử dụng

- **Runtime & Framework:** Node.js (v18+ / v20+), Next.js 14+ (App Router)
- **Database ORM:** Prisma Client & Prisma CLI
- **Cơ sở dữ liệu:** MySQL 8.x (Quản lý qua HeidiSQL / MySQL Workbench)
- **Mã hóa & Bảo mật:** `bcryptjs` (Hash mật khẩu an toàn với salt rounds = 10)
- **Ngôn ngữ:** TypeScript

---

## 📁 Cấu trúc thư mục Backend

```text
backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts        # POST: Xác thực đăng nhập, kiểm tra ban
│   │   │   ├── register/route.ts     # POST: Đăng ký user mới & hash mật khẩu
│   │   │   ├── onboarding/route.ts   # POST: Kiểm tra email & khởi tạo
│   │   │   └── verify-email/route.ts # POST: Xác thực mã OTP 6 số
│   │   └── posts/route.ts            # GET / POST: Lấy danh sách & Tạo/sửa bài viết
│   ├── globals.css                   # Định kiểu toàn cục
│   └── layout.tsx                    # Root layout
├── lib/
│   └── db.ts                         # Khởi tạo singleton Prisma Client
├── prisma/
│   └── schema.prisma                 # Lược đồ cơ sở dữ liệu (Database Schema)
├── .env                              # Biến môi trường kết nối MySQL
├── package.json                      # Danh sách dependencies & scripts
└── tsconfig.json                     # Cấu hình TypeScript
