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
const typeorm_1 = require("typeorm");
const StockInfo_1 = require("../entity/StockInfo");
const CustomerInfo_1 = require("../entity/CustomerInfo");
function getStockInfo(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const CustomerRepository = typeorm_1.getManager().getRepository(CustomerInfo_1.CustomerInfo);
        const result = yield CustomerRepository
            .createQueryBuilder('Customer')
            .leftJoinAndSelect('Customer.stocks', 'stock')
            .getMany();
        console.log(result);
        ctx.body = {
            list: result
        };
    });
}
exports.getStockInfo = getStockInfo;
function setStockInfo(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const CustomerRepository = typeorm_1.getManager().getRepository(CustomerInfo_1.CustomerInfo);
        const StockRepository = typeorm_1.getManager().getRepository(StockInfo_1.StockInfo);
        const newCustomer = CustomerRepository.create({ name: ctx.request.body.name, plate: ctx.request.body.plate });
        const newStock = StockRepository.create(ctx.request.body.stock);
        newCustomer.stocks = newStock;
        yield CustomerRepository.save(newCustomer);
        ctx.body = true;
    });
}
exports.setStockInfo = setStockInfo;
//# sourceMappingURL=Stock.js.map