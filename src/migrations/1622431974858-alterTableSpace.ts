import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableTask1622431974858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE sprint DROP FOREIGN KEY FK_4813b24f130b3050a0a2240d317');
    await queryRunner.query('ALTER TABLE sprint DROP COLUMN spaceId');
    await queryRunner.query('ALTER TABLE sprint ADD COLUMN folderId int');
    await queryRunner.query('ALTER TABLE sprint ADD FOREIGN KEY (folderId) REFERENCES folder(id)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE sprint DROP COLUMN folderId');
    await queryRunner.query('ALTER TABLE sprint ADD COLUMN spaceId int');
    await queryRunner.query('ALTER TABLE sprint ADD FOREIGN KEY (spaceId) REFERENCES space(id)');
  }
}
