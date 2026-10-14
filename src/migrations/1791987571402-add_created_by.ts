import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedBy1791987571402 implements MigrationInterface {
    name = 'AddCreatedBy1791987571402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "sla_deadline"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "sla_deadline" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_02d6084f6eb9912c0d8a35f9d0d" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_02d6084f6eb9912c0d8a35f9d0d"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "sla_deadline"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "sla_deadline" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "created_by"`);
    }

}
