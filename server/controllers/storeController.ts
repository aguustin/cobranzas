
import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";
import cloudinary from "../lib/cloudinary.ts";

interface ITax {
  taxName: 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS';
  percentage: number;
 // isRetention?: boolean;
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

const uploadFileToCloudinary = (file: Express.Multer.File): Promise<string> => {
    console.log('se ejecuta')
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'cobranza_products' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result!.secure_url);
            }
        ).end(file.buffer);
    });
};


export const createStoreController = async (req: Request<{}, {}, StoreBody>, res: Response): Promise<Response> => {

    const {managerId, storeName, domicile, storePassword, identificationTaxNumber, phone, storeEmail, storeTaxes} = req.body
    console.log('MANAGER ID ', managerId)
    const storeExists = await storeModel.findOne({storeName: storeName})

    if(storeExists){
        return res.status(200).json(2)
    }

    const salt: number = 12
    const hashedPassword: string = await bcrypt.hash(storePassword, salt)

    
    let storeImgUrl: string | undefined;
    
    if (req.file) {
         storeImgUrl = await uploadFileToCloudinary(req.file)
    }

    const taxes: ITax[] = storeTaxes
    ? typeof storeTaxes === 'string'
        ? JSON.parse(storeTaxes)
        : storeTaxes
    : [];


    await storeModel.create({
        managerId: managerId,
        storeImg: storeImgUrl,
        storeName: storeName,
        storePassword: hashedPassword,
        domicile: domicile,
        identificationTaxNumber: identificationTaxNumber,
        phone: phone,
        storeEmail: storeEmail,
        storeTaxes: taxes || []
    })
  
    return res.status(200).json(1)
}

export const updateStoreController = async (req: Request<{}, {}, StoreBody>, res: Response): Promise<Response> => {
    const {...data} = req.body
    const dataToUpdate = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined))
    

    for (const key of Object.keys(dataToUpdate)) {
        const value = dataToUpdate[key];

        if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    dataToUpdate[key] = parsed;
                } catch (error) {
                    console.log('')
                }
        
        }

    }
    let storeImgUrl: string | undefined;

    if(req.file){
        storeImgUrl = await uploadFileToCloudinary(req.file)
    }
    
    if(storeImgUrl) {
        dataToUpdate.storeImg = storeImgUrl;
    } 
    
    const { storeId, storeData, taxes, storeImg } = dataToUpdate;
 
    const updateResult = await storeModel.updateOne(
        {_id: dataToUpdate.storeId},
        {
            $set:{ 
                storeName: storeData.storeName,
                domicile: storeData.domicile,
                identificationTaxNumber: storeData.identificationTaxNumber,
                phone: storeData.phone,
                storeEmail:storeData.storeEmail,
                storeTaxes: taxes,
                storeImg: storeImg
             },
        },
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

export const listStoresController = async (req: Request<{sessionId: string}>, res: Response): Promise<Response> => {
    const {sessionId} = req.params
    console.log(sessionId)
    const stores = await storeModel.find({managerId: sessionId})

    return res.send(stores)
}

export const getStoreController = async (req: Request<{}, {}, {storeId: string}>, res: Response): Promise<Response> => {
    const {storeId} = req.body
    console.log(storeId)
    const store = await storeModel.findOne({_id: storeId})

    return res.send(store)
}