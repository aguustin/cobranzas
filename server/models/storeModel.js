import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    storeName:{type: String},
    taxDomicile:{type: String},
    identificationTaxNumber:{type: Number},
    phone:{type: Number},
    storeEmail:{type: String}
})

const storeModel = mongoose.model('Store', StoreSchema)

export default storeModel