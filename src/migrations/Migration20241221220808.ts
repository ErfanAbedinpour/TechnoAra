import { Migration } from '@mikro-orm/migrations';

export class Migration20241221220808 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "productAttributes" drop constraint "productAttributes_product_id_foreign";`);
    this.addSql(`alter table "productAttributes" drop constraint "productAttributes_attribute_id_foreign";`);

    this.addSql(`alter table "productAttributes" add constraint "productAttributes_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "productAttributes" add constraint "productAttributes_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "productAttributes" drop constraint "productAttributes_product_id_foreign";`);
    this.addSql(`alter table "productAttributes" drop constraint "productAttributes_attribute_id_foreign";`);

    this.addSql(`alter table "productAttributes" add constraint "productAttributes_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "productAttributes" add constraint "productAttributes_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade;`);
  }

}
