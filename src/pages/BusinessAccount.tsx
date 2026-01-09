import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function BusinessAccount() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', amount: 5000, status: 'Completed', date: '2025-11-01' },
    { id: 2, type: 'Withdrawal', amount: 1200, status: 'Pending', date: '2025-11-03' },
    { id: 3, type: 'Transfer', amount: 3000, status: 'Completed', date: '2025-11-04' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction: string) => {
    if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
    if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:via-blue-950 dark:to-green-950 p-4 sm:p-6 rounded-xl space-y-6 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-200 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-500" /> Business Account
          </h1>
          <p className="text-sm text-gray-600 dark:text-blue-300">
            Manage company finances and transactions with full control.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] border dark:border-blue-900/40 shadow-lg dark:shadow-blue-900/40 p-4">
          <CardTitle className="text-gray-800 dark:text-blue-200 text-sm mb-1">Account Balance</CardTitle>
          <p className="text-2xl font-bold text-gray-900 dark:text-green-400">$12,450.00</p>
        </Card>

        <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] border dark:border-blue-900/40 shadow-lg dark:shadow-blue-900/40 p-4">
          <CardTitle className="text-gray-800 dark:text-blue-200 text-sm mb-1">Total Income</CardTitle>
          <p className="text-2xl font-bold text-gray-900 dark:text-blue-400 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> $45,000
          </p>
        </Card>

        <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] border dark:border-blue-900/40 shadow-lg dark:shadow-blue-900/40 p-4">
          <CardTitle className="text-gray-800 dark:text-blue-200 text-sm mb-1">Total Expenses</CardTitle>
          <p className="text-2xl font-bold text-gray-900 dark:text-red-400 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" /> $21,300
          </p>
        </Card>
      </div>

      {/* Transaction Actions */}
      <Card className="dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 border dark:border-blue-900/40 shadow-md dark:shadow-blue-900/40 p-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-blue-200">
            Business Transactions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <Input placeholder="Search by type or amount..." className="w-full sm:w-64 dark:bg-blue-950/40 dark:text-blue-100" />

            <Select>
              <SelectTrigger className="w-full sm:w-32 dark:bg-blue-950/40 dark:text-blue-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs dark:text-blue-200">Type</TableHead>
                  <TableHead className="text-xs dark:text-blue-200">Amount</TableHead>
                  <TableHead className="text-xs dark:text-blue-200">Status</TableHead>
                  <TableHead className="text-xs dark:text-blue-200">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-gray-50 dark:hover:bg-blue-950/30 transition">
                    <TableCell className="text-sm text-gray-900 dark:text-blue-200">{tx.type}</TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-blue-200">${tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${
                          tx.status === 'Completed'
                            ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400'
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 dark:text-blue-200">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 rounded-md text-sm transition ${
                      p === currentPage
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-transparent text-gray-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
                className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}