import { Migration } from '@mikro-orm/migrations';

export class Migration20250117152251 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "addresses" drop constraint "addresses_city_id_foreign";`);

    this.addSql(`alter table "cities" drop constraint "cities_slug_unique";`);
    this.addSql(`alter table "cities" drop constraint "cities_pkey";`);
    this.addSql(`alter table "cities" drop column "id", drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "cities" add constraint "cities_pkey" primary key ("slug", "province_id");`);

    this.addSql(`alter table "addresses" drop constraint "addresses_city_id_unique";`);

    this.addSql(`alter table "addresses" add column "city_slug" varchar(255) not null;`);
    this.addSql(`alter table "addresses" rename column "city_id" to "city_province_id";`);
    this.addSql(`alter table "addresses" add constraint "addresses_city_slug_city_province_id_foreign" foreign key ("city_slug", "city_province_id") references "cities" ("slug", "province_id") on update cascade;`);
    this.addSql(`alter table "addresses" add constraint "addresses_city_slug_city_province_id_unique" unique ("city_slug", "city_province_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "addresses" drop constraint "addresses_city_slug_city_province_id_foreign";`);

    this.addSql(`alter table "cities" drop constraint "cities_pkey";`);

    this.addSql(`alter table "cities" add column "id" serial not null, add column "created_at" bigint not null, add column "updated_at" bigint not null;`);
    this.addSql(`alter table "cities" add constraint "cities_slug_unique" unique ("slug");`);
    this.addSql(`alter table "cities" add constraint "cities_pkey" primary key ("id");`);

    this.addSql(`alter table "addresses" drop constraint "addresses_city_slug_city_province_id_unique";`);
    this.addSql(`alter table "addresses" drop column "city_slug";`);

    this.addSql(`alter table "addresses" rename column "city_province_id" to "city_id";`);
    this.addSql(`alter table "addresses" add constraint "addresses_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade;`);
    this.addSql(`alter table "addresses" add constraint "addresses_city_id_unique" unique ("city_id");`);
  }

}
