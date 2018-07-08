import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {CustomerInfo} from "./CustomerInfo"

@Entity()
export class StockInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @Column()
  number: string

  @Column('timestamp')
  time: Date

  // 建立多对一关系
  @ManyToOne(type => CustomerInfo, CustomerInfo => CustomerInfo.stocks, {
    cascade: ["insert", "update"]
  })

  customerInfo: CustomerInfo
}
