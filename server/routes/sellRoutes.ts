import {Router} from "express"
import { getAllStatisticsController, getDayDataController, getOrdersController, getReportController, getSellDataController, getSellsController, sellProductController, webhookHandlerController } from "../controllers/sellController.ts"

const router = Router()

router.get('/get_day_data/:storeId', getDayDataController)

router.post('/get_statistics', getAllStatisticsController)

router.get("/sell_data", getSellDataController);

router.post('/new_sell', sellProductController)

router.post("/webhook/mercadopago", webhookHandlerController)

router.get('/get_sells', getSellsController)

router.post("/reports/:storeId", getReportController);

router.post('/orders',getOrdersController)

export default router