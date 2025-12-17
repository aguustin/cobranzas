import { Request, Response } from "express"
import clientModel from "../models/clientModel.ts"

interface ClientBody{
    clientName:string,
    phone:Date,
    email:string,
}

export const registerClientController = async (req: Request<{}, {}, ClientBody>, res: Response): Promise<Response> => {
    const {clientName, phone, email} = req.body

    await clientModel.create({
        clientName: clientName ?? '',
        phone: phone ?? '',
        email: email ?? ''
    })

    return res.status(200).json({message: 'El cliente fue registrado correctamente!'})
}

export const subsClientController = async (req: Request, res: Response) => {
    const {phone} = req.body

    const checkState = await clientModel.findOne({phone: phone})

    if(checkState){
        checkState.active 
        ? 
        await clientModel.updateOne(
            {phone: phone},
            {
                $set:{
                    active: false
                }
            }
        )
        :
          await clientModel.updateOne(
            {phone: phone},
            {
                $set:{
                    active: true
                }
            }
        )
        return res.status(200).json({message: "Estado del producto cambiado"})
    }

    return res.status(201).json({message: "No se encontro el producto"})
}


export const getClientsController = async (req: Request<{}, {}, {storeId: string}>, res: Response): Promise<Response> => {
    const {storeId} = req.body

    const clients = await clientModel.findOne({storeId: storeId})

    return res.status(200).json({clients})
}