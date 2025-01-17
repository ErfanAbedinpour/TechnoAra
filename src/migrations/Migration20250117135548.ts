import { Migration } from '@mikro-orm/migrations';

export class Migration20250117135548 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cities" add column "en_name" varchar(255) not null;`);
    this.addSql(`alter table "cities" add constraint "cities_en_name_unique" unique ("en_name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cities" drop constraint "cities_en_name_unique";`);
    this.addSql(`alter table "cities" drop column "en_name";`);
  }

}
