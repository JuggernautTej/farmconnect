import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: Strinf, required : true, unique: true },
    description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema); 