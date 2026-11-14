import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjects1794666556960 implements MigrationInterface {
    name = 'AddProjects1794666556960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workspace_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "key" character varying(5) NOT NULL, "description" text, "task_counter" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a3c9187ed74e8dff082dcf95f8" ON "projects"  ("workspace_id", "key") `);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_af78b8fc6857fe0a10d1bb1699e" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_af78b8fc6857fe0a10d1bb1699e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3c9187ed74e8dff082dcf95f8"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
