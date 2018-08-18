import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class ChillInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column('float')
  levelA: number

  @Column('float')
  levelB: number

  @Column('float')
  levelC: number

  @Column('float')
  levelD: number


  @Column('timestamp')
  time: Date

}
