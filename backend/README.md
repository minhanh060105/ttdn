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


## 🚀 Hướng dẫn cài đặt và khởi chạy dự án

### 1. Chuẩn bị môi trường & Cơ sở dữ liệu

1. **Khởi động dịch vụ MySQL:**
   - Đảm bảo MySQL Server đang chạy trên cổng mặc định `3306`.
   - Mở **HeidiSQL**, kết nối vào MySQL Server và tạo một cơ sở dữ liệu mới (nếu chưa có):
     ```sql
     CREATE DATABASE IF NOT EXISTS `blog_database` 
     CHARACTER SET utf8mb4 
     COLLATE utf8mb4_unicode_ci;
     ```

2. **Dữ liệu mồi cần thiết (Seed Roles):**
   - Bảng `roles` cần có sẵn các vai trò để không bị lỗi khóa ngoại khi tạo tài khoản:
     ```sql
     USE `blog_database`;
     INSERT IGNORE INTO `roles` (`id`, `name`, `code`) VALUES 
     (1, 'Quản trị viên', 'admin'),
     (2, 'Tác giả viết bài', 'blogger'),
     (3, 'Độc giả thông thường', 'user');
     ```

---

### 2. Cấu hình biến môi trường (`.env`)

Tạo một file có tên `.env` tại thư mục gốc của **`backend/`** và điền chuỗi kết nối tương ứng:

```env
# Định dạng: mysql://<username>:<password>@<host>:<port>/<database_name>
DATABASE_URL="mysql://root:123456@localhost:3306/blog_database"
3. Cài đặt thư viện dependencies
Mở terminal tại thư mục gốc của dự án (ttdn) và di chuyển vào thư mục backend:

PowerShell


cd backend
npm install
4. Đồng bộ Schema Prisma với MySQL
Chạy lần lượt 2 lệnh sau để sinh mã nguồn tương tác cơ sở dữ liệu:

PowerShell


# 1. Kéo lược đồ bảng hiện có từ database về schema.prisma (nếu đã tạo bảng thủ công)
npx prisma db pull

# 2. Sinh Prisma Client TypeScript
npx prisma generate
5. Khởi chạy Development Server
Chạy lệnh start server Next.js ở chế độ phát triển:

PowerShell


npm run dev
Backend API sẽ lắng nghe tại: http://localhost:3000

Kiểm tra nhanh hoạt động API bằng cách mở trình duyệt hoặc Postman truy cập: http://localhost:3000/api/posts
