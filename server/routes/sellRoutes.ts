import {Router} from "express"
import { getDayDataController } from "../controllers/sellController.ts"

const router = Router()

router.get('/get_day_data/:storeId', getDayDataController)

export default router