import { Request, Response } from "express"
import managerModel from "../models/managerModel.ts"
import * as bcrypt from "bcrypt-ts";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload  {
  email: string;
}

interface ManagerBody {
    email:string,
    password:string,
    completeName:string,
    plan:number,  //1. free, 2. simple, 3. plus
    storesQuantity?:number,
    active:boolean,
    payment?: number,
    paymentDate?: Date
}


export const createManagerContoller = async (req: Request<{}, {}, { managerBody: ManagerBody } >, res: Response): Promise<Response> => {
    const {managerBody} = req.body

    const salt: number = 12
    const hashedPassword: string = await bcrypt.hash(managerBody.password, salt)

    const managerMatch = await managerModel.findOne(
        {email: managerBody.email},
    )

    if(managerMatch){
        return res.status(302).json({message: 'El email del usuario ya existe!'})
    }

   await managerModel.create({
        email: managerBody.email,
        password: hashedPassword,
        completeName: managerBody.completeName,
        plan: managerBody.plan,
        payments:[{
            payment: managerBody.payment,
            paymentDate: Date.now()
        }]
   })

   return res.status(200).json({message: 'El manager se creo con exito!'})
}

export const loginManagerController = async (req: Request<{}, {}, ManagerBody>, res: Response) => {
    const {email, password} = req.body

    const getManager = await managerModel.findOne({email: email})

    if(getManager){
        const validPassword: boolean = await bcrypt.compare(password, getManager.password || '')

        if(validPassword){
            const secretKey: jwt.Secret = process.env.JWT_SECRET_KEY!
             const options: jwt.SignOptions = {
                expiresIn: '148h',
                algorithm: 'HS256'
            }
           jwt.sign(email, secretKey, options)
           
           return res.status(200).json({manager: getManager})
        }
        return res.status(401).json({message: 'Las credenciales ingresadas son incorrectas!'}) 
    }

    return res.status(401).json({message: 'Las credenciales ingresadas son incorrectas!'}) 
}



export const changePlanController = async (req: Request<{}, {}, ManagerBody>, res:Response): Promise<Response> => {
    const {plan, payment, paymentDate} = req.body
    

    const token = req.headers.authorization?.split(" ")[1];

    
    if(!token){
        return res.status(404).json({message: 'No se encuentra el token'})
    }
    const decodedPayload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
    ) as TokenPayload;

    const findManager = await managerModel.findOne({email: decodedPayload.email})

    if(!findManager) {return res.status(404).json({message: 'No se encuentra el usuario'})}

    let costs: number;
    const currentPlan = findManager.plan ?? 0;
    
    if(plan > currentPlan){
        costs = plan - currentPlan
    }else{
        costs = plan
    }

    await managerModel.updateOne(
        {email: decodedPayload.email},
        {
            $set:{
                plan: costs
            }
        }
    )
    return res.status(200).json({message: 'Plan cambiado con exito!'})
}



/** const { cardToken, email } = req.body;

  try {
    const subscription = await mercadopago.preapproval.create({
      reason: "Suscripción mensual - TEST",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 1000,
        currency_id: "ARS",
      },
      payer: {
        email,
        card_token_id: cardToken,
      },
      back_url: "http://localhost:5173/success",
      status: "authorized",
    });

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  } */