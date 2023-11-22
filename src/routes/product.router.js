//trabajamos con router
import { Router } from "express";
const router = new Router();
import { __dirname } from "../utils.js";
import ProductDaoMongoDB from "../dao/controllers/mongoDB/product.manager.mongoDB.js";
const pmDao = new ProductDaoMongoDB();
//Esto era con filesystem pero ahora cambio
//instanciamos mi clase
// import { ProductManager } from "../dao/controllers/filesystem/product.manager.js";
// const productManager = new ProductManager(__dirname + '/dao/db/products.json');


router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await pmDao.getAll();
        if (!limit) res.status(200).json(products);
        else {
            const productsByLimit = await pmDao.getProductsByLimit(limit);
            res.status(200).json(productsByLimit);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await pmDao.getById(Number(id));
        if (!product) res.status(404).json({ message: "product not found" });
        else res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const productCreated = await pmDao.create(req.body);
        socketServer.emit("productos", await pmDao.getAll());
        res.status(200).json(productCreated);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const product = { ...req.body };
        const { id } = req.params;
        const idNumber = Number(id);
        const productOk = await pmDao.getById(idNumber);
        if (!productOk) res.status(404).json({ message: "product not found" });
        else await pmDao.update(product, idNumber);
        res.status(200).json({ message: `product id: ${id} updated` });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const idNumber = Number(id);
        await pmDao.delete(idNumber);
        res.json({ message: `Product id: ${idNumber} deleted` });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

export default router;