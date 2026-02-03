import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";
import * as jwt from 'jsonwebtoken';
import { dev_url_front, email_adm, jwt_secret_key, nodemailer_pass } from "../config.ts";
import nodemailer from "nodemailer";
import cloudinary from "../lib/cloudinary.ts";
import UserModel from "../models/userModel.ts";

interface JwtUserPayload extends jwt.JwtPayload {
  email: string;
}

type UserBody = {
  storeId: string,
  fullName: string,
  userName: string,
  userPassword: string,
  userDni: number,
  userPhoto?: string,
  userRole: string,
  isActive: boolean
}

export const getAllCashiersController = async (req: Request, res: Response) => {
    const cashiers = await UserModel.find({userRole: 'cashier'})
    return res.status(200).json(cashiers)
}

export const registerCashierController = async (
  req: Request<{}, {}, UserBody>,
  res: Response
): Promise<number> => {

  const {
    storeId,
    fullName,
    userName,
    userPassword,
    userDni
  } = req.body

  let imageUrl: string | undefined

  // 📸 Imagen (se mantiene igual)
  if (req.file) {
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'cobranza_usersAtm'
    })
    imageUrl = uploadResponse.secure_url
  }

  // 🔎 Validar usuario duplicado en la misma tienda
  const userExists = await UserModel.findOne({
    storeId,
    $or: [
      { userDni }
    ]
  })

  if (userExists) {
    return 2 // usuario ya existe
  }

  // 🔐 Hash password
  const salt = 12
  const hashedPassword = await bcrypt.hash(userPassword, salt)

  // 👤 Crear usuario
  await UserModel.create({
    storeId,
    fullName,
    userName,
    userPassword: hashedPassword,
    userDni,
    UserDate: new Date(),
    userPhoto: imageUrl,
    userRole: 'cashier',
    isActive: true
  })

  return 1 // ok
}

export const loginCashierController = async (req: Request, res: Response) => {
  try {
    const { userName, userPassword } = req.body

    // 🔎 Buscar usuario
    const user = await UserModel.findOne({ userName })

    if (!user) {
      return res.status(404).json({ code: 2 }) // usuario no existe
    }

    if (!user.isActive) {
      return res.status(403).json({ code: 3 }) // usuario desactivado
    }

    // 🔐 Comparar password
    const passwordMatch = await bcrypt.compare(
      userPassword,
      user.userPassword
    )

    if (!passwordMatch) {
      return res.status(401).json({ code: 1 })
    }

    // 🏪 Obtener info mínima de la tienda (opcional pero útil)
    const store = await storeModel.findById(user.storeId)

    // 🔑 JWT
    const secretKey: jwt.Secret = process.env.JWT_SECRET_KEY!
    const token = jwt.sign(
      {
        userId: user._id,
        storeId: user.storeId,
        role: user.userRole
      },
      secretKey,
      {
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    )

    return res.status(200).json({token, user})

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'LOGIN_ERROR' })
  }
}

export const recoverPasswordController = async (req: Request<{}, {}, {userDni: number}>, res:Response): Promise<Response> => {
    const {userDni} = req.body

    const checkDni = await UserModel.findOne({userDni: userDni})
    if(checkDni){
        return res.status(200).json(1)
    }
    return res.status(201).json(2)
}

export const confirmRecoveryPassController = async (req: Request<{userDni: number, newPassword: string}>, res: Response): Promise<Response> => {
    const {userDni, newPassword} = req.body

    const encryptNewPass = await bcrypt.hash(newPassword, 12)

    await UserModel.updateOne(
        {userDni: userDni},
        {
            $set:{
                userPassword: encryptNewPass
            }
        }
    )

    return res.status(200).json({ok: 1})
}

export const changePassController = async (req: Request<{}, {}, {userDni: number, oldPass: string, newPass: string}>, res: Response) => {
    const {userDni, oldPass, newPass} = req.body

    const user = await UserModel.findOne({userDni: userDni})

    const checkOldPass = await bcrypt.compare(oldPass, user?.userPassword!)

    if(checkOldPass){

        const encriptNewPass = await bcrypt.hash(newPass, 12)

        await UserModel.updateOne(
            {userDni: userDni},
            {
                $set:{
                    userPassword: encriptNewPass
                }
            }
        )
    }

}

export const subsCashierController = async (req: Request, res: Response): Promise<Response> => {
    const {storeId, cashierId} = req.body

    const checkUser = await UserModel.findOne({_id: cashierId})

    if(checkUser){
        checkUser.isActive 
        ? 
        await UserModel.updateOne(
            {_id: cashierId, storeId: storeId},
            {
                $set:{
                    isActive: false
                }
            }
        )
        :
         await UserModel.updateOne(
            {_id: cashierId, storeId: storeId},
            {
                $set:{
                    isActive: true
                }
            }
        )
        return res.status(200).json({message: "Estado del usuario cambiado"})
    }

    return res.status(201).json({message: "No se encontro el usuario"})
}


export const updateCashierController = async (req: Request<{}, {}, UserBody & {storeId: string, cashierId:string}>, res:Response): Promise<Response> => {
    const {storeId, cashierId, ...data} = req.body

    const dataToUpdate = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined))

    let imageUrl: string | undefined;
    
    if (req.file) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'cobranza_usersAtm',
        });
        imageUrl = uploadResponse.secure_url;
        dataToUpdate.userAtmImg = imageUrl
    }

    const updateUser = await UserModel.updateOne(
        {_id:cashierId, storeId: storeId},
        {
            $set: dataToUpdate
        }
    )
    
    if(updateUser.matchedCount === 0){
        return res.status(400)
    }

    return res.status(200).json({message: 1})
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
