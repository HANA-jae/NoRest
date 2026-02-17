import {
  BadRequestException,
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

// 테스트용 하드코딩 — NODE_ENV !== 'production'일 때만 사용
const TEST_USER_ID = '123';
const isTestEnabled = () => process.env.NODE_ENV !== 'production';
const createTestUser = (): User => ({
  id: TEST_USER_ID,
  password: '',
  name: '테스트 사용자',
  email: 'test@han.dev',
  phone: '010-0000-0000',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  profile: null,
  history: null,
  provider: null,
  providerId: null,
  lastLogin: null,
  createdDate: new Date('2026-01-01'),
  modifiedDate: new Date('2026-01-01'),
  createdUser: 'SYSTEM',
  modifiedUser: 'SYSTEM',
}) as User;

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
    // 테스트 유저 폴백 — 프로덕션 환경에서는 비활성화
    if (isTestEnabled() && id === TEST_USER_ID) {
      const dbUser = await this.usersRepository.findOne({ where: { id } });
      if (dbUser) return dbUser;
      // DB에 없으면 자동 생성 (FK 제약 충족)
      const testData = createTestUser();
      const now = new Date();
      const newUser = this.usersRepository.create({
        ...testData,
        password: '',
        createdDate: now,
        createdUser: 'SYSTEM',
        modifiedDate: now,
        modifiedUser: 'SYSTEM',
      });
      try {
        return await this.usersRepository.save(newUser);
      } catch {
        // 동시 생성 경쟁 상태 대비
        return (await this.usersRepository.findOne({ where: { id } })) || testData;
      }
    }

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

    // 테스트 유저는 DB에 없을 수 있으므로 메모리 반환 — 프로덕션 환경에서는 비활성화
    if (isTestEnabled()) {
      const dbUser = await this.usersRepository.findOne({ where: { id } });
      if (!dbUser) {
        return user;
      }
    }

    return this.usersRepository.save(user);
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    const bcrypt = await import('bcryptjs');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('현재 비밀번호가 올바르지 않습니다');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.modifiedDate = new Date();
    user.modifiedUser = id;
    await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
