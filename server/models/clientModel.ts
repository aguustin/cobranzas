import mongoose from "mongoose";
import { ClientI } from "../interfaces/interfaces.ts";
  
const ClientSchema = new mongoose.Schema<ClientI>({
    storeId: {type: String},
    clientName:{type: String},
    phone:{type: Date},
    email:{type: String},
    clientProducts:[{
        clientProductName:{type: Number},
        clientProductBrand:{type: String},
        clientProductQuantity:{type: Number},
        totalSpent:{type: Number},
        clientPaymentType:{type: Number}
    }],
    giftCard:{type: Number},
    active:{type: Boolean}
})

const clientModel = mongoose.model('Client', ClientSchema)
    
export default clientModel