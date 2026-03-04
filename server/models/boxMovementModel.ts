import mongoose from "mongoose"

const BoxMovementSchema = new mongoose.Schema({
   boxId: { type: mongoose.Schema.Types.ObjectId, ref: "Box", required: true },
   storeId: { type: String, required: true },
   cashierId: { type: String },
   cashierName: {type: String},
   type: { 
      type: String, 
      enum: ["withdrawals", "deposit", "adjustment"], 
      required: true 
   },
   reason: { type: String, required: true },
   amount: { type: Number, required: true },
   createdAt: { type: Date, default: Date.now }
})

const boxesMovementModel = mongoose.model("boxesMovementModel", BoxMovementSchema)

export default boxesMovementModel