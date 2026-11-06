import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFix31791294173061 implements MigrationInterface {
    name = 'InitFix31791294173061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_cfd746f703ae7a3e794138e080c"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_ecebef69e07c861111a290cdc0a"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "dealId"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "changedById"`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "deal_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "manager_id" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_989cf44d8c143e0010220dea6fb" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_65bf07efcacdf24f695bed104cc" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_65bf07efcacdf24f695bed104cc"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_989cf44d8c143e0010220dea6fb"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP COLUMN "deal_id"`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "changedById" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD "dealId" uuid`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_ecebef69e07c861111a290cdc0a" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_cfd746f703ae7a3e794138e080c" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
