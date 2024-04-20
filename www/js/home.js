/* 
PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
ROSA REYES - 100434072
DAVID ROLDAN - 100451289
ELENA SERRANO - 100451094
*/

// https://github.com/mebjas/html5-qrcode?tab=readme-ov-file

let socket;
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('clientName');
  clientName = nameInput.value.trim() || 'Un cliente';

  nameInput.addEventListener('input', () => {
    clientName = nameInput.value.trim() || 'Un cliente';
    console.log('Name updated to:', clientName);
  });

  var html5QrcodeScanner = new Html5QrcodeScanner('reader', {
    fps: 10,
    qrbox: 250,
  });
  html5QrcodeScanner.render(onScanSuccess);
  setupSocket();
  setupHelpButton();
});

function setupSocket() {
  socket = io(); // Connect to the server's socket
}

function setupHelpButton() {
  const helpButton = document.getElementById('helpButton');
  helpButton.addEventListener('click', function () {
    const nameInput = document.getElementById('clientName');
    const name = nameInput.value.trim() || 'Un cliente';
    socket.emit('helpRequested', {
      name: name,
      message: `${name} pidió ayuda`,
    });
  });
}

async function fetchProductInfo(productId) {
  try {
    const response = await fetch('/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const productos = await response.json();
    console.log('productos', productos);

    const producto = productos['productos'].find((p) => p.id === productId);
    if (producto) {
      displayProductInfo(producto);
    } else {
      displayProductInfo('');
      console.error('Producto no encontrado');
    }
  } catch (e) {
    console.error('Error al cargar los datos del producto:', e);
  }
}

function onScanSuccess(decodedText, decodedResult) {
  console.log(`Code matched = ${decodedText}`, decodedResult);
  fetchProductInfo(decodedText);
}

function displayProductInfo(producto) {
  localStorage.setItem('producto', JSON.stringify(producto));
  window.location.href = '/product-info.html'; // Redirecciona a la página de info
}
