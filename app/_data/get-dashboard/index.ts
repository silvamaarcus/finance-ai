import { auth } from '@clerk/nextjs/server';
import { TransactionType } from '@prisma/client';

import { db } from '@/app/_lib/prisma';

import { TotalExpensePerCategory, TransactionPercentagePerType } from './types';

// Função para obter os dados do dashboard com base no mês selecionado
export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const where = {
    userId,
    date: {
      gte: new Date(`2024-${month}-01`),
      lt: new Date(`2024-${month}-31`),
    },
  };

  // Soma dos valores de cada tipo de transação (depósitos, investimentos e despesas) para o mês selecionado
  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'DEPOSIT' },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  // O total investido é calculado somando os valores de todas as transações do tipo "INVESTMENT" para o mês selecionado
  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'INVESTMENT' },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  // O total de despesas é calculado somando os valores de todas as transações do tipo "EXPENSE" para o mês selecionado
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  // O saldo é calculado subtraindo o total investido e o total de despesas do total de depósitos
  const balance = depositsTotal - investmentsTotal - expensesTotal;

  // O percentual de cada tipo de transação é calculado dividindo o total de cada tipo pelo total geral de transações e multiplicando por 100 para obter o valor em porcentagem
  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum.amount,
  );

  // O percentual de cada tipo de transação é calculado dividindo o total de cada tipo pelo total geral de transações e multiplicando por 100 para obter o valor em porcentagem
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round(
      (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
  };

  // O total de despesas por categoria é calculado agrupando as transações do tipo "EXPENSE" por categoria e somando os valores de cada categoria. Em seguida, é calculado o percentual de cada categoria em relação ao total de despesas para o mês selecionado
  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ['category'],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal: Math.round(
      (Number(category._sum.amount) / Number(expensesTotal)) * 100,
    ),
  }));

  // As últimas transações são obtidas buscando as transações do usuário para o mês selecionado, ordenando-as pela data em ordem decrescente e limitando o resultado às 15 transações mais recentes
  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
    take: 15,
  });
  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  }; // Retorna um objeto contendo o saldo, os totais de depósitos, investimentos e despesas, o percentual de cada tipo de transação, o total de despesas por categoria e as últimas transações para o mês selecionado
};
