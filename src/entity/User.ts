import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "text", nullable: true })
  token: string;

  @CreateDateColumn()
  createdAt: Timestamp;
}
