import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { RedisService } from '../../redis/redis.service';
import { REDIS_BLACKLIST_PREFIX } from '../../common/constants';
import { Request } from 'express';
import { createHash } from 'crypto';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token) {
      const tokenHash = createHash('sha256').update(token).digest('hex');
      const isBlacklisted = await this.redisService.exists(
        `${REDIS_BLACKLIST_PREFIX}${tokenHash}`,
      );
      if (isBlacklisted) {
        throw new UnauthorizedException('만료된 인증 토큰입니다');
      }
    }

    // 테스트 유저는 DB 조회 없이 바로 반환 — 프로덕션 환경에서는 비활성화
    if (process.env.NODE_ENV !== 'production' && payload.sub === '123') {
      return { id: '123', email: 'test@han.dev', role: 'user' };
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
