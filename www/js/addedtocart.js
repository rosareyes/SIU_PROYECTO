document.addEventListener('DOMContentLoaded', async () => {

    const producto = JSON.parse(localStorage.getItem('producto'));

  
    // Function to add to cart
    async function onClickAddToCart() {
      let carrito = await fetchCart();
      const existingProductIndex = carrito.findIndex((p) => p.id === producto.id);

      if (existingProductIndex !== -1) {
        carrito[existingProductIndex].cantidad += 1;
        document.getElementById('current-quantity').textContent = carrito[existingProductIndex].cantidad;

      } else {
        producto.cantidad = 1;
        producto.orden = carrito.length; // Añade el atributo 'orden' al producto
        producto.favorito = 'No'; // Añade el atributo 'favorito' al producto
        carrito.push(producto);
        document.getElementById('current-quantity').textContent = carrito[0].cantidad;

      }
  
      await updateCartOnServer(carrito);

     // showPopup(); // Show popup instead of redirecting
    }

    // Call onClickAddToCart when the page loads
    try {
        await onClickAddToCart();

        console.log('Producto:', producto);
    } catch (error) {
        console.error('Error while adding to cart:', error);
    }

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
