import {Context} from "koa"
import { getManager } from "typeorm"
import { LevelInfo } from "../entity/LevelInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

export async function getLevelInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.levels', 'levels')
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
