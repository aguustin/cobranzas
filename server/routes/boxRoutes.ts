import { Router } from "express";
import { boxMovementController, cashCountController, createBoxController, deleteAllBoxesController, getBoxController, getBoxesListController, getMovementsController, openCloseBoxController } from "../controllers/boxController.ts";
const router = Router()

router.post('/boxes_list', getBoxesListController)

router.post('/create_box', createBoxController)

router.post('/open_close_box', openCloseBoxController)

router.post('/delete_all_boxes', deleteAllBoxesController)

router.post('/get_box', getBoxController)

router.post('/update_cash_in_box', cashCountController)

router.post('/box_movement', boxMovementController)

router.get('/get_movements/:storeId', getMovementsController)

export default router