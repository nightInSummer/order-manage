import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import {StockInfo} from "./StockInfo"
import {MachiningInfo} from './MachiningInfo'
import {LevelInfo} from "./LevelInfo"

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

  // 建立一对多关系
  @OneToMany(type => MachiningInfo, MachiningInfo => MachiningInfo.customerInfo, {
    cascade: true
  })
  machinings: MachiningInfo[]

  // 建立一对多关系
  @OneToMany(type => LevelInfo, LevelInfo => LevelInfo.customerInfo, {
    cascade: true
  })
  levels: LevelInfo[]
}
