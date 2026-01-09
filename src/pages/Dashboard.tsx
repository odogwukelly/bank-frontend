import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Plus,
  ArrowRight,
  Wallet,
  DollarSign,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  PiggyBank,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import server from '@/server';
import Loader from '@/components/Loader';

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);

  const [user, setUser] = useState({
    totalBalance: 0,
    accountCount: '0',
    totalTransaction: '0',
  });

  const [recentTransactions, setRecentTransactions] = useState<
    {
      id: number;
      description: string;
      amount: number;
      type: string;
      date: string;
      category: string;
      accountID: number;
    }[]
  >([]);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(recentTransactions.length / itemsPerPage));

  const currentTransactions = recentTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            approvedAccount: acc.approvedAccount,

          }));

          const formatted = transactionArray
            .map((t) => ({
              id: t.id,
              description: t.desc || '',
              amount: Number(t.amount) || 0,
              type: t.type || '',
              date: new Date(t.created_at).toISOString(),
              category: t.category || '',
              accountID: t.accountID || '',
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


          setUser({
            ...user,
            totalBalance: data.userData?.totalBalance ?? 0,
            accountCount: accountsArray.length,
            totalTransaction: transactionArray.length,
          });



          setAccounts(formattedAccounts);
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

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }

  const handlePageChange = (page: number | 'prev' | 'next') => {
    if (page === 'prev') setCurrentPage((p) => Math.max(1, p - 1));
    else if (page === 'next') setCurrentPage((p) => Math.min(totalPages, p + 1));
    else setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const colorMap: Record<
    string,
    { bg: string; darkBg: string; icon: string; text: string }
  > = {
    blue: {
      bg: 'bg-blue-100',
      darkBg: 'dark:bg-blue-950/40',
      icon: 'text-blue-600',
      text: 'dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100',
      darkBg: 'dark:bg-green-950/40',
      icon: 'text-green-600',
      text: 'dark:text-green-400',
    },
    yellow: {
      bg: 'bg-yellow-100',
      darkBg: 'dark:bg-yellow-950/40',
      icon: 'text-yellow-600',
      text: 'dark:text-yellow-400',
    },
  };

  const handleSettings = () => navigate("/settings");
  const handleNavigate = (id: string) => navigate(`/account-details/${id}`);
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      default: return Wallet;
    }
  };

  const approvedAccounts = accounts.filter(
    acc => acc.approvedAccount === true || acc.approvedAccount === "Approved"
  );

  const approvedAccountIds = approvedAccounts.map(acc => acc.id);

  const approvedTransactions = recentTransactions.filter(
    txn => approvedAccountIds.includes(txn.accountID)
  );

  const totalTransactions = approvedTransactions.length;
  const activeApprovedAccounts = approvedAccounts.length;


  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 min-h-screen p-4 sm:p-6 rounded-xl">
        {/* Welcome Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-blue-200">
              Welcome back,{' '}
              {userData?.firstName
                ? userData.firstName[0].toUpperCase() +
                userData.firstName.slice(1).toLowerCase()
                : ''}
              {userData?.lastName
                ? ' ' +
                userData.lastName[0].toUpperCase() +
                userData.lastName.slice(1).toLowerCase()
                : ''}
              !
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-blue-300 mt-1">
              Here’s what’s happening with your finances today.
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-sm shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105"
            onClick={() => navigate('/transfer')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Transfer
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Balance"
            value={`$${Number(user.totalBalance || 0).toLocaleString()}`}
            iconColor="text-green-500"
            changeType="positive"
            icon={DollarSign}
            className="
      relative overflow-hidden
      dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#004e92] dark:to-[#000428]
      dark:border dark:border-blue-900/40
      dark:shadow-[0_0_25px_-5px_rgba(0,128,255,0.3)]
      hover:scale-[1.03] transition-all duration-500
      before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(0,102,255,0.15),transparent)]
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
      group
    "
          />

          <StatCard
            title="Total Transaction"
            value={String(totalTransactions || '0')}
            changeType="positive"
            icon={ArrowLeftRight}
            className="
      relative overflow-hidden
      dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#09203f] dark:to-[#000428]
      dark:border dark:border-blue-900/40
      dark:shadow-[0_0_25px_-5px_rgba(0,102,255,0.25)]
      hover:scale-[1.03] transition-all duration-500
      before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_right,rgba(0,102,255,0.1),transparent)]
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
    "
          />

          <StatCard
            title="Active Accounts"
            value={String(activeApprovedAccounts)}
            changeType="neutral"
            icon={CreditCard}
            className="
      relative overflow-hidden
      dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428]
      dark:border dark:border-blue-900/40
      dark:shadow-[0_0_25px_-5px_rgba(0,153,255,0.2)]
      hover:scale-[1.03] transition-all duration-500
      before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(0,128,255,0.12),transparent)]
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
    "
          />
        </div>

        {/* Account Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.filter(account => account.approvedAccount === true)
            .slice(0, 3)
            .map(account => {
              const Icon = getAccountIcon(account.type);

              return (
                <Card
                  key={account.id}
                  className="
            relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300
            dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428]
            dark:border dark:border-blue-900/40
            hover:scale-[1.03]
            before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(0,102,255,0.15),transparent)]
            before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
          "
                >
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/40 rounded-full flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-blue-200 capitalize">
                            {account.name} Account
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-blue-300">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>

                      <Badge
                        className={`text-xs px-2 py-1 ${account.status === "Active"
                          ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                          : "bg-gray-200 dark:bg-blue-950/40 text-gray-600 dark:text-blue-300"
                          }`}
                      >
                        {account.status}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-blue-300">Available Balance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-blue-200">
                        ${account.balance.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleNavigate(account.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>

                      <Button variant="outline" size="sm" className="flex-1" onClick={handleSettings}>
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>



        {/* Recent Activity */}
        <Card className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 shadow-lg dark:shadow-blue-900/40 rounded-2xl transition-all hover:shadow-xl dark:hover:shadow-blue-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-blue-200">
              Recent Activity
            </CardTitle>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 text-sm dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => navigate('/transactions')}
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>

          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {currentTransactions.length === 0 ? (
                <p className="text-center text-sm text-gray-500 dark:text-blue-300 py-6">
                  No recent transactions.
                </p>
              ) : (
                currentTransactions
                  .filter(transaction =>
                    accounts.some(
                      account => account.id === transaction.accountID && account.approvedAccount === true
                    )
                  )
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300"
                    >
                      {/* Icon Section */}
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${transaction.type === "credit"
                            ? "bg-green-100 dark:bg-green-950/40"
                            : transaction.type === "debit"
                              ? "bg-red-100 dark:bg-red-950/40"
                              : "bg-blue-100 dark:bg-blue-950/40"
                            }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : transaction.type === "debit" ? (
                            <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        {/* Description */}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-blue-200 text-sm sm:text-base truncate capitalize">
                            {transaction.description}
                          </p>

                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-blue-300">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>

                            {transaction.category && (
                              <Badge
                                variant="secondary"
                                className="text-xs capitalize dark:bg-blue-950/50 dark:text-blue-300"
                              >
                                {transaction.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0 ml-3">
                        <p
                          className={`font-semibold text-sm sm:text-base ${transaction.type === "credit"
                            ? "text-green-600 dark:text-green-400"
                            : transaction.type === "debit"
                              ? "text-red-600 dark:text-red-400"
                              : "text-blue-600 dark:text-blue-400"
                            }`}
                        >
                          {transaction.type === "credit"
                            ? "+"
                            : transaction.type === "debit" || transaction.type === "transfer"
                              ? "-"
                              : ""}
                          ${Number(transaction.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>


            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-3 py-1 rounded-md text-sm transition ${p === currentPage
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
                    className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-700 dark:text-blue-300">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, recentTransactions.length)} of{' '}
                  {recentTransactions.length} transactions
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: ArrowUpRight, title: 'Send Money', desc: 'Transfer to friends', color: 'blue' },
            { icon: ArrowDownLeft, title: 'Request Money', desc: 'From contacts', color: 'green' },
            { icon: Wallet, title: 'Deposit', desc: 'Check or Crypto Currency', color: 'yellow' },
          ].map((item, idx) => {
            const c = colorMap[item.color] || colorMap.blue;
            return (
              <Card
                key={idx}
                className="hover:shadow-xl dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 dark:hover:bg-blue-950/30 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`${c.bg} ${c.darkBg} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14`}
                  >
                    <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${c.icon} ${c.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-blue-200 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-blue-300 mt-1">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
