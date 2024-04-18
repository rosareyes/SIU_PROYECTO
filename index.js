/* 
LAB 2: API FETCH
ROSA REYES - 100434072
*/

const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('purchaseCompleted', (data) => {
    console.log(
      `${data.name} ha hecho esta compra, empieza a preparar su compra`
    );
    io.emit('notifyManager', {
      message: `${data.name} ha hecho esta compra, empieza a preparar su compra`,
      cart: data.cart,
    });
  });
  socket.on('helpRequested', (data) => {
    console.log(`${data.name} pidió ayuda`);
    io.emit('notifyManager', data);
  });
});

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

app.post('/payment', async (req, res) => {
  try {
    const paymentInfo = req.body;
    await fs.promises.writeFile(
      'cliente.json',
      JSON.stringify(paymentInfo, null, 2)
    );
    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to process payment', error: error.message });
  }
});

app.get('/cliente', async (req, res) => {
  try {
    const data = await fs.promises.readFile('cliente.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).send('Error reading cliente.json');
  }
});

// Catch-all for non-existent routes
app.all('*', (req, res) => {
  res.status(404).send('Ruta no válida');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
