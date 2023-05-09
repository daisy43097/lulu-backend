import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Order} from "../entity/Order";

export class OrderController {

    public static get repo() {
        return getRepository(Order)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        return response.send('get all orders')
    }


    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        return response.send(`get one ${orderId}`)
    }

    static async create(request: Request, response: Response, next: NextFunction) {

    }

    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {
    }
}
