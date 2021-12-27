import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createSprintTable1620224309237 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sprint',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'index',
            type: 'int',
          },
          {
            name: 'startAt',
            type: 'datetime',
          },
          {
            name: 'endAt',
            type: 'datetime',
          },
          {
            name: 'spaceId',
            type: 'int',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'sprint',
      new TableForeignKey({
        columnNames: ['spaceId'],
        referencedTableName: 'space',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sprint');
  }
}
