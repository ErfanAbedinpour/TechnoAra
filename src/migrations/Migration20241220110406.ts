import { Migration } from '@mikro-orm/migrations';

export class Migration20241220110406 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "productAttributes" ("product_id" int not null, "attribute_id" int not null, "value" varchar(255) not null, constraint "productAttributes_pkey" primary key ("product_id", "attribute_id"));`);

    this.addSql(`alter table "productAttributes" add constraint "productAttributes_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "productAttributes" add constraint "productAttributes_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade;`);

    this.addSql(`drop table if exists "Product-Attribute" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "Product-Attribute" ("attribute_id" int not null, "product_id" int not null, "value" varchar(255) not null, constraint "Product-Attribute_pkey" primary key ("attribute_id", "product_id"));`);

    this.addSql(`alter table "Product-Attribute" add constraint "Product-Attribute_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade;`);
    this.addSql(`alter table "Product-Attribute" add constraint "Product-Attribute_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);

    this.addSql(`drop table if exists "productAttributes" cascade;`);
  }

}
