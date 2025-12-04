import mongoose from "mongoose";
import { GiftCardI } from "../interfaces/interfaces";

const GiftCardSchema = new mongoose.Schema<GiftCardI>({
    giftCode:{type: String},
    giftMount:{type: Number}
})

const giftCardModel = mongoose.model("Gifts", GiftCardSchema)

export default giftCardModel