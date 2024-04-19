if ('Accelerometer' in window) {
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  let lastX = 0,
    lastY = 0,
    lastZ = 0;
  const threshold = 15;
  let shaking = false;
  let timer = null;

  try {
    const acc = new Accelerometer({ frequency: 60 });
    acc.onreading = () => {
      const deltaX = Math.abs(lastX - acc.x);
      const deltaY = Math.abs(lastY - acc.y);
      const deltaZ = Math.abs(lastZ - acc.z);

      if (
        (deltaX > threshold && deltaY > threshold) ||
        (deltaX > threshold && deltaZ > threshold) ||
        (deltaY > threshold && deltaZ > threshold)
      ) {
        if (!shaking) {
          console.log('shake detected');
          shaking = true;
          addToCartBtn.style.backgroundColor = 'red';
          window.location.href = 'addedtocart.html'; // Redirect to the cart page
          clearTimeout(timer);
        }
      } else {
        if (shaking) {
          shaking = false;
          timer = setTimeout(() => {
            console.log('shake stopped');
            addToCartBtn.style.backgroundColor = 'white';
          }, 500);
        }
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    acc.start();
  } catch (error) {
    console.error('Accelerometer error:', error);
  }
} else {
  console.log('Accelerometer not supported');
}
