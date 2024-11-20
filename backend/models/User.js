import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, reuired: true },
    isAdmin: { type: Boolean, default: false },
    cart: [
        {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
    },
],
});