import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//https://docs.nestjs.com/recipes/sql-typeorm#repository-pattern

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;
}
