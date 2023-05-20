import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Err, ErrStr, HttpCode} from "../helper/Err";

const jwt = require('jsonwebtoken')
export class AuthController {
    static createToken(user: User) {
        const accessToke = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET_KEY)

        return accessToke
    }

    static validateToken(request: Request, response: Response, next: NextFunction) {
        const accessToken = request.cookies['access-token']
        // const accessToken = request.headers['x-access-token']
        if (!accessToken){
            return response.status(401).send(new Err(HttpCode.E401, ErrStr.ErrAuth))
        }

        try {
            const validToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)

            if (validToken) {
                // request. = true
                return next()
            }
        } catch (e) {
            return response.status(401).send(new Err(HttpCode.E401, ErrStr.ErrAuth, e))
        }
    }
}