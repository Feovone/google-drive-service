import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum FileStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ nullable: true })
  driveId: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ default: FileStatus.SUCCESS })
  status: FileStatus;

  @Column({ nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;
}
