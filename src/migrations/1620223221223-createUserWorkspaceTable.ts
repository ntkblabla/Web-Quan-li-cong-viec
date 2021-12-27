import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createUserWorkspaceTable1620223221223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_workspace',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'workspaceId',
            type: 'int',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'user_workspace',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'user_workspace',
      new TableForeignKey({
        columnNames: ['workspaceId'],
        referencedTableName: 'workspace',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_workspace');
  }
}
