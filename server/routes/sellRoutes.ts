import {Router} from "express"
import { getAllStatisticsController, getDayDataController, getSellDataController, sellProductController, webhookHandlerController } from "../controllers/sellController.ts"

const router = Router()

router.get('/get_day_data/:storeId', getDayDataController)

router.post('/get_statistics', getAllStatisticsController)

router.get("/sell_data", getSellDataController);

router.post('/new_sell', sellProductController)

router.post("/webhook/mercadopago", webhookHandlerController)

export default router