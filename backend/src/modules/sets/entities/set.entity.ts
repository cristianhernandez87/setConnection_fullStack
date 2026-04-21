import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// Definimos los estados posibles de un Set
export enum SetStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
}

@Entity('sets') // Nombre de la tabla en PostgreSQL
export class SetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ length: 100 })
  title: string | undefined;

  @Column({ type: 'text', nullable: true })
  description: string | undefined;

  @Column()
  filename: string | undefined;

  @Column()
  audioUrl: string | undefined;

  @Column({
    type: 'enum',
    enum: SetStatus,
    default: SetStatus.PENDING,
  })
  status: SetStatus | undefined;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | undefined;
}
