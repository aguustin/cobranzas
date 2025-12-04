
import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";

interface CreateStoreBody {
  storeName: string,
  storePassword: string,
  storePasswordB?: string,
  taxDomicile: string,
  identificationTaxNumber: number,
  phone: number,
  storeEmail: string
}

export const createStoreContoller = async (req: Request<{}, {}, CreateStoreBody>, res: Response): Promise<number> => {
    const {storeName, taxDomicile, storePassword, identificationTaxNumber, phone, storeEmail} = req.body

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
    })

    return 1
}

export const loginStoreController = async (req: Request<{}, {}, CreateStoreBody>, res: Response) => {
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