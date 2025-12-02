import { Request, Response } from "express";
import storeModel from "../models/storeModel";
import * as bcrypt from "bcrypt-ts";

interface UserBody{
    name: String,
    lastname: String,
    email: String,
    password: String,
    rol: Number,
    storeId?: String
}

export const createUserController = async (req: Request<{}, {}, UserBody>, res: Response): Promise<number> => {
    const {name, lastname, email, password, rol} = req.body
    const storeId = req.body.storeId

    const emailMatch = await storeModel.findOne(
        {_id: storeId, 'users.email': email},
    )

    if(emailMatch){
        return 2 
    }
    
    const salt: number = 12
    const hashedPassword: string = await bcrypt.hash(password, salt)

    await storeModel.updateOne(
        {_id: storeId},
        {
            $addToSet:{
                users:{
                    name: name,
                    lastname: lastname,
                    email: email,
                    password: hashedPassword,
                    rol: rol
                }
            }
        }
    )

    return 1
}