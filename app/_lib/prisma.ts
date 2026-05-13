/**
 * Conexão Prisma — cliente compartilhado
 * Este arquivo cria e exporta uma instância única do `PrismaClient` para uso em toda a aplicação Next.js.
 * Em produção ele instancia `PrismaClient` diretamente;
 * Em desenvolvimento reutiliza a instância armazenada em `global.cachedPrisma` para evitar múltiplas conexões com o banco de dados durante hot-reloads do Next.js.
 * Uso: importe `db` de [app/_lib/prisma.ts](app/_lib/prisma.ts) para executar queries com o Prisma.
 */

/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
