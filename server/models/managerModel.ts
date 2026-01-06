import mongoose from "mongoose";

const ManagerSchema = new mongoose.Schema({
    email:{type: String},
    password:{type: String},
    completeName:{type: String},  
    storesQuantity:{type: Number},
    active:{type: Boolean, default: true},
    payments:[{
        payment: {type: Number},
        paymentDate: {type: Date}
    }],
    language:{type: String},
    subscription:{type: String},
    subscriptionStatus: {type: String},
    subscriptionPlan: {type: Number}, //1. free, 2. simple, 3. plus
    storesLimit:{type: Number}
})

const managerModel = mongoose.model('Manager', ManagerSchema)

export default managerModel