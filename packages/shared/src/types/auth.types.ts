export interface LoginPayload {
  userId: string;
  password: string;
}

export interface RegisterPayload {
  userId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
