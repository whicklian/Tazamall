// main.js - include after products.js on pages that use it

const CART_KEY = "tazaCart";
const ORDERS_KEY = "tazaOrders";
const USERS_KEY = "tazaUsers";
const CURRENT_USER_KEY = "tazaCurrentUser";

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartUI(); }
function updateCartUI(){
  const badge = document.getElementById("cart-count");
  if(badge) badge.textContent = cart.reduce((s,i)=>s+i.qty,0);
  const stickyCount = document.getElementById("stickyCount");
  if(stickyCount) stickyCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

/* AUTH HELPERS */
function getCurrentUser(){
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
}
function saveCurrentUser(user){
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  updateCartUI();
}
function logoutUser(){
  localStorage.removeItem(CURRENT_USER_KEY);
  updateCartUI();
}
// password hashing helper (SHA-256)
async function hashPassword(pw){
  const enc = new TextEncoder();
  const data = enc.encode(pw);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function registerUser({name,email,password}){
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if(users.find(u=>u.email === email)) return { ok:false, message: 'Email already registered' };
  const hp = await hashPassword(password);
  users.push({ name, email, password: hp });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  saveCurrentUser({ name, email });
  renderUserArea();
  return { ok:true };
}

async function loginUser(email,password){
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const hp = await hashPassword(password);
  const u = users.find(x=>x.email===email && x.password===hp);
  if(!u) return { ok:false, message: 'Invalid credentials' };
  saveCurrentUser({ name: u.name, email: u.email });
  renderUserArea();
  return { ok:true };
}
function requireAuth(next){
  if(!getCurrentUser()){
    const target = next || location.pathname.split('/').pop() || 'index.html';
    location.href = `login.html?next=${encodeURIComponent(target)}`;
    return false;
  }
  return true;
}

/* PRODUCTS & CATEGORIES */
function renderCategories(){
  const bar = document.getElementById("categoryBar");
  if(!bar) return;
  bar.innerHTML = "";
  CATEGORIES.forEach((c,i) => {
    const div = document.createElement("div");
    div.className = "category";
    if(i===0) div.classList.add("active");
    div.textContent = c;
    div.onclick = () => {
      document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
      div.classList.add("active");
      if(c==="All") renderProducts(PRODUCTS);
      else renderProducts(PRODUCTS.filter(p=>p.category===c));
    };
    bar.appendChild(div);
  });
}

function renderProducts(list){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">KES ${Number(p.price).toLocaleString()}</div>
      <button class="btn">View & Add</button>
    `;
    card.querySelector("button").onclick = (e) => {
      e.stopPropagation();
      openModal(p);
    };
    card.onclick = () => openModal(p);
    grid.appendChild(card);
  });
}

/* SEARCH */
function filterSearch(){
  const q = (document.getElementById("search")?.value || "").trim().toLowerCase();
  if(!q) return renderProducts(PRODUCTS);
  renderProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || (p.desc||"").toLowerCase().includes(q)));
}

/* MODAL */
function openModal(product){
  const modal = document.getElementById("productModal");
  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalDesc").textContent = product.desc || "";
  document.getElementById("modalPrice").textContent = `KES ${Number(product.price).toLocaleString()}`;
  document.getElementById("modalQty").value = 1;
  document.getElementById("addModalBtn").onclick = () => {
    const qty = parseInt(document.getElementById("modalQty").value) || 1;
    addToCart(product.id, qty);
    closeModal();
  };
  modal.style.display = "flex";
}
function closeModal(){ document.getElementById("productModal").style.display = "none"; }

/* CART MANAGEMENT */
function addToCart(productId, qty=1){
  const prod = PRODUCTS.find(p=>p.id===productId);
  if(!prod) { alert("Product not found"); return; }
  const exists = cart.find(i=>i.id===productId);
  if(exists) exists.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart();
  showToast(`${qty} × ${prod.name} added to cart`);
}

function removeFromCart(productId){
  cart = cart.filter(i=>i.id !== productId);
  saveCart();
}

function changeQty(productId, delta){
  const item = cart.find(i=>i.id===productId);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(productId);
  saveCart();
}

/* Checkout helpers */
function cartItemsDetailed(){
  return cart.map(ci => {
    const p = PRODUCTS.find(x=>x.id===ci.id) || {};
    return { ...p, qty: ci.qty, subtotal: (p.price||0)*ci.qty };
  });
}
function cartTotal(){
  return cartItemsDetailed().reduce((s,i)=>s+i.subtotal,0);
}

/* small toast */
function showToast(msg, time=1800){
  let t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.bottom = "100px";
  t.style.right = "24px";
  t.style.background = "rgba(0,0,0,0.75)";
  t.style.color = "#fff";
  t.style.padding = "10px 14px";
  t.style.borderRadius = "8px";
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), time);
}

/* init on pages that include main.js */
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  renderCategories();
  renderProducts(PRODUCTS);
  const searchEl = document.getElementById("search");
  if(searchEl) searchEl.oninput = filterSearch;
});

// User area rendering (icon that opens credentials modal when clicked)
function renderUserArea(){
  let ua = document.getElementById('userArea');
  if(ua) ua.remove();
  ua = document.createElement('div');
  ua.id = 'userArea';
  ua.style.cursor = 'pointer';
  ua.style.fontSize = '24px';
  
  const user = getCurrentUser();
  ua.textContent = user ? '👤' : '🔓';
  ua.title = user ? `Logged in as ${user.name}` : 'Not logged in';
  ua.onclick = ()=> openUserModal();
  
  const header = document.querySelector('header');
  if(header) header.appendChild(ua);
  
  // Create modal (hidden by default)
  let modal = document.getElementById('userModal');
  if(modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'userModal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0,0,0,0.5)';
  modal.style.zIndex = '8999';
  modal.onclick = (e)=>{ if(e.target === modal) closeUserModal(); };
  
  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.top = '60px';
  box.style.right = '20px';
  box.style.background = '#fff';
  box.style.borderRadius = '8px';
  box.style.padding = '20px';
  box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  box.style.zIndex = '9000';
  box.style.minWidth = '280px';
  
  if(user){
    box.innerHTML = `
      <div style="margin-bottom:16px;border-bottom:2px solid #eee;padding-bottom:12px">
        <div style="font-size:12px;color:#999;text-transform:uppercase;margin-bottom:4px">Account</div>
        <div style="font-weight:600;font-size:16px;color:#333">${user.name}</div>
        <div style="font-size:13px;color:#666">${user.email}</div>
      </div>
      <button id="closeUserModalBtn" style="width:100%;padding:10px;background:#c33;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600">Logout</button>
    `;
    modal.appendChild(box);
    document.body.appendChild(modal);
    document.getElementById('closeUserModalBtn').onclick = ()=>{ logoutUser(); closeUserModal(); renderUserArea(); location.href='index.html'; };
  } else {
    box.innerHTML = `
      <div style="margin-bottom:12px">
        <a href="login.html" style="display:block;padding:12px;background:#2d5016;color:#fff;text-decoration:none;border-radius:6px;text-align:center;font-weight:600;margin-bottom:8px">Login</a>
        <a href="signup.html" style="display:block;padding:12px;background:#f0f0f0;color:#333;text-decoration:none;border-radius:6px;text-align:center;font-weight:600">Create Account</a>
      </div>
    `;
    modal.appendChild(box);
    document.body.appendChild(modal);
  }
}

function openUserModal(){
  const modal = document.getElementById('userModal');
  if(modal) modal.style.display = 'flex';
}

function closeUserModal(){
  const modal = document.getElementById('userModal');
  if(modal) modal.style.display = 'none';
}

// ensure user area updates on load
document.addEventListener('DOMContentLoaded', ()=> renderUserArea());
