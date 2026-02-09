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

export const getBoxesListController = async (req: Request<{}, {}, { storeId: string, cashierId: string }>, res: Response) => {
    const { storeId, cashierId } = req.body;

   const boxes = await boxesModel.aggregate([
        { $match: { storeId: storeId } }, // todas las cajas de la tienda

        // Convertimos cashierId a ObjectId para poder hacer el lookup
        {
            $addFields: {
            cashierIdObj: {
                $cond: [
                { $ifNull: [cashierId, false] }, // si cashierId existe
                { $toObjectId: cashierId },
                null
                ]
            }
            }
        },

        // Lookup para traer el usuario correspondiente al cashierId
        {
            $lookup: {
            from: "usermodels",            // colección de usuarios
            localField: "cashierIdObj",    // campo de la caja
            foreignField: "_id",           // campo en UserModel
            as: "cashier"
            }
        },

        // Unwind para convertir array en objeto, pero dejamos cajas sin cajero
        { $unwind: { path: "$cashier", preserveNullAndEmptyArrays: true } },

        // Project: seleccionamos los campos de la caja y del cajero
        {
            $project: {
            boxName: 1,
            boxNumber: 1,
            isOpen: 1,
            initialCash: 1,
            totalMoneyInBox: 1,
            cashierId: 1,
            cashier: {
                fullName: { $ifNull: ["$cashier.fullName", ""] },
                username: { $ifNull: ["$cashier.username", ""] },
                userRole: { $ifNull: ["$cashier.userRole", ""] },
                userPhoto: { $ifNull: ["$cashier.userPhoto", ""] },
                loginDate: { $ifNull: [new Date(), ""] }
            }
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