import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['female', 'male'],
        default: 'female'
    },
    role: {
        type: String,
        enum: [systemRoles.ADMIN, systemRoles.USER],
        default: systemRoles.USER
    },
    age: {
        type: Number,
        min: 15,
        max: 100
    },
}, { timestamps: true })


const User = model('User', userSchema)

export default User
