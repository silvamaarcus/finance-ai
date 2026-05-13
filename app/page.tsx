import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const HomePage = async () => {
  const { userId } = await auth(); // Verifica se o usuário está autenticado
  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="flex h-full items-center justify-center">
      {/* O UserButton é um componente fornecido pelo Clerk que exibe o avatar do usuário e um menu suspenso com opções de conta, como "Perfil", "Configurações" e "Sair". */}
      <UserButton
        showName // Exibe o nome do usuário ao lado do avatar
      />
    </div>
  );
};

export default HomePage;
