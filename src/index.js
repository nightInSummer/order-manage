"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const routes_1 = require("./routes");
// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    // create koa app
    const app = new Koa();
    const router = new Router();
    // register all application routes
    routes_1.AppRoutes.forEach(route => router[route.method](route.path, route.action));
    // run app
    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(3000);
    console.log("Koa application is up and running on port 3000");
})).catch(error => console.log("TypeORM connection error: ", error));
//# sourceMappingURL=index.js.map