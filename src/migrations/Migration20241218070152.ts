import { Migration } from '@mikro-orm/migrations';

export class Migration20241218070152 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_cart_id_foreign";`);

    this.addSql(`alter table "carts" drop constraint "carts_User_id_foreign";`);

    this.addSql(`alter table "users" drop constraint "users_cart_id_unique";`);
    this.addSql(`alter table "users" drop column "cart_id";`);

    this.addSql(`alter table "carts" add constraint "carts_User_id_foreign" foreign key ("User_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "carts" drop constraint "carts_User_id_foreign";`);

    this.addSql(`alter table "users" add column "cart_id" int not null;`);
    this.addSql(`alter table "users" add constraint "users_cart_id_foreign" foreign key ("cart_id") references "carts" ("id") on update cascade;`);
    this.addSql(`alter table "users" add constraint "users_cart_id_unique" unique ("cart_id");`);

    this.addSql(`alter table "carts" add constraint "carts_User_id_foreign" foreign key ("User_id") references "users" ("id") on update cascade;`);
  }

}
