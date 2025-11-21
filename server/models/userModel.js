import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type: String},
    lastname:{type: String},
    email:{type: String},
    password:{type: String},
    rol:{type: Number}
})

const userModel = mongoose.model('Users', UserSchema)

export default userModel