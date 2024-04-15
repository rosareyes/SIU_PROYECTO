document.addEventListener('DOMContentLoaded', () => {
  // una vez el DOM este cargado se ejecuta el script
  const producto = JSON.parse(localStorage.getItem('producto'));
  if (producto) {
    const container = document.getElementById('product-info-container');
    container.innerHTML = `
    <div class="bg-white rounded-lg text-left">
    <h2 class="text-xl font-bold text-center">${producto.nombre}</h2>
    <img src="${producto.imagen}" alt="Imagen del producto" class="mx-auto my-4 max-h-[200px] rounded" />
    <div class="my-4">
        <h3 class="text-lg font-semibold">Info del Producto</h3>
        <p>${producto.descripcion}</p>
    </div>
    <div class="my-4">
        <h3 class="text-lg font-semibold">Precio</h3>
        <p class="font-semibold">${producto.precio}€</p>
    </div>
    <div class="my-4">
        <h3 class="text-lg font-semibold">Video</h3>
        <a href="${producto.video_url}" target="_blank" class="text-blue-500 hover:text-blue-700">Ver Video</a>
    </div>
    <div class="my-4">
        <h3 class="text-lg font-semibold">Instrucciones</h3>
        <p>${producto.instrucciones_de_uso}</p>
    </div>
   
</div>
        `;
  } else {
    document.getElementById('product-info-container').innerText =
      'No hay información del producto disponible.';
  }
});
