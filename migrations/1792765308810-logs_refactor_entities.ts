import { MigrationInterface, QueryRunner } from "typeorm";

export class LogsRefactorEntities1792765308810 implements MigrationInterface {
    name = 'LogsRefactorEntities1792765308810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_65bf07efcacdf24f695bed104cc"`);
        await queryRunner.query(`ALTER TABLE "sla_logs" DROP CONSTRAINT "FK_07f48d6a4dbf1e09a4e8a91ae3b"`);
        await queryRunner.query(`CREATE TABLE "funnels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4a12f72b8c7eb9074e20a415da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "funnel_stages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "order" integer NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "funnel_id" uuid, CONSTRAINT "PK_4a0c461c532e1acb63ce6c44e32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_FUNNEL_STAGE_ORDER" ON "funnel_stages"  ("funnel_id", "order") `);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_blocked" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "funnel_stage_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "changed_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "changed_by_fullname" character varying`);
        await queryRunner.query(`ALTER TABLE "sla_logs" ADD "manager_fullname" character varying`);
        await queryRunner.query(`ALTER TABLE "funnel_stages" ADD CONSTRAINT "FK_142b9b0473faf7fd4d4f4da2d0b" FOREIGN KEY ("funnel_id") REFERENCES "funnels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_65d46d77ef437df983ae9454bc4" FOREIGN KEY ("funnel_stage_id") REFERENCES "funnel_stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_65d46d77ef437df983ae9454bc4"`);
        await queryRunner.query(`ALTER TABLE "funnel_stages" DROP CONSTRAINT "FK_142b9b0473faf7fd4d4f4da2d0b"`);
        await queryRunner.query(`ALTER TABLE "sla_logs" DROP COLUMN "manager_fullname"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "changed_by_fullname"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "changed_by_id"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "funnel_stage_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_blocked"`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "manager_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."UQ_FUNNEL_STAGE_ORDER"`);
        await queryRunner.query(`DROP TABLE "funnel_stages"`);
        await queryRunner.query(`DROP TABLE "funnels"`);
        await queryRunner.query(`ALTER TABLE "sla_logs" ADD CONSTRAINT "FK_07f48d6a4dbf1e09a4e8a91ae3b" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_65bf07efcacdf24f695bed104cc" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
