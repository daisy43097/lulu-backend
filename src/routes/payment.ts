import {Router} from "express";
import {PaymentController} from "../controller/PaymentController";

const router = Router()

router.get('/:paymentId', PaymentController.one)
router.post('/', PaymentController.create)
router.delete('/:paymentId', PaymentController.delete)

export default router