# 🌾 Blockchain Rice Supply Chain

Hệ thống quản lý chuỗi cung ứng gạo dựa trên công nghệ Blockchain

## ✨ Tính năng

- 🔐 Xác thực đa vai trò (Admin, Nông dân, Nhà máy, Vận chuyển, Phân phối, Người tiêu dùng)
- 📦 Quản lý lô gạo với mã QR
- 🔍 Truy xuất nguồn gốc sản phẩm
- 📊 Dashboard thống kê và báo cáo
- 📱 Responsive design - hỗ trợ mobile

## 🚀 Demo

[Link demo sẽ được cập nhật sau khi deploy]

## 🛠️ Công nghệ sử dụng

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework:** Bootstrap 5.3.0
- **Icons:** Bootstrap Icons
- **Charts:** Chart.js 4.4.0
- **QR Code:** QRCode.js 1.0.0

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/[your-username]/blockchain-rice-supply-chain.git
```

2. Mở file `index.html` bằng Live Server hoặc trình duyệt

## 👤 Tài khoản Demo

Sử dụng các tài khoản sau để đăng nhập:

- **Admin:** admin / demo123
- **Nông dân:** farmer / demo123
- **Nhà máy:** mill / demo123
- **Vận chuyển:** transport / demo123
- **Phân phối:** distributor / demo123
- **Người tiêu dùng:** consumer / demo123

## 📱 Giao diện

### Trang chủ
- Landing page với 3 card chính: Đăng nhập, Truy xuất, Giới thiệu
- Thống kê tổng quan hệ thống

### Dashboard Admin
- Sidebar navigation với gradient xanh
- 4 stat cards: Người dùng, Lô gạo, Giao dịch, Block
- Biểu đồ phân bổ vai trò
- Biểu đồ giao dịch 7 ngày

### Trang đăng nhập
- Glassmorphism effect
- Dropdown chọn vai trò với animation
- Password visibility toggle
- Background particles animation

### Truy xuất nguồn gốc
- Scan QR code hoặc nhập mã batch
- Timeline hiển thị lịch sử chuỗi cung ứng

## 🎨 Design

- **Color scheme:** Green (#28a745) to Teal (#20c997) gradient
- **Dark background:** Multi-layer gradient với particles
- **Effects:** Glassmorphism, hover animations, floating icons
- **Typography:** Segoe UI font family

## 📄 Cấu trúc thư mục

```
fdd/
├── index.html           # Trang chủ
├── login.html          # Trang đăng nhập
├── dashboard.html      # Dashboard admin
├── traceability.html   # Truy xuất nguồn gốc
├── input_form.html     # Tạo batch & log events
├── css/
│   └── style.css       # Global styles
└── js/
    └── main.js         # JavaScript logic
```

## 🔜 Roadmap

- [ ] Kết nối Firebase Authentication
- [ ] Deploy lên Vercel/Netlify
- [ ] Thêm Firestore Database
- [ ] Tích hợp Blockchain thật (Ethereum/Hyperledger)
- [ ] API Backend với Node.js
- [ ] Mobile App (React Native)

## 📝 License

MIT License

## 👨‍💻 Tác giả

[Tên của bạn]

## 🤝 Đóng góp

Pull requests are welcome! Để thay đổi lớn, vui lòng mở issue trước để thảo luận.

---

⭐ Nếu thấy project hữu ích, hãy cho một star nhé!
