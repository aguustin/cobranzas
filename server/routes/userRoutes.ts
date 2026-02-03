import {Router} from "express"
import multer from "multer"
import { changePassController, confirmRecoveryPassController, getAllCashiersController, loginCashierController, recoverPasswordController, registerCashierController, subsCashierController, updateCashierController } from "../controllers/cashierController.ts";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const router = Router()

router.get('/get_all_cashiers', getAllCashiersController)

router.post('/register_cashier', upload.single('userPhoto'), registerCashierController)

router.post('/login_cashier', loginCashierController)

router.post('/subs_cashier', subsCashierController)

router.post('/recover_cashier_password', recoverPasswordController)

router.post('/confirm_recover_cashier_password', confirmRecoveryPassController)

router.post('/change_cashier_password', changePassController)

router.post('/update_cashier_profile', upload.single('userPhoto'), updateCashierController)

export default router