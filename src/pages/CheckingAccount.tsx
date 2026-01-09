import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CheckingAccount() {
  const [balance, setBalance] = useState(1250.75);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', amount: 300, date: '2025-10-30' },
    { id: 2, type: 'Withdrawal', amount: 100, date: '2025-10-25' },
    { id: 3, type: 'Transfer', amount: 50, date: '2025-10-21' },
  ]);

  const handleTransaction = (type: 'Deposit' | 'Withdrawal') => {
    if (!amount || Number(amount) <= 0) return;
    const newAmount = Number(amount);
    const newBalance =
      type === 'Deposit' ? balance + newAmount : balance - newAmount;

    setTransactions([
      { id: transactions.length + 1, type, amount: newAmount, date: new Date().toISOString().split('T')[0] },
      ...transactions,
    ]);
    setBalance(newBalance);
    setAmount('');
  };

  return (
     <DashboardLayout>
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-200">Checking Account</h1>
          <p className="text-sm text-gray-600 dark:text-blue-300">Manage your daily transactions easily</p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border-blue-900/40 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-blue-300">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900 dark:text-blue-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" /> {balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border-blue-900/40 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-blue-300">Last Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-gray-900 dark:text-blue-100">
              ${transactions.find(t => t.type === 'Deposit')?.amount || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border-blue-900/40 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-blue-300">Last Withdrawal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-gray-900 dark:text-blue-100">
              ${transactions.find(t => t.type === 'Withdrawal')?.amount || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Actions */}
      <Card className="mb-6 dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border-blue-900/40">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-blue-200">Make a Transaction</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 dark:bg-blue-950/40 dark:text-blue-100"
            type="number"
          />
          <div className="flex gap-2">
            <Button onClick={() => handleTransaction('Deposit')} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <ArrowDown className="h-4 w-4 mr-1" /> Deposit
            </Button>
            <Button onClick={() => handleTransaction('Withdrawal')} className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
              <ArrowUp className="h-4 w-4 mr-1" /> Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-blue-200">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs dark:text-blue-200">Type</TableHead>
                <TableHead className="text-xs dark:text-blue-200">Amount</TableHead>
                <TableHead className="text-xs dark:text-blue-200">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-gray-50 dark:hover:bg-blue-950/30 transition">
                  <TableCell className="text-sm dark:text-blue-200">
                    <Badge
                      className={`$ {
                        t.type === 'Deposit'
                          ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                          : t.type === 'Withdrawal'
                          ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                          : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                      } text-xs`}
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm dark:text-blue-200">${t.amount}</TableCell>
                  <TableCell className="text-sm dark:text-blue-200">{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}
