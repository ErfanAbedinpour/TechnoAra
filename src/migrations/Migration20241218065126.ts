import { Migration } from '@mikro-orm/migrations';

export class Migration20241218065126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "brands" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "user_id" int not null, "name" varchar(255) not null);`);

    this.addSql(`alter table "brands" add constraint "brands_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "products" add column "brand_id" int not null;`);
    this.addSql(`alter table "products" add constraint "products_brand_id_foreign" foreign key ("brand_id") references "brands" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" drop constraint "products_brand_id_foreign";`);

    this.addSql(`drop table if exists "brands" cascade;`);

    this.addSql(`alter table "products" drop column "brand_id";`);
  }

}
