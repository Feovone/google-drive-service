import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateTableFiles1746800851135 implements MigrationInterface {
  name = 'CreateTableFiles1746800851135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "files"
                             (
                                 "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "original_url" character varying NOT NULL,
                                 "drive_id"     character varying,
                                 "file_name"    character varying,
                                 "mime_type"    character varying,
                                 "status"       character varying NOT NULL DEFAULT 'SUCCESS',
                                 "error"        character varying,
                                 "created_at"   TIMESTAMP         NOT NULL DEFAULT NOW(),
                                 CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
