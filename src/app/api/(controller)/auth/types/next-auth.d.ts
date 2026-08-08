import type { UserModel } from '@/app/api/model/response/user-model';

declare module 'next-auth' {
  interface Session {
    userDetails: UserModel;
  }
}
