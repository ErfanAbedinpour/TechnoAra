import { Migration } from '@mikro-orm/migrations';

export class Migration20250324213825 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "orders" add column "order_number" uuid not null, add column "delivered_at" date not null, add column "address_id" int not null, add column "total_price" numeric(10,0) not null;`);
    this.addSql(`alter table "orders" add constraint "orders_address_id_foreign" foreign key ("address_id") references "addresses" ("id") on update cascade;`);
    this.addSql(`alter table "orders" add constraint "orders_address_id_unique" unique ("address_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "orders" drop constraint "orders_address_id_foreign";`);

    this.addSql(`alter table "orders" drop constraint "orders_address_id_unique";`);
    this.addSql(`alter table "orders" drop column "order_number", drop column "delivered_at", drop column "address_id", drop column "total_price";`);
  }

}
