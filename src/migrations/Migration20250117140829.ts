import { Migration } from '@mikro-orm/migrations';

export class Migration20250117140829 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cities" drop constraint "cities_state_id_foreign";`);

    this.addSql(`create table "province" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "title" varchar(255) not null, "slug" varchar(255) not null, "latitude" int not null, "longitude" int not null);`);
    this.addSql(`alter table "province" add constraint "province_slug_unique" unique ("slug");`);

    this.addSql(`drop table if exists "states" cascade;`);

    this.addSql(`alter table "cities" drop constraint "cities_name_unique";`);
    this.addSql(`alter table "cities" drop constraint "cities_en_name_unique";`);
    this.addSql(`alter table "cities" drop constraint "cities_state_id_unique";`);
    this.addSql(`alter table "cities" drop column "name", drop column "en_name";`);

    this.addSql(`alter table "cities" add column "title" varchar(255) not null, add column "slug" varchar(255) not null, add column "latitude" varchar(255) not null, add column "longitude" varchar(255) not null;`);
    this.addSql(`alter table "cities" rename column "state_id" to "province_id";`);
    this.addSql(`alter table "cities" add constraint "cities_province_id_foreign" foreign key ("province_id") references "province" ("id") on update cascade;`);
    this.addSql(`alter table "cities" add constraint "cities_title_unique" unique ("title");`);
    this.addSql(`alter table "cities" add constraint "cities_slug_unique" unique ("slug");`);
    this.addSql(`alter table "cities" add constraint "cities_province_id_unique" unique ("province_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cities" drop constraint "cities_province_id_foreign";`);

    this.addSql(`create table "states" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null, "en_name" varchar(255) not null);`);
    this.addSql(`alter table "states" add constraint "states_name_unique" unique ("name");`);
    this.addSql(`alter table "states" add constraint "states_en_name_unique" unique ("en_name");`);

    this.addSql(`drop table if exists "province" cascade;`);

    this.addSql(`alter table "cities" drop constraint "cities_title_unique";`);
    this.addSql(`alter table "cities" drop constraint "cities_slug_unique";`);
    this.addSql(`alter table "cities" drop constraint "cities_province_id_unique";`);
    this.addSql(`alter table "cities" drop column "title", drop column "slug", drop column "latitude", drop column "longitude";`);

    this.addSql(`alter table "cities" add column "name" varchar(255) not null, add column "en_name" varchar(255) not null;`);
    this.addSql(`alter table "cities" rename column "province_id" to "state_id";`);
    this.addSql(`alter table "cities" add constraint "cities_state_id_foreign" foreign key ("state_id") references "states" ("id") on update cascade;`);
    this.addSql(`alter table "cities" add constraint "cities_name_unique" unique ("name");`);
    this.addSql(`alter table "cities" add constraint "cities_en_name_unique" unique ("en_name");`);
    this.addSql(`alter table "cities" add constraint "cities_state_id_unique" unique ("state_id");`);
  }

}
