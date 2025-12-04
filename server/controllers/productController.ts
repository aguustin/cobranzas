import { Request, Response } from "express";
import productModel from "../models/productModel.ts";
import storeModel from "../models/storeModel.ts";
import clientModel from "../models/clientModel.ts";
import { updateGiftCardController } from "./giftCardController.ts";


interface ProductBody {
  storeId: string;
  productMongoId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productDiscount: number;
  paymentType: number;
  taxes: number;
  subTotalPrice: number;
  totalPrice: number;
}

export const registerProductController = async ( req: Request, res:Response): Promise<Response> => {
    const {storeId, productId, productName, productPrice, productCategory, productDiscount, productColor, productQuantity, productTaxe} = req.body

    if(storeId.length > 0 && productId.length > 0 && productName.length > 0 && productPrice > 0 && productQuantity > 0){
        await productModel.create({
            storeId: storeId,
            productId: productId,
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productColor: productColor,
            productQuantity: productQuantity,
            productDiscount: productDiscount ?? 0,
            productTaxe: productTaxe
        })
        
        return res.status(201).json({ message: "Producto registrado" });
    }
   
    return res.status(400).json({ message: "Datos inválidos" });
}


export const listProductsController = async (req: Request<{}, {}, {storeId: string}>, res: Response) => {
    const {storeId} = req.body

    const getProducts = await productModel.find({storeId: storeId})

    res.status(200).json({productsData: getProducts})
}


export const getProductByCategory = async (req:Request<{ storeId: string; productCategory: string }>, res: Response) => {
    const {storeId, productCategory} = req.params

    const getCategory = await productModel.find({storeId: storeId, productCategory: productCategory})

    res.status(200).json({category: getCategory})
}

export const updateProductController = async (req: Request<{}, {}, ProductBody>, res: Response) => {
    const { productMongoId, productName, productPrice, productQuantity, productDiscount } = req.body

    const getProductData = await productModel.findOne({_id: productMongoId})

    if(getProductData){
        await productModel.updateOne(
            {_id: productMongoId},
            {
                $set:{
                    productName: productName ?? getProductData.productName, 
                    productPrice: productPrice ?? getProductData.productPrice, 
                    productQuantity: productQuantity ?? getProductData.productQuantity, 
                    discount: productDiscount ?? getProductData.productDiscount
                }
            }
        )
    }
}

export const subsProductController = async (req: Request, res: Response) => {
    const {productMongoId} = req.body

    const checkState = await productModel.findOne({_id: productMongoId})

    if(checkState){
        checkState.active 
        ? 
        await productModel.updateOne(
            {_id: productMongoId},
            {
                $set:{
                    active: false
                }
            }
        )
        :
          await productModel.updateOne(
            {_id: productMongoId},
            {
                $set:{
                    active: true
                }
            }
        )
        return res.status(200).json({message: "Estado del producto cambiado"})
    }

    return res.status(201).json({message: "No se encontro el producto"})
}


export const sellProductController = async (req: Request<{}, {}, { products: ProductBody[], giftMount: number }>, res: Response ): Promise<Response> => {

  const { products, giftMount } = req.body;

  // Descuentos por medio de pago
  const paymentDiscounts: Record<number, number> = {
    1: 0,  // sin descuento
    2: 20, // tarjeta de débito
    3: 30, // tarjeta de crédito
    4: 40  // efectivo
  };

  // Saldo disponible del gift card enviado desde el frontend
  let remainingGiftCardMount = giftMount ?? 0;

  await Promise.all(
    products.map(async (product) => {

      // 1️⃣ Aplicación de descuentos por producto y medio de pago
      const paymentDiscount = paymentDiscounts[product.paymentType] || 0;
      const totalDiscount = (product.productDiscount || 0) + paymentDiscount;

      product.subTotalPrice = product.subTotalPrice - (product.subTotalPrice * totalDiscount / 100);

      // 2️⃣ Aplicación progresiva del GiftCard
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

      // 3️⃣ Actualización del producto en la base de datos
      await productModel.updateOne(
        { _id: product.productMongoId, storeId: product.storeId },
        {
          $inc: {
            productQuantity: -product.productQuantity,
            totalSells: product.productQuantity,
            totalTaxes: product.taxes,
            subTotalMonthEarned: product.subTotalPrice,
            subTotalEarned: product.subTotalPrice,
            totalEarned: product.subTotalPrice - product.taxes
          }
        }
      );
    })
  );

  return res.status(200).json({  //devolver el valor al frontend y llamar updateGiftCardController para mandarle el giftcode y remainingGiftCardMount desde el frontend
    message: "Venta realizada",
    remainingGiftCardMount
  });
};