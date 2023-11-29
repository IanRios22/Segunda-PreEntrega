import { Schema, model } from "mongoose";
export const collectionsms = "messages"
const SchemaSMS = new Schema({
    user: String,
    message: String,
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const MessageModel = model(collectionsms, SchemaSMS)
