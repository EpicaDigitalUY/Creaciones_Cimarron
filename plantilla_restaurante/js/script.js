function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = "flex";
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = "none";
}


// La idea es que no se muestre esa pantalla negra sino que se envie el formulario y se muestre un mensaje de exito
document.getElementById('reserva-form').addEventListener('submit', function (event) {
    document.querySelector('.loaded-response').style.display = 'block'; // Muestra la pantalla negra de carga
    event.preventDefault(); // Evita el envío del formulario por defecto
    const data = new FormData(event.target);
    const dataObject = Object.fromEntries(data.entries());
    fetch(event.target.action, {
        method: event.target.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObject)    
    }).then(response => {
        if (response.ok) {
            event.target.reset();// Reinicia el formulario
            document.querySelector('.loaded-response').style.display = 'none'; // Oculta la pantalla negra de carga
            document.querySelector('.success').style.display = 'block'; // Muestra el mensaje de éxito
        } else {
            document.querySelector('.loaded-response').style.display = 'none'; // Oculta la pantalla negra de carga
            document.querySelector('.error').style.display = 'block'; // Muestra el mensaje de error
        }   
    }).catch(error => {
        document.querySelector('.loaded-response').style.display = 'none'; // Oculta la pantalla negra de carga
        document.querySelector('.error').style.display = 'block'; // Muestra el mensaje de error
    });
});