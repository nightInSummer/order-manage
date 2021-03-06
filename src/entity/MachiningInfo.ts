import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {CustomerInfo} from "./CustomerInfo"

@Entity()
export class MachiningInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: number

  @Column('float')
  number: number

  @Column({ default: 1 })
  status: number

  @Column('timestamp')
  time: Date

  // 建立多对一关系
  @ManyToOne(type => CustomerInfo, CustomerInfo => CustomerInfo.machinings, {
    cascade: ["insert", "update"]
  })

  customerInfo: CustomerInfo
}
