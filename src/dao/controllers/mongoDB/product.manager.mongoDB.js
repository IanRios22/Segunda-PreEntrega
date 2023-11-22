import { productModel } from "../../models/product.model.js";

export default class ProductDaoMongoDB {
    async getAll() {
        try {
            const response = await productModel.find({}).lean();
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getProductsView() {
        try {
            return await productModel.find().lean();
        } catch (err) {
            return err
        }
    };

    async getById(id) {
        try {
            const response = await productModel.findById(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async create(obj) {
        try {
            const response = await productModel.create(obj);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj) {
        try {
            const response = await productModel.findByIdAndUpdate(id, obj, {
                new: true,
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id) {
        try {
            const response = await productModel.findByIdAndDelete(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}