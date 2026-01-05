import {Router} from "express"
import { changePlanController, mercadoPagoWebhookController } from "../controllers/managerController.ts"

const router = Router()

router.post('/change_plan', changePlanController)

router.post('/webhook', mercadoPagoWebhookController)

export default router