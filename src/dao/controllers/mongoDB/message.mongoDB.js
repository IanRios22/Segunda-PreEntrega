import { MessageModel } from "../../models/message.model.js";

export default class MessageManager {
    getMessages = async () => {
        try {
            return await MessageModel.find().lean();
        } catch (error) {
            return error;
        }
    }


    createMessage = async (message) => {
        if (message.user.trim() === '' || message.message.trim() === '') {
            // Evitar crear mensajes vacíos
            return null;
        }

        try {
            return await MessageModel.create(message);
        } catch (error) {
            return error;
        }
    }

    deleteAllMessages = async () => {
        try {
            console.log("Deleting all messages...");
            const result = await MessageModel.deleteMany({});
            console.log("Messages deleted:", result);
            return result;
        } catch (error) {
            console.error("Error deleting messages:", error);
            return error;
        }
    }

}

