"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedAdminUser1735723300000 = void 0;
const bcrypt = require("bcrypt");
class SeedAdminUser1735723300000 {
    constructor() {
        this.name = 'SeedAdminUser1735723300000';
    }
    async up(queryRunner) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await queryRunner.query(`
      INSERT INTO "users" ("id", "email", "name", "password", "role", "isActive", "createdAt", "updatedAt")
      VALUES (
        uuid_generate_v4(),
        'admin@example.com',
        'Administrator',
        '${hashedPassword}',
        'admin',
        true,
        now(),
        now()
      )
      ON CONFLICT ("email") DO NOTHING
    `);
        await queryRunner.query(`
      INSERT INTO "projects" (
        "id", "title", "description", "content", "technologies",
        "imageUrl", "demoUrl", "githubUrl", "isPublished", "order",
        "createdAt", "updatedAt", "authorId"
      )
      SELECT
        uuid_generate_v4(),
        'Portfolio Website',
        'A modern portfolio website built with Next.js and NestJS, featuring responsive design and admin panel.',
        'This project showcases modern web development practices using React, TypeScript, and PostgreSQL. It includes user authentication, content management, and a clean, responsive design.',
        'Next.js,NestJS,PostgreSQL,TypeScript,Docker',
        'https://via.placeholder.com/600x400',
        'http://localhost:3002',
        'https://github.com/jhasmany/portfolio',
        true,
        1,
        now(),
        now(),
        u.id
      FROM "users" u WHERE u.email = 'admin@example.com'
      LIMIT 1
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "projects" WHERE "title" = 'Portfolio Website'`);
        await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'admin@example.com'`);
    }
}
exports.SeedAdminUser1735723300000 = SeedAdminUser1735723300000;
//# sourceMappingURL=1735723300000-SeedAdminUser.js.map