import mongoose from "mongoose";
import { SellI } from "../interfaces/interfaces.ts";
  
const SellSchema = new mongoose.Schema<SellI>({
    storeId:{type:String},
    sproductId:{type: String},
    sellDate:{type: Date},
    sellUnityPrice:{type: Number, default: 0},
    sellQuantity:{type: Number, default: 0},
    sellSubTotal:{type: Number, default: 0},
    sellTaxes:{type: Number},
    sellTotal:{type: Number, default: 0},
    cupon:{type: Number},
    discount:{type: Number},
    paymentType:{type: String},
    ticketNumber:{type: String},
    ticketEmisionDate:{type: Date},
    storeName:{type:String},
    cashierId:{type: String}
})

SellSchema.index({ storeId: 1, sellDate: 1 }); 
SellSchema.index({ sellDate: 1 });             
SellSchema.index({ storeId: 1, sellQuantity: 1 });

const sellModel = mongoose.model('Sell', SellSchema)
    
export default sellModel