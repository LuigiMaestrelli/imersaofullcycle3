import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrdersItemsTable1626373819549 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order_items',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'quantity',
                        type: 'int'
                    },
                    {
                        name: 'price',
                        type: 'double precision'
                    },
                    {
                        name: 'product_id',
                        type: 'uuid'
                    },
                    {
                        name: 'order_id',
                        type: 'uuid'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            'order_items',
            new TableForeignKey({
                name: 'fk_order_items_product',
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products'
            })
        );

        await queryRunner.createForeignKey(
            'order_items',
            new TableForeignKey({
                name: 'fk_order_items_order',
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('order_items', 'fk_order_items_product');
        await queryRunner.dropForeignKey('order_items', 'fk_order_items_order');
        await queryRunner.dropTable('order_items');
    }
}
