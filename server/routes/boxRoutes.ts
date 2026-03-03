import { Router } from "express";
import { cashCountController, createBoxController, deleteAllBoxesController, getBoxController, getBoxesListController, openCloseBoxController } from "../controllers/boxController.ts";
const router = Router()

router.post('/boxes_list', getBoxesListController)

router.post('/create_box', createBoxController)

router.post('/open_close_box', openCloseBoxController)

router.post('/delete_all_boxes', deleteAllBoxesController)

router.post('/get_box', getBoxController)

router.post('/update_cash_in_box', cashCountController)

export default router