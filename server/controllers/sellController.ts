import {Request, Response} from "express"
import sellModel from "../models/sellModel.ts"
import productModel from "../models/productModel.ts";
import  {  v4  as  uuidv4  }  from  'uuid' ;
import { mp }  from "../lib/mp.ts";
import voucherModel from "../models/voucherModel.ts";
import boxesModel from "../models/boxModel.ts";
import storeModel from "../models/storeModel.ts";
import mongoose from "mongoose";
import { dev_url_back } from "../config.ts";
import { Order, Preference } from "mercadopago";



const preference = new Preference(mp);

export const getSellDataController = async (
  req: Request<{}, {}, {}, { storeId: string; cashierId: string }>,
  res: Response
) => {
  try {
    const { storeId, cashierId } = req.query;
   const [store, box] = await Promise.all([
      storeModel.findById(storeId).select("storeName"),
      boxesModel.findOne({ storeId, cashierId, isOpen: true }).select("_id")
    ]);


    return res.status(200).json({
      storeName: store.storeName,
      boxId: box!._id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error getting sell data"
    });
  }
};



/*export const sellProductController = async (
  req: Request<
    {},
    {},
    {
      products: ProductBody[];
      storeId: string;
      giftMount: number;
      storeName: string;
      cashierId: string;
      boxId: string;
    }
  >,
  res: Response
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      products,
      storeId,
      giftMount = 0,
      storeName,
      cashierId,
      boxId
    } = req.body;

    if (!products?.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    const paymentDiscounts: Record<string, number> = {
      efectivo: 0,
      tarjeta_debito: 20,
      tarjeta_credito: 30,
      transferencia: 40
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
    // Calcular montos en backend
    // =========================
    const calculatedProducts = products.map(product => {
      const paymentDiscount =
        paymentDiscounts[product.paymentType] || 0;

      const totalDiscount =
        paymentDiscount + (product.productDiscount || 0);

      const subTotalPrice =
        product.productPrice * product.productQuantity;

      let discountedSubTotal =
        subTotalPrice -
        (subTotalPrice * totalDiscount) / 100;

      // Aplicar gift card
      if (remainingGiftCardMount > 0) {
        if (discountedSubTotal <= remainingGiftCardMount) {
          remainingGiftCardMount -= discountedSubTotal;
          discountedSubTotal = 0;
        } else {
          discountedSubTotal -= remainingGiftCardMount;
          remainingGiftCardMount = 0;
        }
      }

      const totalEarned = Math.max(
        0,
        discountedSubTotal - product.productTaxe
      );

      storeSubTotal += discountedSubTotal;
      storeTaxes += product.productTaxe;

      return {
        ...product,
        subTotalEarned: discountedSubTotal,
        totalEarned,
        totalDiscount,
        totalTaxes: product.productTaxe
      };
    });

    // =========================
    // Total a cobrar (MercadoPago)
    // =========================
    const totalToPay = calculatedProducts.reduce(
      (acc, p) => acc + p.subTotalEarned,
      0
    );

    const orderId = uuidv4();

    const mpResponse = await mp.instoreOrders.create({
      body: {
        external_reference: orderId,
        title: `Venta de productos ${storeName}`,
        total_amount: totalToPay,
        items: [
          {
            sku_number: orderId,
            title: "Venta de productos",
            unit_price: totalToPay,
            quantity: 1,
            unit_measure: "unit",
            total_amount: totalToPay
          }
        ],
        store_id: storeId,
        notification_url: `${dev_url_back}/api/payments/webhook`
      }
    });

    // =========================
    // Operaciones DB
    // =========================
    for (const product of calculatedProducts) {
      // Actualizar stock
      productBulkOps.push({
        updateOne: {
          filter: {
            _id: product.productId,
            storeId
          },
          update: {
            $inc: {
              productQuantity: -product.productQuantity,
              totalSells: product.productQuantity,
              totalTaxes: product.totalTaxes,
              subTotalEarned: product.subTotalEarned,
              totalEarned: product.totalEarned
            }
          }
        }
      });

      // Insertar venta
      sellsToInsert.push({
        storeId,
        sproductId: product.productId,
        sellDate: new Date(),
        sellUnityPrice: product.productPrice,
        sellQuantity: product.productQuantity,
        sellSubTotal: product.subTotalEarned,
        sellTaxes: product.totalTaxes,
        sellTotal: product.totalEarned,
        discount: product.totalDiscount,
        paymentType: product.paymentType,
        ticketNumber: `T-${uuidv4()}`,
        ticketEmisionDate: new Date(),
        storeName,
        cashierId,
        boxId
      });
    }

    if (productBulkOps.length) {
      await productModel.bulkWrite(productBulkOps, { session });
    }

    if (sellsToInsert.length) {
      await sellModel.insertMany(sellsToInsert, { session });
    }

    // =========================
    // Actualizar Store
    // =========================
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

    // =========================
    // Actualizar Caja
    // =========================
    await boxesModel.updateOne(
      { _id: boxId, storeId, cashierId },
      { $inc: { totalMoneyInBox: storeSubTotal - storeTaxes } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

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
      message: "Error processing sale",
      error
    });
  }
};*/


const createOrder = async (orderId: string, storeId: string, totalToPay: number, cashierId: string, boxId: string) => {
 

  try {
    const mpResponse = await preference.create({
      body: {
        external_reference: orderId,
        items: [
          {
            id: uuidv4(),
            title: "Venta de productos",
            unit_price: Number(totalToPay),
            quantity: 1
          }
        ],
        metadata:{
          storeId,
          cashierId,
          boxId
        },
        notification_url: "https://03ae-200-32-101-183.ngrok-free.app/api/payments/webhook",
        back_urls: {
          success: "https://03ae-200-32-101-183.ngrok-free.app/success",
          failure: "https://03ae-200-32-101-183.ngrok-free.app/failure",
          pending: "https://03ae-200-32-101-183.ngrok-free.app/pending"
        }
      }
    });
    
    // URL del QR o link de pago
    return {
      qr_link: mpResponse.init_point, // este es el link que genera QR dinámico
      id: mpResponse.id
    };
    
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const sellProductController = async (
  req: Request<{}, {}, {
    products: { productId: string; productQuantity: number; paymentType: string; productDiscount: number }[];
    storeId: string;
    giftMount: number;
    storeName: string;
    cashierId: string;
    boxId: string;
  }>,
  res: Response
) => {
  /*const session = await mongoose.startSession();
  session.startTransaction();*/

  try {
    const { products, storeId, giftMount = 0, storeName, cashierId, boxId } = req.body;

    if (!products?.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    const paymentDiscounts: Record<string, number> = {
      efectivo: 0,
      tarjeta_debito: 20,
      tarjeta_credito: 30,
      transferencia: 40
    };

    let remainingGiftCardMount = giftMount;
    let storeSubTotal = 0;
    let storeTaxes = 0;

    const sellsToInsert: any[] = [];
    const calculatedProducts: any[] = [];

    // =========================
    // Calcular montos según DB
    // =========================
    for (const p of products) {
      const productFromDB = await productModel.findById(p.productId);
      if (!productFromDB) throw new Error(`Producto no encontrado: ${p.productId}`);

      const subTotalPrice = productFromDB.productPrice * p.productQuantity;
      const totalDiscount = (paymentDiscounts[p.paymentType] || 0) + (p.productDiscount || 0);

      let discountedSubTotal = subTotalPrice - (subTotalPrice * totalDiscount) / 100;

      if (remainingGiftCardMount > 0) {
        if (discountedSubTotal <= remainingGiftCardMount) {
          remainingGiftCardMount -= discountedSubTotal;
          discountedSubTotal = 0;
        } else {
          discountedSubTotal -= remainingGiftCardMount;
          remainingGiftCardMount = 0;
        }
      }

      const totalEarned = Math.max(0, discountedSubTotal - productFromDB.productTaxe);

      storeSubTotal += discountedSubTotal;
      storeTaxes += productFromDB.productTaxe;

      calculatedProducts.push({
        ...p,
        productPrice: productFromDB.productPrice,
        productTaxe: productFromDB.productTaxe,
        subTotalEarned: discountedSubTotal,
        totalEarned,
        totalDiscount
      });
    }

    // =========================
    // Total a pagar para MP
    // =========================
    const totalToPay: number = calculatedProducts.reduce((acc, p) => acc + p.subTotalEarned, 0);
    const orderId = uuidv4();

    const { qr_link, id: mpOrderId } = await createOrder(orderId, storeId, totalToPay, cashierId, boxId);


    // =========================
    // Actualizar stock en paralelo
    // =========================
    const stockUpdates = calculatedProducts.map(product =>
      productModel.updateOne(
        { _id: product.productId, storeId, productQuantity: { $gte: product.productQuantity } },
        { $inc: { productQuantity: -product.productQuantity } },
        //{ session }
      )
    );

    const stockResults = await Promise.all(stockUpdates);

    // Verificar que todos los productos tuvieron stock suficiente
    stockResults.forEach((result, i) => {
      if (result.matchedCount === 0) {
        throw new Error(`Stock insuficiente para ${calculatedProducts[i].productId}`);
      }
    });

    // =========================
    // Preparar ventas para insertar
    // =========================
    for (const product of calculatedProducts) {
      sellsToInsert.push({
        storeId,
        sproductId: product.productId,
        sellDate: new Date(),
        sellUnityPrice: product.productPrice,
        sellQuantity: product.productQuantity,
        sellSubTotal: product.subTotalEarned,
        sellTaxes: product.productTaxe,
        sellTotal: product.totalEarned,
        discount: product.totalDiscount,
        paymentType: product.paymentType,
        ticketNumber: `T-${uuidv4()}`,
        ticketEmisionDate: new Date(),
        storeName,
        cashierId,
        boxId
      });
    }

    if (sellsToInsert.length) {
      await sellModel.insertMany(sellsToInsert/*, { session }*/);
    }

    // =========================
    // Actualizar caja y store
    // =========================
    await boxesModel.updateOne(
      { _id: boxId, storeId, cashierId },
      { $inc: { totalMoneyInBox: storeSubTotal - storeTaxes } },
      { /*session,*/ upsert: true }
    );

    await storeModel.updateOne(
      { _id: storeId },
      { $inc: { storeSubTotalEarned: storeSubTotal, storeTotalEarned: storeSubTotal - storeTaxes } },
      //{ session }
    );

    /*await session.commitTransaction();
    session.endSession();*/

    return res.status(200).json({
      message: "Venta realizada",
      qr_link,
      mpOrderId,
      remainingGiftCardMount
    });

  } catch (error) {
    /*await session.abortTransaction();
    session.endSession();*/
    console.error(error);
    return res.status(500).json({ message: "Error processing sale", error });
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
        /*boxDate: {
          $gte: hoyInicio,
          $lte: hoyFin
        }*/
      }).lean()
    ]);

    return res.status(200).json({store, sells, box})
}

type StatsFilter = 'dia' | 'semana' | 'mes' | 'anio' | 'siempre';


export const getDateRange = (filter: StatsFilter) => {
  const now = new Date();

  switch (filter) {
    case 'dia': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);

      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    }

    case 'semana': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      return { start, end };
    }

    case 'mes': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }

    case 'anio': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start, end };
    }

    case 'siempre': {
      return {
        start: new Date(0),
        end: new Date()
      };
    }

    default:
      throw new Error('Filtro inválido');
  }
};


const getGroupByFilter = (filter: StatsFilter) => {
  switch (filter) {
    case 'dia':
      return {
        _id: { $hour: "$sellDate" },
        label: { $concat: [{ $toString: { $hour: "$sellDate" } }, ":00"] }
      };

    case 'semana':
      return {
        _id: { $dayOfWeek: "$sellDate" },
        label: {
          $arrayElemAt: [
            ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            { $subtract: [{ $dayOfWeek: "$sellDate" }, 1] }
          ]
        }
      };

    case 'mes':
      return {
        _id: { $week: "$sellDate" },
        label: { $concat: ["Sem ", { $toString: { $week: "$sellDate" } }] }
      };

    case 'anio':
      return {
        _id: { $month: "$sellDate" },
        label: {
          $arrayElemAt: [
            ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
            { $subtract: [{ $month: "$sellDate" }, 1] }
          ]
        }
      };

    case 'siempre':
      return {
        _id: { $year: "$sellDate" },
        label: { $toString: { $year: "$sellDate" } }
      };
  }
};

type QueryBody = {
  storeId: string,
  filter:string,
  start?:string,
  end?:string
}

export const getAllStatisticsController = async (req:Request<{}, {}, {query: QueryBody}>, res:Response): Promise<Response> => {
  const { storeId, filter, start, end } = req.body;
  
  let startDate: Date;
  let endDate: Date;

  if (start && end) {
    startDate = new Date(start);
    endDate = new Date(end);

    if (startDate > endDate) {
      return res.status(400).json({ message: 'Rango de fechas inválido' });
    }
  } else {
    // si no vienen fechas, usamos getDateRange
    const range = getDateRange(filter);
    startDate = range.start;
    endDate = range.end;
  }

  const groupConfig = getGroupByFilter(filter);

  const [sells, efectivo] = await Promise.all([
    // 🔹 SELLS
    sellModel.aggregate([
      {
        $match: {
          storeId,
          sellDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupConfig._id,
          cantidad: { $sum: 1 },
          productos: { $sum: "$sellQuantity" },
          ventas: { $sum: "$sellTotal" }
        }
      },
      {
        $project: {
          _id: 0,
          time: {
            $concat: [{ $toString: "$_id" }, ":00"]
          },
          cantidad: 1,
          productos: 1,
          ventas: 1
        }
      },
      { $sort: { time: 1 } }
    ]),

    // 🔹 BOXES (EFECTIVO)
    boxesModel.aggregate([
      {
        $match: {
          storeId,
          boxDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          efectivo: { $sum: "$totalMoneyInBox" }
        }
      }
    ])
  ]);

  const efectivoTotal = efectivo[0]?.efectivo || 0;

  return res.json(
    sells.map(s => ({
      ...s,
      efectivo: efectivoTotal
    }))
  );
};