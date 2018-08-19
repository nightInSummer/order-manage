import { Context } from 'koa'
import { getManager } from "typeorm"
import { StockInfo } from "../entity/StockInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

export async function getStockInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const query = ctx.query
  const filterName = `Customer.name Like '%${query.name || ''}%'`
  const filterPlate = `AND Customer.plate Like '%${query.plate || ''}%'`
  const filterTime = `stock.time Like '%${query.time || ''}%' AND stock.status = 1`
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.stocks', 'stock', filterTime)
    .where(filterName +(query.plate ? filterPlate : ''))
    .andWhere('Customer.status = 1')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function setStockInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const StockRepository = getManager().getRepository(StockInfo)

  const customer = await CustomerRepository.findOne({ name: ctx.request.body.name, plate: ctx.request.body.plate })

  if (customer && customer.status === 1) {
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

export async function deleteStockInfo(ctx: Context): Promise<void> {
  const StockRepository = getManager().getRepository(StockInfo)
  await StockRepository.update(ctx.query.id, { status: 0 })
  ctx.body = true
}

export async function getCustomer(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository.find({ status: 1 })
  ctx.body = {
    list : result
  }
}

export async function deleteCustomer(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  await CustomerRepository.update(ctx.query.id, { status: 0 })
  ctx.body = true
}

