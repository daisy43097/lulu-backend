import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {SALT_ROUNDS} from "../helper/const";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {AppDataSource} from "../data-source";

const bcrypt = require('bcrypt')


export class UserController {

    // public static get repo() {
    //     return getRepository(User)
    // }

    static async all(request: Request, response: Response, next: NextFunction) {
        return response.send('get all users')
    }


    static async one(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        return response.send(`get one ${userId}`)
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let {email, password, firstName, lastName} = request.body
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
            let user: User = User.create({
                email: email,
                password: hash,
                firstName: firstName,
                lastName: lastName
            })


            validate(user).then(errors => {
                if (errors.length >= 1) {
                    return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
                }

                user.save()
                UserController.repo.save(user).then(() => response.status(200).send(new Err())).catch(e => {
                    console.log('error writing to db')
                    return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
                })
            })
        })
    }

    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        return response.send(`get one ${userId}`)
    }
}
