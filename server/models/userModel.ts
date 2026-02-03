import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    storeId:{type: String},
    fullName:{type: String},
    username:{type: String},
    userpassword:{type: String},
    userDni:{type: Number},
    UserDate:{type: Date},
    userPhoto:{type: String},
    userRole:{type: String},
    isActive:{type: Boolean, default: true},
    productsSelled:[{
        boxId:{type: String},
        productId:{type: String},
        productName:{type: String},
        quantity:{type: Number},
        price:{type: Number},
        selledDate:{type: Date},
        totalEarned:{type: Number}
    }]
})

const UserModel = mongoose.model('UserModel', UserSchema)

export default UserModel