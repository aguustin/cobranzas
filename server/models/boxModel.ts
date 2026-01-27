import mongoose from "mongoose";
import { BoxI } from "../interfaces/interfaces.ts";

const BoxSchema = new mongoose.Schema<BoxI>({
    storeId:{type: String},
    boxName:{type: String},
    isOpen:{type:Boolean},
    boxDate:{type:Date},
    totalMoneyInBox:{type: Number, default: 0},
    boxDifferenceMoney:{type: Number, default: 0}
})

BoxSchema.index({ storeId: 1, boxDate: 1 });
BoxSchema.index({ storeId: 1});

const boxesModel = mongoose.model("boxesModel", BoxSchema)

export default boxesModel