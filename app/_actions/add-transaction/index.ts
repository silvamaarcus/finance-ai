'use server';

import { auth } from '@clerk/nextjs/server';
import {
  TransactionCategory,
  TransactionMethod,
  TransactionType,
} from '@prisma/client';

import { db } from '@/app/_lib/prisma';

import { addTransactionSchema } from './schema';

interface AddTransactionParams {
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionMethod;
  date: Date;
}

export const addTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params); // Validar os dados de entrada usando o esquema definido com Zod

  const { userId } = await auth(); // Obter Id do usuário autenticado usando Clerk

  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  await db.transaction.create({
    data: {
      ...params,
      userId, // Associar a transação ao usuário autenticado
    },
  });
};
