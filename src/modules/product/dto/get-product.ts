import { ApiProperty } from "@nestjs/swagger"
import { Meta } from "../../user/dto/get-user-response"
import { Product } from "../../../models/product.model"
import { Loaded } from "@mikro-orm/core"

export class GetAllProductResponse {
    @ApiProperty({ type: [Product] })
    products: Loaded<Product, "category", "price" | "slug" | "title" | "inventory" | "category.title" | "user.username", never>[]
    @ApiProperty({ type: () => Meta })
    meta: Meta
}
