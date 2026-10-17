import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1792153899534 implements MigrationInterface {
    name = 'Roles1792153899534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_08e86fada7ae67b1689f948e83e" UNIQUE ("title")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "access"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "access" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "access"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "access" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_08e86fada7ae67b1689f948e83e"`);
    }

}
