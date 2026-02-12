import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, UserStatus } from '@han/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id: createUserDto.id },
    });

    if (existingUser) {
      throw new ConflictException('이미 존재하는 아이디입니다');
    }

    const now = new Date();
    const user = this.usersRepository.create({
      ...createUserDto,
      role: createUserDto.role || UserRole.USER,
      status: createUserDto.status || UserStatus.ACTIVE,
      createdDate: now,
      createdUser: 'RESIST_SYSTEM',
      modifiedDate: now,
      modifiedUser: 'RESIST_SYSTEM',
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다 (ID: ${id})`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('이미 존재하는 이메일입니다');
      }
    }

    Object.assign(user, updateUserDto, { modifiedDate: new Date(), modifiedUser: id });
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
