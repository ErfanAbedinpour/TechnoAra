import { Migration } from '@mikro-orm/migrations';

export class Migration20250318142954 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "payments" ("id" serial primary key, "created_at" bigint not null, "updated_at" bigint not null, "amount" numeric(10,2) not null, "provider" text check ("provider" in ('zarinpal', 'zipal')) not null, "authority" varchar(255) not null, "status" text check ("status" in ('Pending', 'Success', 'Failed')) not null default 'Pending', "transaction_id" varchar(255) null, "user_id_id" int not null, "order_id_id" int not null);`);
    this.addSql(`alter table "payments" add constraint "payments_order_id_id_unique" unique ("order_id_id");`);

    this.addSql(`alter table "payments" add constraint "payments_user_id_id_foreign" foreign key ("user_id_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "payments" add constraint "payments_order_id_id_foreign" foreign key ("order_id_id") references "orders" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "payments" cascade;`);
  }

}
