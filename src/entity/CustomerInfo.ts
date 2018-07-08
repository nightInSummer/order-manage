import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import {StockInfo} from "./StockInfo"

@Entity()
export class CustomerInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  plate: string

  // 建立一对多关系
  @OneToMany(type => StockInfo, StockInfo => StockInfo.customerInfo, {
    cascade: true
  })
  stocks: StockInfo[]
}
