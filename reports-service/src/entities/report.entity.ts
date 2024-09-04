import { Entity, PrimaryGeneratedColumn, Column, Index, BeforeInsert } from 'typeorm';
import { ReportStatus } from '../reports/report_types';

@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('smallint')
  status: ReportStatus;

  @Column()
  customer_name: string;

  @Column()
  source_data_uri: string;

  constructor() {
    this.status = ReportStatus.inited;
  }
}
