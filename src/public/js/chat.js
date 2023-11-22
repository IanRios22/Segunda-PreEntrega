const socketClient = io()
const nombreUsuario = document.getElementById("nombreusuario")
const formulario = document.getElementById("formulario")
const inputmensaje = document.getElementById("mensaje")
const chat = document.getElementById("chat")
const actions = document.getElementById("actions");
let usuario = null

if (!usuario) {
    Swal.fire({
        title: "Bienvenido al chat virtual",
        text: "Ingrese su Usuario",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "Necesitas ingresar tu Usuario"
            }
        }
    })
        .then(username => {
            usuario = username.value
            nombreUsuario.innerHTML = usuario
            socketClient.emit("nuevousuario", usuario)
        })
}

function scrollToBottom() {
    const chatContainer = document.getElementById("chat-messages");
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

formulario.onsubmit = (e) => {
    e.preventDefault()
    const info = {
        user: usuario,
        message: inputmensaje.value
    }
    console.log(info)
    socketClient.emit("mensaje", info)
    inputmensaje.value = " "
    scrollToBottom()
}

socketClient.on("chat", mensajes => {

    const chatRender = mensajes.map(mensaje => {
        const DateCreation = new Date(mensaje.createdAt);
        const opcionesHora = { hour: '2-digit', minute: '2-digit' };
        const horaFormateada = DateCreation.toLocaleTimeString(undefined, opcionesHora);
        return `<p class="message-container"><strong>${horaFormateada}</strong> - <strong>${mensaje.user}</strong>: ${mensaje.message}</p>`;
    }).join("");
    chat.innerHTML = chatRender;
});

//toastify
socketClient.on("broadcast", usuario => {
    Toastify({
        text: `Ingreso ${usuario} al chat`,
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)"
        }
    }).showToast()
})


// Botón "Vaciar Chat"
document.getElementById("clearChat").addEventListener("click", () => {
    // Borrar el contenido del chat en el cliente
    document.getElementById("chat").textContent = "";

    // Emitir el evento "clearchat" al servidor usando socketClient
    socketClient.emit("clearchat");
});



