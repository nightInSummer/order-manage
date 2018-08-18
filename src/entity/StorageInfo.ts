import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class StorageInfo {

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
