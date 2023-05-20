import {Router} from "express";
import {UserController} from "../controller/UserController";

const router = Router()

router.get('/', UserController.all)
router.get('/:userId', UserController.one)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/:userId', UserController.validateToken, UserController.update)
router.delete('/:userId', UserController.delete)


// router.get('/:orderId/:paymentStatus', (req, rs) => {
//     const {orderId, paymentStatus} = req.params
//     const {name, age} = req.query
//     const {token, did} = req.headers
//     let bodyOrder = req.body
//     console.log('order info:', bodyOrder)
//     let msg = `${orderId}, status: ${paymentStatus}`
//     let msg2 = `${token}, did is: ${did}`
//     console.log(msg)
//
//     let userInfo = {
//         name: 'Daisy',
//         occupation: 'SDE',
//         education: {
//             primary: 'beijing',
//             secondary: 'haidian'
//         }
//     }
//
//     rs.setHeader('Content-Type', 'application/json')
//     rs.setHeader('Last-Seen', '2023102120')
//     rs.setHeader('X-Powered-By', 'daisyserver')
//
//     // return rs.send(msg + msg2)
//     return rs.status(400).json(userInfo)
//     //return rs.redirect() or rs.file(file)
// })


export default router