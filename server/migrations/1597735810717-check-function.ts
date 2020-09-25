import {MigrationInterface, QueryRunner} from "typeorm";

export class checkFunction1597735810717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE FUNCTION "MyFunction"(myUserId UUID, myMissionId UUID) 
        RETURNS VARCHAR(5)
        language plpgsql
        AS
        $$
        DECLARE solution VARCHAR(5); 
        BEGIN
            IF myUserId IN (SELECT "userId" FROM "user_project" WHERE demande = TRUE AND invitation = TRUE AND "projectId" IN (SELECT "projectId" FROM mission WHERE mission.id = myMissionId ))
            THEN solution = 'True';
            ELSE solution = 'False';
            END IF;
            RETURN solution; 
        END
        $$
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP IF EXISTS MyFunction
        `)
    }

}
