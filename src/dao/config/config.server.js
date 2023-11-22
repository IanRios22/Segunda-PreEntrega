import mongoose from "mongoose";
// const MONGOURL = "mongodb+srv://ian-admin:admin@cluster1.9ex9tkc.mongodb.net/ecommerce?retryWrites=true&w=majority" //mongoATLAS
const URL = "mongodb://127.0.0.1:27017/ecommerce" //LOCALHOST 

const connectedDB = () => {
    try {
        mongoose.connect(URL);
        console.log("Conectado al DB ecommerce");
    } catch (error) {
        console.log(error);
    }
}

export default connectedDB;