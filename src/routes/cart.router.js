import { Router } from "express";
import { CartManager } from "../dao/controllers/filesystem/cart.manager.js";
import { __dirname } from "../utils.js";
const router = Router();
const cartManager = new CartManager(__dirname + '/dao/db/cart.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.get('/', async (req, res) => {
    try {
        const allCarts = await cartManager.getCarts();
        res.status(200).json(allCarts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener carritos" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid, 10));

        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: `No existe el carrito con el ID ${cid}` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        // const cid = parseInt(req.params.cid);
        // const pid = parseInt(req.params.pid);
        const { cid, pid } = req.params;
        const cartID = Number(cid);
        const prodID = Number(pid);
        const cart = await cartManager.getCartById(cartID);
        if (!cart) {
            res.status(404).json({ message: "carrito no encontrado." });
        } else {
            await cartManager.saveProductToCart(cartID, prodID)
            res.status(200).json({ message: "Producto agregado al carrito." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error en la solicitud" });
    }
});


export default router;
