import {Router} from "express";
import user from './user'
import order from './order'

const routes = Router()

routes.use('/user', user)
routes.use('/order', order)


export default routes