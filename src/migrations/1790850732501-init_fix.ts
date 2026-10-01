import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFix1790850732501 implements MigrationInterface {
    name = 'InitFix1790850732501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "full_title"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "short_title"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "patronymic" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD "full_title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD "short_title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "short_title"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "full_title"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "patronymic"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "short_title" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "full_title" character varying NOT NULL`);
    }

}
