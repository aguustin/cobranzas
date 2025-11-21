import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productId:{type: String},
    productName:{type: String},
    productPrice:{type: Number},
    productCategory:{type: Number},
    productColor:{type: String},
    productQuantity:{type: Number},
    sells:[{
        sellDate:{type: Date},
        sellUnityPrice:{type: Number},
        sellSubTotal:{type: Number},
        sellTaxes:{type: Number},
        sellTotal:{type: Number},
        cupon:{type: Number},
        discount:{type: Number},
        paymentType:{type: Number},
        ticketNumber:{type: Number},
        ticketEmisionDate:{type: Date}
    }],
    totalSells:{type: Number},
    totalTaxes:{type: Number},
    subTotalMonthEarned:{type: Number},
    totalMonthEarned:{type: Number},
    subTotalEarned:{type: Number},
    totalEarned:{type: Number}
})

const productModel = mongoose.model('Product', ProductSchema)

export default productModel