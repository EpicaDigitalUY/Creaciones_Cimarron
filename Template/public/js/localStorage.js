const agregarAlCarrito = (producto) => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Función para eliminar un producto del carrito
const eliminarDelCarrito = (productoId) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Encontrar el índice del primer producto que coincida
    const index = carrito.findIndex(producto => producto.id === productoId);

    // Si se encuentra, eliminarlo
    if (index !== -1) {
        carrito.splice(index, 1); // Elimina solo uno
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
};


// Función para leer los datos del carrito
const leerCarrito = () => {
    return JSON.parse(localStorage.getItem('carrito')) || [];
};

export { eliminarDelCarrito, leerCarrito };
export default agregarAlCarrito;
