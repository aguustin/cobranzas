import {Request, Response} from "express"
import sellModel from "../models/sellModel.ts"

export const orderByQuantityController = async (req: Request<{}, {}, {}, {storeId: string, order: number}>, res: Response): Promise<Response> => {
    const {storeId, order} = req.query
    const sortOrder: 1 | -1 = order === 1 ? 1 : -1;
    const orderSells = await sellModel.find({ _id: storeId }).sort({ sellQuantity: sortOrder });

    if(orderSells.length <= 0){
        return res.status(500).json({message: "Hubo un error al ordenar las ventas"})
    }

    return res.sendStatus(200)
}

export const filterByMonthController = async (
  req: Request<{}, {}, {}, { storeId: string; month: string }>, res: Response): Promise<Response> => {
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
