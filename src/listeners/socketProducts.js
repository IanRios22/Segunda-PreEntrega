// import { ProductManager } from "../dao/controllers/filesystem/product.manager.js";
import ProductDaoMongoDB from "../dao/controllers/mongoDB/product.manager.mongoDB.js";
import { __dirname } from "../utils.js";
const prodMan = new ProductDaoMongoDB();
const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id)
        const listadeproductos = await prodMan.getProductsView()
        //mostramos todos los productos
        socketServer.emit("sendProducts", listadeproductos)

        //Con esto agregamos los productos
        socket.on("addProduct", async (obj) => {
            await prodMan.addProduct(obj)
            //mostramos todos los productos
            const listadeproductos = await prodMan.getProductsView()
            socketServer.emit("sendProducts", listadeproductos)
        })

        //Seccion para eliminar un producto segun su id
        socket.on("deleteProduct", async (id) => {
            await prodMan.delete(id)
            //mostramos todos los productos
            const listadeproductos = await prodMan.getProductsView()
            socketServer.emit("sendProducts", listadeproductos)
        })

    })
};

export default socketProducts;