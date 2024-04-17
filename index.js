/* 
LAB 2: API FETCH
ROSA REYES - 100434072
*/

const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3006;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from 'www' directory
app.use(express.static('www'));

app.get('/cart', async (req, res) => {
  try {
    const data = await fs.promises.readFile('cart.json', 'utf8');
    res.type('json').send(data);
  } catch (error) {
    res.status(500).send('Error reading cart.json');
  }
});

app.post('/cart/update', async (req, res) => {
  try {
    await fs.promises.writeFile('cart.json', JSON.stringify(req.body, null, 2));
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
});
app.get('/products', async (req, res) => {
  try {
    const data = await fs.promises.readFile('data/data.json', 'utf8');
    res.type('json').send(data);
  } catch (error) {
    res.status(500).send('Error reading products.json');
  }
});

// Catch-all for non-existent routes
app.all('*', (req, res) => {
  res.status(404).send('Ruta no válida');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
