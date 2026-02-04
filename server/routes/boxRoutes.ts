import { Router } from "express";
const router = Router()

router.get('/boxes_list/:storeId', getBoxesListController)