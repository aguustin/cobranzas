import mongoose from "mongoose";

const ManagerSchema = new mongoose.Schema({
    email:{type: String},
    password:{type: String},
    username:{type: String},  
    storesQuantity:{type: Number},
    active:{type: Boolean, default: true},
    payments:[{
        payment: {type: Number},
        paymentDate: {type: Date}
    }],
    paymentAccounts: {
        paypal: {
            merchantId: String,
            accessToken: String,
            refreshToken: String,
            connected: { type: Boolean, default: false }
        },
        mercadopago: {
            userId: String,
            accessToken: String,
            refreshToken: String,
            connected: { type: Boolean, default: false }
        },
        stripe: {
            accountId: String,
            connected: { type: Boolean, default: false }
        }

    },
    language:{type: String},
    subscription:{type: String},
    subscriptionStatus: {type: String},
    subscriptionPlan: {type: Number}, //1. free, 2. simple, 3. plus
    storesLimit:{type: Number}
})

const managerModel = mongoose.model('Manager', ManagerSchema)

export default managerModel