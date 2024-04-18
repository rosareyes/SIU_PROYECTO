document.addEventListener('DOMContentLoaded', () => {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const container = document.getElementById('product-info-container');
  const producto = JSON.parse(localStorage.getItem('producto'));

  // Display product information if available
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

  // Add event listener for "Add to Cart" button
  addToCartBtn.addEventListener('click', onClickAddToCart);

  // Function to add to cart
  async function onClickAddToCart() {
    let carrito = await fetchCart();
    const existingProductIndex = carrito.findIndex((p) => p.id === producto.id);

    if (existingProductIndex !== -1) {
      carrito[existingProductIndex].cantidad += 1;
    } else {
      producto.cantidad = 1;
      producto.orden = carrito.length; // Añade el atributo 'orden' al producto
      producto.favorito = 'No'; // Añade el atributo 'favorito' al producto
      carrito.push(producto);
    }

    await updateCartOnServer(carrito);
    //window.location.href = 'cart.html'; // Redirect to the cart page
    showPopup(); // Show popup instead of redirecting
  }

  // Accelerometer-based functionality for shaking detection
  setupAccelerometer();
});

// Fetch current cart from the server
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

// Update the cart on the server
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

// Setup accelerometer event if available
function setupAccelerometer() {
  if ('Accelerometer' in window) {
    const acc = new Accelerometer({ frequency: 60 });
    let lastX, lastY, lastZ;
    let shaking = false;
    let timer;

    acc.onreading = () => {
      const deltaX = Math.abs(lastX - acc.x);
      const deltaY = Math.abs(lastY - acc.y);
      const deltaZ = Math.abs(lastZ - acc.z);
      if (isSignificantMotion(deltaX, deltaY, deltaZ)) {
        if (!shaking) {
          console.log('Shake detected');
          shaking = true;
          onClickAddToCart();
          clearTimeout(timer);
        }
      } else {
        if (shaking) {
          shaking = false;
          timer = setTimeout(() => console.log('Shake stopped'), 500);
        }
      }
      [lastX, lastY, lastZ] = [acc.x, acc.y, acc.z];
    };

    acc.start();
  }
}

function isSignificantMotion(deltaX, deltaY, deltaZ) {
  const threshold = 15;
  return (
    (deltaX > threshold && deltaY > threshold) ||
    (deltaX > threshold && deltaZ > threshold) ||
    (deltaY > threshold && deltaZ > threshold)
  );
}

function showPopup() {
  const popup = document.getElementById('popup-notification');
  popup.classList.remove('hidden');
}

function hidePopup() {
  const popup = document.getElementById('popup-notification');
  popup.classList.add('hidden');
}
