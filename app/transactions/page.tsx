import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import AddTransactionButton from '../_components/add-transaction-button';
import Navbar from '../_components/navbar';
import { DataTable } from '../_components/ui/data-table';
import { ScrollArea } from '../_components/ui/scroll-area';
import { canUserAddTransaction } from '../_data/can-user-add-transaction';
import { db } from '../_lib/prisma';
import { transactionColumns } from './_columns';

const TransactionsPage = async () => {
  const { userId } = await auth(); // Verifica se o usuário está autenticado
  if (!userId) {
    redirect('/login'); // Redireciona para a página de login se não estiver autenticado
  }

  // acessar as transações do banco de dados
  const transactions = await db.transaction.findMany({}); // consulta para buscar todas as transações

  const userCanAddTransaction = await canUserAddTransaction();
  return (
    <>
      <Navbar />
      <div className="space-y-6 overflow-hidden p-6">
        {/* TITULO E BOTAO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        {/* TABELA DE TRANSACOES */}
        <ScrollArea>
          <DataTable columns={transactionColumns} data={transactions} />
        </ScrollArea>
      </div>
    </>
  );
};

export default TransactionsPage;
