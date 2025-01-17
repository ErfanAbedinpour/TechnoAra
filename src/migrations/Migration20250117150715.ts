import { Migration } from '@mikro-orm/migrations';

export class Migration20250117150715 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "province" add column "en_name" varchar(255) not null;`);

    this.addSql(`alter table "cities" add column "en_name" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "province" drop column "en_name";`);

    this.addSql(`alter table "cities" drop column "en_name";`);
  }

}
