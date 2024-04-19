document.addEventListener('DOMContentLoaded', async () => {
  const producto = JSON.parse(localStorage.getItem('producto'));
  if ('Accelerometer' in window) {
    let lastX = 0;
    let tiltedRight = false;
    let tiltedLeft = false;
    const threshold = 9;

    try {
      const acc = new Accelerometer({ frequency: 10 });
      acc.onreading = () => {
        if (Math.abs(acc.x - lastX) > threshold) {
          if (acc.x > 9 && !tiltedRight) {
            // izquierda - eliminar
            tiltedRight = true;
            tiltedLeft = false;
            updateProductQuantity('decrease');
            document.body.style.backgroundColor = '#f4cccc';
          } else if (acc.x < -9 && !tiltedLeft) {
            //derecha - agregar
            tiltedLeft = true;
            tiltedRight = false;
            updateProductQuantity('increase');
            document.body.style.backgroundColor = '#e0f0e3';
          }
        } else {
          tiltedRight = false;
          tiltedLeft = false;
        }
        lastX = acc.x;
      };

      acc.start();
    } catch (error) {
      console.error('Accelerometer error:', error);
    }
  }

  async function updateProductQuantity(action) {
    const cart = await fetchCartData();
    const productIndex = cart.findIndex((p) => p.id === producto.id);

    if (productIndex !== -1) {
      if (action === 'increase') {
        cart[productIndex].cantidad += 1;
      } else if (action === 'decrease' && cart[productIndex].cantidad > 1) {
        cart[productIndex].cantidad -= 1;
      }

      updateCartOnServer(cart);
      document.getElementById('current-quantity').textContent =
        cart[productIndex].cantidad;
    }
  }

  async function fetchCartData() {
    const response = await fetch('/cart');
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
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
