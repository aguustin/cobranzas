import mongoose from "mongoose";
import { ProductI } from "../interfaces/interfaces.ts";

const ProductSchema = new mongoose.Schema<ProductI>({
    storeId: {type: String},
    productId:{type: String},  //es el ID escrito a mano por los usuarios. productMongoId utilizado en los controladores es el _id
    productName:{type: String},
    productPrice:{type: Number},
    productCategory:{type: String},
    sizes:{
        type:[{
            sizeSm:{type: String},
            sizeS:{type: String},
            sizeM:{type: String},
            sizeL:{type: String},
            sizeXL:{type: String},
            sizeXXL:{type: String},
            sizexXXL:{type: String},
        }],
        default:[]
    },
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