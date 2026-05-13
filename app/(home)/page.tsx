import { auth } from '@clerk/nextjs/server';
import { isMatch } from 'date-fns';
import { redirect } from 'next/navigation';

import Navbar from '../_components/navbar';
import { getDashboard } from '../_data/get-dashboard';
import ExpensesPerCategory from './_components/expenses-per-category';
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
    redirect('?month=01');
  }

  const dashboard = await getDashboard(month); // Busca os dados do dashboard com base no mês selecionado

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>

        <div className="grid-cols-[2fr, 1fr] grid">
          <div className="flex flex-col gap-6">
            <SummaryCards month={month} {...dashboard} />

            <div className="grid grid-cols-3 grid-rows-1 gap-6">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
