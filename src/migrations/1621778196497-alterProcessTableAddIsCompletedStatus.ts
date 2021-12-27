import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterProcessTableAddIsCompletedStatus1621778196497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE process add isCompleted boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE space drop column isCompleted`);
  }
}
