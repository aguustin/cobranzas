import mongoose from "mongoose";
import { BoxI } from "../interfaces/interfaces.ts";

const BoxSchema = new mongoose.Schema<BoxI>({
    storeId:{type: String},
    boxName:{type: String},
    isOpen:{type:Boolean},
    boxDate:{type:Date},
    totalMoneyInBox:{type: Number},
    boxDifferenceMoney:{type: Number}
})

const boxesModel = mongoose.model("boxesModel", BoxSchema)

export default boxesModel