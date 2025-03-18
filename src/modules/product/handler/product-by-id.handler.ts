import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductByIdQuery } from "../queries/product-by-id.query";
import { Loaded } from "@mikro-orm/core";
import { Product } from "../../../models/product.model";
import { EntityManager } from "@mikro-orm/postgresql";

@QueryHandler(ProductByIdQuery)
export class ProductByIdHandler implements IQueryHandler<ProductByIdQuery> {
    constructor(private readonly em: EntityManager) { }
    execute({ id }: ProductByIdQuery): Promise<Loaded<Product, never, "*", never>> {
        return this.em.findOneOrFail(Product, id)
    }
}