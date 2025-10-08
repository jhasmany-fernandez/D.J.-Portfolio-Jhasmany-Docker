"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1735723200000 = void 0;
class InitialMigration1735723200000 {
    constructor() {
        this.name = 'InitialMigration1735723200000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "name" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "content" text,
        "technologies" text,
        "imageUrl" character varying,
        "demoUrl" character varying,
        "githubUrl" character varying,
        "isPublished" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "authorId" uuid NOT NULL,
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "subject" character varying,
        "message" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "isReplied" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contacts_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "projects"
      ADD CONSTRAINT "FK_projects_authorId"
      FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_authorId" ON "projects" ("authorId")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_isPublished" ON "projects" ("isPublished")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_order" ON "projects" ("order")`);
        await queryRunner.query(`CREATE INDEX "IDX_contacts_isRead" ON "contacts" ("isRead")`);
        await queryRunner.query(`CREATE INDEX "IDX_contacts_createdAt" ON "contacts" ("createdAt")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_projects_authorId"`);
        await queryRunner.query(`DROP INDEX "IDX_contacts_createdAt"`);
        await queryRunner.query(`DROP INDEX "IDX_contacts_isRead"`);
        await queryRunner.query(`DROP INDEX "IDX_projects_order"`);
        await queryRunner.query(`DROP INDEX "IDX_projects_isPublished"`);
        await queryRunner.query(`DROP INDEX "IDX_projects_authorId"`);
        await queryRunner.query(`DROP INDEX "IDX_users_email"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1735723200000 = InitialMigration1735723200000;
//# sourceMappingURL=1735723200000-InitialMigration.js.map