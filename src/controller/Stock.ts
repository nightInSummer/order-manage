import { Context } from 'koa'
import { getManager } from "typeorm"
import { StockInfo } from "../entity/StockInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

export async function getStockInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.stocks', 'stock')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function setStockInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const StockRepository = getManager().getRepository(StockInfo)

  const customer = await CustomerRepository.findOne({ name: ctx.request.body.name, plate: ctx.request.body.plate })

  if (customer) {
    const levelArr = await CustomerRepository.find({
      join: {
        alias: "customer",
        leftJoinAndSelect: {
          levels: "customer.stocks",
        }
      },
      where: { id: customer.id }
    })
    const newStock = StockRepository.create(ctx.request.body.stock)
    customer.stocks = levelArr[0].stocks.concat(newStock)
    await CustomerRepository.save(customer)

    ctx.body = true
  } else {
    const newCustomer = CustomerRepository.create({ name: ctx.request.body.name, plate: ctx.request.body.plate })
    const newStock = StockRepository.create(ctx.request.body.stock)

    newCustomer.stocks = newStock
    await CustomerRepository.save(newCustomer)

    ctx.body = true
  }
}

export async function getCustomer(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository.find()
  ctx.body = {
    list : result
  }
}
