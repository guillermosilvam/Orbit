import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuth1794245073550 implements MigrationInterface {
    name = 'InitAuth1794245073550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "name" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "refresh_token_hash" character varying(64) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_641507381f32580e8479efc36cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_50ccaa6440288a06f0ba693ccc" ON "auth_sessions"  ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8ae45196f82be4540770b41ac5" ON "auth_sessions"  ("refresh_token_hash") `);
        await queryRunner.query(`ALTER TABLE "auth_sessions" ADD CONSTRAINT "FK_50ccaa6440288a06f0ba693ccc6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_sessions" DROP CONSTRAINT "FK_50ccaa6440288a06f0ba693ccc6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ae45196f82be4540770b41ac5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_50ccaa6440288a06f0ba693ccc"`);
        await queryRunner.query(`DROP TABLE "auth_sessions"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
