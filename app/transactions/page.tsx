import AddTransactionButton from '../_components/add-transaction-button';
import Navbar from '../_components/navbar';
import { DataTable } from '../_components/ui/data-table';
import { db } from '../_lib/prisma';
import { transactionColumns } from './_columns';

const TransactionsPage = async () => {
  // acessar as transações do banco de dados
  const transactions = await db.transaction.findMany({}); // consulta para buscar todas as transações

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        {/* TITULO E BOTAO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>

          <AddTransactionButton />
        </div>
        {/* TABELA DE TRANSACOES */}
        <DataTable columns={transactionColumns} data={transactions} />
      </div>
    </>
  );
};

export default TransactionsPage;
