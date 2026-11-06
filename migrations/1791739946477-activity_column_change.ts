import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityColumnChange1791739946477 implements MigrationInterface {
    name = 'ActivityColumnChange1791739946477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" RENAME COLUMN "isCompleted" TO "status"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."activities_status_enum" AS ENUM('NEW', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELED')`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "status" "public"."activities_status_enum" NOT NULL DEFAULT 'NEW'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."activities_status_enum"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "activities" RENAME COLUMN "status" TO "isCompleted"`);
    }

}
