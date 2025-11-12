# 🐛 BUG REPORT - Website Nghệ Quảng Nam
**Ngày phát hiện:** 12/11/2025  
**Test Framework:** Automated Test Suite v1.0  
**Tổng số bugs:** 15

---

## 📊 Tổng Quan

| Severity | Số lượng | Tỷ lệ |
|----------|----------|-------|
| 🔴 Critical | 1 | 6.7% |
| 🟠 High | 3 | 20% |
| 🟡 Medium | 6 | 40% |
| 🔵 Low | 5 | 33.3% |

---

## 🔴 CRITICAL BUGS (Ưu tiên cao nhất)

### Bug #1: Website Not Using HTTPS
**Mức độ:** Critical  
**Phát hiện:** Security Tests  
**Mô tả:** Website đang chạy trên HTTP (localhost:8000), không an toàn cho thông tin khách hàng khi deploy production.

**Tác động:**
- ❌ Thông tin khách hàng có thể bị đánh cắp
- ❌ Không được tin tưởng bởi trình duyệt (cảnh báo "Not Secure")
- ❌ SEO bị ảnh hưởng (Google ưu tiên HTTPS)
- ❌ Không thể sử dụng một số Web APIs

**Cách fix:**
```bash
# Deploy với SSL certificate
# Option 1: Let's Encrypt (miễn phí)
sudo certbot --nginx -d nghequangnam.vn

# Option 2: Cloudflare (miễn phí + CDN)
# Add site to Cloudflare và enable "Always Use HTTPS"

# Option 3: Vercel/Netlify (auto HTTPS)
npm install -g vercel
vercel --prod
```

**Priority:** ⚠️ Phải fix trước khi deploy production

---

## 🟠 HIGH PRIORITY BUGS

### Bug #2: No Mobile Menu (Hamburger)
**Mức độ:** High  
**Phát hiện:** UI Tests  
**Mô tả:** Navigation menu không có hamburger menu trên mobile, các link bị chồng lên nhau và khó sử dụng.

**Tác động:**
- ❌ >50% users dùng mobile không thể navigate
- ❌ UX rất tệ trên màn hình nhỏ
- ❌ Bounce rate cao

**Cách fix:**
1. Thêm button hamburger vào HTML
2. Thêm CSS responsive
3. Thêm JavaScript toggle

**File cần sửa:** `html/*.html`, `css/styles.css`, `.js/main.js`

**Code fix:** Xem `test/bug-fixes.js` - Fix #1

**Estimate:** 2 hours

---

### Bug #3: XSS Vulnerability in Form Inputs
**Mức độ:** High  
**Phát hiện:** Form Tests  
**Mô tả:** Form không sanitize user input. Nếu input được hiển thị lại hoặc lưu vào database, có thể bị XSS attack.

**Ví dụ tấn công:**
```javascript
// User nhập vào name field:
<script>alert('Hacked!')</script>
<img src=x onerror="alert('XSS')">
```

**Tác động:**
- ❌ Attacker có thể chạy JavaScript trên site
- ❌ Đánh cắp cookies, session tokens
- ❌ Redirect users đến phishing sites
- ❌ Defacing website

**Cách fix:**
```javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Apply to all user inputs
const safeName = escapeHtml(document.getElementById('name').value);
```

**File cần sửa:** `.js/main.js`

**Estimate:** 1 hour

---

### Bug #4: localStorage Not Available Fallback
**Mức độ:** High  
**Phát hiện:** Cart Tests  
**Mô tả:** Website dựa hoàn toàn vào localStorage nhưng không có fallback khi localStorage không available (private browsing, blocked by user).

**Tác động:**
- ❌ Cart hoàn toàn không hoạt động trong private mode
- ❌ Error thrown, crash website
- ❌ Mất customers

**Cách fix:**
```javascript
// Implement fallback storage
const storage = {
  data: {},
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch(e) {
      return this.data[key];
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch(e) {
      this.data[key] = value;
    }
  }
};
```

**File cần sửa:** `.js/main.js`

**Estimate:** 1.5 hours

---

## 🟡 MEDIUM PRIORITY BUGS

### Bug #5: Missing Phone Number Validation
**Mức độ:** Medium  
**Mô tả:** Form không validate format số điện thoại. User có thể nhập text, số không hợp lệ.

**Cách fix:**
```javascript
function validatePhone(phone) {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    alert('Số điện thoại không hợp lệ (VD: 0123456789)');
    return false;
  }
  return true;
}
```

**Estimate:** 30 minutes

---

### Bug #6: No Maximum Quantity Limit
**Mức độ:** Medium  
**Mô tả:** User có thể đặt số lượng bất kỳ (999999), không có giới hạn inventory.

**Cách fix:**
```html
<input type="number" min="1" max="100" id="order-qty">
```

```javascript
if (qty > 100) {
  alert('Số lượng tối đa là 100 sản phẩm');
  return false;
}
```

**Estimate:** 20 minutes

---

### Bug #7: No Error Handling for Invalid Cart Data
**Mức độ:** Medium  
**Mô tả:** Nếu cart data bị corrupt (invalid JSON), website crash.

**Cách fix:**
```javascript
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch(e) {
    console.error('Cart data corrupted, resetting...');
    localStorage.removeItem(KEY);
    return [];
  }
}
```

**Estimate:** 30 minutes

---

### Bug #8: No Secure Payment Gateway
**Mức độ:** Medium  
**Mô tả:** Form chỉ ghi nhận thông tin, không có thanh toán online qua cổng an toàn.

**Cách fix:**
- Tích hợp VNPay, MoMo, hoặc ZaloPay
- Requires backend API

**Estimate:** 3-5 days (full integration)

---

### Bug #9: Limited Screen Reader Support
**Mức độ:** Medium  
**Mô tả:** Một số elements thiếu ARIA labels, roles.

**Cách fix:**
```html
<button aria-label="Thêm vào giỏ hàng">Thêm giỏ</button>
<nav role="navigation" aria-label="Main navigation">
<div role="alert" aria-live="polite">
```

**Estimate:** 1 hour

---

### Bug #10: Cart Count Hidden When Zero
**Mức độ:** Medium  
**Mô tả:** Khi giỏ hàng = 0, badge biến mất, user không rõ trạng thái.

**Cách fix:**
```css
#cart-count:empty::after {
  content: '0';
  opacity: 0.7;
}
```

**Estimate:** 15 minutes

---

## 🔵 LOW PRIORITY BUGS

### Bug #11: No Email Field in Order Form
**Mức độ:** Low  
**Mô tả:** Form không có email, khó gửi xác nhận đơn hàng.

**Cách fix:** Thêm input email + validation

**Estimate:** 30 minutes

---

### Bug #12: Form Auto-Reset Too Fast
**Mức độ:** Low  
**Mô tả:** Form reset sau 4s, user chưa kịp xem thông tin.

**Cách fix:** Tăng timeout lên 8-10s hoặc thêm nút "Đóng"

**Estimate:** 15 minutes

---

### Bug #13: No Image Lazy Loading
**Mức độ:** Low  
**Mô tả:** Tất cả images load cùng lúc, chậm trang.

**Cách fix:**
```html
<img src="..." loading="lazy" alt="...">
```

**Estimate:** 30 minutes

---

### Bug #14: No Loading Indicators
**Mức độ:** Low  
**Mô tả:** Không có loading spinner khi submit form.

**Cách fix:**
```javascript
button.disabled = true;
button.textContent = 'Đang xử lý...';
```

**Estimate:** 30 minutes

---

### Bug #15: Files Not Minified
**Mức độ:** Low  
**Mô tả:** CSS/JS không minify, tốn bandwidth.

**Cách fix:**
```bash
npm install -g clean-css-cli uglify-js
cleancss -o styles.min.css styles.css
uglifyjs main.js -o main.min.js
```

**Estimate:** 1 hour (setup build process)

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: Critical & High (1 week)
1. ✅ Setup HTTPS (Day 1)
2. ✅ Implement mobile menu (Day 2)
3. ✅ Fix XSS vulnerability (Day 3)
4. ✅ Add localStorage fallback (Day 3)

### Phase 2: Medium (1 week)
5. ✅ Phone validation (Day 4)
6. ✅ Quantity limits (Day 4)
7. ✅ Cart error handling (Day 5)
8. ✅ Screen reader support (Day 5)
9. ✅ Cart count visibility (Day 6)
10. 🔄 Payment gateway (Future - requires backend)

### Phase 3: Low Priority (3 days)
11. ✅ Email field (Day 7)
12. ✅ Form reset timing (Day 7)
13. ✅ Lazy loading (Day 8)
14. ✅ Loading indicators (Day 8)
15. ✅ Minification (Day 9)

**Total Estimate:** 2-3 weeks for all fixes

---

## 🧪 Testing Checklist

After fixing each bug:
- [ ] Rerun test suite
- [ ] Manual testing on desktop
- [ ] Manual testing on mobile
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility testing
- [ ] Performance testing

---

## 📞 Support

Nếu cần hỗ trợ fix bugs:
1. Xem chi tiết code trong `test/bug-fixes.js`
2. Run test suite: `test/test-functions.html`
3. Check README: `test/README.md`

---

**Generated by:** Automated Test Suite v1.0  
**Last Updated:** 12/11/2025
