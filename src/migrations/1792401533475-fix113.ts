import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix1131792401533475 implements MigrationInterface {
    name = 'Fix1131792401533475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_eb4869da6d8f7121b269140994d"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "company_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" ADD "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_eb4869da6d8f7121b269140994d" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
