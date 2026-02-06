import { Request, Response } from "express";
import boxesModel from "../models/boxModel.ts";
import mongoose from "mongoose";

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

/*export const getBoxController = async (req: Request<{}, {}, {}>, res:Response): Promise<Response> => {
    const {storeId, cashierId} = req.body;

    const box = await boxesModel.findOne({storeId: storeId, cashierId: cashierId ? new mongoose.Types.ObjectId(cashierId) : null, isOpen: true})
        .populate('cashierId', 'fullName userPhoto')

    return res.status(200).json(box)
}*/

export const getBoxesListController = async (req: Request<{}, {}, { storeId: string }>, res: Response) => {
    const { storeId } = req.body;

    const boxes = await boxesModel.aggregate([
        { $match: { storeId: storeId } },  // Filtra por storeId
        {
            $lookup: {
                from: "UserModel",         // Nombre real de la colección de usuarios en MongoDB
                localField: "cashierId",   // Campo en Box
                foreignField: "_id",       // Campo en UserModel
                as: "cashier"              // Cómo quieres que se llame el array resultado
            }
        },
        {
            $unwind: { 
                path: "$cashier", 
                preserveNullAndEmptyArrays: true // Para cajas sin cajero
            }
        },
        {
            $project: {
                boxName: 1,
                boxNumber: 1,
                isOpen: 1,
                initialCash: 1,
                totalMoneyInBox: 1,
                cashier: 1
            }
        }
    ]);

    return res.status(200).json(boxes);
};


export const createBoxController = async (req: Request<{}, {}, {formData:BoxBody}>, res:Response): Promise<Response> => {
    const {formData} = req.body
    console.log(formData)
    await boxesModel.create(formData)
    return res.status(200).json(1)
}

export const openCloseBoxController = async (
    req: Request<{ boxId: string, isOpen: boolean  }, {}, {}, {cashierId: string}>,
    res: Response
): Promise<Response> => {
    const { boxId, isOpen, cashierId } = req.body
    
    const boxData = await boxesModel.findById(boxId)

    if (!boxData) return res.status(404).json({ message: 'Caja no encontrada' })
 
        await boxesModel.findByIdAndUpdate(
        { _id: boxId },
        {
            $set: {
                isOpen,
                cashierId: isOpen ? new mongoose.Types.ObjectId(cashierId) : null,
                initialCash: isOpen ? boxData.totalMoneyInBox : boxData.initialCash
            }
        }
        )

    return res.status(200).json({
        message: isOpen ? 'Se abrió la caja' : 'Se cerró la caja'
    })
}