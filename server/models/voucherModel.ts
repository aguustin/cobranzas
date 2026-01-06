import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
    voucherNumber:{type: String},
    storeId:{type: String},
    storeName:{type: String},
    voucherDate:{type: Date},
    userAtm:{type: String},
    products:[{
        productName:{type: String},
        quantity:{type: Number},
        price:{type: Number}
    }],
    subTotalEarned:{type: Number, default: 0},
    paymentMethod:{type: Number},
    status:{type: Number},
    reference:{type: Number}
})

const voucherModel = mongoose.model('Voucher', VoucherSchema)

export default voucherModel