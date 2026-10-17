import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles21792154168540 implements MigrationInterface {
    name = 'Roles21792154168540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "CHK_15bda8ed30995e15216fa61e52" CHECK ("title" = UPPER("title"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "CHK_15bda8ed30995e15216fa61e52"`);
    }

}
