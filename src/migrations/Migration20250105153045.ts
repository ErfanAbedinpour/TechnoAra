import { Migration } from '@mikro-orm/migrations';

export class Migration20250105153045 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "products" alter column "brand_id" type int using ("brand_id"::int);`);
    this.addSql(`alter table "products" alter column "brand_id" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" alter column "brand_id" type int using ("brand_id"::int);`);
    this.addSql(`alter table "products" alter column "brand_id" set not null;`);
  }

}
