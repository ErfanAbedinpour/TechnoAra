import { Migration } from '@mikro-orm/migrations';

export class Migration20250123100137 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "productImages" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "is_title" boolean not null default false, "src" varchar(255) not null, "product_id" int not null);`);

    this.addSql(`alter table "productImages" add constraint "productImages_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "productImages" cascade;`);
  }

}
