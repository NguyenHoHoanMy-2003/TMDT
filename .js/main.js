// Simple client-side cart and order handling (no backend)
(function () {
  // ========== Mobile Menu Toggle ==========
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mainNav.classList.contains('active') && 
          !mainNav.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link
    mainNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
  
  // Utilities
  function q(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qa(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }
  function formatVND(n) {
    return "₫" + Number(n).toLocaleString("vi-VN");
  }

  // Cart stored in localStorage as array of {id,name,price,qty}
  const KEY = "tbt_cart_v1";
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }

  function updateCartUI() {
    const cart = loadCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    const btnCount = q("#cart-count") || q("#cart-count-2");
    if (btnCount) btnCount.textContent = count;
    // items
    const itemsEl = q("#cart-items");
    if (itemsEl) {
      itemsEl.innerHTML = "";
      if (cart.length === 0) {
        itemsEl.innerHTML =
          '<p style="color:#6b6b6b;">Giỏ hàng đang trống.</p>';
      }
      cart.forEach((it) => {
        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `<div>${it.name} x ${it.qty}</div><div>${formatVND(
          it.price * it.qty
        )}</div>`;
        itemsEl.appendChild(el);
      });
    }
    const totalEl = q("#cart-total");
    if (totalEl) totalEl.textContent = formatVND(total);
  }

  function addToCart(id, name, price, qty) {
    const cart = loadCart();
    const found = cart.find((i) => i.id === id);
    if (found) {
      found.qty += qty;
    } else {
      cart.push({ id, name, price, qty });
    }
    saveCart(cart);
    updateCartUI();
  }

  // Attach add-to-cart buttons
  qa(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price || 0);
      
      // Show loading state
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Đang thêm...";
      btn.style.opacity = "0.7";
      
      // Simulate async operation
      setTimeout(() => {
        addToCart(id, name, price, 1);
        // show success feedback
        btn.textContent = "Đã thêm ✓";
        btn.style.opacity = "1";
        setTimeout(() => {
          btn.textContent = origText;
          btn.disabled = false;
        }, 900);
      }, 300);
    });
  });

  // Product detail add
  const pdAdd = q("#pd-add");
  if (pdAdd) {
    pdAdd.addEventListener("click", () => {
      const id = pdAdd.dataset.id;
      const name = pdAdd.dataset.name;
      const price = Number(pdAdd.dataset.price || 0);
      const qty = Number(q("#pd-qty").value || 1);
      addToCart(id, name, price, qty);
      // show feedback
      const origText = pdAdd.textContent;
      pdAdd.textContent = "Đã thêm ✓";
      setTimeout(() => {
        pdAdd.textContent = origText;
      }, 900);
    });
  }

  // Product detail add for 250g page
  const pdAdd250 = q("#pd-add-250");
  if (pdAdd250) {
    pdAdd250.addEventListener("click", () => {
      const id = pdAdd250.dataset.id;
      const name = pdAdd250.dataset.name;
      const price = Number(pdAdd250.dataset.price || 0);
      const qty = Number(q("#pd-qty-250").value || 1);
      addToCart(id, name, price, qty);
      // show feedback
      const origText = pdAdd250.textContent;
      pdAdd250.textContent = "Đã thêm ✓";
      setTimeout(() => {
        pdAdd250.textContent = origText;
      }, 900);
    });
  }

  // Cart modal controls
  const cartBtn = q("#cart-btn") || q("#cart-btn-2");
  const cartModal = q("#cart-modal");
  const closeCart = q("#close-cart");
  const emptyCart = q("#empty-cart");
  const checkout = q("#checkout");

  function openCart() {
    if (cartModal) {
      cartModal.classList.add("open");
      cartModal.setAttribute("aria-hidden", "false");
    }
  }
  function closeCartFn() {
    if (cartModal) {
      cartModal.classList.remove("open");
      cartModal.setAttribute("aria-hidden", "true");
    }
  }

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (closeCart) closeCart.addEventListener("click", closeCartFn);
  if (emptyCart)
    emptyCart.addEventListener("click", () => {
      localStorage.removeItem(KEY);
      updateCartUI();
    });

  if (checkout)
    checkout.addEventListener("click", () => {
      const cart = loadCart();
      if (cart.length === 0) {
        alert("Giỏ hàng trống");
        return;
      }
      // For demo, navigate to order page or show success
      if (window.location.pathname.includes("order.html")) {
        alert("Vui lòng điền thông tin đặt hàng bên dưới.");
      } else {
        window.location.href = "order.html";
      }
      closeCartFn();
    });

  // View cart button in order page
  const viewCartBtn = q("#view-cart");
  if (viewCartBtn) {
    viewCartBtn.addEventListener("click", openCart);
  }

  // Order page: calculate totals dynamically
  const orderProduct = q("#order-product");
  const orderQty = q("#order-qty");
  const qtyDecrease = q("#qty-decrease");
  const qtyIncrease = q("#qty-increase");
  
  if (orderProduct && orderQty) {
    // Quantity buttons
    if (qtyDecrease) {
      qtyDecrease.addEventListener("click", () => {
        let currentQty = Number(orderQty.value || 1);
        if (currentQty > 1) {
          orderQty.value = currentQty - 1;
          calculateOrder();
        }
      });
    }
    
    if (qtyIncrease) {
      qtyIncrease.addEventListener("click", () => {
        let currentQty = Number(orderQty.value || 1);
        orderQty.value = currentQty + 1;
        calculateOrder();
      });
    }
    
    function calculateOrder() {
      const selectedOption = orderProduct.selectedOptions[0];
      if (!selectedOption || !selectedOption.dataset.price) {
        if (q("#subtotal")) q("#subtotal").textContent = "₫0";
        if (q("#discount")) q("#discount").textContent = "₫0";
        if (q("#shipping")) q("#shipping").textContent = "₫30.000";
        if (q("#total")) q("#total").textContent = "₫0";
        return;
      }
      
      const pricePerPackage = Number(selectedOption.dataset.price);
      const grams = Number(selectedOption.dataset.gram);
      const note = selectedOption.dataset.note || '';
      const quantity = Number(orderQty.value || 1);
      
      const subtotal = pricePerPackage * quantity;
      const shipping = subtotal >= 500000 ? 0 : 30000;
      const total = subtotal + shipping;
      const totalGrams = grams * quantity;

      if (q("#subtotal")) q("#subtotal").textContent = formatVND(subtotal) + ` (${totalGrams}g - ${note})`;
      if (q("#discount")) q("#discount").textContent = "₫0";
      if (q("#shipping"))
        q("#shipping").textContent =
          shipping === 0 ? "Miễn phí ✓" : formatVND(shipping);
      if (q("#total")) q("#total").textContent = formatVND(total);
    }

    orderProduct.addEventListener("change", calculateOrder);
    orderQty.addEventListener("input", calculateOrder);
    calculateOrder(); // Initial calculation
  }

  // Order form handling
  const orderForm = q("#order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      
      const submitBtn = orderForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      
      const name = q("#name").value.trim();
      const phone = q("#phone").value.trim();
      const address = q("#address").value.trim();
      const prod = q("#order-product");
      const packageType = prod.value;
      const pricePerPackage = Number(prod.selectedOptions[0]?.dataset.price || 0);
      const grams = Number(prod.selectedOptions[0]?.dataset.gram || 0);
      const note = prod.selectedOptions[0]?.dataset.note || '';
      const quantity = Number(q("#order-qty").value || 1);

      if (!name || !phone || !address || !packageType) {
        if (q("#order-msg")) {
          q("#order-msg").textContent = "Vui lòng điền đủ thông tin bắt buộc.";
          q("#order-msg").style.background = "#ffebee";
          q("#order-msg").style.color = "#c62828";
        }
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang xử lý...";
        submitBtn.style.opacity = "0.7";
      }

      // Simulate async processing
      setTimeout(() => {
        // Calculate final price
        const subtotal = pricePerPackage * quantity;
        const shipping = subtotal >= 500000 ? 0 : 30000;
        const total = subtotal + shipping;
        const totalGrams = grams * quantity;
        
        const productName = `Tinh bột nghệ ${packageType} x ${quantity} gói (${totalGrams}g - ${note})`;
        
        // Add to cart
        addToCart(packageType + '_' + quantity, productName, total, 1);

        if (q("#order-msg")) {
          q(
            "#order-msg"
          ).textContent = `✅ Đơn hàng đã được ghi nhận! Bạn đã đặt ${quantity} gói ${packageType} (${totalGrams}g). Tổng: ${formatVND(
            total
          )}. Chúng tôi sẽ liên hệ bạn sớm nhất.`;
          q("#order-msg").style.background = "#e8f5e9";
          q("#order-msg").style.color = "#2e7d32";
        }
        
        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          submitBtn.style.opacity = "1";
        }

        // Clear form after short delay
        setTimeout(() => {
          orderForm.reset();
          if (q("#order-msg")) q("#order-msg").textContent = "";
          if (q("#order-qty")) q("#order-qty").value = "1";
          calculateOrder();
        }, 8000);
      }, 500); // End of async simulation
    });
  }

  // Clear cart button in form (if exists on other pages)
  const clearCartBtn = q("#clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      localStorage.removeItem(KEY);
      updateCartUI();
      alert("Giỏ hàng đã được xóa.");
    });
  }

  // Update year
  const y = new Date().getFullYear();
  if (q("#year")) q("#year").textContent = y;
  if (q("#year-2")) q("#year-2").textContent = y;

  // Init UI
  updateCartUI();
})();
