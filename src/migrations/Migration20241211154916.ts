import { Migration } from '@mikro-orm/migrations';

export class Migration20241211154916 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "role_id" drop default;`);
    this.addSql(`alter table "users" alter column "role_id" type int using ("role_id"::int);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" alter column "role_id" type int using ("role_id"::int);`);
    this.addSql(`alter table "users" alter column "role_id" set default 2;`);
  }

}
