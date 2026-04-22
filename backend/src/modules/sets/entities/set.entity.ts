import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TrackMarkerEntity } from './track-marker.entity';

export enum SetStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
}

@Entity('sets')
export class SetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

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

  @OneToMany(() => TrackMarkerEntity, (marker) => marker.set, { cascade: true })
  markers!: TrackMarkerEntity[];
}
