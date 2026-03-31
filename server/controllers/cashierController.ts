import { Request, Response } from "express";
import storeModel from "../models/storeModel.ts";
import * as bcrypt from "bcrypt-ts";
import jwt from 'jsonwebtoken'
import { dev_url_front, email_adm, jwt_secret_key, nodemailer_pass } from "../config.ts";
import nodemailer from "nodemailer";
import cloudinary, { uploadFileToCloudinaryAtmFolder } from "../lib/cloudinary.ts";
import UserModel from "../models/userModel.ts";
import sellModel from "../models/sellModel.ts";

interface JwtUserPayload extends jwt.JwtPayload {
  email: string;
}

type UserBody = {
  storeId: string,
  fullName: string,
  username: string,
  userpassword: string,
  userDni: number,
  userPhoto?: string,
  userRole: string,
  isActive: boolean
}

export const getAllCashiersController = async (req: Request, res: Response) => {
    const {storeId} = req.params
    const cashiers = await UserModel.find({storeId:storeId})
    return res.status(200).json(cashiers)
}

/*export const registerCashierController = async (
  req: Request<{}, {}, UserBody>,
  res: Response
): Promise<Response> => {

  const {
    storeId,
    fullName,
    username,
    userpassword,
    userDni
  } = req.body

  let imageUrl: string | undefined
  
  // 📸 Imagen (se mantiene igual)
  if (req.file) {
    imageUrl = await uploadFileToCloudinaryAtmFolder(req.file)
  }

  // 🔎 Validar usuario duplicado en la misma tienda
  const userExists = await UserModel.findOne({
    storeId,
    $or: [
      { userDni }
    ]
  })

  if (userExists) {
    return res.status(201).json('El usuario ya existe')
  }

  // 🔐 Hash password
  const salt = 12
  const hashedPassword = await bcrypt.hash(userpassword, salt)

  // 👤 Crear usuario
  await UserModel.create({
    storeId,
    fullName,
    username,
    userpassword: hashedPassword,
    userDni,
    UserDate: new Date(),
    userPhoto: imageUrl,
    userRole: 'cashier',
    isActive: true
  })

  return res.status(200).json('El usuario se creó con exito') 
}*/

export const registerCashierController = async (
  req: Request<{}, {}, UserBody>,
  res: Response
): Promise<Response> => {
  try {
    const {
      storeId,
      fullName,
      username,
      userpassword,
      userDni
    } = req.body

    let imageUrl: string | undefined

    // 📸 Subir imagen si existe
    if (req.file) {
      imageUrl = await uploadFileToCloudinaryAtmFolder(req.file)
    }

    // 🔎 Buscar si ya existe un cajero con ese DNI
    const cashierByDni = await UserModel.findOne({ userDni })

    // 🔎 Buscar si ya existe ese username
    const cashierByUsername = await UserModel.findOne({ username })

    // ❌ Si el username ya existe y pertenece a otro usuario distinto
    if (
      cashierByUsername &&
      (!cashierByDni || cashierByUsername._id.toString() !== cashierByDni._id.toString())
    ) {
      return res.status(409).json('El nombre de usuario ya está en uso')
    }

    // ✅ Si el cajero ya existe, reutilizarlo
    if (cashierByDni) {
      const alreadyInStore = cashierByDni.storeId.includes(storeId)

      if (alreadyInStore) {
        return res.status(409).json('El cajero ya está registrado en esta tienda')
      }

      // Agregar nueva tienda al array
      cashierByDni.storeId.push(storeId)

      // opcional: actualizar foto solo si no tenía
      if (imageUrl && !cashierByDni.userPhoto) {
        cashierByDni.userPhoto = imageUrl
      }

      await cashierByDni.save()

      return res.status(200).json('El cajero ya existía y fue asignado a la nueva tienda')
    }

    // 🆕 Si no existe, crear nuevo cajero
    const salt = 12
    const hashedPassword = await bcrypt.hash(userpassword, salt)

    await UserModel.create({
      storeId: [storeId],
      fullName,
      username,
      userpassword: hashedPassword,
      userDni,
      UserDate: new Date(),
      userPhoto: imageUrl,
      userRole: 'cashier',
      isActive: true
    })

    return res.status(200).json('El usuario se creó con éxito')
  } catch (error) {
    console.error('Error al registrar cajero:', error)
    return res.status(500).json('Error interno del servidor')
  }
}

export const loginCashierController = async (req: Request, res: Response) => {
  try {
    const {storeId, username, userpassword } = req.body
  
  
    // 🔎 Buscar usuario
    const user = await UserModel.findOne({ storeId, username })

    if (!user) {
      console.log('no existe')
      return res.status(200).json({token:0, code: 2 }) // usuario no existe
    }

    if (!user.isActive) {
      console.log('usuario desactivo')
      return res.status(403).json({token:0, code: 3 }) // usuario desactivado
    }

 
    // 🔐 Comparar password
    const passwordMatch = await bcrypt.compare(
      userpassword,
      user.userpassword
    )
    if (!passwordMatch) {
      return res.status(401).json({token:0, code: 1 })
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
                userpassword: encryptNewPass
            }
        }
    )

    return res.status(200).json({ok: 1})
}

export const changePassController = async (req: Request<{}, {}, {userDni: number, oldPass: string, newPass: string}>, res: Response) => {
    const {userDni, oldPass, newPass} = req.body

    const user = await UserModel.findOne({userDni: userDni})

    const checkOldPass = await bcrypt.compare(oldPass, user?.userpassword!)

    if(checkOldPass){

        const encriptNewPass = await bcrypt.hash(newPass, 12)

        await UserModel.updateOne(
            {userDni: userDni},
            {
                $set:{
                    userpassword: encriptNewPass
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
        dataToUpdate.cashierIdImg = imageUrl
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



//Ventas totales por cajero
export const totalSellsByCashierController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { storeId } = req.query as { storeId: string };
    if (!storeId) return res.status(400).json({ message: "storeId requerido" });

    const salesByCashier = await sellModel.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: "$cashierId",
          totalSales: { $sum: "$sellTotal" },
          totalQuantity: { $sum: "$sellQuantity" },
          totalTaxes: { $sum: "$sellTaxes" },
          totalDiscounts: { $sum: "$discount" },
          salesCount: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json(salesByCashier);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo ventas por cajero" });
  }
};



//Ventas totales por caja
export const salesByBoxController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { storeId } = req.query as { storeId: string };
    if (!storeId) return res.status(400).json({ message: "storeId requerido" });

    const salesByBox = await sellModel.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: "$boxId",
          totalSales: { $sum: "$sellTotal" },
          totalQuantity: { $sum: "$sellQuantity" },
          totalTaxes: { $sum: "$sellTaxes" },
          salesCount: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json(salesByBox);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo ventas por caja" });
  }
};


/**Si quieres, el próximo paso ideal sería:

📊 Reporte diario por caja + cajero (cuadre de caja)

⚡ Índices recomendados para que estos reports vuelen

🧾 Exportar a PDF / Excel

Tú dime por dónde seguimos.

seguir con esto 05/02/2026
*/



//Ventas totales por mes
export const totalSellsByMonthController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { storeId } = req.query as { storeId: string };
    if (!storeId) return res.status(400).json({ message: "storeId requerido" });

    const salesByMonth = await sellModel.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: {
            year: { $year: "$sellDate" },
            month: { $month: "$sellDate" }
          },
          totalSales: { $sum: "$sellTotal" },
          totalQuantity: { $sum: "$sellQuantity" },
          totalTaxes: { $sum: "$sellTaxes" },
          salesCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return res.status(200).json(salesByMonth);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo ventas por mes" });
  }
};

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
