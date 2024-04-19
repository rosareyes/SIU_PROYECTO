/* 
PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
ROSA REYES - 100434072
DAVID ROLDAN - 100451289
ELENA SERRANO - 100451094
*/

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
          const paymentData = {
            cardholderName: document.getElementById('cardholder-name').value,
            cardNumber: document.getElementById('card-number').value,
            expiryDate: document.getElementById('start-date').value,
            cvv: document.getElementById('issue-number').value,
          };

          fetch('/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to process payment');
              }
              return response.json();
            })
            .then((data) => {
              alert('Pago procesado correctamente');
              window.location.href = 'loading.html';
            })
            .catch((error) => {
              console.error('Error:', error);
              alert('Error procesando el pago');
            });

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
