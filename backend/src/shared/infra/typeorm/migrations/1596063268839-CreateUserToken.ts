import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserToken1596063268839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user_token',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'token',
                    type: 'uuid',
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
            foreignKeys: [
                {
                    name: 'TokenUser',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['userId'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_token');
    }

}
