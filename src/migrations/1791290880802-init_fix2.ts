import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFix21791290880802 implements MigrationInterface {
    name = 'InitFix21791290880802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "budget" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deals" ALTER COLUMN "status" SET DEFAULT 'NEW'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "budget" integer NOT NULL`);
    }

}
