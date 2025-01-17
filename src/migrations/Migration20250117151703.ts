import { Migration } from '@mikro-orm/migrations';

export class Migration20250117151703 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cities" drop constraint "cities_province_id_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cities" add constraint "cities_province_id_unique" unique ("province_id");`);
  }

}
