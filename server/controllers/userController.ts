import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";
import * as jwt from 'jsonwebtoken';
import { dev_url_front, email_adm, jwt_secret_key, nodemailer_pass } from "../config.ts";
import nodemailer from "nodemailer";

interface JwtUserPayload extends jwt.JwtPayload {
  email: string;
}

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
                    rol: 1
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
        jwt.sign(email, secretKey, options)
        
        passwordMatch ? res.status(200).json({user: findUser}) : res.status(401).json({user: 1})
    }

    return res.status(200).json({user: 2})
}

export const recoverPasswordController = async (req: Request<{}, {}, {email: string}>, res:Response): Promise<Response> => {
    const {email} = req.body

    const checkEmail = await storeModel.findOne({'users.email': email})

    if(checkEmail){

    const secretKey: jwt.Secret = process.env.JWT_SECRET_KEY!
    const options: jwt.SignOptions = {
        expiresIn: '5m',
        algorithm: 'HS256'
    }

    const token =  jwt.sign(email, secretKey, options)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, 
        auth: {
            user: email_adm,
            pass: nodemailer_pass
        }
    });
    await transporter.sendMail({
        from: '"MyStore" <no-reply@gotickets.com>',
        to: email,
        subject: `MyStore - Recover password for ${email}`,
        html: `
            <p>Recupera tu contraseña clickeando en el siguiente enlace: ${dev_url_front}/updatePass/${token}</p>
        `
    });
    }

    return res.status(200).json({message: 'Te enviamos un mail a tu correo electronico para recuperar tu contraseña'})
}

export const confirmRecoveryPassController = async (req: Request<{token: string}>, res: Response): Promise<Response> => {
    const {token, newPassword} = req.body
    
    const decoded = jwt.verify(token, jwt_secret_key!) as JwtUserPayload
    
    const {email} = decoded

    const encryptNewPass = await bcrypt.hash(newPassword, 12)

    await storeModel.updateOne(
        {'users.email': email},
        {
            $set:{
                'users.password': encryptNewPass
            }
        }
    )

    return res.status(200).json({ok: 1})
}

export const changePassController = async (req: Request<{}, {}, {email: string, oldPass: string, newPass: string}>, res: Response) => {
    const {email, oldPass, newPass} = req.body

    const store = await storeModel.findOne({'users.email': email}) 

    const getUserPass = store?.users.find((u) => u.email === email)

    const checkOldPass = await bcrypt.compare(oldPass, getUserPass?.password!)

    if(checkOldPass){

        const encriptNewPass = await bcrypt.hash(newPass, 12)

        await storeModel.updateOne(
            {'users.email': email},
            {
                $set:{
                    'users.password': encriptNewPass
                }
            }
        )
    }

}

export const subsUserController = async (req: Request, res: Response): Promise<Response> => {
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


/*export const changePreferencesController = async (req: Request, res:Response): Promise<Response> => {
    const {email, language, moneyType} = req.body

    await storeModel.updateOne({'users.email': email},
        {
            $set:{
                language:language,
                moneyType:moneyType
            }
        }
    )

    return res.sendStatus(200)
}*/
