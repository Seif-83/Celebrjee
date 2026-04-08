// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  }, 60);
});

// Mobile Menu Logic
function toggleMenu() {
  if (window.innerWidth > 768) return; 
  const nav = document.getElementById('navLinks');
  const overlay = document.getElementById('cartOverlay');
  nav.classList.toggle('active');
  overlay.classList.toggle('open');
}

// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// Cart state
let cart = [];
let cartOpen = false;

function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cartDrawer').classList.toggle('open', cartOpen);
  document.getElementById('cartOverlay').classList.toggle('open', cartOpen);
}

function closeAllDrawers() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('navLinks').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('open');
  cartOpen = false;
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; }
  else { cart.push({ name, price, qty: 1 }); }
  updateCart();
  showToast();
  const cc = document.getElementById('cartCount');
  cc.style.transform = 'scale(1.4)';
  setTimeout(() => cc.style.transform = 'scale(1)', 200);
}

function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">Your basket is empty,<br>let\'s change that ✦</div>';
    footer.style.display = 'none';
  } else {
    body.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-img">
          <svg width="40" height="60" viewBox="0 0 40 60">
            <rect x="8" y="20" width="24" height="35" rx="3" fill="#d9cbb5"/>
            <ellipse cx="20" cy="20" rx="12" ry="3" fill="#c4b49a"/>
            <line x1="20" y1="20" x2="20" y2="12" stroke="#5c4433" stroke-width="1"/>
            <path d="M20 6 C17 10 16 13 17 15 C18 17 20 17 20 17 C20 17 22 17 23 15 C24 13 23 10 20 6Z" fill="#ffb347"/>
          </svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} EGP each</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          </div>
        </div>
      </div>
    `).join('');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('cartTotal').textContent = total + ' EGP';
    footer.style.display = 'block';
  }
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
}

function checkout() {
  if (cart.length === 0) return;
  
  let orderMsg = "Hello Celebrjee! ✦\n\nI'd like to place an order:\n\n";
  cart.forEach(item => {
    orderMsg += `- ${item.name} (${item.qty}x) - ${item.price * item.qty} EGP\n`;
  });
  
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  orderMsg += `\nTotal: ${total} EGP\n\nThank you!`;

  const waNumber = "201070495213";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(orderMsg)}`;
  
  const t = document.getElementById('toast');
  t.textContent = "Redirecting to WhatsApp... ✦";
  t.classList.add('show');
  
  setTimeout(() => {
    t.classList.remove('show');
    window.open(waUrl, '_blank');
    setTimeout(() => { t.textContent = "Added to basket ✦"; }, 500);
  }, 1000);
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// Mood / Scent finder
function setMood(el) {
  document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

const moodMap = {
  'Cozy & Warm': 'Snowy Latte',
  'Bold & Energetic': 'Iced Coffee',
  'Romantic': 'Iced Love',
  'Bright & Joyful': 'Heart\'s Bloom',
  'Pure & Simple': '(SCENT) Normal',
  'Sweet & Floral': 'Blooming love',
  'Spicy & Passionate': 'Love flame'
};

function findScent() {
  const active = document.querySelector('.mood-chip.active');
  const mood = active ? active.textContent : 'Cozy & Warm';
  const scent = moodMap[mood] || 'Iced Coffee';
  const btn = document.getElementById('moodResult');
  btn.textContent = `✦ Your scent: ${scent}`;
  btn.style.background = 'var(--bronze)';
  setTimeout(() => {
    btn.textContent = 'Find My Scent';
    btn.style.background = 'var(--cream)';
  }, 3000);
}




// Category Filtering
function filterCategory(cat) {
  const products = document.querySelectorAll('.product-card');
  const filterUI = document.getElementById('filterUI');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const filterNameDisplay = document.getElementById('activeFilterName');
  const wrapper = document.getElementById('productsWrapper');
  
  // Smooth scroll to collection
  document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });

  if (cat === 'all') {
    products.forEach(p => p.classList.remove('filtered-out'));
    filterUI.style.display = 'none';
    viewAllBtn.style.display = 'inline-block';
    
    // Reset toggle state
    wrapper.classList.remove('expanded');
    wrapper.style.maxHeight = wrapper.dataset.baseHeight;
    document.querySelectorAll('.extra-product').forEach(el => {
      el.style.display = 'none';
      el.classList.remove('visible-anim');
    });
    viewAllBtn.textContent = 'View All Products';
    return;
  }

  // Filter mode
  filterUI.style.display = 'flex';
  filterNameDisplay.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
  viewAllBtn.style.display = 'none';

  products.forEach(p => {
    if (p.getAttribute('data-category') === cat) {
      p.classList.remove('filtered-out');
      if (p.classList.contains('extra-product')) {
        p.style.display = 'block';
        setTimeout(() => p.classList.add('visible-anim'), 50);
      }
    } else {
      p.classList.add('filtered-out');
    }
  });

  // Ensure grid is expanded to show all filtered results
  wrapper.style.maxHeight = 'none';
  wrapper.classList.add('expanded');
}

// Toggle Products Animation
function toggleProducts(btn) {
  const wrapper = document.getElementById('productsWrapper');
  const extraProducts = document.querySelectorAll('.extra-product');
  
  if (!wrapper.classList.contains('expanded')) {
    extraProducts.forEach(el => el.style.display = 'block');
    const expandedHeight = wrapper.scrollHeight;
    
    wrapper.style.maxHeight = expandedHeight + 'px';
    wrapper.classList.add('expanded');
    btn.textContent = 'Show Less Products';
    
    setTimeout(() => {
      extraProducts.forEach(el => el.classList.add('visible-anim'));
    }, 50);
    
    setTimeout(() => {
      if(wrapper.classList.contains('expanded')) {
        wrapper.style.maxHeight = 'none';
      }
    }, 800);
    
  } else {
    extraProducts.forEach(el => el.classList.remove('visible-anim'));
    
    const currentHeight = wrapper.scrollHeight;
    wrapper.style.maxHeight = currentHeight + 'px';
    void wrapper.offsetWidth; // Force Reflow
    
    wrapper.classList.remove('expanded');
    wrapper.style.maxHeight = wrapper.dataset.baseHeight;
    btn.textContent = 'View All Products';
    
    setTimeout(() => {
       extraProducts.forEach(el => el.style.display = 'none');
    }, 800);
  }
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('productsWrapper');
  if(wrapper) {
     const extraProductsList = document.querySelectorAll('.extra-product');
     extraProductsList.forEach(el => el.style.display = 'none');
     
     setTimeout(() => {
       wrapper.dataset.baseHeight = wrapper.offsetHeight + 'px';
       wrapper.style.maxHeight = wrapper.dataset.baseHeight;
       wrapper.style.overflow = 'hidden';
       wrapper.style.transition = 'max-height 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
     }, 50);
  }
});
