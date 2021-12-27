import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterSpaceTableAddColor1621747481919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE space add color varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE space drop column color`);
  }
}
