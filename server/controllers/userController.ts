import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";
import * as jwt from 'jsonwebtoken';

interface UserBody{
    name: string,
    lastname: string,
    email: string,
    password: string,
    rol: number,
    storeId?: string,
    active?: boolean
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
        const passwordMatch: boolean = await bcrypt.compare(password, findUser.users[0]?.password || '')
        const secretKey: jwt.Secret = process.env.JWT_SECRET_KEY!
        const options: jwt.SignOptions = {
            expiresIn: '24h',
            algorithm: 'HS256'
        } 
        const token = jwt.sign(email, secretKey, options)
        console.log(token)
        passwordMatch ? res.status(200).json({user: findUser}) : res.status(401).json({user: 1})
    }

    return res.status(200).json({user: 2})
}


export const subsUserController = async (req: Request, res: Response) => {
    const {storeId, userId} = req.body

    const checkUser = await storeModel.findOne({_id: storeId, "users._id": userId})

    if(checkUser){
        checkUser.active 
        ? 
        await storeModel.updateOne(
            {_id: storeId, "users._id": userId},
            {
                $set:{
                    active: false
                }
            }
        )
        :
          await storeModel.updateOne(
            {_id: storeId, "users._id": userId},
            {
                $set:{
                    active: true
                }
            }
        )
        return res.status(200).json({message: "Estado del usuario cambiado"})
    }

    return res.status(201).json({message: "No se encontro el usuario"})
}