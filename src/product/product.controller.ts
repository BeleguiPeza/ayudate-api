import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll() {
    return await this.productService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: ProductDto) {
    return await this.productService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductDto) {
    return await this.productService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.delete(id);
  }
}
