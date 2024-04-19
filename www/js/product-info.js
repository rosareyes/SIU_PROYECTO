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
      <div class="bg-white rounded-lg text-left">
        <h2 class="text-xl font-bold text-center">${producto.nombre}</h2>
        <img src="${producto.imagen}" alt="Imagen del producto" class="mx-auto my-4 max-h-[200px] rounded" />
        <div class="my-4">
          <h3 class="text-lg font-semibold">Info del Producto</h3>
          <p>${producto.descripcion}</p>
        </div>
        <div class="my-4">
          <h3 class="text-lg font-semibold">Precio</h3>
          <p class="font-semibold">${producto.precio}€</p>
        </div>
        <div class="my-4">
          <h3 class="text-lg font-semibold">Video</h3>
          <a href="${producto.video_url}" target="_blank" class="text-blue-500 hover:text-blue-700">Ver Video</a>
        </div>
        <div class="my-4">
          <h3 class="text-lg font-semibold">Instrucciones</h3>
          <p>${producto.instrucciones_de_uso}</p>
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
