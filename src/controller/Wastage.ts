import {Context} from "koa"
import { getManager } from "typeorm"

import { CustomerInfo } from "../entity/CustomerInfo"
import { WastageInfo } from "../entity/WastageInfo"
import * as _ from 'lodash'

export async function getWastageInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const query = ctx.query
  const filterName = `Customer.name Like '%${query.name || ''}%'`
  const filterPlate = `AND Customer.plate Like '%${query.plate || ''}%'`
  const filterTime = `wastages.time Like '%${query.time || ''}%'`
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.wastages', 'wastages', filterTime)
    .where(filterName +(query.plate ? filterPlate : ''))
    .andWhere('Customer.status = 1')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function saveWastageInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const WastageRepository = getManager().getRepository(WastageInfo)
  const customer = await CustomerRepository.findOne(ctx.request.body.id)

  try {
    const wastageArr = await CustomerRepository.find({
      join: {
        alias: "customer",
        leftJoinAndSelect: {
          wastages: "customer.wastages",
          packings: "customer.packings",
          levels: "customer.levels",
          machinings: "customer.machinings",
          stocks: "customer.stocks",
        }
      },
      where: { id: customer.id }
    })

    let total, cost

    console.log(111, ctx.request.body)

    if(ctx.request.body.wastage.type === 0) {
      total = _.reduce(wastageArr[0].stocks,(result, item) => {
        return result + item.number
      }, 0)

      cost =  _.reduce(wastageArr[0].machinings,(result, item) => {
        return result + item.number
      }, 0)
    } else if(ctx.request.body.wastage.type === 1) {
      total = _.reduce(wastageArr[0].levels,(result, item) => {
        return result + item.levelA + item.levelB + item.levelC + item.levelD
      }, 0)

      cost = _.reduce(wastageArr[0].packings,(result, item) => {
        return result + item.levelA + item.levelB + item.levelC + item.levelD
      }, 0)
    }

    const newNumber = ctx.request.body.wastage.number
    const surplus = total - cost
    console.log(surplus)
    console.log(333, surplus - newNumber)

    if(surplus - newNumber < 0) {
      throw new Error('库存不足！')
    }

    const newWastage = WastageRepository.create([ctx.request.body.wastage])
    console.log(222, newWastage)
    customer.wastages = wastageArr[0].wastages.concat(newWastage)
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

export async function deleteWastageInfo(ctx: Context): Promise<void> {
  const WastageRepository = getManager().getRepository(WastageInfo)
  await WastageRepository.delete(ctx.query.id)
  ctx.body = true
}

