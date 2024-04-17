// https://github.com/mebjas/html5-qrcode?tab=readme-ov-file

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

var html5QrcodeScanner = new Html5QrcodeScanner('reader', {
  fps: 10,
  qrbox: 250,
});
html5QrcodeScanner.render(onScanSuccess);

function displayProductInfo(producto) {
  localStorage.setItem('producto', JSON.stringify(producto));
  window.location.href = '/product-info.html'; // Redirecciona a la página de info
}
