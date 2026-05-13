import {
  TransactionCategory,
  TransactionMethod,
  TransactionType,
} from '@prisma/client';

export const TRANSACTION_CATEGORY_LABELS = {
  EDUCATION: 'Educação',
  ENTERTAINMENT: 'Entretenimento',
  FOOD: 'Alimentação',
  HEALTH: 'Saúde',
  HOUSE: 'Moradia',
  OTHER: 'Outros',
  SALARY: 'Salário',
  TRANSPORTATION: 'Transporte',
  UTILITY: 'Utilidades',
};

export const TRANSACTION_PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER: 'Transferência Bancária',
  BANK_SLIP: 'Boleto Bancário',
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  OTHER: 'Outros',
  PIX: 'Pix',
};

export const TRANSACTION_TYPE_OPTIONS = [
  {
    value: TransactionType.EXPENSE,
    label: 'Despesa',
  },
  {
    value: TransactionType.DEPOSIT,
    label: 'Depósito',
  },
  {
    value: TransactionType.INVESTMENT,
    label: 'Investimento',
  },
];

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
  {
    value: TransactionMethod.BANK_TRANSFER,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.BANK_TRANSFER],
  },
  {
    value: TransactionMethod.BANK_SLIP,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.BANK_SLIP],
  },
  {
    value: TransactionMethod.CASH,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.CASH],
  },
  {
    value: TransactionMethod.CREDIT_CARD,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.CREDIT_CARD],
  },
  {
    value: TransactionMethod.DEBIT_CARD,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.DEBIT_CARD],
  },
  {
    value: TransactionMethod.OTHER,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.OTHER],
  },
  {
    value: TransactionMethod.PIX,
    label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionMethod.PIX],
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: TransactionCategory.EDUCATION,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.EDUCATION],
  },
  {
    value: TransactionCategory.ENTERTAINMENT,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.ENTERTAINMENT],
  },
  {
    value: TransactionCategory.FOOD,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.FOOD],
  },
  {
    value: TransactionCategory.HEALTH,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HEALTH],
  },
  {
    value: TransactionCategory.HOUSE,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HOUSE],
  },
  {
    value: TransactionCategory.OTHER,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.OTHER],
  },
  {
    value: TransactionCategory.SALARY,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.SALARY],
  },
  {
    value: TransactionCategory.TRANSPORTATION,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.TRANSPORTATION],
  },
  {
    value: TransactionCategory.UTILITY,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.UTILITY],
  },
];
