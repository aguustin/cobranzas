
import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";

interface ITax {
  taxName: 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS';
  percentage: number;
  isRetention?: boolean;
}

interface StoreBody {
  storeName: string,
  storePassword: string,
  storePasswordB?: string,
  taxDomicile: string,
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

export const createStoreContoller = async (req: Request<{}, {}, StoreBody>, res: Response): Promise<number> => {
    const {storeName, taxDomicile, storePassword, identificationTaxNumber, phone, storeEmail, moneyType, startHour, endHour, storeTaxes} = req.body

    const storeExists = await storeModel.findOne({storeName: storeName})

    if(storeExists){
        return 2
    }

    const salt: number = 12
    const hashedPassword: string = await bcrypt.hash(storePassword, salt)

    await storeModel.create({
        storeName: storeName,
        storePassword: hashedPassword,
        taxDomicile: taxDomicile,
        identificationTaxNumber: identificationTaxNumber,
        phone: phone,
        storeEmail: storeEmail,
        moneyType: moneyType,
        startHour: startHour,
        endHour: endHour,
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