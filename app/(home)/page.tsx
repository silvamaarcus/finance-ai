import { auth } from '@clerk/nextjs/server';
import { isMatch } from 'date-fns';
import { redirect } from 'next/navigation';

import Navbar from '../_components/navbar';
import SummaryCards from './_components/summary-cards';
import TimeSelect from './_components/time-select';

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

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <SummaryCards month={month} />
      </div>
    </>
  );
};

export default Home;
