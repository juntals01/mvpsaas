import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSystemStateTable1761970132704 implements MigrationInterface {
    name = 'CreateSystemStateTable1761970132704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "system_state" ("key" character varying(100) NOT NULL, "value" text, CONSTRAINT "PK_a291c88459a85c912ca5f83eb83" PRIMARY KEY ("key"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "system_state"`);
    }

}
