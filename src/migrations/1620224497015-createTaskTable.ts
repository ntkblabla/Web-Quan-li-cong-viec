import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTaskTable1620224497015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'dueDate',
            type: 'datetime',
          },
          {
            name: 'description',
            type: 'longtext',
          },
          {
            name: 'processId',
            type: 'int',
          },
          {
            name: 'result',
            type: 'longtext',
          },
          {
            name: 'estimateTime',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'datetime',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
          },
          {
            name: 'sprintId',
            type: 'int',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['sprintId'],
        referencedTableName: 'sprint',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['processId'],
        referencedTableName: 'process',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task');
  }
}
