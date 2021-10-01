import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("offers")
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  rec_date: string;

  @Column()
  client: string;

  @Column()
  project_name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  work_type: string;

  @Column({ type: "date", nullable: true })
  quo_date: string;

  @Column({ nullable: true })
  quo_values: string;

  @Column({ nullable: true })
  quo_no: string;

  @Column({ nullable: true })
  status: string;
}
