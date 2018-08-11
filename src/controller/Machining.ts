import {Context} from "koa"
import { getManager } from "typeorm"
import { MachiningInfo } from "../entity/MachiningInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

import * as _ from 'lodash'

export async function getMachiningInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.machinings', 'machinings')
    .leftJoinAndSelect('Customer.stocks', 'stocks')
    .leftJoinAndSelect('Customer.wastages', 'wastages','wastages.type = 0')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function setMachiningInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const MachiningRepository = getManager().getRepository(MachiningInfo)

  const customer = await CustomerRepository.findOne(ctx.request.body.id)
  try {
    const machiningArr = await CustomerRepository.find({
      join: {
        alias: "customer",
        leftJoinAndSelect: {
          machinings: "customer.machinings",
          stocks: "customer.stocks"
        }
      },
      where: { id: customer.id }
    })
    const newMachining = MachiningRepository.create(ctx.request.body.machining)
    customer.machinings = machiningArr[0].machinings.concat(newMachining)

    const total = _.reduce(machiningArr[0].stocks,(result, item) => {
      return result + item.number
    }, 0)

    const machining = _.reduce(ctx.request.body.machining,(result, item) => {
      return result + item.number
    }, 0)

    if(total - machining < 0) {
      throw new Error('库存不足！')
    }

    await CustomerRepository.save(customer)

    ctx.body = true
  } catch (e) {
    ctx.body = {
      data: false,
      message: e.message
    }
  }
}
