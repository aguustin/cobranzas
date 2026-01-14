import {Request, Response} from "express"
import sellModel from "../models/sellModel.ts"
import productModel from "../models/productModel.ts";
import  {  v4  as  uuidv4  }  from  'uuid' ;
import { mp }  from "../lib/mp.ts";
import voucherModel from "../models/voucherModel.ts";

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


export const sellProductController = async (req: Request<{}, {}, { products: ProductBody[], storeId: string, giftMount:number, storeName: string, userAtm: string }>, res: Response ): Promise<Response> => {
  const { products, storeId, giftMount, storeName, userAtm } = req.body;

  const paymentDiscounts: Record<number, number> = {
    1: 0,  // sin descuento
    2: 20, // tarjeta de débito
    3: 30, // tarjeta de crédito
    4: 40  // efectivo
  };

  const getSubTotalforMp: number = products.reduce((accumulator, currentProduct) => {
    const paymentDiscount = paymentDiscounts[currentProduct.paymentType] || 0;
    return accumulator + currentProduct.subTotalPrice - (currentProduct.subTotalPrice * paymentDiscount) / 100
  }, 0)

  const orderId: string = uuidv4()

  const response = await mp.instoreOrders.create({
  body: {
    external_reference: orderId,
    title: `Venta de productos ${products[0]?.storeName}`,
    description: "description",
    total_amount: getSubTotalforMp,
    items: [
      {
        sku_number: orderId,
        category: "marketplace",
        title: "Venta de productos",
        description: "description",
        unit_price: getSubTotalforMp,
        quantity: 1,
        unit_measure: "unit",
        total_amount: getSubTotalforMp,
      },
    ],
    store_id: products[0]?.storeId,
    notification_url:
      "https://75de159a824f.ngrok-free.app/api/payments/webhook",
  },
});

res.json({
  qr_data: response.qr_data,
  qr_image: response.qr_image,
});
  

  // Saldo disponible del gift card enviado desde el frontend
  let remainingGiftCardMount = giftMount ?? 0;

  await Promise.all(
    products.map(async (product) => {

      //Aplicación de descuentos por producto y medio de pago
      const paymentDiscount = paymentDiscounts[product.paymentType] || 0;
      const totalDiscount = (product.productDiscount || 0) + paymentDiscount;

      product.subTotalPrice = product.subTotalPrice - (product.subTotalPrice * totalDiscount / 100);

    
      if (remainingGiftCardMount > 0) {
        if (product.subTotalPrice <= remainingGiftCardMount) {
          // El giftCard cubre completamente este producto
          remainingGiftCardMount -= product.subTotalPrice;
          product.subTotalPrice = 0;
        } else {
          // El product aún queda con un valor a pagar
          product.subTotalPrice -= remainingGiftCardMount;
          remainingGiftCardMount = 0;
        }
      }

      await productModel.updateOne(
        { _id: product.productMongoId, storeId: product.storeId },
        {
          $inc: {
              productQuantity: -product.productQuantity,
              totalSells: product.productQuantity,
              totalTaxes: product.taxes,
              subTotalEarned: product.subTotalPrice,
              totalEarned: product.subTotalPrice - product.taxes,
          }
        }
      );

    const netTotal:number = Math.max(0, product.subTotalPrice - product.taxes);

      await sellModel.create({
          storeId: product.storeId,
          sproductId: product.productMongoId,
          sellDate: new Date(),
          sellUnityPrice: product.unityPrice,
          sellQuantity: product.productQuantity,
          sellSubTotal: product.subTotalPrice,
          sellTaxes: product.taxes,
          sellTotal: netTotal,
          discount: totalDiscount,
          paymentType: product.paymentType,
          ticketNumber: `T-${uuidv4()}`,
          ticketEmisionDate: new Date(),
          storeName,
          userAtm
      });
    }
));

 

  return res.status(200).json({  //devolver el valor al frontend y llamar updateGiftCardController para mandarle el giftcode y remainingGiftCardMount desde el frontend
    message: "Venta realizada",
    remainingGiftCardMount
  });
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