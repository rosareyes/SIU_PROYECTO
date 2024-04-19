/* 
PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
ROSA REYES - 100434072
DAVID ROLDAN - 100451289
ELENA SERRANO - 100451094
*/

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  if (form) {
    form.addEventListener('submit', submitPayment);
  }
});

function submitPayment(event) {
  event.preventDefault(); // Previene la recarga de la página

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
      window.location.href = 'loading.html'; // Redirecciona a la página de confirmación
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error procesando el pago');
    });
}
