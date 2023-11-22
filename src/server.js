//creacion del servidor 
import express from "express";
const server = express();
import morgan from 'morgan';
import routerP from "./routes/product.router.js";
import routerC from "./routes/cart.router.js";
import routerView from "./routes/views.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import socketProd from "./listeners/socketProducts.js";
import connectedDB from "./dao/config/config.server.js";
import socketChat from "./listeners/socketChats.js";


const port = 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(__dirname + '/public'));
server.engine("handlebars", handlebars.engine());
server.set("views", __dirname + '/views');
server.set("view engine", "handlebars");
server.use(morgan('dev'));
//Para usar las rutas
server.use('/api/products', routerP)
server.use('/api/carts', routerC);
server.use('/', routerView);

connectedDB();

const httpServer = server.listen(port, () => {
    try {
        console.log(`🚀 Servidor escuchando en el puerto ${port} accediendo a: `);
        console.log(`\t1)http://localhost:${port}/api/products`);
        console.log(`\t2)http://localhost:${port}/api/carts`);
    } catch (error) {
        console.log(error.message);
    };
})

const socketServer = new Server(httpServer)

socketProd(socketServer);
socketChat(socketServer);





