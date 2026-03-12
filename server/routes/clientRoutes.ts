
import {Router} from "express"
import { getClientsController, subsClientController } from "../controllers/clientController.ts";

const router = Router()

router.get('/get_clients/:storeId', getClientsController)

router.post('/unsub_client', subsClientController)


export default router