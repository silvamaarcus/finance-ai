'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import Groq from 'groq-sdk';

import { db } from '@/app/_lib/prisma';

import { GenerateAiReportSchema, generateAiReportSchema } from './schema';

export const generateAiReport = async ({
  month,
  year,
}: GenerateAiReportSchema) => {
  //* validar os dados de entrada usando zod
  generateAiReportSchema.parse({ month, year });

  //* verificar se o usuário está autenticado
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  //* verificar se usuario tem plano premium para usar
  // Obtém os dados do usuário autenticado usando o Clerk
  const user = await clerkClient().users.getUser(userId);
  // Verifica se o usuário tem um plano premium com base nos metadados públicos do usuário
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === 'premium';

  if (!hasPremiumPlan) {
    throw new Error('You need a premium plan to generate AI report');
  }

  // Obtém a chave da API do GROQ a partir das variáveis de ambiente e inicializa o cliente do GROQ
  const groqAi = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  //* pegar as transações do mês recebido
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });

  //* mandar as transações para a IA gerar o relatório com insights
  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. Nunca use emojis. Nunca use quadros. Nunca use citações, blocos. Apenas headlines, paragraphs e bullets. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${transaction.date.toLocaleDateString('pt-BR')}-R$${transaction.amount}-${transaction.type}-${transaction.category}`,
    )
    .join(';')}`;

  const completion = await groqAi.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      {
        role: 'system',
        content:
          'Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.',
      },
      {
        role: 'user',
        content,
      },
    ],
  });

  //* retornar o relatório gerado
  return completion.choices[0].message.content;
};
