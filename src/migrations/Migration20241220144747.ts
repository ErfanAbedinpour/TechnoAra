import { Migration } from '@mikro-orm/migrations';

export class Migration20241220144747 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "products" rename column "describtion" to "description";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" rename column "description" to "describtion";`);
  }

}
