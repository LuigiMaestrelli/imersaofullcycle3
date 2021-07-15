import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>
    ) {}

    create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepo.create(createProductDto);
        return this.productRepo.save(product);
    }

    findAll(): Promise<Product[]> {
        return this.productRepo.find();
    }

    async findOne(idOrSlug: string): Promise<Product> {
        const where = uuidValidate(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug };

        const product = await this.productRepo.findOne(where);

        if (!product) {
            throw new EntityNotFoundError(Product, idOrSlug);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const updateResult = await this.productRepo.update(id, updateProductDto);
        if (!updateResult.affected) {
            throw new EntityNotFoundError(Product, id);
        }
        return await this.productRepo.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const deleteResult = await this.productRepo.delete(id);
        if (!deleteResult.affected) {
            throw new EntityNotFoundError(Product, id);
        }
    }
}
