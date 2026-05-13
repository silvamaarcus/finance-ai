import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Navbar from './_components/navbar';

const HomePage = async () => {
  const { userId } = await auth(); // Verifica se o usuário está autenticado
  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!userId) {
    redirect('/login');
  }

  return <Navbar />;
};

export default HomePage;
