import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class GameProject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
