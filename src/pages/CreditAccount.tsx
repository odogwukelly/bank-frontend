import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CreditAccountPage() {
  const [creditLimit, setCreditLimit] = useState(5000);
  const [currentBalance, setCurrentBalance] = useState(2300);
  const [payment, setPayment] = useState('');
  const [transactions] = useState([
    { id: 1, date: '2025-11-01', description: 'Online Purchase', amount: -120.75 },
    { id: 2, date: '2025-10-28', description: 'Payment Received', amount: 300.0 },
    { id: 3, date: '2025-10-24', description: 'ATM Withdrawal', amount: -80.5 },
  ]);

  const handlePayment = () => {
    if (payment) {
      setCurrentBalance((prev) => Math.max(0, prev - parseFloat(payment)));
      setPayment('');
    }
  };

  const availableCredit = creditLimit - currentBalance;

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-black dark:via-blue-950 dark:to-green-950 min-h-screen p-4 sm:p-6 rounded-xl transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-blue-200">Credit Account</h1>
            <p className="text-gray-600 dark:text-blue-300 text-sm">Manage your credit usage and payments</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border dark:border-blue-900/40">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-blue-100">Credit Limit</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-blue-200">${creditLimit.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border dark:border-blue-900/40">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-blue-100">Current Balance</CardTitle>
              <Wallet className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-blue-200">${currentBalance.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border dark:border-blue-900/40">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-blue-100">Available Credit</CardTitle>
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-blue-200">${availableCredit.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Make Payment Section */}
        <Card className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-blue-200">Make a Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Input
              type="number"
              placeholder="Enter amount..."
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="dark:bg-blue-950/40 dark:text-blue-100"
            />
            <Button onClick={handlePayment} className="bg-blue-600 hover:bg-blue-700 text-white">
              Pay Now
            </Button>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-blue-200">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs dark:text-blue-200">Date</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Description</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Amount</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="hover:bg-gray-50 dark:hover:bg-blue-950/30 transition">
                      <TableCell className="text-xs text-gray-700 dark:text-blue-200">{t.date}</TableCell>
                      <TableCell className="text-xs text-gray-700 dark:text-blue-200">{t.description}</TableCell>
                      <TableCell className={`text-xs font-semibold ${t.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {t.amount < 0 ? (
                          <Badge className="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 text-xs flex items-center gap-1">
                            <ArrowDownRight className="h-3 w-3" /> Debit
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 text-xs flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> Credit
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
