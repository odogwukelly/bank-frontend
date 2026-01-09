import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, ArrowDownLeft, ArrowUpRight, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react';
import server from '@/server';
import Loader from '@/components/Loader';

// SavingsAccount.tsx
// A responsive, well-styled light/dark-theme Savings Account page.
// Designed to fit into your existing dashboard (uses same component names and Tailwind classes).

type Transaction = {
  id: string | number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
};

export default function SavingsAccount() {
  // Mocked data (replace with real API calls)
  const [balance, setBalance] = useState<number>(12450.75);
  const [available, setAvailable] = useState<number>(11450.75);
  const [goal, setGoal] = useState<number>(20000);
  const [autoSave, setAutoSave] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<Transaction[]>(() => (
    Array.from({ length: 22 }).map((_, i) => ({
      id: i + 1,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      description: i % 2 === 0 ? 'Salary deposit' : 'Grocery',
      amount: i % 2 === 0 ? 1500 + i * 10 : 54 + i,
      type: i % 2 === 0 ? 'credit' : 'debit',
      category: i % 2 === 0 ? 'Income' : 'Spending',
    }))
  ));

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentTx = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Forms
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState<
    {
      id: number;
      description: string;
      amount: number;
      type: string;
      date: string;
      category: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    if (userData?.id) {
      const fetchUserDataById = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${server}/users/get/${userData.id}`);
          const transactionRes = await fetch(`${server}/users/transaction/get/${userData.id}`);

          if (!res.ok) throw new Error('Failed to fetch user data');

          const data = await res.json();
          const transactionData = await transactionRes.json();

          const accountsArray = data.userAccount || [];
          const transactionArray = transactionData || [];

          const formattedAccounts = (accountsArray || []).map(acc => ({
            id: acc.id,
            name: acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase(),
            type: acc.accountType,
            balance: acc.accountBalance,
            accountNumber: "****" + acc.accountNumber.slice(-4),
            status: acc.status ? "Active" : "Inactive",
          }));

          setAccounts(formattedAccounts);



          const formatted = transactionArray
            .map((t) => ({
              id: t.id,
              description: t.desc || '',
              amount: Number(t.amount) || 0,
              type: t.type || '',
              date: new Date(t.created_at).toISOString(),
              category: t.category || '',
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setRecentTransactions(formatted);
          setCurrentPage(1);
        } catch (err) {
          console.error('❌ Error fetching user:', err);
        } finally {
          setLoading(false);

        }
      };

      fetchUserDataById();
    } else {
      setLoading(false);
    }
  }, [userData?.id]);




  // useEffect(() => {
  //   // Example: keep available <= balance
  //   setAvailable(balance - 1000);
  // }, [balance]);

  function handleDeposit(e?: React.FormEvent) {
    e?.preventDefault();
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) return;
    const newTx: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: 'Manual deposit',
      amount: amt,
      type: 'credit',
      category: 'Deposit',
    };
    setTransactions((p) => [newTx, ...p]);
    setBalance((b) => b + amt);
    setDepositAmount('');
    setCurrentPage(1);
  }

  function handleWithdraw(e?: React.FormEvent) {
    e?.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0 || amt > available) return;
    const newTx: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: 'Manual withdrawal',
      amount: amt,
      type: 'debit',
      category: 'Withdrawal',
    };
    setTransactions((p) => [newTx, ...p]);
    setBalance((b) => b - amt);
    setWithdrawAmount('');
    setCurrentPage(1);
  }

if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 min-h-screen p-4 sm:p-6 rounded-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-blue-200">Savings</h1>
            <p className="text-sm text-gray-600 dark:text-blue-300 mt-1">Your savings account overview and activity.</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-sm shadow-md hover:shadow-lg transition-transform duration-200" onClick={() => { /* open transfer */ }}>
              <Plus className="h-4 w-4 mr-2" /> New Transfer
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-blue-300">Auto-save</span>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </div>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#004e92] dark:to-[#000428] dark:border dark:border-blue-900/40">
            <CardContent>
              <p className="text-xs text-gray-400">Total Balance</p>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-blue-200">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <Badge className="bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400">Primary</Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-blue-300 mt-2">Available: ${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#09203f] dark:to-[#000428] dark:border dark:border-blue-900/40">
            <CardContent>
              <p className="text-xs text-gray-400">Savings Goal</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-200">${goal.toLocaleString()}</h2>
              <div className="w-full bg-blue-50 dark:bg-blue-950/30 rounded-full h-2 mt-3 overflow-hidden">
                <div className="h-2 bg-blue-600 dark:bg-blue-400" style={{ width: `${Math.min(100, (balance / goal) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-blue-300 mt-2">{Math.round((balance / goal) * 100)}% of goal</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border dark:border-blue-900/40">
            <CardContent>
              <p className="text-xs text-gray-400">Recent Deposit</p>
              <div className="flex items-center space-x-3 mt-2">
                <div className="rounded-full bg-blue-50 dark:bg-blue-950/30 w-12 h-12 flex items-center justify-center">
                  <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-blue-200">${transactions[0]?.amount?.toLocaleString() || '—'}</p>
                  <p className="text-xs text-gray-500 dark:text-blue-300">{new Date(transactions[0]?.date || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions - deposit / withdraw */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { handleDeposit(e); }} className="space-y-3">
                <Input placeholder="Amount (USD)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                <div className="flex items-center space-x-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <ArrowDownLeft className="h-4 w-4 mr-2" /> Deposit
                  </Button>
                  <Button variant="ghost" onClick={() => setDepositAmount('')}>Clear</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdraw</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { handleWithdraw(e); }} className="space-y-3">
                <Input placeholder="Amount (USD)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                <div className="flex items-center space-x-2">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    <ArrowUpRight className="h-4 w-4 mr-2" /> Withdraw
                  </Button>
                  <Button variant="ghost" onClick={() => setWithdrawAmount('')}>Clear</Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-blue-300 mt-2">Available to withdraw: ${available.toLocaleString()}</p>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" /> New Goal</Button>
                <Button className="flex-1" variant="ghost">Export</Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-blue-300 mt-2">Auto-save is {autoSave ? 'enabled' : 'disabled'}. Changes sync instantly.</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Transactions table */}
        <Card className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-36 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="spending">Spending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs dark:text-blue-200">Date</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Description</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Category</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Amount</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Type</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentTx.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50 dark:hover:bg-blue-950/30">
                      <TableCell className="text-sm dark:text-blue-200">{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm dark:text-blue-200">{tx.description}</TableCell>
                      <TableCell className="text-sm dark:text-blue-200">{tx.category}</TableCell>
                      <TableCell className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm dark:text-blue-200">{tx.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="hidden sm:flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded-md text-sm ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 dark:text-blue-300'}`}>
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-xs text-gray-600 dark:text-blue-300">Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
