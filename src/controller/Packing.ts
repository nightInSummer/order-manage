import {Context} from "koa"
import { getManager } from "typeorm"
import { PackingInfo } from "../entity/PackingInfo"
import {CustomerInfo} from "../entity/CustomerInfo"
import {ChillInfo} from "../entity/ChillInfo"

export async function getPackingInfo (ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.packings', 'packings')
    .leftJoinAndSelect('Customer.levels', 'levels')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function savePackingInfo (ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const PackingRepository = getManager().getRepository(PackingInfo)
  const ChillRepository = getManager().getRepository(ChillInfo)

  const customer = await CustomerRepository.findOne(ctx.request.body.id)
  let chill = await ChillRepository.findOne(ctx.request.body.chillId)


  const packing = {}

  if (ctx.request.body.levelA) {
    packing['levelA'] =  ctx.request.body.levelA
    chill['levelA'] = chill['levelA'] + Number(ctx.request.body.levelA)
  }
  if (ctx.request.body.levelB) {
    packing['levelB'] =  ctx.request.body.levelB
    chill['levelB'] =  chill['levelB'] + Number(ctx.request.body.levelB)
  }
  if (ctx.request.body.levelC) {
    packing['levelC'] =  ctx.request.body.levelC
    chill['levelC'] =  chill['levelC'] + Number(ctx.request.body.levelC)
  }
  if (ctx.request.body.levelD) {
    packing['levelD'] =  ctx.request.body.levelD
    chill['levelD'] =  chill['levelD'] + Number(ctx.request.body.levelD)
  }

  if (customer) {
    const packingArr = await CustomerRepository.find({
      join: {
        alias: "customer",
        leftJoinAndSelect: {
          levels: "customer.packings",
        }
      },
      where: { id: customer.id }
    })
    packing['storage'] = ctx.request.body.chillId
    packing['truck'] = ctx.request.body.truck
    const newPacking = PackingRepository.create([{ ...packing }])
    customer.packings = packingArr[0].packings.concat(newPacking)
    await CustomerRepository.save(customer)
    await ChillRepository.update(ctx.request.body.chillId, { ...chill })

    ctx.body = true
  }

}

