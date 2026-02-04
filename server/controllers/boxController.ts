import { Request, Response } from "express";
import boxesModel from "../models/boxModel.ts";

export const getBoxesListController = async (req: Request<{storeId: string}, {}, {}>, res:Response): Promise<Response> => {
    const {storeId} = req.params;

    const boxes = await boxesModel.find({storeId: storeId})

    res.status(200).json(boxes)
}

export const openBoxController = async (req: Request<{}, {}, {}>, res:Response): Promise<Response> => {

}