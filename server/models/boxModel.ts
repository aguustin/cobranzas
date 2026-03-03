import mongoose from "mongoose";
import { BoxI } from "../interfaces/interfaces.ts";

const BoxSchema = new mongoose.Schema<BoxI>({
    storeId:{type: String},
    cashierId:{type: String},
    boxName:{type: String},
    boxNumber:{type: String},
    location:{type: String},
    paymentTerminal:{type: String},
    isOpen:{type:Boolean},
    boxOpenDate:{type:Date},
    boxCloseDate:{type: Date},
    initialCash:{type: Number, default: 0},
    cashSales:{type: Number, default: 0},
    withdrawals:{type: Number, default: 0},
    expectedCash:{type: Number, default: 0},
    totalMoneyInBox:{type: Number, default: 0},
    maxDiscount:{type: Number},
    printer:{type: String},
    allowRefunds: {type: Boolean},
    allowCashWithdrawal: {type: Boolean},
    requireManagerAuth: {type: Boolean},
    maxTransactionAmount: {type: Number},
    boxDifferenceMoney:{type: Number, default: 0}
})



BoxSchema.index({ storeId: 1, boxOpenDate: 1 });
BoxSchema.index({ storeId: 1});

const boxesModel = mongoose.model("boxesModel", BoxSchema)

export default boxesModel