import { AuthModule } from "src/modules/auth/auth.module";
import { ProductModule } from "../modules/product/product.module";
import { CategoryModule } from "../modules/category/category.module";
import { BrandModule } from "../modules/brand/brand.module";
import { ReidsModule } from "../modules/redis/redis.module";
import { UserModule } from "../modules/user/user.module";
import { EmailModule } from "../modules/email/email.module";
import { CartModule } from "../modules/cart/cart.module";
import { AddressModule } from "../modules/address/address.module";
import { ProvinceModule } from "../modules/province/province.module";
import { StorageModule } from "../modules/storage/storage.module";
import { PaymentModule } from "../modules/payment/payment.module";
import { TicketModule } from "../modules/ticket/ticket.module";
import { OrderModule } from "../modules/order/order.module";

export const internalImports = [
    AuthModule,
    ReidsModule,
    UserModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    EmailModule,
    CartModule,
    AddressModule,
    ProvinceModule,
    StorageModule,
    PaymentModule,
    TicketModule,
    OrderModule
];