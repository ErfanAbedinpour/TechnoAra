import { Migration } from '@mikro-orm/migrations';

export class Migration20241209172037 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "attribute" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null);`);
    this.addSql(`alter table "attribute" add constraint "attribute_name_unique" unique ("name");`);

    this.addSql(`create table "notifications" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "title" varchar(255) not null, "text" text not null);`);

    this.addSql(`create table "role" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" text check ("name" in ('user', 'admin')) not null);`);
    this.addSql(`alter table "role" add constraint "role_name_unique" unique ("name");`);

    this.addSql(`create table "states" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null);`);
    this.addSql(`alter table "states" add constraint "states_name_unique" unique ("name");`);

    this.addSql(`create table "cities" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "name" varchar(255) not null, "state_id" int not null);`);
    this.addSql(`alter table "cities" add constraint "cities_name_unique" unique ("name");`);
    this.addSql(`alter table "cities" add constraint "cities_state_id_unique" unique ("state_id");`);

    this.addSql(`create table "users" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "role_id" int not null default 2, "profile_id" int null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_profile_id_unique" unique ("profile_id");`);

    this.addSql(`create table "tickets" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "title" varchar(255) not null, "body" text not null, "status" text check ("status" in ('open', 'closed', 'In Progress')) not null default 'open', "department" text check ("department" in ('finance', 'support', 'sales')) not null, "identify" uuid not null, "user_id" int not null);`);
    this.addSql(`alter table "tickets" add constraint "tickets_identify_unique" unique ("identify");`);

    this.addSql(`create table "profiles" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "bio" varchar(255) not null, "profile" varchar(255) not null, "user_id" int not null);`);
    this.addSql(`alter table "profiles" add constraint "profiles_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "orders" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "status" text check ("status" in ('processing', 'complete', 'cancelled')) not null default 'processing', "user_id" int not null);`);

    this.addSql(`create table "notifications_users" ("notification_id" int not null, "user_id" int not null, constraint "notifications_users_pkey" primary key ("notification_id", "user_id"));`);

    this.addSql(`create table "categoryies" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "slug" varchar(50) not null, "title" varchar(255) not null, "is_activate" boolean not null default true, "user_id" int not null, "en_name" varchar(255) not null);`);
    this.addSql(`alter table "categoryies" add constraint "categoryies_slug_unique" unique ("slug");`);

    this.addSql(`create table "products" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "title" varchar(50) not null, "inventory" int not null, "describtion" text not null, "user_id" int not null, "price" numeric(10,2) not null, "category_id" int not null);`);

    this.addSql(`create table "Product-Attribute" ("attribute_id" int not null, "product_id" int not null, "value" varchar(255) not null, constraint "Product-Attribute_pkey" primary key ("attribute_id", "product_id"));`);

    this.addSql(`create table "comments" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "body" text not null, "user_id" int not null, "product_id" int not null);`);

    this.addSql(`create table "carts" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "User_id" int not null);`);
    this.addSql(`alter table "carts" add constraint "carts_User_id_unique" unique ("User_id");`);

    this.addSql(`create table "cart_product" ("product_id" int not null, "cart_id" int not null, "count" int not null, constraint "cart_product_pkey" primary key ("product_id", "cart_id"));`);

    this.addSql(`create table "addresses" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "postal_code" varchar(255) not null, "street" text not null, "city_id" int not null, "user_id" int not null);`);
    this.addSql(`alter table "addresses" add constraint "addresses_city_id_unique" unique ("city_id");`);

    this.addSql(`create table "wallets" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "user_id" int not null, "credit" numeric(10,2) not null);`);
    this.addSql(`alter table "wallets" add constraint "wallets_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "cities" add constraint "cities_state_id_foreign" foreign key ("state_id") references "states" ("id") on update cascade;`);

    this.addSql(`alter table "users" add constraint "users_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete set default;`);
    this.addSql(`alter table "users" add constraint "users_profile_id_foreign" foreign key ("profile_id") references "profiles" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "tickets" add constraint "tickets_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "profiles" add constraint "profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "orders" add constraint "orders_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "notifications_users" add constraint "notifications_users_notification_id_foreign" foreign key ("notification_id") references "notifications" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "notifications_users" add constraint "notifications_users_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "categoryies" add constraint "categoryies_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "products" add constraint "products_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "products" add constraint "products_category_id_foreign" foreign key ("category_id") references "categoryies" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "Product-Attribute" add constraint "Product-Attribute_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade;`);
    this.addSql(`alter table "Product-Attribute" add constraint "Product-Attribute_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);

    this.addSql(`alter table "comments" add constraint "comments_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "comments" add constraint "comments_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "carts" add constraint "carts_User_id_foreign" foreign key ("User_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "cart_product" add constraint "cart_product_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "cart_product" add constraint "cart_product_cart_id_foreign" foreign key ("cart_id") references "carts" ("id") on update cascade;`);

    this.addSql(`alter table "addresses" add constraint "addresses_city_id_foreign" foreign key ("city_id") references "cities" ("id") on update cascade;`);
    this.addSql(`alter table "addresses" add constraint "addresses_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "wallets" add constraint "wallets_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

}
