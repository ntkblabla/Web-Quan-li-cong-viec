import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterProcessTableSpaceNull1621744573497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE process modify spaceId int null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE process modify spaceId int not null`);
  }
}
