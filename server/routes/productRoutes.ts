import {Router} from "express"
import { listProductsController, registerProductController } from "../controllers/productController.ts"

const router = Router()

router.post('/get_products_filter', listProductsController)

router.post('/register_product', registerProductController)

export default router