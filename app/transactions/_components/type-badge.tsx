import { Transaction, TransactionType } from '@prisma/client';
import { CircleIcon } from 'lucide-react';

import { Badge } from '@/app/_components/ui/badge';

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="rounded-full bg-muted font-bold text-primary hover:bg-muted">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="rounded-full bg-red-500/10 font-bold text-red-500 hover:bg-muted">
        <CircleIcon className="mr-2 fill-red-500" size={10} />
        Despesa
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full bg-white/10 font-bold text-white hover:bg-muted">
      <CircleIcon className="mr-2 fill-white" size={10} />
      Investimento
    </Badge>
  );
};

export default TransactionTypeBadge;
