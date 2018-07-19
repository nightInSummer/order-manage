import {Context} from "koa"
import { getManager } from "typeorm"
import { MachiningInfo } from "../entity/MachiningInfo"
import { CustomerInfo } from "../entity/CustomerInfo"

export async function getMachiningInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const result = await CustomerRepository
    .createQueryBuilder('Customer')
    .leftJoinAndSelect('Customer.machinings', 'machinings')
    .leftJoinAndSelect('Customer.stocks', 'stocks')
    .getMany()

  ctx.body = {
    list: result
  }
}

export async function setMachiningInfo(ctx: Context): Promise<void> {
  const CustomerRepository = getManager().getRepository(CustomerInfo)
  const MachiningRepository = getManager().getRepository(MachiningInfo)

  const customer = await CustomerRepository.findOne(ctx.request.body.id)
  if (customer) {
    const levelArr = await CustomerRepository.find({
      join: {
        alias: "customer",
        leftJoinAndSelect: {
          levels: "customer.machinings",
        }
      },
      where: { id: customer.id }
    })
    const newMachining = MachiningRepository.create(ctx.request.body.machining)
    customer.machinings = levelArr[0].machinings.concat(newMachining)
    await CustomerRepository.save(customer)

    ctx.body = true
  } else {
    const newCustomer = CustomerRepository.create({name: ctx.request.body.name, plate: ctx.request.body.plate})
    const newMachining = MachiningRepository.create(ctx.request.body.machining)

    newCustomer.machinings = newMachining
    await CustomerRepository.save(newCustomer)

    ctx.body = true
  }
}
