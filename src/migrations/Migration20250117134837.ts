import { Migration } from '@mikro-orm/migrations';

export class Migration20250117134837 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "states" add column "en_name" varchar(255) not null;`);
    this.addSql(`alter table "states" add constraint "states_en_name_unique" unique ("en_name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "states" drop constraint "states_en_name_unique";`);
    this.addSql(`alter table "states" drop column "en_name";`);
  }

}
