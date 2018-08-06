import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {CustomerInfo} from "./CustomerInfo"

@Entity()
export class PackingInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 0 })
  levelA: number

  @Column({ default: 0 })
  levelB: number

  @Column({ default: 0 })
  levelC: number

  @Column({ default: 0 })
  levelD: number

  @Column()
  storage: number

  @Column()
  truck: number

  @Column('timestamp')
  time: Date

  // 建立多对一关系
  @ManyToOne(type => CustomerInfo, CustomerInfo => CustomerInfo.packings, {
    cascade: ["insert", "update"]
  })

  customerInfo: CustomerInfo
}
