"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const CustomerInfo_1 = require("./CustomerInfo");
let StockInfo = class StockInfo {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], StockInfo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], StockInfo.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], StockInfo.prototype, "number", void 0);
__decorate([
    typeorm_1.Column('timestamp'),
    __metadata("design:type", Date
    // 建立多对一关系
    )
], StockInfo.prototype, "time", void 0);
__decorate([
    typeorm_1.ManyToOne(type => CustomerInfo_1.CustomerInfo, CustomerInfo => CustomerInfo.stocks, {
        cascade: ["insert", "update"]
    }),
    __metadata("design:type", CustomerInfo_1.CustomerInfo)
], StockInfo.prototype, "customerInfo", void 0);
StockInfo = __decorate([
    typeorm_1.Entity()
], StockInfo);
exports.StockInfo = StockInfo;
//# sourceMappingURL=StockInfo.js.map