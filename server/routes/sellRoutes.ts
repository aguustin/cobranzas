import {Router} from "express"
import { getAllStatisticsController, getDayDataController } from "../controllers/sellController.ts"

const router = Router()

router.get('/get_day_data/:storeId', getDayDataController)

router.post('/get_statistics', getAllStatisticsController)

export default router