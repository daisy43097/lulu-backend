import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {SALT_ROUNDS} from "../helper/const";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {AuthController} from "./AuthController";

const bcrypt = require('bcrypt')


export class UserController extends AuthController{

    static async all(request: Request, response: Response, next: NextFunction) {
        return response.send('get all users')
    }


    static async one(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        return response.send(`get one ${userId}`)
    }

    static async register(request: Request, response: Response, next: NextFunction) {
        let {email, password, firstName, lastName} = request.body

        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        const hash = await bcrypt.hash(password, salt)

        let user = User.create({email, password: hash, firstName, lastName})

        const errors = await validate(user)
        if (errors.length > 0) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }

        await user.save()
        return response.status(200).send(new Err())

    }

    static async login(request: Request, response: Response, next: NextFunction) {
        const {email, password} = request.body

        let user: User
        let accessToken: string
        try {
            user = await User.findOneOrFail({where: {email}})
            const dbPassword = user.password

            const match = await bcrypt.compare(password, dbPassword)
            if (!match) {
                return response.status(401).send(new Err(HttpCode.E401, ErrStr.ErrPassword))
            } else {
                accessToken = UserController.createToken(user)

                response.cookie('access-token', accessToken, {
                    maxAge: 60*60*24*30*1000,
                    httpOnly:true
                })
            }
        } catch (e) {
            return response.status(401).send(new Err(HttpCode.E401, ErrStr.ErrNoUser, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, {auth: true, userId: user.id, email: user.email, userName: user.firstName }))//delete token
    }

    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.params
        return response.send(`get one ${userId}`)
    }
}
