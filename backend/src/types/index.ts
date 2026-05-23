export interface JwtPayload {
  sub: string;
  email: string;
  plan: string;
  role: 'USER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: string;
  role: 'USER' | 'ADMIN';
}

declare module 'fastify' {
  interface FastifyRequest {
    nexvpnUser: AuthenticatedUser;
  }
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RefreshBody {
  refreshToken: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
}
