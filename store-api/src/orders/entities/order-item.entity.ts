import { Product } from 'src/products/entities/product.entity';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    product_id: string;

    @Column()
    order_id: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Order, order => order.items)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @BeforeInsert()
    generateId() {
        if (this.id) {
            return;
        }

        this.id = uuidv4();
    }
}
