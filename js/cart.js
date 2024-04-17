document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length > 0) {
    carrito.forEach((producto) => {
      const productDiv = document.createElement('div');

      productDiv.className = 'mb-4 p-4 border-b';
      productDiv.innerHTML = `
      <div class="flex items-center">
        <img src="${producto.imagen}" alt="${
        producto.nombre
      }" class="w-20 h-20 object-cover rounded mr-4">
        <div>
          <h3 class="text-lg font-semibold">${producto.nombre}</h3>
          <p class="text-sm text-gray-600">Precio: ${producto.precio}€</p>
          <p class="text-sm text-gray-600">Cantidad: ${producto.cantidad}</p>
        </div>
      </div>
      <div>
        <p class="text-lg font-semibold">Subtotal: ${
          producto.precio * producto.cantidad
        }€</p>
      </div>
    `;
      cartContainer.appendChild(productDiv);
    });
  } else {
    cartContainer.innerText = 'No hay productos en el carrito.';
    cartContainer.className = 'text-center text-gray-500 text-xl';
  }
});
