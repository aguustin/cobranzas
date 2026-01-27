import {Router} from "express"
import { listProductsController } from "../controllers/productController.ts"

const router = Router()

router.post('/get_products_filter', listProductsController)

export default router