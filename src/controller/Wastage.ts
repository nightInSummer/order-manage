import {Context} from "koa"
import { getManager } from "typeorm"

import { CustomerInfo } from "../entity/CustomerInfo"
import { WastageInfo } from "../entity/WastageInfo"

export async function getWastageInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.wastages', 'wastages')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function saveWastageInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const WastageRepository = getManager().getRepository(WastageInfo)
  const customer = await CustomerRepository.findOne(ctx.request.body.id)

  const wastageArr = await CustomerRepository.find({
    join: {
      alias: "customer",
      leftJoinAndSelect: {
        wastages: "customer.wastages",
      }
    },
    where: { id: customer.id }
  })
  const newWastage = WastageRepository.create([ctx.request.body.wastage])
  customer.wastages = wastageArr[0].wastages.concat(newWastage)
  await CustomerRepository.save(customer)

  ctx.body = true

}
