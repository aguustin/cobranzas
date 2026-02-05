import { Request, Response } from "express";
import boxesModel from "../models/boxModel.ts";

type BoxBody = {
    storeId: string,
    boxName: string,
    boxNumber: string,
    totalMoneyInBox: number,
    location: string,
    paymentTerminal: string,
    printer: string,
    maxDiscount: number,
    allowRefunds: boolean,
    allowCashWithdrawal: boolean,
    requireManagerAuth: boolean,
    maxTransactionAmount: number
}

export const getBoxesListController = async (req: Request<{storeId: string}, {}, {}>, res:Response): Promise<Response> => {
    const {storeId} = req.params;
    
    const boxes = await boxesModel.find({storeId: storeId})

    return res.status(200).json(boxes)
}

export const createBoxController = async (req: Request<{}, {}, {formData:BoxBody}>, res:Response): Promise<Response> => {
    const {formData} = req.body
    console.log(formData)
    await boxesModel.create(formData)
    return res.status(200).json(1)
}

export const openCloseBoxController = async (req: Request<{boxId: string, isOpen: boolean}, {}, {}>, res:Response): Promise<Response> => {
    const {boxId, isOpen} = req.params
    const boxData = await boxesModel.findOne({_id: boxId})
    if(isOpen){
        await boxesModel.updateOne({_id:boxId},
        {
            $set:{
                isOpen: isOpen,
                initialCash: boxData!.totalMoneyInBox
            }
        }
        )
    }else{
        await boxesModel.updateOne({_id:boxId},
            {
                $set:{
                    isOpen: isOpen
                }
            }
        )
    }

    return res.status(200).json({message: isOpen ? 'Se abrio la caja' : 'Se cerro la caja'})
}