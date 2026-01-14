import { Request, Response } from "express"
import managerModel from "../models/managerModel.ts"
import * as bcrypt from "bcrypt-ts";
//import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { preApproval } from "../lib/mp.ts";
import { paymentClient } from "../lib/mp.ts";
import jwt from 'jsonwebtoken';

interface TokenPayload extends JwtPayload  {
  email: string;
}

interface ManagerBody {
    email:string,
    password:string,
    username:string,
    subscriptionPlan?:number,  //1. free, 2. simple, 3. plus
    storesQuantity?:number,
    active?:boolean,
    payment?: number,
    paymentDate?: Date,
    managerId?: string,
    cardToken?: string
}


export const createManagerContoller = async (req: Request<{}, {}, { signInData: ManagerBody } >, res: Response): Promise<Response> => {
    const {signInData} = req.body
    console.log(signInData);
    const salt: number = 12
    const hashedPassword: string = await bcrypt.hash(signInData.password, salt)

    const managerMatch = await managerModel.findOne(
        {email: signInData.email},
    )

    if(managerMatch){
        return res.status(200).json({resMessage: 2})
    }

   await managerModel.create({
        email: signInData.email,
        password: hashedPassword,
        username: signInData.username
   })

   return res.status(200).json({resMessage: 1})
}

export const loginManagerController = async (req: Request<{}, {}, ManagerBody>, res: Response) => {
    const {email, password} = req.body

    const getManager = await managerModel.findOne({email: email})
    console.log(email, password)

    if(getManager){
        const validPassword: boolean = await bcrypt.compare(password, getManager.password || '')
        if(validPassword){
          
            const secretKey: jwt.Secret = process.env.JWT_SECRET_KEY!
             const options: jwt.SignOptions = {
                expiresIn: 60 * 60 * 24,
                algorithm: "HS256"
            }
           jwt.sign({email}, secretKey, options)
           
           return res.status(200).json({manager: getManager})
        }
        return res.status(401).json({message: 'Las credenciales ingresadas son incorrectas!'}) 
    }

    return res.status(401).json({message: 'Las credenciales ingresadas son incorrectas!'}) 
}

/**  const cardForm = .cardForm({
  amount: "1000",
  form: {
    id: "form-checkout",
    cardholderName: { id: "form-checkout__cardholderName" },
    cardholderEmail: { id: "form-checkout__cardholderEmail" },
    cardNumber: { id: "form-checkout__cardNumber" },
    expirationDate: { id: "form-checkout__expirationDate" },
    securityCode: { id: "form-checkout__securityCode" },
    installments: { id: "form-checkout__installments" },
    identificationType: { id: "form-checkout__identificationType" },
    identificationNumber: { id: "form-checkout__identificationNumber" }
  },
  callbacks: {
    onSubmit: (event) => {
      event.preventDefault();
      const cardToken = cardForm.getCardFormData().token;
      // enviar token al backend
    }
  }
}) */

export const changePlanController = async (req: Request<{}, {}, ManagerBody>, res:Response): Promise<Response> => {
    const {cardToken, subscriptionPlan} = req.body
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(404).json({message: 'No se encuentra el token'})
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as TokenPayload;

    const manager = await managerModel.findOne({email: decodedPayload.email})

    if(!manager) {return res.status(404).json({message: 'No se encuentra el usuario'})}

    const plan_prices: Record<number, number> = {
        1: 1000,
        2: 2500,
        3: 5000,
        4: 8000
    };

    const amount:number = plan_prices[subscriptionPlan]
    
    const stores_limit: Record<number,number> = {
      1: 1,
      2: 5,
      3: 15,
      4: 30
    }

    const storeslimits:number = stores_limit[subscriptionPlan]

    if(manager.subscription){
         await preApproval.update(manager.subscription, {
            auto_recurring: {
                frequency: 1,
                frequency_type: "months",
                transaction_amount: amount,
                currency_id: "ARS",
            },
        });

            await managerModel.updateOne(
            { _id: manager._id },
            {
                $set: {
                    subscriptionPlan: subscriptionPlan,
                }
            }
            );

            return res.status(200).json({
            message: "subscriptionPlan actualizado correctamente",
            });
    }

    if (!cardToken) {
        return res.status(400).json({
            message: "Se requiere tarjeta para crear la suscripción"
        });
    }
     const subscription = await preApproval.create({
        reason: "Suscripción mensual",
        external_reference: manager._id.toString(),
        payer_email: manager.email,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: amount,
          currency_id: "ARS",
        },
        card_token_id: cardToken,
        status: "authorized",
      });

    await managerModel.updateOne(
    { _id: manager._id },
    {
        $set: {
            subscription: subscription.id,
            subscriptionPlan: subscriptionPlan,
            subscriptionStatus: subscription.status,
            storesLimit: storeslimits
        },
    }
    );

    return res.status(201).json({
        message: "Suscripción creada",
        subscriptionId: subscription.id,
    });
}


export const changePreferencesController = async (req: Request, res:Response): Promise<Response> => {
    const {email, language } = req.body

    await managerModel.updateOne({email: email},
        {
            $set:{
                language:language
            }
        }
    )

    return res.sendStatus(200)
}


export const cancelSubscriptionController = async (req: Request<{}, {}, {sessionId:string, subscription: string}>, res:Response): Promise<Response> => {
    const {sessionId, subscription} = req.body

    await preApproval.update({subscriptionId: subscription}, {
        status: "cancelled"
    });

    await managerModel.updateOne({_id: sessionId},
      {
        $set:{
          subscriptionStatus: "cancelled",
          subscriptionPlan: 1
        }
      }
    )
    return res.sendStatus(200)
}

export const mercadoPagoWebhookController = async (req:Request, res:Response): Promise<void> => {
  try {
    const { type, data } = req.body;

    res.sendStatus(200);

    if (type !== "payment") return;

    const paymentId = data.id;

    const payment = await paymentClient.get({
      id: paymentId,
    });

    const subscriptionId = payment.body.preapproval_id;
    const status = payment.body.status;

    if (!subscriptionId) return;

    if (status === "approved") {
      await managerModel.updateOne(
        { subscription: subscriptionId },
        {
          $push: {
            payments: {
              payment: payment.body.transaction_amount,
              paymentDate: new Date(payment.body.date_approved),
            },
          },
          $set: {
            lastPaymentStatus: "approved",
            active: true,
          },
        }
      );
    }

    if (status === "rejected") {
      await managerModel.updateOne(
        { subscription: subscriptionId },
        {
          $set: {
            lastPaymentStatus: "rejected",
            active: false,
          },
        }
      );
    }

  } catch (error) {
    console.error("Webhook error:", error);
  }

};

export const getAllManagersController = async (req: Request<{}>, res:Response): Promise<Response> => {
    const getAllManagers = await managerModel.find({})
    
    return res.send(getAllManagers)
 }

/** const { managerId, cardToken, email } = req.body;

  try {
    const subscription = await preApproval.create({
      reason: "Suscripción mensual - TEST",
      external_reference: managerId,
      payer_email: email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: costs,
        currency_id: "ARS",
      },
      card_token_id: cardToken,  
      status: "authorized",
    });

    await managerModel.updateOne({email: decodedPayload.email},
    {
      $set:{
        subscription: subscription.id
        subscriptionStatus: subscription.status,
        subscriptionPlan:currentPlan
      }
    })

     res.status(201).json({
      subscriptionId: subscription.id,
      status: subscription.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  } 





  EN EL FRONTEND TIENE QUE IR ESTO:

  const cardForm = .cardForm({
  amount: "1000",
  form: {
    id: "form-checkout",
    cardholderName: { id: "form-checkout__cardholderName" },
    cardholderEmail: { id: "form-checkout__cardholderEmail" },
    cardNumber: { id: "form-checkout__cardNumber" },
    expirationDate: { id: "form-checkout__expirationDate" },
    securityCode: { id: "form-checkout__securityCode" },
    installments: { id: "form-checkout__installments" },
    identificationType: { id: "form-checkout__identificationType" },
    identificationNumber: { id: "form-checkout__identificationNumber" }
  },
  callbacks: {
    onSubmit: (event) => {
      event.preventDefault();
      const cardToken = cardForm.getCardFormData().token;
      // enviar token al backend
    }
  }
});
    
*/