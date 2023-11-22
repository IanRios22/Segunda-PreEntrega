import { Schema, model } from "mongoose";
export const collectionsms = "messages"
const SchemaSMS = new Schema({
    user: String,
    message: String,
},
    { timestamps: true });

export const MessageModel = model(collectionsms, SchemaSMS)
