import MessageManager from "../dao/controllers/mongoDB/message.mongoDB.js";

const smsDB = new MessageManager()

const socketChat = (socketServer) => {

    socketServer.on('connection', async (socket) => {
        console.log('🟢 ¡New connection!', socket.id);

        socket.on("mensaje", async (info) => {
            await smsDB.createMessage(info);
            // Emitir el mensaje a todos los clientes conectados
            socketServer.emit("chat", await smsDB.getMessages());

        })
        socket.on("clearchat", async () => {
            // Borrar todos los mensajes utilizando el MessagesManager
            await smsDB.deleteAllMessages();

        });

        socket.on("nuevousuario", (usuario) => {
            socket.broadcast.emit("broadcast", usuario);

        })

    })


}

export default socketChat