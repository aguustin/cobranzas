import {Router} from "express"
import { createStoreController } from "../controllers/storeController.ts"
const router = Router()

import multer from "multer"
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/create_store', upload.single('storeImg'), createStoreController)

export default router