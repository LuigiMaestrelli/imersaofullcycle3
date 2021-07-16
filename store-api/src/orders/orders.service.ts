import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Connection, EntityNotFoundError, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { PaymentService } from './payment/payment.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        private paymentService: PaymentService,
        private readonly connection: Connection
    ) {}

    async create(createOrderDto: CreateOrderDto) {
        const orderData = this.orderRepo.create(createOrderDto);

        const products = await this.productRepo.find({
            where: {
                id: In(orderData.items.map(p => p.product_id))
            }
        });

        orderData.items.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (!product) {
                throw new EntityNotFoundError(Product, item.product_id);
            }
            item.price = product.price;
        });

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = await queryRunner.manager.save(orderData);
            await this.paymentService.payment({
                creditCard: {
                    name: order.credit_card.name,
                    number: order.credit_card.number,
                    expirationMonth: order.credit_card.expiration_month,
                    expirationYear: order.credit_card.expiration_year,
                    cvv: order.credit_card.cvv
                },
                amount: order.total,
                store: process.env.STORE_NAME,
                description: `Produtos: ${products.map(p => p.name).join(', ')}`
            });

            await queryRunner.manager.update(
                Order,
                { id: order.id },
                {
                    status: OrderStatus.Approved
                }
            );
            await queryRunner.commitTransaction();

            return await this.orderRepo.findOne(order.id, {
                relations: ['items']
            });
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    findAll() {
        return this.orderRepo.find();
    }

    async findOne(id: string) {
        const order = await this.orderRepo.findOne(id, {
            relations: ['items']
        });

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
