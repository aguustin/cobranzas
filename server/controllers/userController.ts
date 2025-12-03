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

export const loginUserController = async (req:Request, res:Response) => {
    const {email, password} = req.body

    const findUser = await storeModel.findOne({"users.email": email})

    if(findUser){
        const passwordMatch: boolean = await bcrypt.compare(password, findUser.users[0]?.password)   
        passwordMatch ? res.status(200).json({user: findUser}) : res.status(401).json({user: 1})
    }

    return res.status(200).json({user: 2})
}


