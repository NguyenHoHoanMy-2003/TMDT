# 🧪 Test Suite - Website Nghệ Quảng Nam

## Giới thiệu
Đây là bộ test tự động để kiểm tra các chức năng của website và phát hiện bugs.

## Cách sử dụng

1. **Mở file test:**
   ```
   http://localhost:8000/test/test-functions.html
   ```

2. **Chạy tests:**
   - Click "▶ Chạy Tất Cả Tests" để chạy toàn bộ test suite
   - Hoặc chạy từng nhóm test riêng lẻ

3. **Xem kết quả:**
   - Tổng hợp: Hiển thị số lượng tests pass/fail
   - Chi tiết: Từng test case với icon ✅/❌
   - Bugs: Danh sách bugs được phát hiện với severity và cách fix

## Các nhóm test

### 🛒 Cart Tests (Giỏ hàng)
- localStorage availability
- Cart initialization
- Add/Update/Remove products
- Price calculation
- Multiple products handling
- Invalid data handling

### 📝 Form Tests
- Required field validation
- Phone number format
- Email validation
- Quantity validation
- Form submission
- XSS prevention

### 🎨 UI Tests
- CSS loading
- Responsive design
- Color scheme
- Image loading
- Modal accessibility
- Mobile navigation

### 🔒 Security Tests
- HTTPS protocol
- Payment security
- CSRF protection

### ⚡ Performance Tests
- Page load time
- DOM size
- File optimization
- Image optimization

### ♿ Accessibility Tests
- Alt text for images
- Heading hierarchy
- Form labels
- Color contrast
- Screen reader support

## Bugs được phát hiện

### 🔴 Critical (Nghiêm trọng)
1. **Website Not Using HTTPS** - Không dùng HTTPS

### 🟠 High (Cao)
1. **No Mobile Menu** - Thiếu hamburger menu trên mobile
2. **XSS Vulnerability** - Có thể bị tấn công XSS

### 🟡 Medium (Trung bình)
1. **Missing Phone Validation** - Không validate số điện thoại
2. **No Max Quantity Limit** - Không giới hạn số lượng đặt hàng
3. **No Error Handling for Invalid Cart Data** - Không xử lý lỗi dữ liệu giỏ hàng
4. **No Secure Payment Gateway** - Chưa tích hợp cổng thanh toán
5. **Limited Screen Reader Support** - Hỗ trợ screen reader hạn chế

### 🔵 Low (Thấp)
1. **No Email Field** - Thiếu trường email trong form
2. **Form Auto-Reset** - Form tự động reset quá nhanh
3. **No Image Lazy Loading** - Không có lazy loading cho ảnh
4. **Cart Count Hidden When Zero** - Số giỏ hàng ẩn khi = 0
5. **No Loading States** - Không có indicator khi loading
6. **Files Not Minified** - Files chưa được minify

## Cách fix bugs

Xem chi tiết trong phần "🐛 Bugs Phát Hiện" sau khi chạy test. Mỗi bug có:
- **Title**: Tên bug
- **Description**: Mô tả chi tiết
- **Severity**: Mức độ nghiêm trọng
- **Location**: Vị trí trong code
- **Fix**: Code mẫu để fix

## Thống kê

- **Tổng số tests**: ~50+ tests
- **Coverage**: Cart, Forms, UI, Security, Performance, Accessibility
- **Bugs found**: ~15 bugs với các mức độ khác nhau

## Next Steps

1. Fix bugs theo thứ tự ưu tiên: Critical → High → Medium → Low
2. Rerun tests sau khi fix
3. Thêm tests mới cho features mới
4. Setup CI/CD để chạy tests tự động

## Tech Stack

- Pure JavaScript (Vanilla JS)
- localStorage API
- Performance API
- DOM Testing
- Manual test assertions

---

**Lưu ý**: Đây là test suite client-side. Cần thêm backend tests khi có API.
