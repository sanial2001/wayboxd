import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User } from 'next-auth';
import { comparePassword } from '@/app/_util/password';
import prisma from '@/app/service/_lib/prisma';
import { UserModel } from '@/app/api/model/response/user-model';

async function getUserDetailsByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

async function getUserDetailsById(userId: number): Promise<UserModel> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('Invalid user id');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'email:', type: 'text' },
        password: { label: 'password:', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email || '';
        const password = credentials?.password || '';
        const user = await getUserDetailsByEmail(email);

        if (!user) {
          throw new Error('Invalid email');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        const authUser: User = {
          id: String(user.id),
          image: '',
          name: user.name,
          email: user.email,
        };

        return authUser;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.userDetails = await getUserDetailsById(
        token.sub !== undefined ? Number(token.sub) : 0
      );
      return session;
    },
  },
};
