import agregarAlCarrito, { eliminarDelCarrito, leerCarrito } from "./localStorage.js"
import "./localStorage.js"

const contenedorProductos = document.getElementById('products-grid');



function render() {
    const productos = leerCarrito()
    contenedorProductos.innerHTML = ''
    document.getElementById('elementos').innerHTML = ""
    let idProductos = []

    //! REVISAR AUTOVARIACION DE TOTAL
    let total = 0


    if (productos.length === 0) {
        contenedorProductos.innerHTML = 'Aqui apareceran los productos de su carrito'
    }   

    document.getElementById('info-carrito').style.display.flex
    productos.forEach(producto => {
        total += producto.precio

        if (idProductos.includes(producto.id)) {

            const input = document.getElementById(`cantidad-${producto.id}`)

            input.value = parseInt(input.value) + 1
            document.getElementById(`ce-${producto.id}`).innerHTML = input.value        



        } else {

            //Card
            const artProducto = document.createElement('article'); //Crea un elemento article 
            artProducto.classList.add('product-card'); //agrega la clase correspondiente
            artProducto.dataset.cat = producto.categoria;
            artProducto.dataset.name = producto.nombre;
            artProducto.dataset.desc = producto.descripcion;
            artProducto.dataset.tags = producto.tags.join(' ');

            artProducto.innerHTML = `
                   <a href="/${encodeURIComponent(producto.nombre)}/p/${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="product-info">
                        <h3 class="product-name">${producto.nombre}</h3>
                        <p class="product-desc">${producto.descripcion}</p>
                        <p class="product-price">$${producto.precio.toLocaleString()}</p>
                    </div>
                    </a>
                    <label for"cantidad-${producto.id}">Cantidad:</label>
                    <input type="number" class="cantidad" id="cantidad-${producto.id}" value=1 readonly></input>
                    <button id="more-${producto.id}">+</button>
                    <button id="minus-${producto.id}">-</button>
                    `;
            contenedorProductos.appendChild(artProducto);

            //Registro de producto ya vinculado
            idProductos.push(producto.id);

            //ajuste del precio total
            // total += producto.precio
            document.getElementById('precioTotal').innerText = `$${total}`

            //lista de elementos
            const elemento = document.createElement('p');
            elemento.innerHTML = `${producto.nombre} x <span id="ce-${producto.id}">1</span>`
            document.getElementById('elementos').appendChild(elemento)


            //agregar elemento repetido
            document.getElementById(`more-${producto.id}`).addEventListener('click', () => {
                addCarrito(producto);
                render()
            })
            //quitar elemento repetido
            document.getElementById(`minus-${producto.id}`).addEventListener('click', () => {
                deleteCarrito(producto.id);
                render()
            })
        }



    });
}

function addCarrito(producto) {
    agregarAlCarrito(producto)
}
function deleteCarrito(pid) {
    eliminarDelCarrito(pid)
}

render()