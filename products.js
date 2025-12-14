// products.js
// Primary product data used across the site — cleaned and consistent
const PRODUCTS = [
  // Fashion
  { id: 1, name: 'Kenya Lion Sport Jersey', img: 'img/r4.jpg', price: 2400, category: 'Fashion', desc: 'Official print, breathable fabric.' },
  { id: 2, name: 'Walk for Cure T-Shirt', img: 'img/t-shirt-design-in-kenya-opt-3.jpg', price: 1200, category: 'Fashion', desc: 'Event tee, unisex.' },
  { id: 3, name: 'Classic Jacket', img: 'img/jacket3.jpeg', price: 3500, category: 'Fashion', desc: 'Warm and stylish winter jacket.' },
  { id: 4, name: 'Premium Leather Jacket', img: 'img/jacket.jpeg', price: 5200, category: 'Fashion', desc: 'Genuine leather, perfect fit.' },
  { id: 5, name: 'Sports Shoes', img: 'img/shoes.jpeg', price: 2800, category: 'Fashion', desc: 'Comfortable athletic shoes.' },
  { id: 6, name: 'Running Sneakers', img: 'img/shoes2.jpeg', price: 2500, category: 'Fashion', desc: 'Lightweight and flexible.' },
  { id: 7, name: 'Casual Shirt', img: 'img/t-shirt.jpeg', price: 1500, category: 'Fashion', desc: 'Everyday wear, soft cotton.' },
  { id: 8, name: 'Premium T-Shirt', img: 'img/tshirt.jpeg', price: 1800, category: 'Fashion', desc: 'High-quality material.' },
  
  // Electronics
  { id: 9, name: 'Premium Round Smartwatch', img: 'img/watch.jpg', price: 4500, category: 'Electronics', desc: 'Health tracking, Bluetooth calls, 7-day battery.' },
  { id: 10, name: 'Kids Smartwatch with Camera', img: 'img/smart.jpg', price: 3200, category: 'Electronics', desc: 'Camera, SOS, GPS demo (offline).' },
  { id: 11, name: 'Galaxy Edition Smartwatch', img: 'img/smartwach.jpeg', price: 5200, category: 'Electronics', desc: 'Premium metal finish, AMOLED display.' },
  { id: 12, name: 'Wireless Pods', img: 'img/pods.jpeg', price: 2200, category: 'Electronics', desc: 'True wireless earbuds, noise cancelling.' },
  { id: 13, name: 'Gaming PC', img: 'img/pc.jpeg', price: 85000, category: 'Electronics', desc: 'High-performance gaming setup.' },
  { id: 14, name: 'Laptop Computer', img: 'img/pc1.jpeg', price: 45000, category: 'Electronics', desc: 'Lightweight portable laptop.' },
  
  // Accessories
  { id: 15, name: 'SanDisk Portable SSD 500GB', img: 'img/sandisk2.jpeg', price: 7800, category: 'Accessories', desc: 'Fast NVMe-like speeds, pocketable.' },
  { id: 16, name: 'SanDisk Ultra Flash Drive 128GB', img: 'img/sandisk.jpeg', price: 950, category: 'Accessories', desc: 'Compact USB-A stick.' },
  { id: 17, name: 'USB Extension Cable', img: 'img/extension.jpeg', price: 300, category: 'Accessories', desc: '1.5m heavy-duty cable.' },
  { id: 18, name: 'Premium USB Hub', img: 'img/usb.jpeg', price: 1200, category: 'Accessories', desc: '7-port USB 3.0 hub.' },
  { id: 19, name: 'High Speed Data Cable', img: 'img/cable.jpeg', price: 450, category: 'Accessories', desc: 'Universal charging cable.' },
  { id: 20, name: 'Extra Storage Drive', img: 'img/sandisk4.jpeg', price: 3500, category: 'Accessories', desc: 'Secure backup storage.' },
  
  // Home & Kitchen
  { id: 21, name: 'Electric Kettle 1.7L', img: 'img/kettle.jpeg', price: 2500, category: 'Home & Kitchen', desc: 'Fast boiling, auto-shutoff.' },
  { id: 22, name: 'Stainless Kettle', img: 'img/kettle3.jpeg', price: 1800, category: 'Home & Kitchen', desc: 'Durable and elegant design.' },
  { id: 23, name: 'Mini Fridge', img: 'img/fridge.jpeg', price: 18000, category: 'Home & Kitchen', desc: 'Compact cooling, perfect for dorms.' },
  { id: 24, name: 'Wooden Dining Table', img: 'img/table.jpeg', price: 12000, category: 'Home & Kitchen', desc: 'Solid wood construction.' },
  { id: 25, name: 'Glass Coffee Table', img: 'img/table22.jpeg', price: 8500, category: 'Home & Kitchen', desc: 'Modern sleek design.' },
  { id: 26, name: 'Comfortable Sofa', img: 'img/sofa.jpeg', price: 35000, category: 'Home & Kitchen', desc: 'Spacious 3-seater sofa.' },
  
  // Beauty
  { id: 27, name: 'Moisturizing Lip Balm', img: 'img/lipbum.jpeg', price: 250, category: 'Beauty', desc: 'Organic ingredients, SPF 15.' },
  { id: 28, name: 'Lipstick Classic Red', img: 'img/lip.jpeg', price: 380, category: 'Beauty', desc: 'Long-lasting formula.' }
];

const CATEGORIES = ["All", "Fashion", "Electronics", "Accessories", "Beauty", "Home & Kitchen"];
