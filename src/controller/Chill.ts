import {Context} from "koa"
import { getManager } from "typeorm"
import { ChillInfo } from "../entity/ChillInfo"
import { StorageInfo } from "../entity/StorageInfo"

export async function getChillInfo(ctx: Context): Promise<void> {
  const ChillRepository = getManager().getRepository(ChillInfo)
  const result = await ChillRepository.find()

  ctx.body = {
    list: result
  }
}

export async function updateChillInfo(ctx: Context): Promise<void> {
  const ChillRepository = getManager().getRepository(ChillInfo)
  const StorageRepository = getManager().getRepository(StorageInfo)

  let chill = await ChillRepository.findOne(ctx.request.body.id)
  let storage = await StorageRepository.findOne(ctx.request.body.storageId)

  try {
    if (ctx.request.body.levelA) {
      chill.levelA = chill.levelA - Number(ctx.request.body.levelA)
      storage.levelA = storage.levelA + Number(ctx.request.body.levelA)
      if (chill.levelA < 0) {
        throw new Error('库存不足！')
      }
    }
    if (ctx.request.body.levelB) {
      chill.levelB = chill.levelB - Number(ctx.request.body.levelB)
      storage.levelB = storage.levelB + Number(ctx.request.body.levelB)
      if (chill.levelA < 0) {
        throw new Error('库存不足！')
      }
    }
    if (ctx.request.body.levelC) {
      chill.levelC = chill.levelC - Number(ctx.request.body.levelC)
      storage.levelC = storage.levelC + Number(ctx.request.body.levelC)
      if (chill.levelA < 0) {
        throw new Error('库存不足！')
      }
    }
    if (ctx.request.body.levelD) {
      chill.levelD = chill.levelD - Number(ctx.request.body.levelD)
      storage.levelD = storage.levelD + Number(ctx.request.body.levelD)
      if (chill.levelA < 0) {
        throw new Error('库存不足！')
      }
    }
    await ChillRepository.save(chill)
    await StorageRepository.save(storage)
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
