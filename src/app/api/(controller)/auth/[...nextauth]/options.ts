import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, User } from 'next-auth';
import { comparePassword } from '@/app/_util/password';
import { UserModel } from '@/app/api/model/response/user-model';
import { getUserByEmail, getUserById } from '@/app/service/user/user-service';

async function getUserDetailsById(userId: number): Promise<UserModel> {
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
        email: { label: 'email:', type: 'text' },
        password: { label: 'password:', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email || '';
        const password = credentials?.password || '';
        const user = await getUserByEmail(email);
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
