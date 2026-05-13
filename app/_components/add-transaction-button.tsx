'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  TransactionCategory,
  TransactionMethod,
  TransactionType,
} from '@prisma/client';
import { DialogClose } from '@radix-ui/react-dialog';
import { ArrowDownUpIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MoneyInput } from '@/app/_components/money-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';

import { addTransaction } from '../_actions/add-transaction';
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from '../_constants/transactions';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Validacao com Zod
const formSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  amount: z.number(),
  type: z.enum(TransactionType, {
    error: 'O tipo de transação é obrigatório',
  }),
  category: z.enum(TransactionCategory, {
    error: 'A categoria é obrigatória',
  }),
  paymentMethod: z.enum(TransactionMethod, {
    error: 'O método de pagamento é obrigatório',
  }),
  date: z.date({ error: 'A data é obrigatória' }),
});

type FormSchema = z.infer<typeof formSchema>;

const AddTransactionButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.OTHER,
      paymentMethod: TransactionMethod.OTHER,
      date: new Date(),
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      await addTransaction(data);
      setDialogIsOpen(false); // Fecha o diálogo após adicionar a transação
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog
        open={dialogIsOpen}
        onOpenChange={(open) => {
          setDialogIsOpen(open); // Atualiza o estado do diálogo para controlar sua abertura e fechamento
          if (!open) {
            form.reset();
          }
        }} // Reseta o formulário quando o diálogo for fechado
      >
        <DialogTrigger asChild>
          <Button className="rounded-full font-bold">
            Adicionar transação
            <ArrowDownUpIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar transação</DialogTitle>
            <DialogDescription>Insira as informações abaixo</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            {/* Campos do formulário */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da transação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Valor da transação"
                        value={field.value}
                        onValueChange={({ floatValue }) => {
                          field.onChange(floatValue ?? 0);
                        }} // Atualiza o valor do campo "amount" com o valor formatado do MoneyInput
                        onBlur={field.onBlur} // Garante que a validação seja acionada ao perder o foco
                        disabled={field.disabled} // Desabilita o campo durante o envio do formulário
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo da Transação */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo da transação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Método da Transação */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data da Transação */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button>Adicionar</Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTransactionButton;
