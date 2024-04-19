/* 
PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
ROSA REYES - 100434072
DAVID ROLDAN - 100451289
ELENA SERRANO - 100451094
*/

document.addEventListener('DOMContentLoaded', () => {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const container = document.getElementById('product-info-container');
  const producto = JSON.parse(localStorage.getItem('producto'));

  // mostrar la información del producto si está disponible
  if (producto) {
    container.innerHTML = `
    <div class="bg-white rounded-lg p-6 shadow-lg">
        <h2 class="text-2xl font-bold text-gray-900 text-center">${producto.nombre}</h2>
        <img src="${producto.imagen}" alt="Imagen del producto" class="mx-auto my-4 max-h-[200px] rounded-lg shadow-sm" />
        <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800">Info del Producto</h3>
            <p class="text-gray-600 mt-2">${producto.descripcion}</p>
        </div>
        <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800">Precio</h3>
            <p class="text-lg font-semibold text-purple-600">${producto.precio}€</p>
        </div>
        <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800">Instrucciones</h3>
            <p class="text-gray-600 mt-2">${producto.instrucciones_de_uso}</p>
        </div>
    </div>`;
  } else {
    container.innerText = 'No hay información del producto disponible.';
  }

  // añadir un evento al botón de añadir al carrito
  addToCartBtn.addEventListener('click', onClickAddToCart);

  function onClickAddToCart() {
    window.location.href = 'addedtocart.html';
  }
});

async function fetchCart() {
  try {
    const response = await fetch('/cart');
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return [];
  }
}

async function updateCartOnServer(cart) {
  try {
    await fetch('/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cart),
    });
  } catch (error) {
    console.error('Failed to update cart on the server:', error);
  }
}
