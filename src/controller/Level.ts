import {Context} from "koa"
import { getManager } from "typeorm"
import { LevelInfo } from "../entity/LevelInfo"
import { CustomerInfo } from "../entity/CustomerInfo"
import {ChillInfo} from "../entity/ChillInfo"

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
  const ChillRepository = getManager().getRepository(ChillInfo)

  const customer = await CustomerRepository.findOne(ctx.request.body.id)
  let chill = await ChillRepository.findOne(ctx.request.body.chillId)

  const level = {}

  if (ctx.request.body.levelA) {
    level['levelA'] =  ctx.request.body.levelA
    chill['levelA'] = chill['levelA'] + Number(ctx.request.body.levelA)
  }
  if (ctx.request.body.levelB) {
    level['levelB'] =  ctx.request.body.levelB
    chill['levelB'] =  chill['levelB'] + Number(ctx.request.body.levelB)
  }
  if (ctx.request.body.levelC) {
    level['levelC'] =  ctx.request.body.levelC
    chill['levelC'] =  chill['levelC'] + Number(ctx.request.body.levelC)
  }
  if (ctx.request.body.levelD) {
    level['levelD'] =  ctx.request.body.levelD
    chill['levelD'] =  chill['levelD'] + Number(ctx.request.body.levelD)
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
    await ChillRepository.update(ctx.request.body.chillId, { ...chill })

    ctx.body = true
  } else {
    const newCustomer = CustomerRepository.create({ name: ctx.request.body.name, plate: ctx.request.body.plate })

    newCustomer.levels = LevelRepository.create([{ ...level }])


    await CustomerRepository.save(newCustomer)
    await ChillRepository.update(ctx.request.body.chillId, { ...chill })
    ctx.body = true
  }


}
