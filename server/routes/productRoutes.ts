import {Router} from "express"
import { getProductByIdController, listProductsController, registerProductController, updateProductController } from "../controllers/productController.ts"
import multer from "multer"
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const router = Router()

router.post('/get_products_filter', listProductsController)

router.post('/register_product', upload.single('productImg'), registerProductController)

router.post('/update_product', upload.single('productImg'), updateProductController)

router.get('/get_product_by_id/:storeId/:productMongoId', getProductByIdController)

export default router