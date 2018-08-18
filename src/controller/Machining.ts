import {Context} from "koa"
import { getManager } from "typeorm"
import { MachiningInfo } from "../entity/MachiningInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

import * as _ from 'lodash'

export async function getMachiningInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const query = ctx.query
  const filterName = `Customer.name Like '%${query.name || ''}%'`
  const filterPlate = `AND Customer.plate Like '%${query.plate || ''}%'`
  const filterTime = `machinings.time Like '%${query.time || ''}%'`
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.machinings', 'machinings', filterTime)
    .leftJoinAndSelect('Customer.stocks', 'stocks')
    .leftJoinAndSelect('Customer.wastages', 'wastages','wastages.type = 0')
    .where(filterName +(query.plate ? filterPlate : ''))
    .andWhere('Customer.status = 1')
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
          stocks: "customer.stocks",
          wastages: "customer.wastages"
        }
      },
      where: { id: customer.id }
    })
    const list: any = _.reject(ctx.request.body.machining, { number: '' })
    const newMachining = MachiningRepository.create(list)
    customer.machinings = machiningArr[0].machinings.concat(newMachining)

    const total = _.reduce(machiningArr[0].stocks,(result, item) => {
      return result + item.number
    }, 0)

    const machining = _.reduce(machiningArr[0].machinings,(result, item) => {
      return result + item.number
    }, 0)

    const wastage = _.reduce(machiningArr[0].wastages,(result, item) => {
      if(item.type == 0) {
        return result + item.number
      } else {
        return result
      }
    }, 0)

    const newNumber = _.reduce(ctx.request.body.machining,(result, item) => {
      return result + Number(item.number)
    }, 0)

    const surplus = total - machining - wastage
    if(surplus - newNumber < 0) {
      throw new Error('库存不足！')
    }

    await CustomerRepository.save(customer)

    ctx.body = {
      data: true
    }
  } catch (e) {
    ctx.body = {
      data: false,
      message: e.message
    }
  }
}

export async function deleteMachiningInfo(ctx: Context): Promise<void> {
  const MachiningRepository = getManager().getRepository(MachiningInfo)
  await MachiningRepository.delete(ctx.query.id)
  ctx.body = true
}
