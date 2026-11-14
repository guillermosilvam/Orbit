import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddTasks1794676396630 implements MigrationInterface {
    name = 'AddTasks1794676396630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "number" integer NOT NULL, "title" character varying(200) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'todo', "priority" character varying(20) NOT NULL DEFAULT 'medium', "position" numeric(20,10) NOT NULL DEFAULT '1000', "assignee_id" uuid, "due_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_10434cf29644a4a93a76858a96" ON "tasks"  ("project_id", "number") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_855d484825b715c545349212c7f" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_855d484825b715c545349212c7f"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10434cf29644a4a93a76858a96"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
