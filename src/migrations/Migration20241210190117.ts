import { Migration } from '@mikro-orm/migrations';

export class Migration20241210190117 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "wallet_id" int not null;`);
    this.addSql(`alter table "users" add constraint "users_wallet_id_foreign" foreign key ("wallet_id") references "wallets" ("id") on update cascade;`);
    this.addSql(`alter table "users" add constraint "users_wallet_id_unique" unique ("wallet_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_wallet_id_foreign";`);

    this.addSql(`alter table "users" drop constraint "users_wallet_id_unique";`);
    this.addSql(`alter table "users" drop column "wallet_id";`);
  }

}
