import {Router} from "express"
import { changePlanController, createManagerContoller, mercadoPagoWebhookController } from "../controllers/managerController.ts"

const router = Router()

router.post('signIn_manager', createManagerContoller)

router.post('/change_plan', changePlanController)

router.post('/webhook', mercadoPagoWebhookController)

export default router