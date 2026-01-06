import mongoose from "mongoose";
import { SellI } from "../interfaces/interfaces.ts";
  
const SellSchema = new mongoose.Schema<SellI>({
    storeId:{type:String},
    sproductId:{type: String},
    sellDate:{type: Date},
    sellUnityPrice:{type: Number},
    sellQuantity:{type: Number},
    sellSubTotal:{type: Number},
    sellTaxes:{type: Number},
    sellTotal:{type: Number},
    cupon:{type: Number},
    discount:{type: Number},
    paymentType:{type: Number},
    ticketNumber:{type: String},
    ticketEmisionDate:{type: Date},
    storeName:{type:String},
    userAtm:{type: String}
})

const sellModel = mongoose.model('Sell', SellSchema)
    
export default sellModel