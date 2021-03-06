import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {CustomerInfo} from "./CustomerInfo"

@Entity()
export class WastageInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column('float')
  number: number

  @Column()
  type: number

  @Column({ default: 1 })
  status: number

  @Column('timestamp')
  time: Date

  // 建立多对一关系
  @ManyToOne(type => CustomerInfo, CustomerInfo => CustomerInfo.wastages, {
    cascade: ["insert", "update"]
  })

  customerInfo: CustomerInfo
}
