import { Router } from "express";
import { createBoxController, getBoxesListController, openCloseBoxController } from "../controllers/boxController.ts";
const router = Router()

router.get('/boxes_list/:storeId', getBoxesListController)

router.post('/create_box', createBoxController)

router.put('/open_close_box/:boxId/:isOpen', openCloseBoxController)

export default router