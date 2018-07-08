import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class MachiningInfo {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @Column()
  number: number

  @Column('timestamp')
  time: Date
}
