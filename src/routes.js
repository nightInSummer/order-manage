"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stock = require("./controller/Stock");
/**
 * All application routes.
 */
exports.AppRoutes = [
    {
        path: '/stock',
        method: 'get',
        action: Stock.getStockInfo
    },
    {
        path: '/stock',
        method: 'post',
        action: Stock.setStockInfo
    }
];
//# sourceMappingURL=routes.js.map