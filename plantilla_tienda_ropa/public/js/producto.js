// En caso de escalar:
//* Seleccionar producto desde el servidor.
//* Aplicar solo renderizacion y funcionalidad de add-carrito mediante document.getElement

import  "./localStorage.js"
import agregarAlCarrito from "./localStorage.js";

const urlParts = window.location.pathname.split('/');
const productoId = parseInt(urlParts[urlParts.length - 1], 10);





fetch('/json/productos.json')
    .then(res => res.json())
    .then(productos => {
        const producto = productos.find(p => p.id === productoId);

        const contenedor = document.getElementById('producto-detalle');

        if (!producto) {
            contenedor.innerHTML = '<p>Producto no encontrado.</p>';
            return;
        }
        contenedor.innerHTML = `
          <div class="image-container">
            <img src="/${producto.imagen}" alt="${producto.nombre}" />
          </div>
          <div class="info-prod">

          <div class="categorias">
            ${producto.tags.map((m) => `<div class="tag">${m}</div>`).join('')}
          </div>

          <h2>${producto.nombre}</h2>
          <p>${producto.descripcion}</p>
          <p class="precio">$${(producto.precio)}</p>

          <button class="buy">Comprar ahora</button>
          <button class="carrito" id="add-carr-${producto.id}">Añadir al carrito</button>
          </div>
        `;

        document.getElementById(`add-carr-${producto.id}`).addEventListener('click', () => {
            addCarrito(producto);
        })
    })
    .catch(() => {
        document.getElementById('producto-detalle').innerHTML = '<p>Error al cargar los productos.</p>';
    });


function addCarrito(producto) {
    agregarAlCarrito(producto)
    alert("Agregado con exito")
    window.location.href = "/carrito"
}