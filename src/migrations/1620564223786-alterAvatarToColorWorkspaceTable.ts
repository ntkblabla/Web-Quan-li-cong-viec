import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterAvatarToColorWorkspaceTable1620564223786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE workspace RENAME COLUMN avatar TO color`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE workspace RENAME COLUMN color TO avatar`);
  }
}
