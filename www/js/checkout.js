document.addEventListener('DOMContentLoaded', () => {
  let clientName = 'Un cliente'; // Default name if no data is fetched
  fetchClienteData();
  setupSocket();
  setupHelpButton();
});

function setupHelpButton() {
  const helpButton = document.getElementById('helpButton');
  helpButton.addEventListener('click', function () {
    const name = clientName;
    socket.emit('helpRequested', {
      name: name,
      message: `${name} pidió ayuda`,
    });
  });
}

function fetchClienteData() {
  fetch('/cliente')
    .then((response) => response.json())
    .then((data) => {
      if (data && data.cardholderName) {
        clientName = data.cardholderName; // Store name globally
        displayClientName(data.cardholderName);
        // Fetch the cart details
        fetch('/cart')
          .then((response) => response.json())
          .then((cartData) => {
            // Now emit both the name and the cart details
            socket.emit('purchaseCompleted', {
              name: data.cardholderName,
              cart: cartData,
            });
          })
          .catch((error) => console.error('Error fetching cart:', error));
      }
    })
    .catch((error) => console.error('Error fetching client data:', error));
}

let socket;
function setupSocket() {
  socket = io(); // Connect to the server's socket
}

function displayClientName(name) {
  const messageDiv = document.querySelector('.bg-purple-200');
  const nameElement = document.createElement('p');
  nameElement.textContent = `Pago realizado con éxito, ${name}.`;
  nameElement.className = 'text-xl font-bold';
  messageDiv.insertBefore(nameElement, messageDiv.firstChild);
}
