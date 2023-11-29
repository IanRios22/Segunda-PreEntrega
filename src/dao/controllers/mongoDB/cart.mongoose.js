import { cartModel } from "../../models/carts.model.js";

export default class CartDaoMongo {
    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };


    getCartById = async (cartId) => {

        try {
            const cart = await cartModel.findById(cartId)

            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            throw err;;
        }
    };


    addCart = async (products) => {
        try {
            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }

            const cart = await cartModel.create(cartData);
            return cart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            throw err;;
        }
    };


    addProductInCart = async (cid, obj) => {
        try {
            const filter = { _id: cid, "products._id": obj._id };
            const cart = await cartModel.findById(cid);
            const findProduct = cart.products.some((product) => product._id.toString() === obj._id);

            if (findProduct) {
                const update = { $inc: { "products.$.quantity": obj.quantity } };
                await cartModel.updateOne(filter, update);
            } else {
                const update = { $push: { products: { _id: obj._id, quantity: obj.quantity } } };
                await cartModel.updateOne({ _id: cid }, update);
            }

            return await cartModel.findById(cid);
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err.message);
            throw err;;
        }
    };
    deleteProductInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            throw err;
        }

    }
    updateProductQuantityInCart = async (cid, pid, quantity) => {
        try {
            const filter = { _id: cid, "products._id": pid };
            const cart = await cartModel.findById(cid);
            const findProduct = cart.products.some((product) => product._id.toString() === pid);

            if (findProduct) {
                const update = { $inc: { "products.$.quantity": quantity } };
                await cartModel.updateOne(filter, update);
            } else {
                // Puedes manejar el escenario de error si el producto no existe en el carrito
                throw new Error(`Product with ID: ${pid} not found in cart`);
            }

            return await cartModel.findById(cid);
        } catch (err) {
            console.error('Error updating product quantity in cart:', err.message);
            throw err;
        }
    };

    updateProductsInCart = async (cid, products) => {
        await cartModel.updateOne({ _id: cid }, { products });
        return await cartModel.findOne({ _id: cid });
    }
}