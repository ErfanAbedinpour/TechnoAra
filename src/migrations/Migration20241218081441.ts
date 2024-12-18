import { Migration } from '@mikro-orm/migrations';

export class Migration20241218081441 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "order-items" ("order_id" int not null, "product_id" int not null, "quantity" int not null, "price" numeric(10,2) not null, constraint "order-items_pkey" primary key ("order_id", "product_id"));`);

    this.addSql(`alter table "order-items" add constraint "order-items_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade;`);
    this.addSql(`alter table "order-items" add constraint "order-items_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "order-items" cascade;`);
  }

}
