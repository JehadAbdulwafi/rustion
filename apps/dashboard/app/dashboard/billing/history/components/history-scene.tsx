'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, CreditCard } from "lucide-react";

export default function HistoryScene({
  transactions
}: {
  transactions: Transaction[];
}) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-0 rounded-md overflow-hidden">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CreditCard className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium">No transactions yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your payment history will appear here once you make your first transaction.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.createdAt), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.status === 'succeeded' ? 'success' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'}
                      className="capitalize"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>{formatAmount(+transaction.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
