import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CreditCard, Wallet, PiggyBank, TrendingUp, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import server from '@/server';
import Loader from '@/components/Loader';

export default function Accounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const storedData = JSON.parse(localStorage.getItem("userData") || '{}');
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'text-green-600 dark:text-green-400';
      case 'debit': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = storedData?.id;
        if (!userId) return;

        const [accountRes, transactionRes] = await Promise.all([
          fetch(`${server}/users/get/${userId}`, { headers: { "Content-Type": "application/json" } }),
          fetch(`${server}/users/transaction/get/${userId}`, { headers: { "Content-Type": "application/json" } }),
        ]);

        if (!accountRes.ok || !transactionRes.ok) throw new Error("Failed to fetch data");

        const accountData = await accountRes.json();
        const transactionData = await transactionRes.json();

        const formattedAccounts = (accountData.userAccount || []).map(acc => ({
          id: acc.id,
          name: acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase(),
          type: acc.accountType,
          balance: acc.accountBalance,
          accountNumber: "****" + acc.accountNumber.slice(-4),
          status: acc.status ? "Active" : "Inactive",
          approvedAccount: acc.approvedAccount,
        }));

        const formattedTransactions = (transactionData || []).map(tx => ({
          id: tx.id,
          description: tx.desc,
          amount: tx.amount,
          type: tx.type,
          date: new Date(tx.created_at),
        }));


        setAccounts(formattedAccounts);
        setRecentTransactions(formattedTransactions);


      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [storedData?.id]);

  const handleNavigate = (id: string) => navigate(`/account-details/${id}`);
  const handleCreateAccount = () => navigate("/create-account");
  const handleSettings = () => navigate("/settings");

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      default: return Wallet;
    }
  };

  if (loading) return <DashboardLayout><Loader message="Loading accounts..." size="h-96" color="blue-500" /></DashboardLayout>;

  // Filter & sort transactions
  const filteredTransactions = recentTransactions
    .filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase())  )
    .sort((a, b) => sortAsc ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime());

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  const approvedAccounts = accounts.filter(
    acc => acc.approvedAccount === true || acc.approvedAccount === "Approved"
  );

  const approvedAccountIds = approvedAccounts.map(acc => acc.id);

  const approvedTransactions = recentTransactions.filter(
    txn => approvedAccountIds.includes(txn.accountID)
  );

  const activeApprovedAccounts = approvedAccounts.length;
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              My Accounts
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Manage and view all your bank accounts</p>
          </div>

          {activeApprovedAccounts >= 3 ? (
            <></>
          ):(
            <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg"
            onClick={handleCreateAccount}
          >
            <CreditCard className="h-4 w-4 mr-2" /> Request New Account
          </Button>
          ) }
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
        {/* Account Cards with Dashboard dark theme */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(account => {
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
                        <h3 className="font-semibold text-gray-900 dark:text-blue-200 capitalize">{account.name} Account</h3>
                        <p className="text-sm text-gray-500 dark:text-blue-300">{account.accountNumber}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs px-2 py-1 ${account.status === 'Active' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' : 'bg-gray-200 dark:bg-blue-950/40 text-gray-600 dark:text-blue-300'}`}>
                      {account.status}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-blue-300">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-blue-200">${account.balance.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleNavigate(account.id)}>
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
        </div> */}



        {/* Recent Transactions with Dashboard styling */}
        <Card className="shadow-lg dark:shadow-blue-900/40 rounded-2xl dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 transition-all hover:shadow-xl dark:hover:shadow-blue-800/50">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-blue-200">Recent Transactions</CardTitle>
            <div className="flex items-center mt-3 sm:mt-0 space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-blue-300 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button size="sm" className="bg-gray-100 dark:bg-blue-950/40 text-gray-700 dark:text-blue-300 hover:bg-gray-200 dark:hover:bg-blue-900" onClick={() => setSortAsc(!sortAsc)}>
                Sort: {sortAsc ? 'Oldest' : 'Newest'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {paginatedTransactions.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-blue-300 py-6">No transactions found</p>
            ) : paginatedTransactions.map(tx => (
              <div
                key={tx.id}
                className={`flex justify-between items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300
                  ${tx.type === 'credit' ? 'bg-green-100/10 dark:bg-green-950/20' : tx.type === 'debit' ? 'bg-red-100/10 dark:bg-red-950/20' : 'bg-blue-100/10 dark:bg-blue-950/20'}
                  border border-gray-100 dark:border-blue-900/20
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-950/40' : tx.type === 'debit' ? 'bg-red-100 dark:bg-red-950/40' : 'bg-blue-100 dark:bg-blue-950/40'}`}>
                    <TrendingUp className={`h-5 w-5 ${getTypeColor(tx.type)}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-blue-200 capitalize">{tx.description}</p>
                    <p className="text-xs text-gray-500 dark:text-blue-300">{tx.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getTypeColor(tx.type)}`}>
                    {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <Badge variant="secondary" className={`capitalize ${getTypeColor(tx.type)}`}>
                    {tx.type}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-4">
                <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 dark:text-blue-300">{currentPage} / {totalPages}</span>
                <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
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
