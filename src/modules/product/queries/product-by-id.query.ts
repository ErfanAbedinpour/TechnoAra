import { Query } from "@nestjs/cqrs";
import { Product } from "../../../models/product.model";
import { Loaded } from "@mikro-orm/core";

export class ProductByIdQuery extends Query<Loaded<Product, never, "*", never>> {
    constructor(public readonly id: number) {
        super()
    }
}