import { Context } from 'koa'
import { getManager, getConnection } from "typeorm"
import { StockInfo } from "../entity/StockInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

export async function getStockInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.stocks', 'stock')
    .getMany()

  console.log(result)
  ctx.body = {
    list: result
  }
}

export async function setStockInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const StockRepository = getManager().getRepository(StockInfo)

  const newCustomer = CustomerRepository.create({ name: ctx.request.body.name, plate: ctx.request.body.plate })
  const newStock = StockRepository.create(ctx.request.body.stock)

  newCustomer.stocks = newStock
  await CustomerRepository.save(newCustomer)

  ctx.body = true
}
