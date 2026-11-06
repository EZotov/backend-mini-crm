import { MigrationInterface, QueryRunner } from "typeorm";

export class LogsAnotherChange1792769011649 implements MigrationInterface {
    name = 'LogsAnotherChange1792769011649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_65d46d77ef437df983ae9454bc4"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "form_status"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "to_status"`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "action_description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_65d46d77ef437df983ae9454bc4" FOREIGN KEY ("funnel_stage_id") REFERENCES "funnel_stages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_65d46d77ef437df983ae9454bc4"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "action_description"`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "to_status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "form_status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_65d46d77ef437df983ae9454bc4" FOREIGN KEY ("funnel_stage_id") REFERENCES "funnel_stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
