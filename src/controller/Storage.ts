import {Context} from "koa"
import { getManager } from "typeorm"
import { StorageInfo } from "../entity/StorageInfo"

export async function getStorageInfo(ctx: Context): Promise<void> {
  const ChillRepository = getManager().getRepository(StorageInfo)
  const result = await ChillRepository.find()

  ctx.body = {
    list: result
  }
}

export async function updateStorageInfo(ctx: Context): Promise<void> {
  const StorageRepository = getManager().getRepository(StorageInfo)

  const storage = await StorageRepository.findOne(ctx.request.body.id)
  try {
    if (ctx.request.body.levelA) {
      storage.levelA = storage.levelA - Number(ctx.request.body.levelA)
      if (storage.levelA < 0) {
        throw new Error('库存不足！')
      }
    }
    if (ctx.request.body.levelB) {
      storage.levelB = storage.levelB - Number(ctx.request.body.levelB)
      if (storage.levelB < 0) {
        throw new Error('库存不足！')
      }
    }
    if (ctx.request.body.levelC) {
      storage.levelC = storage.levelC - Number(ctx.request.body.levelC)
      if (storage.levelC < 0) {
        throw new Error('库存不足！')
      }
    }
    if (ctx.request.body.levelD) {
      storage.levelD = storage.levelD - Number(ctx.request.body.levelD)
      if (storage.levelD < 0) {
        throw new Error('库存不足！')
      }
    }
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
