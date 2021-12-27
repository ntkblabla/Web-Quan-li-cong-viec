import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableWorkspace1622775121040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE workspace DROP INDEX UQ_406f56fc2a42ad5f541973cdbee');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
