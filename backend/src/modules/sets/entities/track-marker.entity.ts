import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SetEntity } from './set.entity';
import { TrackSourceEntity } from './track-source.entity';

export enum MarkerStatus {
  MATCHED = 'MATCHED',
  MANUAL = 'MANUAL',
  NOT_FOUND = 'NOT_FOUND',
  IDENTIFYING = 'IDENTIFYING',
}

@Entity('track_markers')
export class TrackMarkerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', comment: 'Tiempo de inicio en segundos' })
  start_time!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  artist!: string;

  @Column({
    type: 'enum',
    enum: MarkerStatus,
    default: MarkerStatus.IDENTIFYING,
  })
  status!: string;

  @Column({
    type: 'float',
    nullable: true,
    comment: 'Nivel de confianza de la IA (0.0 a 1.0)',
  })
  confidence_score: number | undefined;

  @ManyToOne(() => SetEntity, (set) => set.markers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'set_id' })
  set!: SetEntity;

  @OneToMany(() => TrackSourceEntity, (source) => source.marker, {
    cascade: true,
  })
  sources!: TrackSourceEntity[];
}
