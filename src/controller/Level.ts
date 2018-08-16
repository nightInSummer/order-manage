import {Context} from "koa"
import { getManager } from "typeorm"
import { LevelInfo } from "../entity/LevelInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

export async function getLevelInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const query = ctx.query
  const filterName = `Customer.name Like '%${query.name || ''}%'`
  const filterPlate = `AND Customer.plate Like '%${query.plate || ''}%'`
  const filterTime = `levels.time Like '%${query.time || ''}%'`
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.levels', 'levels', filterTime)
    .where(filterName +(query.plate ? filterPlate : ''))
    .andWhere('Customer.status = 1')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function setLevelInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const LevelRepository = getManager().getRepository(LevelInfo)

  const customer = await CustomerRepository.findOne(ctx.request.body.id)

  const level = {}

  if (ctx.request.body.levelA) {
    level['levelA'] =  ctx.request.body.levelA
  }
  if (ctx.request.body.levelB) {
    level['levelB'] =  ctx.request.body.levelB
  }
  if (ctx.request.body.levelC) {
    level['levelC'] =  ctx.request.body.levelC
  }
  if (ctx.request.body.levelD) {
    level['levelD'] =  ctx.request.body.levelD
  }

  if (customer) {
    const levelArr = await CustomerRepository.find({
      join: {
        alias: "customer",
        leftJoinAndSelect: {
          levels: "customer.levels",
        }
      },
      where: { id: customer.id }
    })
    const newLevel = LevelRepository.create([{ ...level }])
    customer.levels = levelArr[0].levels.concat(newLevel)
    await CustomerRepository.save(customer)

    ctx.body = true
  } else {
    const newCustomer = CustomerRepository.create({ name: ctx.request.body.name, plate: ctx.request.body.plate })

    newCustomer.levels = LevelRepository.create([{ ...level }])


    await CustomerRepository.save(newCustomer)
    ctx.body = true
  }
}

export async function deleteLevelInfo(ctx: Context): Promise<void> {
  const LevelRepository = getManager().getRepository(LevelInfo)
  await LevelRepository.delete(ctx.query.id)
  ctx.body = true
}
