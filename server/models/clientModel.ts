import mongoose from "mongoose";
import { ClientI } from "../interfaces/interfaces.ts";
  
const ClientSchema = new mongoose.Schema<ClientI>({
    storeId: {type: String},
    clientName:{type: String},
    phone:{type: Number},
    email:{type: String},
    clientProducts:[{
        clientProductName:{type: Number, default: 0},
        clientProductBrand:{type: String, default: ''},
        clientPaymentType:{type: Number, default: 0}
    }],
    clientProductQuantity:{type: Number, default: 0},
    totalSpent:{type: Number, default: 0},
    giftCard:{type: Number},
    active:{type: Boolean}
})

ClientSchema.index({ storeId: 1, phone: 1 }, { unique: true });

const clientModel = mongoose.model('Client', ClientSchema)
    
export default clientModel