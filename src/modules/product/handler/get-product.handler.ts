import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindProductQuery } from "../queries/get-product.query";
import { GetAllProductResponse } from "../dto/get-product";
import { EntityManager } from "@mikro-orm/postgresql";
import { Product } from "../../../models/product.model";

@QueryHandler(FindProductQuery)
export class FindProductHandler implements IQueryHandler<FindProductQuery> {
    constructor(private em: EntityManager) { }
    async execute({ limit, page }: FindProductQuery): Promise<GetAllProductResponse> {
        const offset = (page - 1) * limit;

        const [products, count] = await this.em.findAndCount(Product, { inventory: { $gte: 1 } }, {
            limit: limit,
            offset,
            fields: ["category.title", "user.username", "title", "slug", "price", "inventory", "brand.name"],
            populate: ['category', 'brand', 'images.isTitle', 'images.src'],
            orderBy: { id: "asc" }
        })

        return {
            products,
            meta: {
                countAll: count,
                count: products.length,
                allPages: Math.ceil(count / limit) || 1,
                page,
            }
        };

    }
}