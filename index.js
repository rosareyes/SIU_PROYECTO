/**
 * PROYECTO FINAL - SISTEMAS INTERACTIVOS Y UBICUOS
 * ROSA REYES - 100434072
 * DAVID ROLDAN - 100451289
 * ELENA SERRANO - 100451094
 */

const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

/**
 * Middleware para registrar las solicitudes entrantes.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @param {Function} next - La siguiente función de middleware.
 */
app.use((req, res, next) => {
  console.log(`Solicitud entrante para ${req.originalUrl}`);
  next();
});

io.on('connection', (socket) => {
  /**
   * Event listener para el evento 'purchaseCompleted'.
   * @param {Object} data - Los datos de la compra.
   */
  socket.on('purchaseCompleted', (data) => {
    console.log(
      `${data.name} ha realizado esta compra, comienza a preparar su compra`
    );
    io.emit('notifyManager', {
      message: `${data.name} ha realizado esta compra, comienza a preparar su compra`,
      cart: data.cart,
    });
  });

  /**
   * Event listener para el evento 'helpRequested'.
   * @param {Object} data - Los datos de la solicitud de ayuda.
   */
  socket.on('helpRequested', (data) => {
    console.log(`${data.name} solicitó ayuda`);
    io.emit('notifyManager', data);
  });
});

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Servir archivos estáticos desde el directorio 'www'
app.use(express.static('www'));

/**
 * Controlador de ruta para la solicitud GET '/cart'.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
app.get('/cart', async (req, res) => {
  try {
    const data = await fs.promises.readFile('cart.json', 'utf8');
    res.type('json').send(data);
  } catch (error) {
    res.status(500).send('Error al leer cart.json');
  }
});

/**
 * Controlador de ruta para la solicitud POST '/cart/update'.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
app.post('/cart/update', async (req, res) => {
  try {
    await fs.promises.writeFile('cart.json', JSON.stringify(req.body, null, 2));
    res.json({ message: 'Carrito actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
});

/**
 * Controlador de ruta para la solicitud GET '/products'.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
app.get('/products', async (req, res) => {
  try {
    const data = await fs.promises.readFile('data/data.json', 'utf8');
    res.type('json').send(data);
  } catch (error) {
    res.status(500).send('Error al leer products.json');
  }
});

/**
 * Controlador de ruta para la solicitud POST '/payment'.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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

/**
 * Controlador para la solicitud GET '/cliente'.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
app.get('/cliente', async (req, res) => {
  try {
    const data = await fs.promises.readFile('cliente.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).send('Error reading cliente.json');
  }
});

/**
 * Catch-all para rutas no válidas.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
app.all('*', (req, res) => {
  res.status(404).send('Ruta no válida');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
