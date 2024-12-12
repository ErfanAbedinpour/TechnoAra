import { ApiProperty, PartialType } from "@nestjs/swagger";
import { User } from "../../../models/user.model";
import { Collection } from "@mikro-orm/core";
import { Address } from "../../../models/address.model";
import { Comment } from "../../../models/comment.model";
import { Wallet } from "../../../models/wallet.model";
import { Role } from "../../../models/role.model";
import { Notification } from "../../../models/notification.model";
import { Order } from "../../../models/order.model";
import { Ticket } from "../../../models/ticket.model";
import { Product } from "../../../models/product.model";

export class UserDto extends PartialType(User) {
    @ApiProperty()
    username?: string;
    @ApiProperty()
    email?: string;
    @ApiProperty()
    bio?: string;
    @ApiProperty()
    profile: string
    @ApiProperty()
    addresses?: Collection<Address, object>
    @ApiProperty()
    id?: number;
    @ApiProperty()
    comments?: Collection<Comment, object>;
    @ApiProperty()
    wallet?: Wallet;
    @ApiProperty()
    role?: Role;
    @ApiProperty()
    createdAt?: number;
    @ApiProperty()
    notifications?: Collection<Notification, object>;
    @ApiProperty()
    orders?: Collection<Order, object>;
    @ApiProperty()
    phone?: string;
    @ApiProperty()
    tickets?: Collection<Ticket, object>;
    @ApiProperty()
    products?: Collection<Product, object>;
    @ApiProperty()
    updatedAt?: number;
}