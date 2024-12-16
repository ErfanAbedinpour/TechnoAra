import { Migration } from '@mikro-orm/migrations';

export class Migration20241216142607 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "products" add column "slug" varchar(255) not null;`);
    this.addSql(`alter table "products" add constraint "products_slug_unique" unique ("slug");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" drop constraint "products_slug_unique";`);
    this.addSql(`alter table "products" drop column "slug";`);
  }

}
