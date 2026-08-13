import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User } from 'next-auth';
import { comparePassword } from '@/app/_util/password';
import { getUserById, getUserWithPasswordByUsername } from '@/app/service/user/user-service';

async function getUserDetailsById(userId: number) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('Invalid user id');
  }
  return user;
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
        username: { label: 'username:', type: 'text' },
        password: { label: 'password:', type: 'password' },
      },
      async authorize(credentials) {
        const username = credentials?.username || '';
        const password = credentials?.password || '';
        const user = await getUserWithPasswordByUsername(username);
        if (!user) {
          throw new Error('Invalid username');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        const authUser: User = {
          id: String(user.id),
          image: '',
          name: user.username,
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
