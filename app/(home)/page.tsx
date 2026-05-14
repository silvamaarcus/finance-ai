import { auth, clerkClient } from '@clerk/nextjs/server';
import { isMatch } from 'date-fns';
import { redirect } from 'next/navigation';

import Navbar from '../_components/navbar';
import { canUserAddTransaction } from '../_data/can-user-add-transaction';
import { getDashboard } from '../_data/get-dashboard';
import AiReportButton from './_components/ai-report-button';
import ExpensesPerCategory from './_components/expenses-per-category';
import LastTransactions from './_components/last-transactions';
import SummaryCards from './_components/summary-cards';
import TimeSelect from './_components/time-select';
import TransactionsPieChart from './_components/transactions-pie-chart';

interface HomeProps {
  searchParams: {
    month?: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth(); // Verifica se o usuário está autenticado
  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!userId) {
    redirect('/login');
  }

  // Verifica se o mês é inválido (ou seja, se não foi fornecido ou se não corresponde ao formato "MM")
  const monthIsInvalid = !month || !isMatch(month, 'MM');
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`); // Redireciona para a mesma página com o mês atual como parâmetro
  }

  const dashboard = await getDashboard(month); // Busca os dados do dashboard com base no mês selecionado

  const userCanAddTransaction = await canUserAddTransaction(); // Verifica se o usuário tem permissão para adicionar uma transação

  const user = await clerkClient().users.getUser(userId); // Obtém os dados do usuário autenticado usando o Clerk

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === 'premium'
              }
            />
            <TimeSelect />
          </div>
        </div>
        <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
