import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFix21790936210016 implements MigrationInterface {
    name = 'InitFix21790936210016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_8824c76128d5ed303cec18e4d71"`);
        await queryRunner.query(`ALTER TABLE "company" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "isSlaViolated"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "is_sla_violated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_eb4869da6d8f7121b269140994d" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_eb4869da6d8f7121b269140994d"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "company_id"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "is_sla_violated"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "isSlaViolated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "company" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_8824c76128d5ed303cec18e4d71" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
