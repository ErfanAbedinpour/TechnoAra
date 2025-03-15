import { Command } from "@nestjs/cqrs";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../../../models/product.model";
import { Loaded } from "@mikro-orm/core";

export class UpdateProductCommand extends Command<Loaded<Product, never, "*", never>> {
    constructor(public productId: number, public updateDto: UpdateProductDto) { super() }
}