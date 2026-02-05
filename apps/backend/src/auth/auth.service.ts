import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './interfaces/tokens.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { REDIS_BLACKLIST_PREFIX } from '../common/constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokenPair(user);
    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokenPair(user);
    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
      const isBlacklisted = await this.redisService.exists(
        `${REDIS_BLACKLIST_PREFIX}${tokenHash}`,
      );

      if (isBlacklisted) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      const user = await this.usersService.findById(payload.sub);

      // Blacklist old refresh token
      const ttl = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 0;
      if (ttl > 0) {
        await this.redisService.setex(
          `${REDIS_BLACKLIST_PREFIX}${tokenHash}`,
          ttl,
          '1',
        );
      }

      const tokens = await this.generateTokenPair(user);
      return {
        ...tokens,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(accessToken: string, refreshToken: string) {
    // Blacklist access token
    try {
      const accessPayload = this.jwtService.verify<JwtPayload>(accessToken, {
        secret: this.configService.get('jwt.accessSecret'),
      });
      const accessHash = createHash('sha256').update(accessToken).digest('hex');
      const accessTtl = accessPayload.exp
        ? accessPayload.exp - Math.floor(Date.now() / 1000)
        : 0;
      if (accessTtl > 0) {
        await this.redisService.setex(
          `${REDIS_BLACKLIST_PREFIX}${accessHash}`,
          accessTtl,
          '1',
        );
      }
    } catch {
      // Access token may already be expired, that's fine
    }

    // Blacklist refresh token
    try {
      const refreshPayload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });
      const refreshHash = createHash('sha256').update(refreshToken).digest('hex');
      const refreshTtl = refreshPayload.exp
        ? refreshPayload.exp - Math.floor(Date.now() / 1000)
        : 0;
      if (refreshTtl > 0) {
        await this.redisService.setex(
          `${REDIS_BLACKLIST_PREFIX}${refreshHash}`,
          refreshTtl,
          '1',
        );
      }
    } catch {
      // Refresh token may already be expired, that's fine
    }

    return { message: 'Logged out successfully' };
  }

  private async generateTokenPair(user: User): Promise<Tokens> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.accessTokenTtl'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshTokenTtl'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user;
    return result;
  }
}
