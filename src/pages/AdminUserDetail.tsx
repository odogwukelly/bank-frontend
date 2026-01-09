import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, User, CreditCard, PiggyBank, Wallet, Settings, ArrowLeft, Clock1, Clock, Search, Eye, Trash2, Edit, Headphones, Landmark } from 'lucide-react';
import server from '@/server';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loader from '@/components/Loader';
import OverlayLoader from '@/components/OverlayLoader';

export default function UserDetails() {
  const { user_id } = useParams();
  const userId = user_id
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [allowTransfer, setAllowTransfer] = useState({
    allowValidation: false,
    allowTransfer: false,
  });
  const [loading, setLoading] = useState(true);
  const [deleteTransaction, setDeleteTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [transactions, setTransactions] = useState([
    {
      id: 0,
      description: '',
      amount: 0,
      date: '',
      type: '',
      category: '',
      status: '',
      account: ''
    }
  ]);


  useEffect(() => {
    const fetchUserTransactionData = async () => {
      try {

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

        const formatted = transactionDataArray.map((transact) => ({

          id: transact.id,
          description: transact.desc,
          amount: transact.amount,
          date: transact.created_at,
          type: transact.type,
          category: transact.category,
          status: transact.status,
          account: 'Main Checking'
        }));

        setTransactions(formatted);
      } catch (error) {
        console.error("Error fetching account data:", error);
        setTransactions([]);
      }
    };

    fetchUserTransactionData();
  }, [userId]);


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


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${server}/users/get/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch user data');

        const data = await res.json();
        setAllowTransfer({ ...allowTransfer, allowValidation: data.userData.allowValidation, allowTransfer: data.userData.allowTransfer })
        setUser(data.userData);
        setAccounts(
          (data.userAccount || []).map((acc) => ({
            id: acc.id,
            name: acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase(),
            type: acc.accountType,
            balance: acc.accountBalance,
            accountNumber: '****' + acc.accountNumber.slice(-4),
            status: acc.status ? 'Active' : 'Inactive',
            approvedAccount: acc.approvedAccount ? 'Approved' : 'Not Approved',
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    };

    fetchUserData();
  }, [userId]);


  const handleAccountClick = (accountID: string) => {
    navigate(`/admin-account-details/${accountID}/${user.id}`);
  };

  const handleEditProfile = () => {
    navigate(`/admin-edit-user/${userId}`);
  };

  const handleTransferSettings = () => {
    navigate(`/admin-transfer-settings/${user_id}`);
  };

  const handleAllowTransfer = async () => {
    if (allowTransfer.allowTransfer === true) {
      try {
        if (!user_id) {
          toast({
            title: "Unauthorized",
            description: "User ID is required",
            variant: "destructive",
          });
          return;
        }

        const payload = {
          allowTransfer: false
        };

        const res = await fetch(`${server}/users/update/${user_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("Response:", res.status, data);

        if (!res.ok) {
          throw new Error(data.detail || "Failed to update user data");
        }

        toast({
          title: "Disabled!",
          description: `You have just disallowed this User Transfer access!`,
          variant: "warning"
        });

      } catch (error: any) {
        console.error("Network Error:", error);
        toast({
          title: "Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    }

    if (allowTransfer.allowTransfer === false) {
      try {
        if (!user_id) {
          toast({
            title: "Unauthorized",
            description: "User ID is required",
            variant: "destructive",
          });
          return;
        }

        const payload = {
          allowTransfer: true
        };

        const res = await fetch(`${server}/users/update/${user_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("Response:", res.status, data);

        if (!res.ok) {
          throw new Error(data.detail || "Failed to update data");
        }

        toast({
          title: "Allowed",
          description: `You have just Allowed this User Transfer Access!`,
          variant: "success"
        });

      } catch (error: any) {
        console.error("Network Error:", error);
        toast({
          title: "Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  }


  const handleTransferValidation = async () => {
    if (allowTransfer.allowValidation === true) {
      try {
        if (!user_id) {
          toast({
            title: "Unauthorized",
            description: "User ID is required",
            variant: "destructive",
          });
          return;
        }

        const payload = {
          allowValidation: false
        };

        const res = await fetch(`${server}/users/update/${user_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("Response:", res.status, data);

        if (!res.ok) {
          throw new Error(data.detail || "Failed to update account");
        }

        toast({
          title: "Disabled!",
          description: `You have just disabled this User Transfer Validation access!`,
          variant: "warning"
        });

      } catch (error: any) {
        console.error("Network Error:", error);
        toast({
          title: "Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    }

    if (allowTransfer.allowValidation === false) {
      try {
        if (!user_id) {
          toast({
            title: "Unauthorized",
            description: "User ID is required",
            variant: "destructive",
          });
          return;
        }

        const payload = {
          allowValidation: true
        };

        const res = await fetch(`${server}/users/update/${user_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("Response:", res.status, data);

        if (!res.ok) {
          throw new Error(data.detail || "Failed to update account");
        }

        toast({
          title: "Allowed",
          description: `You have just Allowed this User Transfer Validation Access!`,
          variant: "success"
        });

      } catch (error: any) {
        console.error("Network Error:", error);
        toast({
          title: "Error",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  }

  const handleDeleteTransaction = async (transaction_id) => {
    if (window.confirm("Are you sure you want to proceed with deleting this transaction?")) {
      setDeleteTransaction(true)
      try {
        await fetch(`${server}/users/transaction/${transaction_id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        toast({
          title: "Deleted",
          description: `Transaction deleted successfully.`,
          variant: "success"
        });

        window.location.reload()

      } catch (error) {
        console.error("Error deleting this user transaction", error);
        toast({
          title: "failed!",
          description: `Failed to delete transaction.`,
          variant: "destructive"
        });
      } finally {
        setDeleteTransaction(false)
      }
    }
  }


  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return CreditCard;
      case 'savings':
        return PiggyBank;
      default:
        return Wallet;
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout>
      {deleteTransaction && <OverlayLoader message="Deleting..." color="red-500" />}

      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-x-2 mb-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>

          {/* <Button className="bg-blue-600 hover:bg-blue-700 text-xs h-7 sm:h-8" size="sm">
              < className="h-3 w-3 mr-1" />
              Customer Support
            </Button> */}
        </div>
        {/* User Info Section */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-x-2 ">
            <div className="flex items-center space-x-4">

              <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                <AvatarImage
                  src={user?.profileUrl || "/placeholder.svg"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg sm:text-xl">
                  {user?.firstName?.[0]?.toUpperCase() || ""}
                  {user?.lastName?.[0]?.toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
              {/* <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePicture || ''} alt={user.firstName} />
                <AvatarFallback>
                  {user.firstName[0].toUpperCase()}
                  {user.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="mt-2 mb-2 text-sm capitalize">Role: <strong>{user.isAdmin ? "Admin" : "Customer"}</strong></p>

                <div>
                  <small>Total Balance: <span className='bg-green-200 p-1 rounded-full pr-2 pl-2'><strong>${user.totalBalance.toLocaleString()}</strong></span></small>
                </div>
              </div>
            </div>
            <Button variant="secondary" className='hover:bg-blue-500'>
              <Settings className="h-4 w-4 " /> Allow Transfer Validation
              <Switch
                onClick={handleTransferValidation}
                checked={allowTransfer.allowValidation}
                onCheckedChange={(checked) => setAllowTransfer({ ...allowTransfer, allowValidation: checked })}
              />
            </Button>

            <Button variant="destructive" onClick={handleTransferSettings} className='hover:bg-red-200 hover:text-black'>
              <Settings className="h-4 w-4 " /> Transfer Settings
            </Button>
            <Button variant="outline" onClick={handleEditProfile} className='hover:bg-blue-500'>
              <Settings className="h-4 w-4 " /> Edit Profile
            </Button>



          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{user.mobile || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{user.address || 'No address provided'}</span>
            </div>
          </div>
        </Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  mb-4 mt-4">
          <Button variant="success" className='hover:bg-green-300'>
            <Settings className="h-4 w-4 " /> Allow Transfer
            <Switch
              onClick={handleAllowTransfer}
              checked={allowTransfer.allowTransfer}
              onCheckedChange={(checked) => setAllowTransfer({ ...allowTransfer, allowTransfer: checked })}
            />
          </Button>


          {/* <Button className="bg-blue-600 hover:bg-blue-400 "
            onClick={() => navigate(`/create-transaction/${userId}`)}
          >
            <CreditCard className="h-4 w-4 " />
            Create Card
          </Button> */}


          <Button className="bg-green-600 hover:bg-green-400 "
            onClick={() => navigate(`/create-account/${userId}`)}
          >
            <Landmark className="h-4 w-4 " />
            Create Account
          </Button>


          <Button className="bg-blue-600 hover:bg-blue-400 "
            onClick={() => navigate(`/create-transaction/${userId}`)}
          >
            <Clock className="h-4 w-4 " />
            Create Transaction
          </Button>


          <Button className="bg-green-600 hover:bg-green-400 "
            onClick={() => navigate(`/admin-support-view/${userId}`)}
          >
            <Headphones className="h-4 w-4 " />
            View Support Request
          </Button>
        </div>
        <hr />

        {/* User Accounts Section */}
        <div className='mt-6'>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">User Accounts</h3>
          {accounts.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
              No accounts found for this user.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => {
                const Icon = getAccountIcon(account.type);
                return (
                  <Card
                    key={account.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {account.name} Account
                            </h4>
                            <p className="text-xs text-gray-600">{account.accountNumber}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">{account.status}</Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className="text-xs text-gray-600">Available Balance</p>
                          <p className="text-xl font-bold text-gray-900">${account.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          {account.approvedAccount !== "Approved" ? (
                            <Badge className="bg-red-100 text-red-800 text-xs">{account.approvedAccount}</Badge>
                          ) : (<></>)}

                        </div>
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* User trasaction Section */}
        <Card className='mt-5'>
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
                          {transaction.amount > 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className={`font-bold text-sm ${getTypeColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    )}

                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(transaction.date).toLocaleDateString("en-CA")}</span>
                    {/* <span>{transaction.account}</span> */}
                    <span className='space-x-2'>
                      <Button variant="outline" size="sm" className="h-5 w-5 p-0 sm:h-6 sm:w-6"
                        onClick={() => navigate(`/edit-transaction/${transaction.id}/${user.id}`)}
                      >
                        <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-5 w-5 p-0 sm:h-6 sm:w-6 text-red-600"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </span>
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
                    <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-xs sm:text-sm">{new Date(transaction.date).toLocaleDateString("en-CA")}</TableCell>
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


                      <TableCell className="p-1 sm:p-2">
                        <div className="flex space-x-0.5">

                          <Button variant="outline" size="sm" className="h-5 w-5 p-0 sm:h-6 sm:w-6"
                            onClick={() => navigate(`/edit-transaction/${transaction.id}/${user.id}`)}
                          >
                            <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>

                          <Button variant="outline" size="sm" className="h-5 w-5 p-0 sm:h-6 sm:w-6 text-red-600"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                      </TableCell>
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
