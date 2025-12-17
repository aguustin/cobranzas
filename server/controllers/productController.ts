import { Request, Response } from "express";
import productModel from "../models/productModel.ts";
import storeModel from "../models/storeModel.ts";
import clientModel from "../models/clientModel.ts";
import { updateGiftCardController } from "./giftCardController.ts";
import sellModel from "../models/sellModel.ts";
import managerModel from "../models/managerModel.ts";


interface ProductBody {
  storeId: string;
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



export const registerProductController = async ( req: Request, res:Response): Promise<Response> => {
    const {storeId, productId, productName, productPrice, productCategory, productDiscount, productQuantity, productTaxe} = req.body

    if(storeId.length > 0 && productId.length > 0 && productName.length > 0 && productPrice > 0 && productQuantity > 0){
        await productModel.create({
            storeId: storeId,
            productId: productId,
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productQuantity: productQuantity,
            productDiscount: productDiscount ?? 0,
            productTaxe: productTaxe
        })
        
        return res.status(201).json({ continue: 1 });
    }
   
    return res.status(400).json({ continue: 0 });
}


export const addSizesController = async (req: Request<{}, {}, { storeId: string; sizeNumber: number; value: string }>, res: Response) => {
  try {
    const { storeId, sizeNumber, value } = req.body;

    const sizeMap: Record<number, string> = {
      1: "sizeSm",
      2: "sizeS",
      3: "sizeM",
      4: "sizeL",
      5: "sizeXL",
      6: "sizeXXL",
      7: "sizexXXL"
    };

    const sizeField = sizeMap[sizeNumber];
    if (!sizeField) return res.status(400).json({ msg: "Número de talla inválido" });

    
    const result = await productModel.updateOne(
      { storeId, "sizes.0": { $exists: true } },
      { $set: { [`sizes.0.${sizeField}`]: value } }
    );


    if (result.matchedCount === 0) {
      await productModel.updateOne(
        { storeId },
        { $push: { sizes: { [sizeField]: value } } }
      );
    }

    res.json({ msg: "Talla agregada/actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ msg: "Error al agregar talla", error: err });
  }
};

export const listProductsController = async (req: Request<{}, {}, {storeId: string}>, res: Response) => {
    const {storeId} = req.body

    const products = await productModel.find({storeId: storeId})

    res.status(200).json({products})
}

export const getProductById = async (req:Request<{productMongoId: string}>, res:Response): Promise<Response> => {
    const {productMongoId} = req.params
    const findProduct = await productModel.findOne({_id: productMongoId})

    if(findProduct){
      return res.status(200).json(findProduct)
    }
    return res.sendStatus(204).json(1)
}


export const getProductsByCategory = async (req:Request<{ storeId: string; productCategory: string }>, res: Response) => {
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



export const getStatisticsController = async (req: Request<{type: number}, {}, {idType: string}>, res: Response): Promise<Response> =>{
  const {type} = req.params
  const {idType} = req.body
  let statistics;

  const statisticsMap: Record<number, () => Promise<any>> = {
      1: () => managerModel.findById(idType),
      2: () => storeModel.findOne({ managerId: idType }),
      3: () => productModel.findOne({ storeId: idType }),
      4: () => sellModel.findOne({ storeId: idType }),
      5: () => productModel.findOne({ storeId: idType }),
  }

  const query = statisticsMap[type]

  statistics = await query

  return res.status(200).json({statistics})
}
