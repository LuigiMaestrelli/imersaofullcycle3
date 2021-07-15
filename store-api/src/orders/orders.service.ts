import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>
    ) {}

    async create(createOrderDto: CreateOrderDto) {
        const order = this.orderRepo.create(createOrderDto);

        const products = await this.productRepo.find({
            where: {
                id: In(order.items.map(p => p.product_id))
            }
        });

        order.items.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (!product) {
                throw new EntityNotFoundError(Product, item.product_id);
            }
            item.price = product.price;
        });

        return this.orderRepo.save(order);
    }

    findAll() {
        return this.orderRepo.find();
    }

    async findOne(id: string) {
        const order = await this.orderRepo.findOne(id);

        if (!order) {
            throw new EntityNotFoundError(Order, id);
        }

        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const updateResult = await this.orderRepo.update(id, updateOrderDto);
        if (!updateResult.affected) {
            throw new EntityNotFoundError(Order, id);
        }
        return await this.orderRepo.findOne(id);
    }

    async remove(id: string) {
        const deleteResult = await this.orderRepo.delete(id);
        if (!deleteResult.affected) {
            throw new EntityNotFoundError(Order, id);
        }
    }
}
