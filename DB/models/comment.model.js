import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    numberOfLikes: { type: Number, default: 0, min: 0 },
}, { timestamps: true });


export default model('Comment', commentSchema);