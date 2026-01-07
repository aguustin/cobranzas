import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    managerId:{type: String},
    storeName:{type: String},
    storePassword:{type: String},
    taxDomicile:{type: String},
    identificationTaxNumber:{type: Number},
    phone:{type: Number},
    storeEmail:{type: String},
    moneyType:{type: String},
    active:{type: Boolean, default: true},
    users:[{
        name:{type: String},
        lastname:{type: String},
        email:{type: String},
        password:{type: String},
        rol:{type: Number}, //1. admin, 2. cajero, 3. supervisor
        active:{type: Boolean},
        atmSells:{type:Number},
        userAtmImg:{type: String},
    }],
    startHour:{type: Date},
    endHour:{type: Date},
    storeTaxes: [{
        taxName: { 
            type: String, 
            required: true,
            enum: ['IVA', 'IIBB', 'TASA_MUNICIPAL', 'GANANCIAS', 'OTROS'] 
        },
        percentage: { 
            type: Number, 
            required: true 
        }, // Ejemplo: 21, 3.5, etc.
        description: { type: String }
    }],
    months:{
        type: [{
            monthDate: { type: Date },
            monthMount: { type: Number, default: 0 },
            taxesMonth: { type: Number, default: 0 }
        }],
        default: []
    },
    storeSubTotalEarned:{type: Number, default: 0},
    storeTotalEarned:{type: Number, default: 0},
})

const storeModel = mongoose.model('Store', StoreSchema)

export default storeModel