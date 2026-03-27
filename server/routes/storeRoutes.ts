import {Router} from "express"
import { createStoreController, getAllStatisticsController, getStoreByIdController, listStoresByCashierController, listStoresController, updateStoreController } from "../controllers/storeController.ts"
const router = Router()

import multer from "multer"
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/create_store', upload.single('storeImg'), createStoreController)

router.get('/get_all_stores/:sessionId', listStoresController)

router.get('/get_all_stores_by_cashier/:sessionId', listStoresByCashierController)

router.post('/get_store_by_id', getStoreByIdController)

router.post('/update_store', upload.single('storeImg'), updateStoreController)


export default router