import { ArrowDownUpIcon } from 'lucide-react';

import { Button } from '../_components/ui/button';
import { DataTable } from '../_components/ui/data-table';
import { db } from '../_lib/prisma';
import { transactionColumns } from './_columns';

const TransactionsPage = async () => {
  // acessar as transações do banco de dados
  const transactions = await db.transaction.findMany({}); // consulta para buscar todas as transações

  return (
    <div className="space-y-6 p-6">
      {/* TITULO E BOTAO */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button className="rounded-full">
          Adicionar transação
          <ArrowDownUpIcon />
        </Button>
      </div>
      {/* TABELA DE TRANSACOES */}
      <DataTable columns={transactionColumns} data={transactions} />
    </div>
  );
};

export default TransactionsPage;
