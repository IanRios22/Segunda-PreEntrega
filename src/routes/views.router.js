import { Router } from "express";
//import { ProductManager } from "../dao/controllers/filesystem/product.manager.js";
import ProductDaoMongoDB from "../dao/controllers/mongoDB/product.manager.mongoDB.js";
import { __dirname } from "../utils.js";

const prodMan = new ProductDaoMongoDB(__dirname + '/dao/db/products.json');
const routerView = new Router();

routerView.get('/', async (req, res) => {
    const listProd = await prodMan.getProductsView();
    res.render("home", { listProd });
})

routerView.get('/realtimeproducts', async (req, res) => {
    res.render("realtimeproducts")
});

routerView.get("/chat", (req, res) => {
    res.render("chat")
})

export default routerView;