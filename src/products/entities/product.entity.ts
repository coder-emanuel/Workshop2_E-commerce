import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal')
    price: number;

    @ManyToMany(() => Order, order => order.products)
    orders: Order[];
}