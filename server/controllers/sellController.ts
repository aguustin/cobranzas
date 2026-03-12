import {Request, Response} from "express"
import sellModel from "../models/sellModel.ts"
import productModel from "../models/productModel.ts";
import  {  v4  as  uuidv4  }  from  'uuid' ;
import { mp }  from "../lib/mp.ts";
import voucherModel from "../models/voucherModel.ts";
import boxesModel from "../models/boxModel.ts";
import storeModel from "../models/storeModel.ts";
import { Payment, Preference } from "mercadopago";
import QRCode from "qrcode";
import orderModel from "../models/orderModel.ts";
import clientModel from "../models/clientModel.ts";
import mongoose from "mongoose";


const preference = new Preference(mp);

export const getSellDataController = async (
  req: Request<{}, {}, {}, { storeId: string; cashierId: string }>,
  res: Response
) => {
  try {
    const { storeId, cashierId } = req.query;
  
    const [store, box] = await Promise.all([
      storeModel.findById(storeId).select("storeName"),
      boxesModel.findOne({ storeId, cashierId, isOpen: true })
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



export const webhookHandlerController = async (req, res) => {
  try {
    const { type, data } = req.body

    if (type !== "payment") {
      return res.sendStatus(200)
    }

    const paymentClient = new Payment(mp)

    const payment = await paymentClient.get({
      id: data.id
    })

    if (payment.status !== "approved") {
      return res.sendStatus(200)
    }

    const externalReference = payment.external_reference

    if (!externalReference) {
      return res.sendStatus(200)
    }

    const order = await orderModel.findOne({ externalReference })

    if (!order) {
      return res.sendStatus(200)
    }

    if (order.status === "approved") {
      return res.sendStatus(200)
    }

    // ✅ Actualizar orden
    order.status = "approved"
    order.paymentId = payment.id?.toString()
    order.paymentMethod = payment.payment_method_id
    order.paymentStatusDetail = payment.status_detail
    order.paidAt = new Date()

    await order.save()

    // Descontar stock
    for (const item of order.products) {
      await productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.productQuantity , totalSells: item.productQuantity} }
      )
    }

    return res.sendStatus(200)

  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
}


export const sellProductController = async (req, res) => {
  try {
    const {
      products,
      storeId,
      giftMount = 0,
      storeName,
      cashierId,
      boxId,
      clientName,
      phone,
      email
    } = req.body

    let paymentType;

    if (!products?.length) {
      return res.status(400).json({ message: "No products provided" })
    }

    const paymentDiscounts: Record<string, number> = {
      efectivo: 0,
      tarjeta_debito: 20,
      tarjeta_credito: 30,
      transferencia: 40
    }

    let remainingGiftCardMount = giftMount
    let storeSubTotal = 0
    let storeTaxes = 0
    const calculatedProducts: any[] = []

    // =========================
    // Calcular montos reales
    // =========================
    for (const p of products) {
      const productFromDB = await productModel.findById(p.productId)
      if (!productFromDB)
        throw new Error(`Producto no encontrado: ${p.productId}`)

      const subTotalPrice =
        productFromDB.productPrice * p.productQuantity
      
      const totalDiscount =
        (paymentDiscounts[p.paymentType] || 0) +
        (p.productDiscount || 0)
      
      let discountedSubTotal =
        subTotalPrice - (subTotalPrice * totalDiscount) / 100

      if (remainingGiftCardMount > 0) {
        if (discountedSubTotal <= remainingGiftCardMount) {
          remainingGiftCardMount -= discountedSubTotal
          discountedSubTotal = 0
        } else {
          discountedSubTotal -= remainingGiftCardMount
          remainingGiftCardMount = 0
        }
      }


      const totalEarned = Math.max(
        0,
        discountedSubTotal - productFromDB.productTaxe
      )
      
      storeSubTotal += discountedSubTotal
      storeTaxes += (subTotalPrice * productFromDB.productTaxe) / 100
      
      calculatedProducts.push({
        productId: productFromDB._id,
        productName: productFromDB.productName,
        productQuantity: p.productQuantity,
        productPrice: productFromDB.productPrice,
        productTaxe: productFromDB.productTaxe,
        subTotalEarned: discountedSubTotal,
        totalEarned,
        totalDiscount
      })
      paymentType = p.paymentType
    }
    
    const totalToPay = calculatedProducts.reduce(
      (acc, p) => acc + p.subTotalEarned,
      0
    ) + storeTaxes

    const clientQuantity = calculatedProducts.reduce(
      (acc, c) => acc + c.productQuantity, 
      0
    )
    
    const externalReference = uuidv4()

    // =========================
    // 1️ Crear orden en tu DB (PENDING)
    // =========================
    const client = await clientModel.findOne({ 
      storeId: storeId,
      phone: phone // o email si es único
    });

    if(!client){
      console.log('no se encontro ', clientName, ' ', phone, ' ', email)
       await clientModel.create({
        storeId,
        clientName:clientName,
        phone:Number(phone),
        email:email,
        clientProductQuantity: clientQuantity,
        totalSpent: totalToPay,
        giftCard: 0,
        active: true
      });
    }else{
      console.log('se encontro')
      await clientModel.updateOne(
        {
          storeId: storeId,
          phone: phone,
        },
        {
          $inc: {
            clientProductQuantity: clientQuantity,
            totalSpent: totalToPay
          },
          $set: {
            clientName: clientName,
            email: email
          }
        }
      );
    }
     if(paymentType === 'efectivo'){
      
      Promise.all([
         await orderModel.create({
            paymentType: "efective",
            paidAt: Date.now(),
            storeId,
            storeName,
            cashierId,
            boxId,
            products: calculatedProducts,
            storeSubTotal,
            storeTaxes,
            totalToPay,
        }),

        await boxesModel.updateOne({_id: boxId}, {$inc:{cashSales: totalToPay, totalMoneyInBox: totalToPay}})
      ])
      return res.status(200).json(1)
    }

    const order = await orderModel.create({
      externalReference,
      paidAt: Date.now(),
      storeId,
      storeName,
      cashierId,
      boxId,
      paymentType: "qr",
      products: calculatedProducts,
      storeSubTotal,
      storeTaxes,
      totalToPay,
      status: "pending"
    })

    // =========================
    // 2 Crear orden QR en Mercado Pago
    // =========================

   
    const response = await fetch(
      `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${process.env.MP_USER_ID}/stores/${storeId}/pos/${posId}/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          external_reference: externalReference,
          title: "Venta NovaStore",
          description: "Venta mostrador",
          total_amount: Number(totalToPay),
          items: [
            {
              sku_number: "VENTA",
              category: "others",
              title: "Venta productos",
              quantity: 1,
              unit_price: Number(totalToPay),
              unit_measure: "unit",
              total_amount: Number(totalToPay)
            }
          ]
        })
      }
    )

    //https://0a15-200-32-101-183.ngrok-free.app

    const data = await response.json()

    if (!response.ok) {
      // Si falla MP, eliminar orden pending
      await orderModel.findByIdAndDelete(order._id)
      console.log("MP STATUS:", response.status)
      console.log("MP ERROR FULL:", data)
      throw new Error(data.message || "Error creating MP order")
    }
    
    // Guardar id de MP
    order.orderId = data.id
    await order.save()

    const qrImage = await QRCode.toDataURL(data.qr_data)

    return res.status(200).json({
      message: "Venta iniciada - esperando pago",
      qrImage,
      mpOrderId: data.in_store_order_id,
      remainingGiftCardMount
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Error processing sale",
      error: error.message
    })
  }
}

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

export const getDayDataController = async (
  req: Request<{ storeId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { storeId } = req.params;
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);
    const storeQuery = storeModel.findOne(
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
        storeTotalEarned: 1,
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
    ).lean();

    const sellsQuery = sellModel
      .aggregate([
        {
          $match: {
            storeId: storeId,
            sellDate: { $gte: hoyInicio, $lte: hoyFin }
          }
        },
        {
          $group: {
            _id: null,
            totalSold: { $sum: "$sellQuantity" },
            docCount: { $sum: 1 }
          }
        }
      ])
      .exec();

    const boxQuery = boxesModel
      .findOne({
        storeId: storeId
        // boxOpenDate: { $gte: hoyInicio, $lte: hoyFin }
      })
      .lean();
      const [store, sellsArr, box] = await Promise.all([
        storeQuery,
        sellsQuery,
        boxQuery
      ]);
      
      const sells = sellsArr[0] || {
        _id: null,
        totalSold: 0,
        docCount: 0
      };
      
    return res.status(200).json({
      store,
      sells,
      box
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error getting day data"
    });
  }
};

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
        _id: { $isoWeek: "$sellDate" },
        label: { $concat: ["Sem ", { $toString: { $isoWeek: "$sellDate" } }] }
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
  console.log( storeId, ' ', filter, ' ', ' ', start, ' ', end)
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
  const matchStage = {
    storeId
  };

  if (start && end) {
    matchStage.sellDate = { $gte: startDate, $lte: endDate };
}

  const [sells, efectivo] = await Promise.all([
    // 🔹 SELLS
    sellModel.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: groupConfig._id,
          cantidad: { $sum: 1 },
          productos: { $sum: "$sellQuantity" },
          ventas: { $sum: "$sellTotal" },
          withdrawals: { $sum: "$wi"}
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
          boxOpenDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: storeId,
          efectivo: { $sum: "$totalMoneyInBox" }
        }
      }
    ])
  ]);

  const efectivoTotal = efectivo[0]?.efectivo || 0;
  console.log(sells, '   ', efectivoTotal)
  return res.json(
    sells.map(s => ({
      ...s,
      efectivo: efectivoTotal
    }))
  );
};


export const getSellsController = async (req: Request, res: Response) => {
    const resp = await sellModel.find({})
    console.log(resp)
    return res.send(resp)
}

const buildMatchFilter = (storeId, filters) => {

  const match = {
    storeId: storeId,
    status: "pending"  //debe filtar los datos aprobados, para eso cambiar el status a "approved"
  }

  if (filters.startDate && filters.endDate) {

    const start = new Date(filters.startDate)
    const end = new Date(filters.endDate)

    end.setHours(23,59,59,999)

    match.paidAt = {
      $gte: start,
      $lte: end
    }

  }

  if (filters.cashierId) {
    match.cashierId = filters.cashierId
  }
console.log('cashierId: ', filters.cashierId)
  if (filters.productId) {
    match["products.productId"] = filters.productId
  }
console.log('productId: ', filters.productId)
  return match
}


const getSalesByDate = async (storeId, filters) => {

  const match = buildMatchFilter(storeId, filters)

  return await orderModel.aggregate([

    { $match: match },

    { $unwind: "$products" },

    {
      $lookup: {
        from: "usermodels",
        let: { cashierId: { $toObjectId: "$cashierId" } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$cashierId"] }
            }
          }
        ],
        as: "cashier"
      }
    },

    {
      $unwind: {
        path: "$cashier",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {

        date: "$paidAt",

        productName: "$products.productName",

        quantity: "$products.productQuantity",

        price: "$products.productPrice",

        subTotal: "$products.subTotalEarned",

        total: "$products.totalEarned",

        paymentType: 1,

        cashierName: "$cashier.fullName",

       // cashierPhoto: "$cashier.userPhoto"

      }
    }

  ])

}


const getSalesByProduct = async (storeId, filters) => {

  const match = buildMatchFilter(storeId, filters)

  return await orderModel.aggregate([

    { $match: match },

    { $unwind: "$products" },

    {
      $group: {

        _id: "$products.productId",

        totalSold: { $sum: "$products.productQuantity" },

        totalRevenue: { $sum: "$products.totalEarned" },

        avgPrice: { $avg: "$products.productPrice" }

      }
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },

    { $unwind: "$product" },

    {
      $project: {

        productName: "$product.name",

        totalSold: 1,

        totalRevenue: 1,

        avgPrice: 1

      }
    }

  ])

}


const getSalesByCashier = async (storeId, filters) => {

  const match = buildMatchFilter(storeId, filters)

  return await orderModel.aggregate([

    { $match: match },

    {
      $group: {

        _id: "$cashierId",

        totalOrders: { $sum: 1 },

        totalRevenue: { $sum: "$totalToPay" }

      }
    },

    {
      $lookup: {

        from: "usermodels",

        localField: "_id",

        foreignField: "_id",

        as: "cashier"

      }
    },

    { $unwind: "$cashier" },

    {
      $project: {

        cashierName: "$cashier.fullName",

        //cashierPhoto: "$cashier.userPhoto",

        totalOrders: 1,

        totalRevenue: 1

      }
    }

  ])

}


const getNetProfit = async (storeId, filters) => {

  const match = buildMatchFilter(storeId, filters)

  return await orderModel.aggregate([

    { $match: match },

    {
      $group: {

        _id: null,

        subTotal: { $sum: "$storeSubTotal" },

        taxes: { $sum: "$storeTaxes" },

        totalRevenue: { $sum: "$totalToPay" },

        orders: { $sum: 1 }

      }
    }

  ])

}


export const getReportController = async (req, res) => {

  try {

    const { storeId } = req.params
    const { reportType, filters } = req.body
    console.log('storeid: ', storeId, ' ', 'report type: ', reportType, ' ', 'filters: ', filters)
    let result

    switch (reportType) {

      case "sales_by_date":
        result = await getSalesByDate(storeId, filters)
        break

      case "sales_by_product":
        result = await getSalesByProduct(storeId, filters)
        break

      case "sales_by_cashier":
        result = await getSalesByCashier(storeId, filters)
        break

      case "net_profit":
        result = await getNetProfit(storeId, filters)
        break

      default:
        return res.status(400).json({message:"Invalid report type"})
    }
    console.log(result)
    res.json(result)

  } catch (error) {

    console.error(error)
    res.status(500).json({message:"Error generating report"})
  }
}


export const getOrdersController = async (req:Request, res:Response): Promise<Response> => {
  const {storeId} = req.body
  const orders = await orderModel.find({storeId: storeId})
  return res.status(200).json(orders)
}

/** // =========================
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
      await sellModel.insertMany(sellsToInsert/*, { session });
    }

    // =========================
    // Actualizar caja y store
    // =========================
    await boxesModel.updateOne(
      { _id: boxId, storeId, cashierId },
      { $inc: { totalMoneyInBox: storeSubTotal - storeTaxes } },
      { /*session, upsert: true }
    );

    await storeModel.updateOne(
      { _id: storeId },
      { $inc: { storeSubTotalEarned: storeSubTotal, storeTotalEarned: storeSubTotal - storeTaxes } },
      //{ session }
    ); */