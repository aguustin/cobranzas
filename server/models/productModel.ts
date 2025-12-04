import mongoose from "mongoose";
import { ProductI } from "../interfaces/interfaces";

const ProductSchema = new mongoose.Schema<ProductI>({
    storeId: {type: String},
    productId:{type: String},
    productName:{type: String},
    productPrice:{type: Number},
    productCategory:{type: String},
    productColor:{type: String},
    productQuantity:{type: Number},
    productDiscount:{type: Number},
    productTaxe: {type: Number},
    totalSells:{type: Number, default: 0},
    totalTaxes:{type: Number, default: 0},
    subTotalMonthEarned:{type: Number, default: 0},
    totalMonthEarned:{type: Number, default: 0},
    months:{
        type: [{
            monthDate: { type: Date },
            monthMount: { type: Number, default: 0 },
            taxesMonth: { type: Number, default: 0 }
        }],
        default: []
    },
    subTotalEarned:{type: Number, default: 0},
    totalEarned:{type: Number, default: 0},
    active:{type: Boolean, default: true}
})

const productModel = mongoose.model<ProductI>('Product', ProductSchema)

export default productModel