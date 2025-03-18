import { Command } from "@nestjs/cqrs";
import { CreateProductResponse } from "../dto/create-product.dto";

export class CreateProductCommand extends Command<CreateProductResponse> {
    constructor(
        public readonly userId: number,
        public readonly title: string,
        public readonly slug: string,
        public readonly inventory: number,
        public readonly description: string,
        public readonly price: string,
        public readonly category: number,
        public readonly brand: number
    ) {
        super()
    }
}