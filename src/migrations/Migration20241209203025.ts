import { Migration } from '@mikro-orm/migrations';

export class Migration20241209203025 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_profile_id_foreign";`);

    this.addSql(`drop table if exists "profiles" cascade;`);

    this.addSql(`alter table "users" drop constraint "users_profile_id_unique";`);
    this.addSql(`alter table "users" drop column "profile_id";`);

    this.addSql(`alter table "users" add column "bio" varchar(255) not null, add column "profile" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "profiles" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "bio" varchar(255) not null, "profile" varchar(255) not null, "user_id" int not null);`);
    this.addSql(`alter table "profiles" add constraint "profiles_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "profiles" add constraint "profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "users" drop column "bio", drop column "profile";`);

    this.addSql(`alter table "users" add column "profile_id" int null;`);
    this.addSql(`alter table "users" add constraint "users_profile_id_foreign" foreign key ("profile_id") references "profiles" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users" add constraint "users_profile_id_unique" unique ("profile_id");`);
  }

}
