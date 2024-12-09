import { Migration } from '@mikro-orm/migrations';

export class Migration20241209203131 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "bio" type varchar(255) using ("bio"::varchar(255));`);
    this.addSql(`alter table "users" alter column "bio" drop not null;`);
    this.addSql(`alter table "users" alter column "profile" type varchar(255) using ("profile"::varchar(255));`);
    this.addSql(`alter table "users" alter column "profile" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" alter column "bio" type varchar(255) using ("bio"::varchar(255));`);
    this.addSql(`alter table "users" alter column "bio" set not null;`);
    this.addSql(`alter table "users" alter column "profile" type varchar(255) using ("profile"::varchar(255));`);
    this.addSql(`alter table "users" alter column "profile" set not null;`);
  }

}
