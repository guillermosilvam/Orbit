import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivity1795203671943 implements MigrationInterface {
  name = "AddActivity1795203671943";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workspace_id" uuid NOT NULL, "actor_id" uuid, "type" character varying(30) NOT NULL, "project_key" character varying(5), "project_name" character varying(100), "task_identifier" character varying(32), "task_title" character varying(200), "previous_status" character varying(20), "new_status" character varying(20), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_activities" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_activities_workspace_created_at" ON "activities" ("workspace_id", "created_at")`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_activities_workspace" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_activities_actor" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_activities_actor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_activities_workspace"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_activities_workspace_created_at"`,
    );
    await queryRunner.query(`DROP TABLE "activities"`);
  }
}
