import NextAuth from 'next-auth';
import authConfig from './app/_lib/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Every page under /account, including /account itself
  matcher: ['/account/:path*'],
};
