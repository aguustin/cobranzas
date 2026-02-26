

import mongoose from "mongoose";
import { BoxI, OrderI } from "../interfaces/interfaces.ts";

const OrderSchema = new mongoose.Schema<OrderI>({
    orderId: {type: String},
    paymentId: {type: String},
    paymentMethod: {type: String},
    paymentStatusDetail: {type: String},
    paymentType: { type: String, enum: ["qr", "point", "online", "efective"], required: true},
    paidAt:{type: Date},
    externalReference: {type: String},
    storeId: {type: String},
    storeName: {type: String},
    cashierId: {type: String},
    boxId: {type: String},
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
        productQuantity: { type: Number, required: true},
        productPrice: { type: Number, required: true},
        productTaxe: { type: Number, required: true},
        subTotalEarned: { type: Number, required: true},
        totalEarned: { type: Number, required: true},
        totalDiscount: { type: Number, required: true}
    }],
    storeSubTotal: {type: Number},
    storeTaxes: {type: Number},
    totalToPay: {type: Number},
    status: {type: String, enum: ["pending", "approved", "rejected", "cancelled"], default:"pending"}
})

OrderSchema.index({ orderId: 1});

const orderModel = mongoose.model("orderModel", OrderSchema)

export default orderModel
