/* 
PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
ROSA REYES - 100434072
DAVID ROLDAN - 100451289
ELENA SERRANO - 100451094
*/

document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to Socket.IO server
  const notificationElement = document.getElementById('notification');

  socket.on('notifyManager', (data) => {
    // Create a container for the new message
    const messageContainer = document.createElement('div');
    messageContainer.className = 'mt-2 p-4 bg-gray-100 rounded-lg shadow';

    // Add the primary message text
    const messageText = document.createElement('p');
    messageText.className = 'text-lg font-semibold';
    messageText.textContent = data.message;
    messageContainer.appendChild(messageText);

    // Check if there's cart data and append it
    if (data.cart && data.cart.length > 0) {
      const cartSummary = document.createElement('div');
      cartSummary.className = 'mt-4 p-4 bg-white rounded shadow-lg';
      cartSummary.innerHTML =
        '<h3 class="text-lg font-bold text-purple-800 underline mb-2">Resumen:</h3>';
      data.cart.forEach((item) => {
        const itemDetail = document.createElement('p');
        itemDetail.className = 'text-gray-600';
        itemDetail.textContent = `${item.nombre} - Cantidad: ${item.cantidad}`;
        cartSummary.appendChild(itemDetail);
      });
      messageContainer.appendChild(cartSummary);
    }

    // Append this new message container to the notification element
    notificationElement.prepend(messageContainer);
  });
});
