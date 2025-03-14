import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "../commands/create-product.command";
import { CreateProductResponse } from "../dto/create-product.dto";
import Decimal from "decimal.js";
import { EntityManager } from "@mikro-orm/postgresql";
import { Product } from "../../../models/product.model";

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {

    constructor(private readonly em: EntityManager) { }

    async execute(command: CreateProductCommand): Promise<CreateProductResponse> {
        const { userId, brand, category, description, inventory, price, slug, title } = command
        const decimalPrice = new Decimal(price);


        try {
            const product = this.em.create(Product, {
                category: category,
                price: decimalPrice,
                slug: slug,
                inventory: inventory,
                description: description,
                title,
                user: userId,
                brand: brand
            }, { persist: true, partial: true });

            await this.em.flush();

            return (product as unknown) as CreateProductResponse;
        } catch (err) {
            throw err;
        }
    }
}