import { Query } from "@nestjs/cqrs";
import { GetAllProductResponse } from "../dto/get-product";

export class FindProductQuery extends Query<GetAllProductResponse> {
    constructor(
        public limit: number,
        public page: number
    ) {
        super()
    }
}