
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Calendar, ArrowUpDown } from 'lucide-react';
import server from '@/server';
import Loader from '@/components/Loader';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const userData = JSON.parse(localStorage.getItem("userData"));
  
  const [transactions, setTransactions] = useState([
    {
      id: 0,
      description: '',
      amount: 0,
      date: '',
      type: '',
      category: '',
      status: '',
      account: '',
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTransactionData = async () => {
      try {
        const userId = userData?.id;
        if (!userId) return;

        const transactionRes = await fetch(`${server}/users/transaction/get/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!transactionRes.ok) {
          throw new Error("Failed to fetch transaction data");
        }

        const transactionData = await transactionRes.json();

        const transactionDataArray = transactionData || [];

        const formattedAcc = transactionDataArray.map((transact) => ({
          account_id: transact.accountID
        }));
        const formatted = transactionDataArray.map((transact) => ({
          id: transact.id,
          description: transact.desc,
          amount: transact.amount,
          date: transact.created_at,
          type: transact.type,
          category: transact.category,
          status: transact.status
        }));

        setTransactions(formatted);
      } catch (error) {
        console.error("Error fetching account data:", error);
        setTransactions([]);
      } finally{
        setLoading(false)
      }
    };

    fetchUserTransactionData();
  }, [userData?.id]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'description':
        return a.description.localeCompare(b.description);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  
if (loading) {
  return (
    <DashboardLayout>
      <Loader message="Loading..." size="h-96" color="blue-500" />
    </DashboardLayout>
  );
}


  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage your transaction history</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Transactions</CardTitle>
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile View - Card Layout */}
            <div className="block sm:hidden space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm capitalize">{transaction.description}</p>
                      <p className="text-xs text-gray-600 capitalize">{transaction.category}</p>
                    </div>
                    {transaction.type === "debit" || transaction.type === "transfer" ? (
                      <div className="text-right">
                        <p className={`font-bold text-sm ${getTypeColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '-' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className={`font-bold text-sm ${getTypeColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    )}

                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(transaction.date).toLocaleDateString('en-CA')}</span>
                    <span>{transaction.account}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Description</TableHead>
                    <TableHead className="text-xs sm:text-sm">Category</TableHead>
                    {/* <TableHead className="text-xs sm:text-sm">Account</TableHead> */}
                    <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-xs sm:text-sm">{new Date(transaction.date).toLocaleDateString('en-CA')}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-xs sm:text-sm capitalize">{transaction.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm capitalize">{transaction.category}</TableCell>
                      {/* <TableCell className="text-xs sm:text-sm">{transaction.account}</TableCell> */}

                      {transaction.type === "debit" || transaction.type === "transfer" ? (
                        <TableCell className={`font-bold text-xs sm:text-sm ${getTypeColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '-' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </TableCell>
                      ) : (
                        <TableCell className={`font-bold text-xs sm:text-sm ${getTypeColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </TableCell>
                      )}



                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-600 text-sm sm:text-base">No transactions found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
