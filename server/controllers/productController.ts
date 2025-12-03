import { Request, Response } from "express";
import productModel from "../models/productModel";
import storeModel from "../models/storeModel";


interface SoldProduct {
  storeId: string;
  productMongoId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  taxes: number;
  subTotalPrice: number,
  totalPrice: number;
}

export const registerProductController = async ( req: Request, res:Response): Promise<Response> => {
    const {storeId, productId, productName, productPrice, productCategory, productColor, productQuantity, productTaxe} = req.body

    if(storeId.length > 0 && productId.length > 0 && productName.length > 0 && productPrice > 0 && productQuantity > 0){
        await productModel.create({
            storeId: storeId,
            productId: productId,
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productColor: productColor,
            productQuantity: productQuantity,
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

export const sellProductController = async (req: Request<{}, {}, SoldProduct[]>, res:Response): Promise<Response> => {
    const productsData: SoldProduct[] = req.body
    
    await Promise.all(
        productsData.map(product =>
            productModel.updateOne(
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
            )
        )
    );

    return res.sendStatus(200)
}

