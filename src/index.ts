import { AppDataSource } from "./data-source"
import * as express from 'express'
import * as bodyParser from "body-parser";
import routes from "./routes";
const SERVER_PORT = 3000;

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    app.use('/', routes)
    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //
    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here
    // ...

    // start express server
    app.listen(SERVER_PORT);

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

}).catch(error => console.log(error))
