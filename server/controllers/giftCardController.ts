import { Request, Response } from "express"
import giftCardModel from "../models/giftCardModel.ts"

export const registerGiftCardController = async (req: Request<{}, {}, {giftCode: string, giftMount: number}>, res: Response): Promise<Number> => {
    const {giftCode, giftMount} = req.body

    await giftCardModel.create({
        giftCode: giftCode,
        giftMount: giftMount
    })

    return 1
}

export const updateGiftCardController = async (req: Request<{}, {}, {giftCode: string, remainingGiftCardMount: number}>, res: Response): Promise<Response> => {
    const {giftCode, remainingGiftCardMount} = req.body

    await giftCardModel.updateOne(
        {giftCode: giftCode},
        {
            $set:{
                giftMount: remainingGiftCardMount
            }
        }
    )
    return res.status(200).json({message: 'Se actualizo el monto del cupon de regalo'})
}

