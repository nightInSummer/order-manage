import {Context} from "koa"
import { getManager } from "typeorm"
import { PackingInfo } from "../entity/PackingInfo"
import {CustomerInfo} from "../entity/CustomerInfo"
import {ChillInfo} from "../entity/ChillInfo"
import * as _ from 'lodash'
import * as utils from '../common/utils'

export async function getPackingInfo (ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const query = ctx.query
  const filterName = `Customer.name Like '%${query.name || ''}%'`
  const filterPlate = `AND Customer.plate Like '%${query.plate || ''}%'`
  const filterTime = `packings.time Like '%${query.time || ''}%'`
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.packings', 'packings', filterTime)
    .leftJoinAndSelect('Customer.levels', 'levels')
    .leftJoinAndSelect('Customer.wastages', 'wastages', 'type=1')
    .where(filterName +(query.plate ? filterPlate : ''))
    .andWhere('Customer.status = 1')
    .getMany()

  if(ctx.query.display) {
    const url = utils.createXls(result, 'packings')
    ctx.body = {
      list: url
    }
  } else {
    ctx.body = {
      list: result
    }
  }
}

export async function savePackingInfo (ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const PackingRepository = getManager().getRepository(PackingInfo)
  const ChillRepository = getManager().getRepository(ChillInfo)

  const customer = await CustomerRepository.findOne(ctx.request.body.id)
  let chill = await ChillRepository.findOne(ctx.request.body.chillId)


  const packing = {}
  try {
    if (ctx.request.body.levelA) {
      packing['levelA'] =  ctx.request.body.levelA || 0
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
            packings: "customer.packings",
            levels: "customer.levels",
            wastages: "customer.wastages"
          }
        },
        where: { id: customer.id }
      })
      packing['storage'] = ctx.request.body.chillId
      packing['truck'] = ctx.request.body.truck
      const newPacking = PackingRepository.create([{ ...packing }])
      customer.packings = packingArr[0].packings.concat(newPacking)

      const total = _.reduce(packingArr[0].levels,(result, item) => {
        return result + item.levelA + item.levelB + item.levelC + item.levelD
      }, 0)

      const packings = _.reduce(packingArr[0].packings,(result, item) => {
        return result + item.levelA + item.levelB + item.levelC + item.levelD
      }, 0)

      const wastage = _.reduce(packingArr[0].wastages,(result, item) => {
        if(item.type == 1) {
          return result + item.number
        } else {
          return result
        }
      }, 0)

      const newNumber = (packing['levelA'] || 0) + (packing['levelB'] || 0) +(packing['levelC'] || 0) + (packing['levelD'] || 0)

      const surplus = total - packings - wastage

      console.log(surplus)

      if(surplus - newNumber < 0) {
        throw new Error('库存不足！')
      }

      await CustomerRepository.save(customer)
      await ChillRepository.update(ctx.request.body.chillId, { ...chill })

      ctx.body = {
        data: true
      }
    }
  } catch (e) {
    ctx.body = {
      data: false,
      message: e.message
    }
  }
}

export async function deletePackingInfo(ctx: Context): Promise<void> {
  const PackingRepository = getManager().getRepository(PackingInfo)
  await PackingRepository.delete(ctx.query.id)
  ctx.body = true
}

