# Proyecto Final - Sistemas Interactivos y Ubicuos
<div align="center">
  <img align="center" src='https://github.com/rosareyes/SIU_PROYECTO/assets/63470281/be25f718-6c7f-4a4c-a0e8-e7afeb88d905' height='200px'>
</div>

## Integrantes del Equipo
- Rosa Reyes - 100434072
- David Roldán - 100451289
- Elena Serrano - 100451094

## Nombre del Proyecto
El Corte Americano

## Cómo Ejecutar la App
- Para ejecutar la aplicación, se debe ejecutar el siguiente comando en el root del directorio del proyecto:
  - `npm install`
  - `node index.js`

- Para ver el dashboard del dependiente, se debe ir a la página `/dashboard.html`. Por ejemplo, `localhost:5500/dashboard.html`

- Cuando en las demás páginas se haga una interacción con sockets, apareceran mensajes en el dashboard, como el de pedir ayuda o que el cliente ha hecho un pago.

## Funcionalidades del Proyecto
Este proyecto implementa un sistema de comercio electrónico interactivo y ubicuo que permite a los usuarios:
- Escanear códigos QR para obtener información de productos.
- Añadir productos al carrito de compras mediante la interacción de agitar el móvil o de forma manual.
- Modificar la cantidad de productos en el carrito inclinando el teléfono a la izquierda o derecha.
- Ver y gestionar los productos favoritos (doble click) y su orden (drag and drop) en el carrito.
- Pedir ayuda a través de un botón, que envía una notificación con el nombre del usuario a un dashboard administrativo.
- Pedir ayuda hablando desde el micrófono, diciendo las palabras 'ayuda' o 'ayúdame'. (Desde el inicio o después de haber hecho un pago).
- Realizar el pago mediante una simulación en la página de pago.

## Cambios Respecto al Diseño Original
- **Interacción para Modificar Cantidades**: Originalmente se planeó usar los botones de volumen para añadir o quitar productos del carrito. Sin embargo, se cambió a una interacción más ubicua que es inclinar el teléfono hacia la izquierda o derecha.
- **Funcionalidades Adicionales Implementadas**:
  - Se implementaron todas las funcionalidades planeadas y se añadieron algunas más, como la capacidad de ordenar los productos en el carrito y guardar este orden en el servidor Node.js.
  - Se añadió la funcionalidad de marcar productos como favoritos y una página de favoritos donde se pueden gestionar.
  - Se añadió el botón de ayuda no solo en la pantalla final del checkout, sino también al inicio de la aplicación.
