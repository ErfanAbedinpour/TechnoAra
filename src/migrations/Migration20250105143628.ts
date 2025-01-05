import { Migration } from '@mikro-orm/migrations';

export class Migration20250105143628 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "brands" add constraint "brands_name_unique" unique ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "brands" drop constraint "brands_name_unique";`);
  }

}
