import { Migration } from '@mikro-orm/migrations';

export class Migration20241210185713 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "phone" varchar(255) null;`);
    this.addSql(`alter table "users" add constraint "users_phone_unique" unique ("phone");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_phone_unique";`);
    this.addSql(`alter table "users" drop column "phone";`);
  }

}
