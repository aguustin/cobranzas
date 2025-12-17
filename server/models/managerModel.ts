import mongoose from "mongoose";

const ManagerSchema = new mongoose.Schema({
    email:{type: String},
    password:{type: String},
    completeName:{type: String},
    plan:{type: Number},  //1. free, 2. simple, 3. plus
    storesQuantity:{type: Number},
    active:{type: Boolean, default: true},
    payments:[{
        payment: {type: Number},
        paymentDate: {type: Date}
    }]
})

const managerModel = mongoose.model('Manager', ManagerSchema)

export default managerModel