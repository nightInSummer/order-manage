import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import {StockInfo} from "./StockInfo"
import {MachiningInfo} from './MachiningInfo'
import {LevelInfo} from "./LevelInfo"
import {PackingInfo} from "./PackingInfo"
import {WastageInfo} from "./WastageInfo"

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

  // 建立一对多关系
  @OneToMany(type => PackingInfo, Packing => Packing.customerInfo, {
    cascade: true
  })
  packings: LevelInfo[]

  // 建立一对多关系
  @OneToMany(type => WastageInfo, Wastage => Wastage.customerInfo, {
    cascade: true
  })
  wastages: WastageInfo[]
}
