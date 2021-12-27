import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableSprint1622566795192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE sprint ADD COLUMN name varchar(255), ADD COLUMN status varchar(255)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE sprint DROP COLUMN name, DROP COLUMN status');
  }
}
