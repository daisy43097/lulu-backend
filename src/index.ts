import { AppDataSource } from "./data-source"
import express from "express"
import bodyParser from "body-parser";
import routes from "./routes";
import cors from 'cors';
import router from "./routes/user";

const cookiePaser = require('cookie-parser')
const SERVER_PORT = 5001;

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();

    const allowedOrigins = ['http://localhost:3000'];

    const options: cors.CorsOptions = {
        origin: allowedOrigins,
        credentials: true,
        exposedHeaders: ['Content-disposition', 'x-access-token']
    };

    app.use(cors(options));
    app.use(cookiePaser())

    app.use('/stripe/webhook', bodyParser.raw({type: "*/*"}))
    app.use(bodyParser.json());

    app.use('/', routes)

    // setup express app here
    // ...

    // start express server
    app.listen(SERVER_PORT);

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

}).catch(error => console.log(error))
