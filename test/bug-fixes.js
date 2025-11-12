// ========================================
// BUG FIXES cho Website Nghệ Quảng Nam
// ========================================

// FIX #1: Mobile Menu (Hamburger Menu)
// Severity: HIGH
// Location: HTML header & CSS

/*
Thêm vào HTML (trong header):
<button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
  <span></span>
  <span></span>
  <span></span>
</button>

CSS để thêm:
*/

const mobileMenuCSS = `
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: white;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .main-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, var(--turmeric) 0%, var(--green) 100%);
    flex-direction: column;
    padding: 1rem;
    display: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .main-nav.active {
    display: flex;
  }
  
  .main-nav a {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
}
`;

// JavaScript để toggle menu
const mobileMenuJS = `
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
  
  // Close menu when clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}
`;

// ========================================
// FIX #2: Phone Number Validation
// Severity: MEDIUM
// Location: main.js - order form handling

function validatePhone(phone) {
  // Vietnamese phone number format
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return false;
  }
  return true;
}

// Sử dụng trong order form:
/*
const phone = document.getElementById('phone').value.trim();
if (!validatePhone(phone)) {
  alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (VD: 0123456789)');
  return false;
}
*/

// ========================================
// FIX #3: Email Field in Order Form
// Severity: LOW
// Location: order.html

const emailFieldHTML = `
<div class="form-group">
  <label for="email">Email <span class="required">*</span></label>
  <input type="email" id="email" name="email" placeholder="example@email.com" required>
</div>
`;

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========================================
// FIX #4: Max Quantity Limit
// Severity: MEDIUM
// Location: HTML quantity inputs

// Cập nhật HTML:
// <input type="number" id="order-qty" min="1" max="100" value="1">

function validateQuantity(qty) {
  const quantity = parseInt(qty);
  if (isNaN(quantity) || quantity < 1) {
    alert('Số lượng tối thiểu là 1');
    return false;
  }
  if (quantity > 100) {
    alert('Số lượng tối đa là 100 sản phẩm');
    return false;
  }
  return true;
}

// ========================================
// FIX #5: XSS Prevention
// Severity: HIGH
// Location: main.js - all user input handling

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sử dụng:
/*
const safeName = escapeHtml(document.getElementById('name').value);
const safeAddress = escapeHtml(document.getElementById('address').value);
*/

// ========================================
// FIX #6: Error Handling for Cart Data
// Severity: MEDIUM
// Location: main.js - loadCart() function

function loadCartSafe() {
  const KEY = 'tbt_cart_v1';
  try {
    const data = localStorage.getItem(KEY);
    if (!data) return [];
    
    const cart = JSON.parse(data);
    
    // Validate cart structure
    if (!Array.isArray(cart)) {
      console.warn('Invalid cart data format, resetting cart');
      localStorage.removeItem(KEY);
      return [];
    }
    
    // Validate each item
    const validCart = cart.filter(item => {
      return item.id && 
             item.name && 
             typeof item.price === 'number' && 
             typeof item.qty === 'number' && 
             item.qty > 0;
    });
    
    return validCart;
  } catch (e) {
    console.error('Error loading cart:', e);
    localStorage.removeItem(KEY);
    return [];
  }
}

// ========================================
// FIX #7: Loading States
// Severity: LOW
// Location: Form submissions and cart operations

function showLoading(button, loadingText = 'Đang xử lý...') {
  button.disabled = true;
  button.dataset.originalText = button.textContent;
  button.textContent = loadingText;
  button.style.opacity = '0.6';
}

function hideLoading(button) {
  button.disabled = false;
  button.textContent = button.dataset.originalText || 'Gửi';
  button.style.opacity = '1';
}

// Sử dụng:
/*
const submitBtn = document.getElementById('submit-btn');
showLoading(submitBtn);

// Do async operation...
setTimeout(() => {
  hideLoading(submitBtn);
}, 2000);
*/

// ========================================
// FIX #8: Image Lazy Loading
// Severity: LOW
// Location: HTML image tags

// Method 1: HTML native lazy loading
// <img src="image.jpg" loading="lazy" alt="Description">

// Method 2: Intersection Observer (advanced)
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Call when DOM ready
// setupLazyLoading();

// ========================================
// FIX #9: Cart Count Visibility
// Severity: LOW
// Location: CSS and JS

const cartCountCSS = `
#cart-count {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 2px 6px;
  background: var(--green);
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
}

#cart-count:empty::after {
  content: '0';
  opacity: 0.7;
}
`;

// ========================================
// FIX #10: Form Auto-Reset Timing
// Severity: LOW
// Location: main.js - order form submission

// Thay đổi từ 4000ms sang 8000ms hoặc thêm user control
const improvedFormReset = `
// Thêm nút để user control
const resetMessage = document.createElement('div');
resetMessage.innerHTML = '<button id="close-msg" class="btn outline">Đóng</button>';
document.getElementById('order-msg').appendChild(resetMessage);

document.getElementById('close-msg')?.addEventListener('click', () => {
  orderForm.reset();
  document.getElementById('order-msg').textContent = '';
});

// Hoặc tăng timeout
setTimeout(() => { 
  orderForm.reset(); 
  document.getElementById('order-msg').textContent = '';
}, 8000); // Tăng từ 4000 lên 8000
`;

// ========================================
// FIX #11: Screen Reader Support
// Severity: MEDIUM
// Location: HTML elements throughout site

const ariaImprovements = `
<!-- Navigation -->
<nav class="main-nav" role="navigation" aria-label="Main navigation">
  <a href="index.html" aria-current="page">Trang chủ</a>
</nav>

<!-- Buttons -->
<button class="add-to-cart" 
        aria-label="Thêm Tinh bột nghệ 100g vào giỏ hàng">
  Thêm giỏ
</button>

<!-- Cart count -->
<span id="cart-count" aria-live="polite" aria-atomic="true">0</span>

<!-- Form errors -->
<div id="order-msg" role="alert" aria-live="assertive"></div>

<!-- Modal -->
<div id="cart-modal" role="dialog" aria-modal="true" aria-labelledby="cart-title">
  <h3 id="cart-title">Giỏ hàng của bạn</h3>
</div>
`;

// ========================================
// FIX #12: localStorage Fallback
// Severity: HIGH
// Location: main.js - cart functionality

// Fallback when localStorage is not available
const cartStorage = {
  data: [],
  
  isLocalStorageAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  get(key) {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return JSON.stringify(this.data);
  },
  
  set(key, value) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      this.data = JSON.parse(value);
    }
  },
  
  remove(key) {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      this.data = [];
    }
  }
};

// Sử dụng cartStorage thay vì localStorage trực tiếp

// ========================================
// SUMMARY: Priority Order to Fix
// ========================================

/*
1. HIGH Priority:
   - Mobile Menu (affects usability on mobile)
   - XSS Prevention (security risk)
   - localStorage Fallback (functionality issue)

2. MEDIUM Priority:
   - Phone Validation (data quality)
   - Max Quantity Limit (business logic)
   - Error Handling for Cart (stability)
   - Screen Reader Support (accessibility)

3. LOW Priority:
   - Email Field (feature enhancement)
   - Loading States (UX improvement)
   - Lazy Loading (performance)
   - Cart Count Visibility (UI polish)
   - Form Reset Timing (UX tweak)

4. CRITICAL (Infrastructure):
   - HTTPS (deploy to secure hosting)
   - Payment Gateway (requires backend)
   - File Minification (build process)
*/

console.log('Bug fixes loaded. See comments for implementation details.');
