import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1761534773578 implements MigrationInterface {
    name = 'InitSchema1761534773578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clerkId" character varying(128) NOT NULL, "email" character varying(255), "name" character varying(255), "imageUrl" text, "role" character varying(32) NOT NULL DEFAULT 'user', "lastSignInAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b0e4d1eb939d0387788678c4f8" ON "users" ("clerkId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0e4d1eb939d0387788678c4f8"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
