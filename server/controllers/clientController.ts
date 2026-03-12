import { Request, Response } from "express"
import clientModel from "../models/clientModel.ts"
import axios from "axios"

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
    const {clientId} = req.body
    console.log(clientId)
    const checkState = await clientModel.findOne({_id: clientId})

    if(checkState){
        checkState.active 
        ? 
        await clientModel.updateOne(
            {_id: clientId},
            {
                $set:{
                    active: false
                }
            }
        )
        :
          await clientModel.updateOne(
            {_id: clientId},
            {
                $set:{
                    active: true
                }
            }
        )
        return res.status(200).json({message: "Estado del cliente cambiado"})
    }

    return res.status(201).json({message: "No se encontro el cliente"})
}


export const getClientsController = async (req: Request<{}, {}, {storeId: string}>, res: Response): Promise<Response> => {
    const {storeId} = req.params
    console.log('asdsadas: ', storeId)
    const clients = await clientModel.find({storeId: storeId})

    return res.status(200).json(clients)
}
