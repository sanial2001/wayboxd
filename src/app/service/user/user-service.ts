import { UserModel } from '@/app/api/model/response/user-model';
import prisma from '@/app/service/_lib/prisma';
import { User } from '@prisma/client';

export async function getUserById(id: number): Promise<UserModel | null> {
  const user = await prisma.user.findUnique({ 
    where: { id } 
  });
  if (!user) {
    return null;
  }
  return mapUserEntityToModel(user);
}

function mapUserEntityToModel(user: User): UserModel {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
