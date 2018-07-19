import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class ChillInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  levelA: number

  @Column()
  levelB: number

  @Column()
  levelC: number

  @Column()
  levelD: number


  @Column('timestamp')
  time: Date

}
