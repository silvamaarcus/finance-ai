'use server';

import { auth } from '@clerk/nextjs/server';
import {
  TransactionCategory,
  TransactionMethod,
  TransactionType,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { db } from '@/app/_lib/prisma';

import { upsertTransactionSchema } from './schema';

interface UpsertTransactionParams {
  id?: string; // O ID é opcional, pois pode ser usado tanto para criação quanto para atualização de transações
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params); // Validar os dados de entrada usando o esquema definido com Zod

  const { userId } = await auth(); // Obter Id do usuário autenticado usando Clerk

  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  await db.transaction.upsert({
    // Se um ID for fornecido, o Prisma tentará encontrar uma transação existente com esse ID para atualizar. Se nenhum ID for fornecido, o Prisma criará uma nova transação.
    where: {
      id: params.id,
    },
    // Se a transação já existir (ou seja, se um ID válido for fornecido), atualizar os campos com os novos valores
    update: { ...params, userId },
    // Se a transação não existir (ou seja, se nenhum ID for fornecido), criar uma nova transação com os dados fornecidos e associá-la ao usuário autenticado
    create: {
      ...params,
      userId,
    },
  });
  revalidatePath('/transactions'); // Revalidar a rota de transações para garantir que as alterações sejam refletidas na interface do usuário
};
