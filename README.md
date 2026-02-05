# HAN

React + NestJS + PostgreSQL + Redis 기반 풀스택 웹서비스

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18, Vite, TypeScript, Zustand, React Router, Fetch API |
| Backend | NestJS 10, TypeScript, TypeORM, Passport, Swagger |
| Database | PostgreSQL 16 |
| Cache | Redis 7 (ioredis) |
| Auth | JWT (Access/Refresh Token + Redis Blacklist) |
| Infra | Docker Compose, pnpm Workspaces |

## 프로젝트 구조

```
├── apps/
│   ├── backend/                 NestJS API 서버
│   │   └── src/
│   │       ├── auth/            JWT 인증 (login, register, refresh, logout)
│   │       ├── users/           사용자 CRUD
│   │       ├── health/          헬스체크 (DB + Redis)
│   │       ├── config/          환경변수 모듈 (Joi 검증)
│   │       ├── database/        TypeORM + 마이그레이션
│   │       ├── redis/           ioredis 글로벌 모듈
│   │       └── common/          Guards, Filters, Interceptors, Pipes, Decorators
│   │
│   └── frontend/                React SPA
│       └── src/
│           ├── components/      UI 컴포넌트 (Layout, Header, Auth Forms)
│           ├── pages/           페이지 (Home, Login, Register, Dashboard, 404)
│           ├── store/           Zustand 상태관리 (auth, ui)
│           ├── services/        API 호출 (auth, user)
│           ├── lib/             Fetch API 클라이언트 (토큰 관리, silent refresh)
│           ├── hooks/           커스텀 훅 (useAuth)
│           └── router/          React Router 설정
│
└── packages/
    └── shared/                  공유 타입, 상수, 유틸 (@han/shared)
```

## 사전 요구사항

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

```bash
# 백엔드
cp apps/backend/.env.example apps/backend/.env

# 프론트엔드
cp apps/frontend/.env.example apps/frontend/.env
```

### 3. 인프라 실행 (PostgreSQL + Redis)

```bash
docker compose up -d
```

### 4. Shared 패키지 빌드

```bash
pnpm --filter @han/shared build
```

### 5. DB 마이그레이션

```bash
pnpm --filter backend migration:run
```

### 6. 개발 서버 실행

```bash
# 전체 동시 실행
pnpm dev

# 또는 개별 실행
pnpm --filter backend start:dev     # http://localhost:3000
pnpm --filter frontend dev          # http://localhost:5173
```

## API 문서

개발 서버 실행 후 Swagger UI 접속:

```
http://localhost:3000/api/docs
```

## 주요 엔드포인트

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/register` | 회원가입 | - |
| POST | `/api/auth/login` | 로그인 | - |
| POST | `/api/auth/refresh` | 토큰 갱신 | - |
| POST | `/api/auth/logout` | 로그아웃 | Bearer |
| GET | `/api/users/me` | 내 프로필 조회 | Bearer |
| GET | `/api/users` | 사용자 목록 | Bearer |
| PATCH | `/api/users/:id` | 사용자 수정 | Bearer |
| DELETE | `/api/users/:id` | 사용자 삭제 | Bearer |
| GET | `/api/health` | 헬스체크 | - |

## 인증 흐름

```
1. POST /api/auth/login → { accessToken, refreshToken, user }
2. 요청마다 Authorization: Bearer <accessToken> 헤더 포함
3. accessToken 만료(15분) → POST /api/auth/refresh로 갱신
4. refreshToken 만료(7일) → 재로그인 필요
5. POST /api/auth/logout → 토큰 Redis 블랙리스트 등록
```

프론트엔드 Fetch API 클라이언트가 401 응답 시 자동으로 토큰 갱신을 시도합니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 전체 개발 서버 실행 |
| `pnpm build` | 전체 빌드 |
| `pnpm lint` | 전체 린트 |
| `pnpm format` | Prettier 포맷팅 |
| `pnpm --filter backend migration:generate` | 마이그레이션 생성 |
| `pnpm --filter backend migration:run` | 마이그레이션 실행 |
| `pnpm --filter backend migration:revert` | 마이그레이션 롤백 |
| `pnpm --filter backend test` | 백엔드 테스트 |
| `pnpm --filter @han/shared build` | Shared 패키지 빌드 |

## 환경변수

### Backend (`apps/backend/.env`)

```env
NODE_ENV=development
APP_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=han_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`apps/frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=HAN
```

## Docker 서비스

| 서비스 | 포트 | 설명 |
|--------|------|------|
| PostgreSQL | 5432 | 메인 데이터베이스 |
| Redis | 6379 | 토큰 블랙리스트 / 캐시 |

```bash
docker compose up -d      # 시작
docker compose down        # 중지
docker compose logs -f     # 로그 확인
```
