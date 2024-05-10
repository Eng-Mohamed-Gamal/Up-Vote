import { Schema, model } from "mongoose";


const productSchema = new Schema({
    title: { type: String, required: true },
    caption: { type: String, default: 'no caption' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    numberOfLikes: { type: Number, default: 0, min: 0 },
    Images: [{
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
        folderId: { type: String, required: true, unique: true }
    }]
}, { timestamps: true });

export default model('Product', productSchema);
