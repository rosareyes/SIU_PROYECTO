if ('Accelerometer' in window) {
  let tiltedRight = false;
  let tiltedLeft = false;
  try {
    const acc = new Accelerometer({ frequency: 10 });
    acc.onreading = () => {
      console.log(acc.x);
      if (acc.x > 9) {
        if (!tiltedRight) {
          tiltedRight = true;
          document.body.style.backgroundColor = 'red';
          navigator.vibrate([500]);
          handleTiltDecreaseQuantity();
        }
      } else if (acc.x < -9) {
        if (!tiltedLeft) {
          tiltedLeft = true;
          document.body.style.backgroundColor = 'green';
          navigator.vibrate([500]);
          handleTiltIncreaseQuantity();
        }
      } else {
        tiltedRight = false;
        tiltedLeft = false;
      }
    };

    acc.start();
  } catch (err) {
    console.log(err);
  }
}

async function updateCartOnServer(updatedCart) {
  try {
    const response = await fetch('/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCart),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Cart updated successfully:', data);
      // Optionally update the UI or alert the user
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Failed to update cart on the server:', error);
  }
}

function handleTiltIncreaseQuantity() {
  // Get the current cart from storage or a global variable
  let cart = getCurrentCartData();
  let productId = getProductIdFromSomewhere(); // Determine how you identify which product to update

  let productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].cantidad += 1; // Increase quantity
    updateCartOnServer(cart);
  }
}

function handleTiltDecreaseQuantity() {
  let cart = getCurrentCartData();
  let productId = getProductIdFromSomewhere();

  let productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex !== -1 && cart[productIndex].cantidad > 1) {
    cart[productIndex].cantidad -= 1; // Decrease quantity but ensure it does not go below 1
    updateCartOnServer(cart);
  }
}
