import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrackMarkerEntity } from './track-marker.entity';

export enum SourceProvider {
  SPOTIFY = 'SPOTIFY',
  YOUTUBE = 'YOUTUBE',
  SOUNDCLOUD = 'SOUNDCLOUD',
  BEATPORT = 'BEATPORT',
  BANDCAMP = 'BANDCAMP',
  LOCAL = 'LOCAL',
}

@Entity('track_sources')
export class TrackSourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: SourceProvider })
  provider!: string;

  @Column({ type: 'varchar', nullable: true })
  external_id: string | undefined;

  @Column({ type: 'varchar' })
  external_url!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => TrackMarkerEntity, (marker) => marker.sources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'track_marker_id' })
  marker!: TrackMarkerEntity;
}
