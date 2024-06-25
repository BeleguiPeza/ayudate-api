import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async getAll(): Promise<Auth[]> {
    const list = await this.authRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: 'La lista está vacia' });
    }
    return list;
  }

  async findById(id: number): Promise<Auth> {
    const product = await this.authRepository.findOneBy({ id: id });
    if (!product) {
      throw new NotFoundException({ message: 'no existe' });
    }
    return product;
  }

  async signIn(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.authRepository.findOneBy({ email: dto.email });
    if (user?.password !== dto.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
