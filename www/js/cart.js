let carrito = []; // Global carrito variable

document.addEventListener('DOMContentLoaded', () => {
  fetchCartData();

  async function fetchCartData() {
    try {
      const response = await fetch('/cart');
      carrito = await response.json(); // Assign response to global carrito

      // Sort the carrito array based on the 'orden' attribute
      carrito.sort((a, b) => a.orden - b.orden);

      updateCartDisplay(); // Populate the cart display after fetching and sorting
    } catch (error) {
      console.error('Error fetching cart data:', error);
      carrito = []; // Ensure carrito is empty if fetch fails
    }
  }

  function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Clear previous contents

    if (carrito.length > 0) {
      carrito.forEach((producto) => {
        const productDiv = createProductDiv(producto);
        cartContainer.appendChild(productDiv);
      });
    } else {
      cartContainer.innerText = 'No hay productos en el carrito.';
      cartContainer.className = 'text-center text-gray-500 text-xl';
    }
  }

  function createProductDiv(producto) {
    const productDiv = document.createElement('div');
    productDiv.className = 'mb-4 p-4 border-b';
    productDiv.setAttribute('id', `product-${producto.id}`);
    productDiv.setAttribute('draggable', 'true');
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

    addDragAndDropHandlers(productDiv);
    return productDiv;
  }

  function addDragAndDropHandlers(div) {
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
  }
});

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.currentTarget.id);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(draggedId);
  const dropTarget = e.target.closest('.mb-4.p-4.border-b');

  // Reorder the DOM elements
  const wasBefore =
    [...dropTarget.parentNode.children].indexOf(draggedElement) <
    [...dropTarget.parentNode.children].indexOf(dropTarget);
  if (wasBefore) {
    dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
  } else {
    dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
  }

  // Update the order based on DOM
  actualizarOrdenCarrito();
}

function actualizarOrdenCarrito() {
  const cartContainer = document.getElementById('cart-container');
  const productDivs = cartContainer.querySelectorAll('.mb-4.p-4.border-b');
  productDivs.forEach((div, index) => {
    const productId = div.getAttribute('id').replace('product-', '');
    const product = carrito.find(
      (p) => `product-${p.id}` === div.getAttribute('id')
    );
    if (product) {
      product.orden = index;
    }
  });

  // Update the global carrito
  updateCartOnServer(carrito);
}

async function updateCartOnServer(cart) {
  try {
    const response = await fetch('/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cart),
    });
    if (!response.ok) {
      throw new Error('Failed to update the cart');
    }
    console.log('Cart updated successfully');
  } catch (error) {
    console.error('Failed to update cart on the server:', error);
  }
}
