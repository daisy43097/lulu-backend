import {Router} from "express";
import user from './user'
import order from './order'
import stripe from './stripe'
import payment from "./payment";
import {UserController} from "../controller/UserController";
const routes = Router()

routes.use('/user', user)
routes.use('/order', UserController.validateToken, order)
routes.use('/stripe', stripe)
routes.use('/payment', payment)

export default routes