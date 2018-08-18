import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {CustomerInfo} from "./CustomerInfo"

@Entity()
export class PackingInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column('float', { default: 0 })
  levelA: number

  @Column('float', { default: 0 })
  levelB: number

  @Column('float', { default: 0 })
  levelC: number

  @Column('float', { default: 0 })
  levelD: number

  @Column()
  storage: number

  @Column()
  truck: number

  @Column({ default: 1 })
  status: number

  @Column('timestamp')
  time: Date

  // 建立多对一关系
  @ManyToOne(type => CustomerInfo, CustomerInfo => CustomerInfo.packings, {
    cascade: ["insert", "update"]
  })

  customerInfo: CustomerInfo
}
