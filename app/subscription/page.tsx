import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Navbar from '../_components/navbar';

const SubscriptionPage = async () => {
  const { userId } = await auth(); // Verifica se o usuário está autenticado
  if (!userId) {
    redirect('/login'); // Redireciona para a página de login se não estiver autenticado
  }

  return <Navbar />;
};

export default SubscriptionPage;
