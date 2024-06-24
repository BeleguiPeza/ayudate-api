import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    const list = await this.productRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: 'La lista está vacia' });
    }
    return list;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) {
      throw new NotFoundException({ message: 'no existe' });
    }
    return product;
  }

  async findByName(name: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ name: name });
    if (!product) {
      throw new NotFoundException({ message: 'no existe' });
    }
    return product;
  }

  async create(dto: ProductDto): Promise<any> {
    const product = this.productRepository.create(dto);
    await this.productRepository.save(product);
    return { message: `Product ${product.name} created` };
  }

  async update(id: number, dto: ProductDto): Promise<any> {
    const product = await this.findById(id);
    dto.name ? (product.name = dto.name) : (product.name = product.name);
    dto.price ? (product.price = dto.price) : (product.price = product.price);
    dto.image ? (product.image = dto.image) : (product.image = product.image);
    await this.productRepository.save(product);
    return { message: `Product ${product.name} edited` };
  }

  async delete(id: number): Promise<any> {
    const product = await this.findById(id);
    await this.productRepository.delete(product);
    return { message: `Product ${product.name} deleted` };
  }
}
