
import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";
import cloudinary from "../lib/cloudinary.ts";

interface ITax {
  taxName: 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS';
  percentage: number;
  isRetention?: boolean;
}

interface StoreBody {
  managerId: string,
  storeName: string,
  storePassword: string,
  storePasswordB?: string,
  domicile: string,
  identificationTaxNumber: number,
  phone: number,
  storeEmail: string,
  moneyType: string,
  startHour?: Date,
  endHour?: Date,
  storeTaxes?: ITax[],
  storeSubtotalMonthEarned:Number,
  storeTotalMonthEarned:Number,
  storeSubTotalEarned:Number,
  storeTotalEarned:Number
}

export const createStoreController = async (req: Request<{}, {}, StoreBody>, res: Response): Promise<number> => {
    const {managerId, storeName, domicile, storePassword, identificationTaxNumber, phone, storeEmail, storeTaxes} = req.body

    const storeExists = await storeModel.findOne({storeName: storeName})


    if(storeExists){
        return 2
    }

    const salt: number = 12
    const hashedPassword: string = await bcrypt.hash(storePassword, salt)

    let imageUrl: string | undefined;
    
    if (req.file) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'cobranza_products',
        });
        imageUrl = uploadResponse.secure_url;
        console.log(imageUrl)
    }
    console.log(managerId, storeName, domicile, storePassword, identificationTaxNumber, phone, storeEmail, storeTaxes)
    
    await storeModel.create({
        managerId: managerId,
        storeImg: imageUrl,
        storeName: storeName,
        storePassword: hashedPassword,
        domicile: domicile,
        identificationTaxNumber: identificationTaxNumber,
        phone: phone,
        storeEmail: storeEmail,
        storeTaxes: storeTaxes || []
    })
    return 1
}

export const updateStoreController = async (req: Request<{}, {}, StoreBody & { storeId: string }>, res: Response): Promise<Response> => {
    const {storeId, ...data} = req.body

    const dataToUpdate = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined))

    const updateResult = await storeModel.updateOne(
        {_id: storeId},
        {
            $set:{ dataToUpdate }
        },
        { runValidators: true }
    )

    if(updateResult.matchedCount === 0){
        return res.status(400).send({message: 2})
    }

    return res.status(200).json({message: 1})
}

export const loginStoreController = async (req: Request<{}, {}, StoreBody>, res: Response) => {
    const {storeName, storePassword} = req.body
    const storeNameExists = await storeModel.findOne({storeName: storeName})

    if(!storeNameExists?.storePassword){
        const match: boolean = await bcrypt.compare(storePassword, storeNameExists?.storePassword || '')
        if(match){
            return res.status(200).json({data: storeNameExists})
        }
        return res.status(200).json({data: 1})
    }
    return res.status(200).json({data: 2})
}

export const subsStoreController = async (req: Request, res: Response) => {
    const {storeId} = req.params

    const idMatch = await storeModel.findOne({_id: storeId})

    if(idMatch){
        idMatch.active ?
        await storeModel.updateOne(
            {_id: storeId},
            {
                $set:{ active: false}
            }
        )
        :
        await storeModel.updateOne(
            {_id: storeId},
            {
                $set:{ active: true}
            }
        )
        return res.status(200).json({unsubscribe: true})
    }
    
    return res.status(200).json({unsubscribe: false})
}

export const listStoresController = async (req: Request<{}, {}, {sessionId: string}>, res: Response): Promise<Response> => {
    const {sessionId} = req.body

    const stores = await storeModel.find({managerId: sessionId})

    return res.status(200).json({stores})
}

export const getStoreController = async (req: Request<{}, {}, {storeId: string}>, res: Response): Promise<Response> => {
    const {storeId} = req.body

    const store = await storeModel.findOne({_id: storeId})

    return res.status(200).json({store})
}