import {Router} from "express"
import { changePlanController, connectPayPalController, createManagerContoller, getAllManagersController, loginManagerController, mercadoPagoWebhookController, paypalCallbackController } from "../controllers/managerController.ts"

const router = Router()

router.get('/get_all_managers', getAllManagersController)

router.post('/signIn_manager', createManagerContoller)

router.post('/login_manager', loginManagerController)

router.post('/change_plan', changePlanController)

router.post('/webhook', mercadoPagoWebhookController)

router.post('/connect', connectPayPalController)

router.get('/callback', paypalCallbackController)

export default router