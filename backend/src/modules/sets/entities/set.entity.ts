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
  id!: string;

  // Le decimos explícitamente a Postgres que es un varchar (texto corto)
  @Column({ type: 'varchar', length: 100 })
  title!: string;

  // Si quieres que la descripción sea opcional, ponle nullable: true, pero el tipo TS sigue siendo string
  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar' })
  filename!: string;

  @Column({ type: 'varchar' })
  audioUrl!: string;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: 'Tamaño del archivo en bytes',
  })
  audioSize: number | undefined;

  @Column({ type: 'varchar', default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
