import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigr1790699507111 implements MigrationInterface {
    name = 'InitMigr1790699507111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_title" character varying NOT NULL, "short_title" character varying, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "inn" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "access" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying, "patronymic" character varying, "last_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role_id" uuid, CONSTRAINT "REL_a2cecd1a3531c0b041e29ba46e" UNIQUE ("role_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "USER_EMAIL_ACTIVE" ON "users"  ("email") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "deal_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "form_status" character varying NOT NULL, "to_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "changedById" uuid, "dealId" uuid, CONSTRAINT "PK_c32b082d69d927fd7abe9152d02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "budget" integer NOT NULL, "status" character varying NOT NULL, "sla_deadline" TIMESTAMP, "isSlaViolated" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "manager_id" uuid, "companyId" uuid, "customer_id" uuid, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "description" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deal_id" uuid, "manager_id" uuid, CONSTRAINT "REL_e02487f1dff929c959f8191d19" UNIQUE ("manager_id"), CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_ecebef69e07c861111a290cdc0a" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal_history" ADD CONSTRAINT "FK_cfd746f703ae7a3e794138e080c" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_2e8a59b685ff2983c71ae80c5ed" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_8824c76128d5ed303cec18e4d71" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_9be56ac4039640667147157451a" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_04fa1883f5dc10f9a9661074ae0" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_e02487f1dff929c959f8191d19a" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_e02487f1dff929c959f8191d19a"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_04fa1883f5dc10f9a9661074ae0"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_9be56ac4039640667147157451a"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_8824c76128d5ed303cec18e4d71"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_2e8a59b685ff2983c71ae80c5ed"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_cfd746f703ae7a3e794138e080c"`);
        await queryRunner.query(`ALTER TABLE "deal_history" DROP CONSTRAINT "FK_ecebef69e07c861111a290cdc0a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TABLE "deal_history"`);
        await queryRunner.query(`DROP INDEX "public"."USER_EMAIL_ACTIVE"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
