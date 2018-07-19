import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {CustomerInfo} from "./CustomerInfo"

@Entity()
export class LevelInfo {

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

  @Column('timestamp')
  time: Date

  // 建立多对一关系
  @ManyToOne(type => CustomerInfo, CustomerInfo => CustomerInfo.levels, {
    cascade: ["insert", "update"]
  })

  customerInfo: CustomerInfo
}
