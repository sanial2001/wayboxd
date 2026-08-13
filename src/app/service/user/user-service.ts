import { UserModel } from '@/app/api/model/response/user-model';
import prisma from '@/app/service/_lib/prisma';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';

export async function getUserById(id: number): Promise<UserModel | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return null;
  }
  return mapUserEntityToModel(user);
}

export async function getUserByEmail(email: string): Promise<UserModel | null> {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    return null;
  }
  return mapUserEntityToModel(user);
}

export async function getUserByUsername(username: string): Promise<UserModel | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }
  return mapUserEntityToModel(user);
}

export async function getUserWithPasswordByUsername(username: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: { username },
  });
}

export async function updateUser(id: number, data: Partial<UserModel>): Promise<UserModel> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      updatedAt: new Date(),
    },
  });
  return mapUserEntityToModel(user);
}

export async function saveUser(data: any): Promise<UserModel> {
  const user = await prisma.user.create({
    data: {
      email: data.email ?? null,
      username: data.username,
      password: createHashPassword(data.password),
      createdAt: new Date(),
      updatedAt: data.updatedAt ?? null,
    },
  });
  return mapUserEntityToModel(user);
}

function mapUserEntityToModel(user: User): UserModel {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function createHashPassword(password: string): string {
  return hashSync(password, 10);
}
