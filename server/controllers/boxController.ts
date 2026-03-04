import { Request, Response } from "express";
import boxesModel from "../models/boxModel.ts";
import mongoose from "mongoose";
import boxesMovementModel from "../models/boxMovementModel.ts";

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

export const getBoxController = async (req: Request<{}, {}, {}>, res:Response): Promise<Response> => {
    const {storeId, cashierId} = req.body;

    const box = await boxesModel.findOne({storeId: storeId, cashierId: cashierId ? new mongoose.Types.ObjectId(cashierId) : null, isOpen: true})

    return res.status(200).json(box)
}

export const getBoxesListController = async (req: Request<{}, {}, { storeId: string, cashierId: string }>, res: Response) => {
    const { storeId } = req.body;
    
const boxes = await boxesModel.aggregate([
  { $match: { storeId } },

  {
    $addFields: {
      cashierIdObj: {
        $cond: [
          { $ifNull: ['$cashierId', false] },
          { $toObjectId: '$cashierId' },
          null
        ]
      }
    }
  },

  {
    $lookup: {
      from: 'usermodels',
      localField: 'cashierIdObj',
      foreignField: '_id',
      as: 'cashier'
    }
  },

  {
    $unwind: {
      path: '$cashier',
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $project: {
      boxName: 1,
      boxNumber: 1,
      isOpen: 1,
      initialCash: 1,
      totalMoneyInBox: 1,
      cashierId: 1,

      cashier: {
        $cond: [
          { $ifNull: ['$cashier._id', false] }, // 👉 solo si existe cajero
          {
            fullName: '$cashier.fullName',
            username: '$cashier.username',
            userRole: '$cashier.userRole',
            userPhoto: '$cashier.userPhoto',
            loginDate: new Date()
          },
          '$$REMOVE' // ❌ elimina el campo completamente
        ]
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
                cashierId: isOpen ? cashierId : null,
                initialCash: isOpen ? boxData.totalMoneyInBox : boxData.initialCash,
                boxOpenDate: isOpen ? new Date() : boxData.boxOpenDate,
                boxCloseDate: !isOpen ? new Date() : boxData.boxCloseDate
            }
        }
        )

    return res.status(200).json({
        message: isOpen ? 'Se abrió la caja' : 'Se cerró la caja'
    })
}


export const cashCountController = async (req: Request, res: Response) => {
  const {storeId, cashierId} = req.body
  const box = await boxesModel.findOne({storeId: storeId, cashierId: cashierId})
  if(box){
    await boxesModel.updateOne(
      {_id:box._id},
      {
        $set:{
          cashSales: 0,
          initialCash: box.totalMoneyInBox
        }
      }
    )
    return res.status(200).json(1)
  }

  return res.status(201).json(2)
}


export const boxMovementController = async (req: Request, res: Response) => {
  const {amount, boxId, cashierId, cashierName, movementType, reason, storeId} = req.body
  try {
  
  await boxesMovementModel.create(
    { boxId: boxId,
      storeId: storeId,
      cashierId: cashierId,
      cashierName: cashierName,
      type: movementType,
      reason: reason,
      amount: amount
    }
  )
  
  const movementFieldMap: Record<string, string> = {
    withdrawal: "withdrawals",
    deposit: "deposit"
  }
  
  const field = movementFieldMap[movementType] 
  
  await boxesModel.updateOne(
    { _id: boxId },
    { $inc: { [field]: amount } },
  )
  
    return res.status(200).json({ message: "Movement registered" })

  } catch (error) {
    return res.status(500).json({ message: "Error registering movement" })
  }
}

export const getMovementsController = async (req: Request, res :Response): Promise<Response> => {
  const {storeId} = req.params

  const getMovements = await boxesMovementModel.find({storeId: storeId})

  return res.status(200).json(getMovements)
}

export const deleteAllBoxesController = async (req: Request, res: Response): Promise<Response> => {
    await boxesModel.deleteMany({})
    return res.status(200).json({message: 'Todas las cajas han sido eliminadas'})
}