import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProductCommand } from "../commands/update-product.command";
import { Loaded } from "@mikro-orm/core";
import { Product } from "../../../models/product.model";
import { EntityManager } from "@mikro-orm/postgresql";
import { Attribute } from "../../../models/attribute.model";
import { ProductAttribute } from "../../../models/product-attribute.model";

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
    constructor(private readonly em: EntityManager) { }

    async execute(command: UpdateProductCommand): Promise<Loaded<Product, never, "*", never>> {
        try {

            const { productId: id, updateDto: updateProductDto } = command

            const product = await this.em.findOneOrFail(Product, id);
            /*
              user send product attribute like this 
              size 13ich
              ram 6GB
              ....
              if this attribute exsist in Db append them to productAttribute Table 
              and if not exsist create them.
             */
            /*
              store attributes and productAttributes into array 
              and insert whole them at once for decrease IO 
             */
            const attributes: Attribute[] = [];
            const productAttributes: ProductAttribute[] = [];

            if (updateProductDto.attributes) {

                for (const { name, value } of updateProductDto.attributes) {
                    // create instance of attribute
                    const attribute = this.em.create(Attribute, { name, createdAt: Date.now(), updatedAt: Date.now() });

                    // push attribute into list for whole at once
                    attributes.push(attribute);
                    productAttributes.push({ attribute, value, product: product });
                }
            }

            for (const [prop, value] of Object.entries(updateProductDto)) {
                if (prop !== "attributes" && value && product[prop] !== value) {
                    this.em.assign(product, { [prop]: value });
                }
            }

            // upsert attributes 
            await this.em.upsertMany(
                Attribute,
                attributes,
                { onConflictFields: ['name'], onConflictAction: "ignore" })

            await Promise.all([
                this.em.upsertMany(
                    ProductAttribute,
                    productAttributes,
                    { onConflictFields: ["attribute", "product"], onConflictAction: "merge", onConflictMergeFields: ["value"] }),
                this.em.flush()
            ])

            return product
        } catch (err) {
            throw err
        }

    }
}