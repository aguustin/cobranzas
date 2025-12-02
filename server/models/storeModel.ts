import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    storeName:{type: String},
    storePassword:{type: String},
    taxDomicile:{type: String},
    identificationTaxNumber:{type: Number},
    phone:{type: Number},
    storeEmail:{type: String},
    active:{type: Boolean, default: true},
    users:[{
        name:{type: String},
        lastname:{type: String},
        email:{type: String},
        password:{type: String},
        rol:{type: Number}
    }]
})

const storeModel = mongoose.model('Store', StoreSchema)

export default storeModel