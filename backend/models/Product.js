import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);