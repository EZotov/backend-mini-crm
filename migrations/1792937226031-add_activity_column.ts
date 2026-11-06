import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivityColumn1792937226031 implements MigrationInterface {
    name = 'AddActivityColumn1792937226031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "title"`);
    }

}
