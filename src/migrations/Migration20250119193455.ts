import { Migration } from '@mikro-orm/migrations';

export class Migration20250119193455 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "addresses" drop constraint "addresses_city_slug_city_province_id_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "addresses" add constraint "addresses_city_slug_city_province_id_unique" unique ("city_slug", "city_province_id");`);
  }

}
