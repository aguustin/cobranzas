import {Router} from "express"
import { changePlanController, createManagerContoller, getAllManagersController, loginController, mercadoPagoWebhookController } from "../controllers/managerController.ts"

const router = Router()

router.get('/get_all_managers', getAllManagersController)

router.post('/signIn_manager', createManagerContoller)

router.post('/login_manager', loginController)

router.post('/change_plan', changePlanController)

router.post('/webhook', mercadoPagoWebhookController)

export default router