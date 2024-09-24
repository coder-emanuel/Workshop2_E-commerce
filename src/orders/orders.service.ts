import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, productIds } = createOrderDto;
  
    return await this.orderRepository.manager.transaction(async (transactionalEntityManager) => {
      try {
        const products = await Promise.all(
          productIds.map(id => this.productsService.findOne(id))
        );
  
        if (products.some(product => !product)) {
          throw new NotFoundException('One or more products not found');
        }
  
        const totalPrice = products.reduce((sum, product) => {
          console.log(`Adding product price: ${product.price}`);
          return sum + Number(product.price);
        }, 0);
  
        console.log(`Calculated total price: ${totalPrice}`);
  
        const order = transactionalEntityManager.create(Order, {
          user: { id: userId },
          products,
          totalPrice,
          createdAt: new Date().toISOString(),
        });
  
        console.log(`Created order object:`, order);
  
        const savedOrder = await transactionalEntityManager.save(Order, order);
        console.log(`Saved order:`, savedOrder);
  
        return savedOrder;
      } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user', 'products'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
