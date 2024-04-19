document.addEventListener('DOMContentLoaded', function () {
  fetchProductsAndDisplayFavorites();

  async function fetchProductsAndDisplayFavorites() {
    try {
      const response = await fetch('/cart'); // Adjust this path to where your products are stored
      const products = await response.json();

      // Filtrar los productos favoritos
      const favorites = products.filter((product) => product.favorito === 'Si');

      const favsContainer = document.getElementById('favs-container');
      favsContainer.innerHTML = '';

      if (favorites.length === 0) {
        favsContainer.innerHTML = '<p>No tienes productos favoritos.</p>';
      } else {
        favorites.forEach((product) => {
          const productElement = document.createElement('div');
          productElement.className = 'p-4 mb-4 shadow rounded bg-white';
          productElement.innerHTML = `
                   <div class="flex items-center justify-center flex-col">
                   <img src="${product.imagen}" alt="${product.nombre}" class="w-32 h-32 object-cover rounded">
                   <h3 class="text-lg font-semibold">${product.nombre}</h3>
                   <p>${product.descripcion}</p>
                   <p class="font-bold">${product.precio} EUR</p>
                   </div>
                    `;
          favsContainer.appendChild(productElement);
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      document.getElementById('favs-container').innerHTML =
        '<p>Error loading favorites.</p>';
    }
  }
});
