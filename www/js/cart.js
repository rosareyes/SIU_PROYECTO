document.addEventListener('DOMContentLoaded', () => {
  fetchCartData();

  async function fetchCartData() {
    const response = await fetch('/cart');
    let carrito = await response.json();

    // Añade el atributo 'orden' a cada producto en el carrito
    carrito.forEach((producto, index) => {
      producto.orden = index;
    });

    const cartContainer = document.getElementById('cart-container');
    if (carrito && carrito.length > 0) {
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
              <p class="text-sm text-gray-600">Cantidad: ${
                producto.cantidad
              }</p>
            </div>
          </div>
          <div>
            <p class="text-lg font-semibold">Subtotal: ${
              producto.precio * producto.cantidad
            }€</p>
          </div>
        `;

        // Añade los atributos de arrastrar y soltar
        productDiv.setAttribute('draggable', true);
        productDiv.setAttribute('id', `product-${producto.id}`);
        productDiv.addEventListener('dragstart', handleDragStart);
        productDiv.addEventListener('dragover', handleDragOver);
        productDiv.addEventListener('drop', handleDrop);

        // Establece el color de fondo para los productos favoritos
        if (producto.favorito === 'Si') {
          productDiv.style.backgroundColor = '#eabef8'; // Cambia el color de fondo a morado
        }

        // Añade el controlador de eventos de doble clic
        productDiv.addEventListener('dblclick', async () => {
          // Cambia el atributo 'favorito' y el color de fondo
          if (producto.favorito === 'No') {
            producto.favorito = 'Si';
            productDiv.style.backgroundColor = '#eabef8'; // Cambia el color de fondo a morado
          } else {
            producto.favorito = 'No';
            productDiv.style.backgroundColor = ''; // Restablece el color de fondo predeterminado
          }

          // Actualiza el carrito en el servidor
          await updateCartOnServer(carrito);
        });

        cartContainer.appendChild(productDiv);
      });
    } else {
      cartContainer.innerText = 'No hay productos en el carrito.';
      cartContainer.className = 'text-center text-gray-500 text-xl';
    }
  }

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.currentTarget.id);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
    const dropTarget = e.target.closest('.mb-4.p-4.border-b');

    // Comprueba si el elemento arrastrado estaba originalmente antes en el DOM
    const wasBefore =
      [...dropTarget.parentNode.children].indexOf(draggedElement) <
      [...dropTarget.parentNode.children].indexOf(dropTarget);

    if (wasBefore) {
      // Si el elemento arrastrado estaba antes, insértalo después
      dropTarget.parentNode.insertBefore(
        draggedElement,
        dropTarget.nextSibling
      );
    } else {
      // Si no, insértalo antes
      dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
    }

    // Obtiene los índices de orden de los productos
    const index1 = [...dropTarget.parentNode.children].indexOf(draggedElement);
    const index2 = [...dropTarget.parentNode.children].indexOf(dropTarget);

    // Intercambia el orden de los productos en el carrito
    intercambiarOrden(carrito, index1, index2);

    // Actualiza el carrito en el servidor
    await updateCartOnServer(carrito);
  }

  function intercambiarOrden(carrito, index1, index2) {
    // Encuentra los productos en el carrito
    const producto1 = carrito.find((producto) => producto.orden === index1);
    const producto2 = carrito.find((producto) => producto.orden === index2);

    // Intercambia sus atributos de orden
    if (producto1 && producto2) {
      const temp = producto1.orden;
      producto1.orden = producto2.orden;
      producto2.orden = temp;
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
});
