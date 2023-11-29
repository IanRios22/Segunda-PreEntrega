import { Router } from "express";
//import { CartManager } from "../dao/controllers/filesystem/cart.manager.js";
//import { __dirname } from "../utils.js";
const router = Router();
//const cartManager = new CartManager(__dirname + '/dao/db/cart.json');
import CartDaoMongo from "../dao/controllers/mongoDB/cart.mongoose.js"
import ProductDaoMongoDB from "../dao/controllers/mongoDB/product.manager.mongoDB.js"

const cm = new CartDaoMongo()
const pm = new ProductDaoMongoDB()

// ENDPOINT Auxiliar para corroborar todos los carritos 
router.get("/", async (req, res) => {
    const carrito = await cm.getCarts()
    res.json({ carrito })
})
// ENDPOINT Que devuelve un carrito
router.get("/:cid", async (req, res) => {
    const { cid } = req.params
    const carritofound = await cm.getCartById(cid)
    res.json({ status: "success", carritofound })
})
router.post("/", async (req, res) => {
    try {
        const createcart = await cm.addCart();
        res.status(200).send({ status: "success", createcart })
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
})

// ENDPOINT para colocar la cantidad de un producto


router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const checkIdProduct = await pm.getProductById(pid);
        if (!checkIdProduct) {
            return res.status(404).send({ message: `Product with ID: ${pid} not found` });
        }

        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
        }

        const result = await cm.addProductInCart(cid, { _id: pid, quantity: quantity });
        console.log(result);
        return res.status(200).send({
            message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
            cart: result,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send({ message: "An error occurred while processing the request" });
    }
});


// ENDPOINT que actualiza la lista de productos en el carrito
// Cambios en el código del servidor
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar si la cantidad es un número positivo
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).send({ status: 'error', message: 'Invalid quantity value' });
        }

        // Verificar si el carrito con el ID cid existe
        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` });
        }

        // Verificar si el producto con el ID pid existe
        const checkIdProduct = await pm.getProductById(pid);
        if (!checkIdProduct) {
            return res.status(404).send({ status: 'error', message: `Product with ID: ${pid} not found` });
        }

        // Actualizar el carrito en la base de datos con la cantidad actualizada
        const cart = await cm.updateProductQuantityInCart(cid, pid, quantity);
        return res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 'error', message: 'An error occurred while processing the request' });
    }
});




// ENDPOINT para eliminar un producto dado de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        // Extraer los parámetros de la URL: cid (ID del carrito) y pid (ID del producto)
        const { cid, pid } = req.params;

        // Verificar si el producto con el ID pid existe
        const checkIdProduct = await pm.getProductById(pid);
        if (!checkIdProduct) {
            return res.status(404).send({ status: 'error', message: `Product with ID: ${pid} not found` });
        }

        // Verificar si el carrito con el ID cid existe
        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({ status: 'error', message: `Cart with ID: ${cid} not found` });
        }

        // Buscar el índice del producto en la lista de productos del carrito
        const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid);
        if (findProductIndex === -1) {
            return res.status(404).send({ status: 'error', message: `Product with ID: ${pid} not found in cart` });
        }

        // Eliminar el producto de la lista de productos del carrito
        checkIdCart.products.splice(findProductIndex, 1);

        // Actualizar el carrito en la base de datos sin el producto eliminado
        const updatedCart = await cm.deleteProductInCart(cid, checkIdCart.products);

        return res.status(200).send({ status: 'success', message: `Deleted product with ID: ${pid}`, cart: updatedCart });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 'error', message: 'An error occurred while processing the request' });
    }
});


// ENDPOINT que elimina todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cm.getCartById(cid);

        if (!cart) {
            return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
        }

        if (cart.products.length === 0) {
            return res.status(404).send({ message: 'The cart is already empty' });
        }

        // Vaciar el carrito estableciendo la propiedad 'products' como un arreglo vacío.
        cart.products = [];

        await cm.updateProductsInCart(cid, cart.products);

        return res.status(200).send({
            status: 'success',
            message: `The cart with ID: ${cid} was emptied correctly`,
            cart: cart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'An error occurred while processing the request' });
    }
});


export default router;
