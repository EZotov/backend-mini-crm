import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyChanges1791801448569 implements MigrationInterface {
    name = 'ManyChanges1791801448569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_e02487f1dff929c959f8191d19a"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "REL_e02487f1dff929c959f8191d19"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "created_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "assigned_id" uuid`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "UQ_403f0cc09c0c2137bf88a39e143" UNIQUE ("assigned_id")`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "created_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "UQ_4dd73efe65b7a57c7f8038715a4" UNIQUE ("created_by_id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "REL_a2cecd1a3531c0b041e29ba46e"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_19bcdb3af0768ac8b305c2900df" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_403f0cc09c0c2137bf88a39e143" FOREIGN KEY ("assigned_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_4dd73efe65b7a57c7f8038715a4" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_4dd73efe65b7a57c7f8038715a4"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_403f0cc09c0c2137bf88a39e143"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_19bcdb3af0768ac8b305c2900df"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "REL_a2cecd1a3531c0b041e29ba46e" UNIQUE ("role_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "UQ_4dd73efe65b7a57c7f8038715a4"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "UQ_403f0cc09c0c2137bf88a39e143"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "assigned_id"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "manager_id" uuid`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "REL_e02487f1dff929c959f8191d19" UNIQUE ("manager_id")`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_e02487f1dff929c959f8191d19a" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
