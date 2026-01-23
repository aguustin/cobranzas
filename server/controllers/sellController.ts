import {Request, Response} from "express"
import sellModel from "../models/sellModel.ts"
import productModel from "../models/productModel.ts";
import  {  v4  as  uuidv4  }  from  'uuid' ;
import { mp }  from "../lib/mp.ts";
import voucherModel from "../models/voucherModel.ts";
import boxesModel from "../models/boxModel.ts";
import storeModel from "../models/storeModel.ts";
import mongoose from "mongoose";

interface ProductBody {
  storeId: string;
  storeName: string;
  productMongoId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productDiscount: number;
  paymentType: number;
  taxes: number;
  unityPrice: number;
  subTotalPrice: number;
  totalPrice: number;
  sizes: string
}


interface SellBody {
  sproductId:string,
  sellDate:Date,
  sellUnityPrice:number,
  sellSubTotal:number,
  sellTaxes:number,
  sellTotal:number,
  cupon:number,
  discount:number,
  paymentType:number,
  ticketNumber:number,
  ticketEmisionDate:Date
}



export const sellProductController = async (
  req: Request<{}, {}, {
    products: ProductBody[],
    storeId: string,
    giftMount: number,
    storeName: string,
    userAtm: string,
    boxId: string
  }>,
  res: Response
): Promise<Response> => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      products,
      storeId,
      giftMount = 0,
      storeName,
      userAtm
    } = req.body;

    if (!products?.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    const paymentDiscounts: Record<number, number> = {
      1: 0,
      2: 20,
      3: 30,
      4: 40
    };

    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    let remainingGiftCardMount = giftMount;
    let storeSubTotal = 0;
    let storeTaxes = 0;

    const sellsToInsert: any[] = [];
    const productBulkOps: any[] = [];

    // =========================
    //  Calcular totales
    // =========================
    const calculatedProducts = products.map(product => {
      const paymentDiscount = paymentDiscounts[product.paymentType] || 0;
      const totalDiscount = paymentDiscount + (product.productDiscount || 0);

      const discountedSubTotal =
        product.subTotalPrice -
        (product.subTotalPrice * totalDiscount) / 100;

      let finalSubTotal = discountedSubTotal;

      if (remainingGiftCardMount > 0) {
        if (finalSubTotal <= remainingGiftCardMount) {
          remainingGiftCardMount -= finalSubTotal;
          finalSubTotal = 0;
        } else {
          finalSubTotal -= remainingGiftCardMount;
          remainingGiftCardMount = 0;
        }
      }

      const netTotal = Math.max(0, finalSubTotal - product.taxes);

      storeSubTotal += finalSubTotal;
      storeTaxes += product.taxes;

      return {
        ...product,
        finalSubTotal,
        netTotal,
        totalDiscount
      };
    });

    // =========================
    //  MercadoPago
    // =========================
    const orderId = uuidv4();

    const mpResponse = await mp.instoreOrders.create({
      body: {
        external_reference: orderId,
        title: `Venta de productos ${storeName}`,
        total_amount: storeSubTotal,
        items: [
          {
            sku_number: orderId,
            title: "Venta de productos",
            unit_price: storeSubTotal,
            quantity: 1,
            unit_measure: "unit",
            total_amount: storeSubTotal
          }
        ],
        store_id: storeId,
        notification_url: "https://TU_URL/api/payments/webhook"
      }
    });

    // =========================
    //  DB Operations
    // =========================
    for (const product of calculatedProducts) {

      productBulkOps.push({
        updateOne: {
          filter: {
            _id: product.productMongoId,
            storeId: product.storeId
          },
          update: {
            $inc: {
              productQuantity: -product.productQuantity,
              totalSells: product.productQuantity,
              totalTaxes: product.taxes,
              subTotalEarned: product.finalSubTotal,
              totalEarned: product.netTotal
            }
          }
        }
      });

      sellsToInsert.push({
        storeId: product.storeId,
        sproductId: product.productMongoId,
        sellDate: new Date(),
        sellUnityPrice: product.unityPrice,
        sellQuantity: product.productQuantity,
        sellSubTotal: product.finalSubTotal,
        sellTaxes: product.taxes,
        sellTotal: product.netTotal,
        discount: product.totalDiscount,
        paymentType: product.paymentType,
        ticketNumber: `T-${uuidv4()}`,
        ticketEmisionDate: new Date(),
        storeName,
        userAtm
      });
    }

    await productModel.bulkWrite(productBulkOps, { session });

    const storeUpdateResult = await storeModel.updateOne(
      {
        _id: storeId,
        "months.monthDate": { $gte: hoyInicio, $lte: hoyFin }
      },
      {
        $inc: {
          "months.$.monthMount": storeSubTotal,
          "months.$.taxesMonth": storeTaxes,
          storeSubTotalEarned: storeSubTotal,
          storeTotalEarned: storeSubTotal - storeTaxes
        }
      },
      { session }
    );

    if (storeUpdateResult.matchedCount === 0) {
      await storeModel.updateOne(
        { _id: storeId },
        {
          $push: {
            months: {
              monthDate: new Date(),
              monthMount: storeSubTotal,
              taxesMonth: storeTaxes
            }
          },
          $inc: {
            storeSubTotalEarned: storeSubTotal,
            storeTotalEarned: storeSubTotal - storeTaxes
          }
        },
        { session }
      );
    }

    await sellModel.insertMany(sellsToInsert, { session });

    await session.commitTransaction();
    session.endSession();

    // =========================
    // 4️⃣ Response
    // =========================
    return res.status(200).json({
      message: "Venta realizada",
      qr_data: mpResponse.qr_data,
      qr_image: mpResponse.qr_image,
      remainingGiftCardMount
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({
      message: "Error processing sale"
    });
  }
};




export const orderByQuantityController = async (req: Request<{}, {}, {}, {storeId: string, order: number}>, res: Response): Promise<Response> => {
    const {storeId, order} = req.query
    const sortOrder: 1 | -1 = order === 1 ? 1 : -1;
    const orderSells = await sellModel.find({ _id: storeId }).sort({ sellQuantity: sortOrder });

    if(orderSells.length <= 0){
        return res.status(500).json({message: "Hubo un error al ordenar las ventas"})
    }

    return res.sendStatus(200)
}



export const filterByMonthController = async (req: Request<{}, {}, {}, { storeId: string; month: string }>, res: Response): Promise<Response> => {
  const { storeId, month } = req.query;

  if (!month) return res.status(400).json({ message: "Falta el parámetro month" });

  const date = new Date(month);
  if (isNaN(date.getTime())) return res.status(400).json({ message: "Fecha inválida" });

  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  const orderSells = await sellModel.find({
    _id: storeId,
    sellDate: { $gte: startDate, $lte: endDate },
  });

  if (orderSells.length === 0) {
    return res.status(404).json({ message: "No se encontraron ventas en ese mes" });
  }

  return res.status(200).json(orderSells);
};

export const getDayDataController = async (req:Request<{storeId: string}>, res:Response): Promise<Response> => {
    const {storeId} = req.params

    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const [store, sells, box] = await Promise.all([
   storeModel.findOne(
  { _id: storeId },
  {
    managerId: 1,
    storeImg: 1,
    storeName: 1,
    storePassword: 1,
    domicile: 1,
    identificationTaxNumber: 1,
    phone: 1,
    storeEmail: 1,
    moneyType: 1,
    active: 1,
    months: {
      $filter: {
            input: "$months",
            as: "m",
            cond: {
              $and: [
                { $gte: ["$$m.monthDate", hoyInicio] },
                { $lte: ["$$m.monthDate", hoyFin] }
              ]
            }
          }
        }
      }
    ).lean(),
    (async ()  => { 
      const arr = sellModel.aggregate([
      { 
        $match: { 
          storeId: storeId,
          sellDate: { $gte: hoyInicio, $lte: hoyFin }
        } 
      },
      {
       $group: {
          _id: null, // o puedes poner "$storeId" si querés identificar
          totalSold: { $sum: "$sellQuantity" },
          docCount: { $sum: 1 } // esto cuenta la cantidad de documentos
        }
      }
    ])
    return arr[0] || { 
      _id: null, 
      totalSold: 0, 
      docCount: 0 
    };
    })(),
      boxesModel.findOne({
        storeId: storeId,
        boxDate: {
          $gte: hoyInicio,
          $lte: hoyFin
        }
      }).lean()
    ]);

    return res.status(200).json({store, sells, box})
}