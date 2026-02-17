import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_simulation')
export class Simulation {
  @PrimaryGeneratedColumn({ name: 'simulation_id' })
  simulationId: number;

  @Column({ name: 'user_id', length: 50 })
  userId: string;

  @Column({ name: 'completed_step', type: 'int', default: 0 })
  completedStep: number;

  @Column({ name: 'input_data', type: 'jsonb', nullable: true })
  inputData: Record<string, unknown> | null;

  @Column({ name: 'result_data', type: 'jsonb', nullable: true })
  resultData: Record<string, unknown> | null;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}
