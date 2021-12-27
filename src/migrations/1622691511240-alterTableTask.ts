import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableTask1622691511240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE task MODIFY description LONGTEXT null');
    await queryRunner.query('ALTER TABLE task MODIFY dueDate date null');
    await queryRunner.query('ALTER TABLE task MODIFY result LONGTEXT null');
    await queryRunner.query('ALTER TABLE task MODIFY estimateTime int null');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE task MODIFY description LONGTEXT not null');
    await queryRunner.query('ALTER TABLE task MODIFY dueDate date not null');
    await queryRunner.query('ALTER TABLE task MODIFY result LONGTEXT not null');
    await queryRunner.query('ALTER TABLE task MODIFY estimateTime int not null');
  }
}
