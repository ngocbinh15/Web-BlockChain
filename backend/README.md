# Backend - Blockchain Rice Supply Chain API

REST API cho hệ thống quản lý chuỗi cung ứng gạo

## 🚀 Setup

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình Database

**MySQL/MariaDB:**

```bash
# Tạo database
mysql -u root -p < database/schema.sql

# Hoặc import thủ công:
mysql -u root -p
source database/schema.sql
```

### 3. Cấu hình Environment Variables

```bash
cp .env.example .env
# Sửa các thông tin trong .env
```

### 4. Chạy server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: http://localhost:5000

## 📡 API Endpoints

### Authentication

#### POST /api/auth/login

Đăng nhập

```json
{
  "username": "admin",
  "password": "demo123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ricechain.com",
    "role": "admin",
    "full_name": "Administrator"
  }
}
```

#### POST /api/auth/register

Đăng ký user mới

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "farmer",
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 ABC Street"
}
```

#### GET /api/auth/me

Lấy thông tin user hiện tại (cần JWT token)

Headers:

```
Authorization: Bearer {token}
```

### Batches (Lô hàng)

#### GET /api/batches

Lấy tất cả lô hàng (cần JWT)

#### GET /api/batches/:batch_code

Lấy chi tiết lô hàng theo mã (Public)

#### POST /api/batches

Tạo lô hàng mới (cần JWT)

```json
{
  "batch_code": "RICE2025004",
  "product_name": "Gạo ST25",
  "quantity": 1000,
  "unit": "kg"
}
```

#### POST /api/batches/:batch_code/transaction

Thêm giao dịch cho lô hàng (cần JWT)

```json
{
  "action": "HARVEST",
  "description": "Thu hoạch từ đồng ruộng",
  "location": "Đồng Tháp"
}
```

## 🔐 Demo Accounts

Tất cả tài khoản đều có mật khẩu: `demo123`

- **Admin:** admin@ricechain.com
- **Farmer:** farmer@ricechain.com
- **Mill:** mill@ricechain.com
- **Transport:** transport@ricechain.com
- **Distributor:** distributor@ricechain.com
- **Consumer:** consumer@ricechain.com

## 📊 Database Schema

### Tables

- `users` - Thông tin người dùng
- `batches` - Lô hàng gạo
- `transactions` - Lịch sử giao dịch

## 🚀 Deploy

### Railway.app (Recommended - Free tier)

1. Push code lên GitHub
2. Truy cập https://railway.app
3. New Project → Deploy from GitHub
4. Chọn repo và folder `backend`
5. Add MySQL plugin
6. Set environment variables
7. Deploy!

### Render.com

1. Truy cập https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add MySQL database
8. Set environment variables

## 🔧 Environment Variables (Production)

```
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=blockchain_rice
JWT_SECRET=your_very_secure_random_string
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 📝 License

MIT
