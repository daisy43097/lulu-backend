import {NextFunction, Request, Response} from "express";
import {Order, OrderDTO, ProductDTO} from "../entity/Order";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {IdCheckRes, UtilController} from "./UtilController";
import {User} from "../entity/User";
import {validate} from "class-validator";
import {Payment} from "../entity/Payment";

export class OrderController extends UtilController{

    static async getOneProduct(props) {
        const prodId = props[0]
        const colorId = props[1]
        const size = props[2]
        const quantity = props[3]
        const axios = require('axios');
        let tempProduct = await axios.get(`http://api-lulu.hibitbyte.com/product/${prodId}?mykey=quYInIkWzFGYyyky7DctmZoBuri44pHZN4h5kR9BFF44/rkQcKv1cL2k3cM6t8AltVEQXGxLar2Q6FNCPM7/xw==`)
            .then(res => res.data.rs)
            .catch(err => console.log(err))
        let tempImage = tempProduct?.images.find(img => img.colorId === colorId)
        let product: ProductDTO = {
            title: tempProduct.name,
            productId: prodId,
            size,
            price: tempProduct.price,
            color: tempImage.colorAlt,
            colorId,
            image: tempImage.mainCarousel.media.split(' | ').filter(i => i)[0],
            quantity
        }
        return product
    }

    static async getProducts(order) {
        let productStrs = order.products.split(' | ').filter(i => i)
        let products = await Promise.all(productStrs.map(str => {
            let props = str.split('-').filter(i => i)
            return OrderController.getOneProduct(props).then(res => res).catch(e => console.log(e))
        }))

        return products
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let {userId} = request.params
        if (!userId)
            return response
                .status(400)
                .send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter));
        let orders: Order[]
        let result: OrderDTO[]

        try {
            let res = await OrderController.validateOrder(parseInt(userId))

            orders = await Order.find({
                where: {
                    user: {id: parseInt(userId)}
                },
                order: {
                    createAt: "DESC"
                },
                relations: ['payment']
            })
            await OrderController.getProducts(orders[0])
            result = await Promise.all(orders.map( async order => {
                let products = await OrderController.getProducts(order)
                return {
                    id: order.id,
                    payment: order.payment,
                    products,
                    status: order.status,
                    isActive: order.isActive,
                    isDelete: order.isDelete,
                    createAt: order.createAt,
                    updateAt: order.updateAt
                }
            }))
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrNoObj, e))
        }

        return response
            .status(200)
            .send(new Err(HttpCode.E200, ErrStr.OK, result));

    }


    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        if (!orderId)
            return response
                .status(400)
                .send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter));

        let order: Order
        try {
            order = await Order.findOneOrFail({where: {id: parseInt(orderId)}})
        } catch (e) {
            return response
                .status(400)
                .send(new Err(HttpCode.E400, ErrStr.ErrNoObj, e));
        }

        return response
            .status(200)
            .send(new Err(HttpCode.E200, ErrStr.OK, order));
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let {products, user, billAddress, shipAddress, total, taxRate} = request.body

        let order;
        try {
            let res = await OrderController.validateOrder(user)

            let payment = Payment.create({billAddress, shipAddress, total, taxRate})
            const paymentErrors = await validate(payment)
            if (paymentErrors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, paymentErrors))
            }

            order = Order.create({products, user: res.entities[0], payment})
            const orderErrors = await validate(order)
            if (orderErrors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, orderErrors))
            }

            await order.save()
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(HttpCode.E200).send(new Err(HttpCode.E200, ErrStr.OK, order.id))
    }

    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {
    }

    // generate invoice

    static async createInvoice(request: Request, response: Response, next: NextFunction) {
        const fs = require('fs');
        const PDFDocument = require('pdfkit');
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-disposition', 'attachment; filename='+ 'invoice' +'.pdf');
        const {order} = request.body
        let doc = new PDFDocument({margin: 50})

        OrderController.generateHeader(doc); // Invoke `generateHeader` function.
        OrderController.generateCustomerInformation(doc, order)
        OrderController.generateInvoiceTable(doc, order)
        OrderController.generateFooter(doc); // Invoke `generateFooter` function.

        // doc.pipe(fs.createWriteStream(path));

        doc.pipe(response)
        doc.end();

    }
}
