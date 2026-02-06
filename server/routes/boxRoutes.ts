import { Router } from "express";
import { createBoxController, getBoxesListController, openCloseBoxController } from "../controllers/boxController.ts";
const router = Router()

router.post('/boxes_list', getBoxesListController)

router.post('/create_box', createBoxController)

router.post('/open_close_box', openCloseBoxController)

export default router