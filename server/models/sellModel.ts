import mongoose from "mongoose";
  
const SellSchema = new mongoose.Schema({
    sproductId:{type: String},
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
})

const sellModel = mongoose.model('Sell', SellSchema)
    
export default sellModel