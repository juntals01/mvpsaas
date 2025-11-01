import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('system_state')
export class SystemState {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  key!: string;

  @Column({ type: 'text', nullable: true })
  value!: string | null;
}
