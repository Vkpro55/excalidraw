import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String
})

export const User = mongoose.model("User", UserSchema);