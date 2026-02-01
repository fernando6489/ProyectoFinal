// Inicializar carrito
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const table = document.getElementById("cart-table");
const totalSpan = document.getElementById("total");

// Renderizar carrito
function renderCart() {
  if (!table || !totalSpan) return; // seguridad si no estamos en tienda.html

  table.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="p-6 text-center text-gray-400">
          El carrito está vacío 🛒
        </td>
      </tr>
    `;
    totalSpan.textContent = "0.00";
    return;
  }

  cart.forEach((p, index) => {
    const subtotal = p.price * p.qty;
    total += subtotal;

    table.innerHTML += `
      <tr class="border-b border-gray-700 hover:bg-gray-700">
        <td class="p-3">${p.name}</td>
        <td class="p-3 text-center">$${p.price.toFixed(2)}</td>
        <td class="p-3 text-center">
          <div class="flex justify-center gap-2">
            <button onclick="changeQty(${index}, -1)" class="px-2 bg-gray-600 rounded hover:bg-gray-500">➖</button>
            <span>${p.qty}</span>
            <button onclick="changeQty(${index}, 1)" class="px-2 bg-gray-600 rounded hover:bg-gray-500">➕</button>
          </div>
        </td>
        <td class="p-3 text-center">$${subtotal.toFixed(2)}</td>
        <td class="p-3 text-center">
          <button onclick="removeItem(${index})" class="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm">🗑</button>
        </td>
      </tr>
    `;
  });

  totalSpan.textContent = total.toFixed(2);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Cambiar cantidad
function changeQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

// Eliminar producto
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// Vaciar carrito
function vaciarCarrito() {
  if (cart.length === 0) {
    alert("El carrito ya está vacío 🛒");
    return;
  }
  if (confirm("¿Seguro que deseas vaciar el carrito?")) {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    alert("🗑 Carrito vaciado correctamente.");
  }
}

// Agregar producto
function addToCart(product) {
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Producto agregado al carrito 🛒");
}

// Contador del carrito
function updateCartCount() {
  const count = cart.reduce((acc, p) => acc + p.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// Cargar productos desde JSON
async function cargarProductos() {
  const res = await fetch("/public/data/productos.json");
  const productos = await res.json();
  const container = document.getElementById("productos-container");
  if (!container) return;

  productos.forEach(p => {
    container.innerHTML += `
      <div class="flex flex-col items-center justify-center w-100 max-w-sm mx-auto">
        <div class="relative w-full h-75 bg-gray-300 bg-center bg-cover rounded-lg shadow-md group"
             style="background-image: url(${p.imagen})">
          <div class="absolute inset-0 flex flex-col items-center justify-center 
              bg-white dark:bg-gray-800 rounded-lg
              opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-4 z-0">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">Características</h2>
            <ul class="text-sm text-gray-700 dark:text-gray-300 text-left leading-relaxed">
              ${p.descripcion.map(d => `<li>→ ${d}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800 relative z-10">
          <h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">${p.nombre}</h3>
          <div class="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
            <span class="font-bold text-gray-800 dark:text-gray-200">$${p.precio.toFixed(2)}</span>
            <button onclick="addToCart({ id: '${p.id}', name: '${p.nombre}', price: ${p.precio} })"
                    class="px-2 py-1 text-xs font-semibold text-white uppercase bg-gray-800 rounded hover:bg-gray-700">
              Add to cart
            </button>
          </div>
        </div>
      </div>`;
  });
}
// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  cargarProductos();
  renderCart();
});

