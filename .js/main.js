// Simple client-side cart and order handling (no backend)
(function(){
  // Utilities
  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function formatVND(n){ return '₫' + Number(n).toLocaleString('vi-VN'); }

  // Cart stored in localStorage as array of {id,name,price,qty}
  const KEY = 'tbt_cart_v1';
  function loadCart(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch(e){return []} }
  function saveCart(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }

  function updateCartUI(){
    const cart = loadCart();
    const count = cart.reduce((s,i)=>s+i.qty,0);
    const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
    const btnCount = q('#cart-count') || q('#cart-count-2');
    if(btnCount) btnCount.textContent = count;
    // items
    const itemsEl = q('#cart-items');
    if(itemsEl){
      itemsEl.innerHTML = '';
      if(cart.length===0){ itemsEl.innerHTML = '<p style="color:#6b6b6b;">Giỏ hàng đang trống.</p>'; }
      cart.forEach(it=>{
        const el = document.createElement('div'); el.className='cart-item';
        el.innerHTML = `<div>${it.name} x ${it.qty}</div><div>${formatVND(it.price*it.qty)}</div>`;
        itemsEl.appendChild(el);
      });
    }
    const totalEl = q('#cart-total'); if(totalEl) totalEl.textContent = formatVND(total);
  }

  function addToCart(id,name,price,qty){
    const cart = loadCart();
    const found = cart.find(i=>i.id===id);
    if(found){ found.qty += qty; } else { cart.push({id,name,price,qty}); }
    saveCart(cart); updateCartUI();
  }

  // Attach add-to-cart buttons
  qa('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.dataset.id; const name = btn.dataset.name; const price = Number(btn.dataset.price||0);
      addToCart(id,name,price,1);
      // show quick feedback
      const origText = btn.textContent;
      btn.textContent = 'Đã thêm ✓'; setTimeout(()=>{ btn.textContent = origText; },900);
    });
  });

  // Product detail add
  const pdAdd = q('#pd-add'); if(pdAdd){ pdAdd.addEventListener('click',()=>{
    const id = pdAdd.dataset.id; const name = pdAdd.dataset.name; const price = Number(pdAdd.dataset.price||0);
    const qty = Number(q('#pd-qty').value||1);
    addToCart(id,name,price,qty);
    // show feedback
    const origText = pdAdd.textContent;
    pdAdd.textContent = 'Đã thêm ✓'; setTimeout(()=>{ pdAdd.textContent = origText; },900);
  }); }

  // Product detail add for 250g page
  const pdAdd250 = q('#pd-add-250'); if(pdAdd250){ pdAdd250.addEventListener('click',()=>{
    const id = pdAdd250.dataset.id; const name = pdAdd250.dataset.name; const price = Number(pdAdd250.dataset.price||0);
    const qty = Number(q('#pd-qty-250').value||1);
    addToCart(id,name,price,qty);
    // show feedback
    const origText = pdAdd250.textContent;
    pdAdd250.textContent = 'Đã thêm ✓'; setTimeout(()=>{ pdAdd250.textContent = origText; },900);
  }); }

  // Cart modal controls
  const cartBtn = q('#cart-btn') || q('#cart-btn-2');
  const cartModal = q('#cart-modal');
  const closeCart = q('#close-cart');
  const emptyCart = q('#empty-cart');
  const checkout = q('#checkout');

  function openCart(){ if(cartModal){ cartModal.classList.add('open'); cartModal.setAttribute('aria-hidden','false'); } }
  function closeCartFn(){ if(cartModal){ cartModal.classList.remove('open'); cartModal.setAttribute('aria-hidden','true'); } }

  if(cartBtn) cartBtn.addEventListener('click', openCart);
  if(closeCart) closeCart.addEventListener('click', closeCartFn);
  if(emptyCart) emptyCart.addEventListener('click', ()=>{ localStorage.removeItem(KEY); updateCartUI(); });

  if(checkout) checkout.addEventListener('click', ()=>{
    const cart = loadCart(); if(cart.length===0){ alert('Giỏ hàng trống'); return; }
    // For demo, navigate to order page or show success
    if(window.location.pathname.includes('order.html')){
      alert('Vui lòng điền thông tin đặt hàng bên dưới.');
    } else {
      window.location.href = 'order.html';
    }
    closeCartFn();
  });

  // View cart button in order page
  const viewCartBtn = q('#view-cart'); if(viewCartBtn){ viewCartBtn.addEventListener('click', openCart); }

  // Order page: calculate totals dynamically
  const orderProduct = q('#order-product');
  const orderQty = q('#order-qty');
  if(orderProduct && orderQty){
    function calculateOrder(){
      const selectedOption = orderProduct.selectedOptions[0];
      if(!selectedOption || !selectedOption.dataset.price) return;
      const price = Number(selectedOption.dataset.price);
      const qty = Number(orderQty.value || 1);
      const subtotal = price * qty;
      const shipping = subtotal >= 500000 ? 0 : 30000;
      const total = subtotal + shipping;
      
      if(q('#subtotal')) q('#subtotal').textContent = formatVND(subtotal);
      if(q('#shipping')) q('#shipping').textContent = shipping === 0 ? 'Miễn phí' : formatVND(shipping);
      if(q('#total')) q('#total').textContent = formatVND(total);
    }
    
    orderProduct.addEventListener('change', calculateOrder);
    orderQty.addEventListener('input', calculateOrder);
    calculateOrder(); // Initial calculation
  }

  // Order form handling
  const orderForm = q('#order-form');
  if(orderForm){
    orderForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const name = q('#name').value.trim();
      const phone = q('#phone').value.trim();
      const address = q('#address').value.trim();
      const prod = q('#order-product'); 
      const pid = prod.value; 
      const pprice = Number(prod.selectedOptions[0]?.dataset.price || 0);
      const pname = prod.selectedOptions[0]?.text.split(' — ')[0].trim();
      const qty = Number(q('#order-qty').value||1);
      
      if(!name||!phone||!address||!pid){ 
        if(q('#order-msg')){
          q('#order-msg').textContent='Vui lòng điền đủ thông tin bắt buộc.';
          q('#order-msg').style.background='#ffebee';
          q('#order-msg').style.color='#c62828';
        }
        return; 
      }
      
      // Add to cart and show success
      addToCart(pid, pname, pprice, qty);
      const cart = loadCart(); 
      const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
      
      if(q('#order-msg')){
        q('#order-msg').textContent = `✅ Đơn hàng đã được ghi nhận! Tổng: ${formatVND(total)}. Chúng tôi sẽ liên hệ bạn sớm nhất.`;
        q('#order-msg').style.background='#e8f5e9';
        q('#order-msg').style.color='#2e7d32';
      }
      
      // Clear form after short delay
      setTimeout(()=>{ 
        orderForm.reset(); 
        if(q('#order-msg')) q('#order-msg').textContent = '';
        // Optionally clear cart after order
        // localStorage.removeItem(KEY); updateCartUI();
      }, 4000);
    });
  }

  // Clear cart button in form (if exists on other pages)
  const clearCartBtn = q('#clear-cart'); 
  if(clearCartBtn){ 
    clearCartBtn.addEventListener('click', ()=>{ 
      localStorage.removeItem(KEY); 
      updateCartUI(); 
      alert('Giỏ hàng đã được xóa.');
    }); 
  }

  // Update year
  const y = new Date().getFullYear(); if(q('#year')) q('#year').textContent = y; if(q('#year-2')) q('#year-2').textContent = y;

  // Init UI
  updateCartUI();
})();
