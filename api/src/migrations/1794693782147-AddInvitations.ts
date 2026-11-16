import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvitations1794693782147 implements MigrationInterface {
    name = 'AddInvitations1794693782147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workspace_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "role" character varying(20) NOT NULL, "email" character varying(255), "created_by_id" uuid NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "accepted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_872ac94a64b3d44fc4b554780c" ON "invitations"  ("token_hash") `);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_37d2c3ed527014368be5302bdec" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_504adeb0e31e50792c33aced772" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_504adeb0e31e50792c33aced772"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_37d2c3ed527014368be5302bdec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_872ac94a64b3d44fc4b554780c"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
    }

}
