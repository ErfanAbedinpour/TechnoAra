import { Migration } from '@mikro-orm/migrations';

export class Migration20250219133438 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tickets" drop constraint "tickets_user_id_foreign";`);

    this.addSql(`alter table "tickets" add constraint "tickets_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tickets" drop constraint "tickets_user_id_foreign";`);

    this.addSql(`alter table "tickets" add constraint "tickets_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

}
