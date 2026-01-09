// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { StatCard } from '@/components/dashboard/StatCard';
// import { ChartCard } from '@/components/dashboard/ChartCard';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   AlertTriangle,
//   Users,
//   DollarSign,
//   Activity,
//   Shield,
//   Search,
//   Filter,
//   Download,
//   Eye,
//   Lock,
//   Unlock,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   TrendingUp,
//   CreditCard,
//   Ban,
//   Trash,
//   Trash2,
//   Headphones,
//   ArrowLeftRight,
//   ArrowDown
// } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import server from '@/server';
// import { useNavigate } from 'react-router-dom';
// import { toast } from '@/components/ui/use-toast';
// import Loader from '@/components/Loader';
// import handleLogout from '@/components/logOut';
// import OverlayLoader from '@/components/OverlayLoader';


// export default function Admin() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [totalUser, setTotalUser] = useState({
//     totalUsers: 0,
//     totalAccounts: 0,
//     totalTransactions: 0,
//     totalSupport: 0
//   });
//   const navigate = useNavigate()

//   const [users, setUsers] = useState([{
//     id: 0,
//     name: '',
//     email: '',
//     status: 'active',
//     balance: 0,
//     joinDate: '',
//     lastLogin: '',
//     riskLevel: '',
//     transferOTP: "",
//     isAdmin: false

//   }]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(false);



//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userRes = await fetch(`${server}/users/get/all`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" }
//         });

//         const accountRes = await fetch(`${server}/users/account/`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" }
//         });

//         const transactionRes = await fetch(`${server}/users/transaction/`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" }
//         });

//         const supportRes = await fetch(`${server}/users/get/all/support`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" }
//         });


//         const userData = await userRes.json();
//         const accountData = await accountRes.json();
//         const transactionData = await transactionRes.json();
//         const supportData = await supportRes.json();

//         const totalUser = userData.totalUsers;
//         const totalAccount = accountData.length || [];
//         const totalTransaction = transactionData.length || [];
//         const support = supportData.length || [];

//         setTotalUser({
//           ...totalUser,
//           totalUsers: totalUser,
//           totalAccounts: totalAccount,
//           totalTransactions: totalTransaction,
//           totalSupport: support
//         })

//         const usersArray = userData.userData || [];

//         const formatted = usersArray.map((user) => ({
//           id: user.id,
//           status: "active",
//           name: `${user.firstName} ${user.lastName}`,
//           email: user.email,
//           balance: user.totalBalance,
//           joinDate: user.created_at,
//           transferOTP: user.transferOTP,

//           isAdmin: user.isAdmin,
//           riskLevel: ''
//         }));

//         setUsers(formatted);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setUsers([]);
//       } finally {
//         setLoading(false)
//       }
//     };

//     fetchUserData();
//   }, []);

//   const systemStats = [
//     {
//       title: 'Total Users',
//       value: totalUser.totalUsers.toString() || "0",
//       change: '',
//       changeType: 'positive' as const,
//       icon: Users
//     },
//     {
//       title: 'Total Accounts',
//       value: totalUser.totalAccounts.toString() || "0",
//       change: '',
//       changeType: 'neutral' as const,
//       icon: CreditCard
//     },
//     {
//       title: 'Transactions',
//       value: totalUser.totalTransactions.toString() || "0",
//       change: '',
//       changeType: 'positive' as const,
//       icon: ArrowLeftRight
//     },
//     {
//       title: 'Support Request',
//       value: totalUser.totalSupport.toString() || "0",
//       change: '',
//       changeType: 'positive' as const,
//       icon: ArrowDown
//     },
//   ]; 

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'active':
//         return <Badge className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5">Active</Badge>;
//       case 'suspended':
//         return <Badge className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5">Suspended</Badge>;
//       case 'pending':
//         return <Badge className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5">Pending</Badge>;
//       default:
//         return <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{status}</Badge>;
//     }
//   };

//   const getRiskBadge = (risk: string) => {
//     switch (risk) {
//       case 'low':
//         return <Badge className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5">Low</Badge>;
//       case 'medium':
//         return <Badge className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5">Medium</Badge>;
//       case 'high':
//         return <Badge className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5">High</Badge>;
//       default:
//         return <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{risk}</Badge>;
//     }
//   };

//   const getSeverityBadge = (severity: string) => {
//     switch (severity) {
//       case 'low':
//         return <Badge className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5">Low</Badge>;
//       case 'medium':
//         return <Badge className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5">Medium</Badge>;
//       case 'high':
//         return <Badge className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5">High</Badge>;
//       default:
//         return <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{severity}</Badge>;
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });


//   const handleDeleteUser = async (userID) => {
//     if (window.confirm("Are you sure you want to proceed with deleting this user?")) {
//       setDeleting(true)
//       try {
//         const res = await fetch(`${server}/users/delete/${userID}`, {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" }
//         });
//         toast({
//           title: "Deleted",
//           description: `User has been deleted successfully.`,
//           variant: "success"
//         });

//         // setTimeout(() => {
//           window.location.reload();
//         // }, 2500);


//       } catch (error) {
//         console.error("Error deleting this user account", error);
//         toast({
//           title: "failed!",
//           description: `Failed to delete account.`,
//           variant: "destructive"
//         });
//       }finally{
//         setDeleting(false)
//       }
//     }
//   }



//   if (loading) {
//     return (
//       <DashboardLayout>
//         <Loader message="Loading..." size="h-96" color="blue-500" />
//       </DashboardLayout>
//     );
//   }




//   return (
//     <DashboardLayout>
//       {deleting && <OverlayLoader message="Deleting..." color="red-500" />}
      
//       <div className="space-y-3 sm:space-y-4 lg:space-y-6">
//         {/* Header - Mobile Optimized */}
//         <div className="flex flex-col space-y-2 sm:space-y-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//             <p className="text-gray-600 mt-0.5 text-xs sm:text-sm">Monitor and manage your banking platform</p>
//           </div>
//           <div className="flex flex-col xs:flex-row space-y-1.5 xs:space-y-0 xs:space-x-2">
//             {/* <Button variant="outline" size="sm" className="text-xs h-7 sm:h-8">
//               <Download className="h-3 w-3 mr-1" />
//               Export
//             </Button> */}

//           </div>
//         </div>

//         {/* System Stats - Mobile First Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-2">
//           {systemStats.map((stat, index) => (
//             <StatCard
//               key={index}
//               title={stat.title}
//               value={stat.value}
//               // change={stat.change}
//               changeType={stat.changeType}
//               icon={stat.icon}
//             />
//           ))}
//         </div>

        

//         {/* User Management - Mobile Optimized */}
//         <Card>
//           <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
//             <CardTitle className="text-sm sm:text-base lg:text-lg">User Management</CardTitle>
//             <div className="flex flex-col  sm:flex-row sm:gap-2 lg:gap-3 ">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
//                 <Input
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-7 text-xs h-7 sm:h-8"
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full sm:w-28 h-7 sm:h-8 text-xs">
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="suspended">Suspended</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardHeader>
//           <CardContent className="p-2 sm:p-3 lg:p-1">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2">User</TableHead>
//                     <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2">OTP</TableHead>

//                     <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2">Status</TableHead>
//                     <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2">Balance</TableHead>
//                     {/* <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2 hidden md:table-cell">Risk</TableHead> */}
//                     <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2 lg:table-cell">View</TableHead>
//                     <TableHead className="text-[10px] sm:text-xs p-1 sm:p-2">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredUsers.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell className="min-w-0 p-1 sm:p-2">
//                         <div>
//                           <p className="font-medium text-[10px] sm:text-xs truncate capitalize">{user.name}</p>
//                           <p className="text-[9px] sm:text-[10px] text-gray-600 truncate">{user.email}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-medium text-[10px] sm:text-xs p-1 sm:p-2">{user.transferOTP}</TableCell>

//                       <TableCell className="p-1 sm:p-2">{getStatusBadge(user.status)}</TableCell>
//                       <TableCell className="font-medium text-[10px] sm:text-xs p-1 sm:p-2">${user.balance.toLocaleString()}</TableCell>
//                       {/* <TableCell className="hidden md:table-cell p-1 sm:p-2">{getRiskBadge(user.riskLevel)}</TableCell> */}
//                       {/* <TableCell className="hidden lg:table-cell text-[10px] sm:text-xs p-1 sm:p-2">{user.lastLogin}</TableCell> */}
//                       <TableCell className="p-1 sm:p-2">
//                         <div className="flex space-x-0.5">

//                           <Button variant="outline" size="sm" className="h-5 w-5 p-0 sm:h-6 sm:w-6"
//                             onClick={() => navigate(`/admin-user-details/${user.id}`)}>
//                             <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                       {user.isAdmin !== true ? (
//                         <TableCell className="p-1 sm:p-2">
//                           <div className="flex space-x-0.5">

//                             <Button variant="outline" size="sm" className="h-5 w-5 p-0 sm:h-6 sm:w-6 text-red-600"
//                               onClick={() => handleDeleteUser(user.id)}>
//                               <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       ) : (
//                         <TableCell className="p-1 sm:p-2 ">
//                           <div className="justify-center">
//                             <small><strong className='text-red-500'>Admin</strong></small>
//                           </div>
//                         </TableCell>
//                       )}


//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

        
//       </div>
//     </DashboardLayout>
//   );
// }


import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  CreditCard,
  ArrowLeftRight,
  ArrowDown,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import server from '@/server';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';
import handleLogout from '@/components/logOut';
import OverlayLoader from '@/components/OverlayLoader';

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalUser, setTotalUser] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalSupport: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`${server}/users/get/all`);
        const accountRes = await fetch(`${server}/users/account/`);
        const transactionRes = await fetch(`${server}/users/transaction/`);
        const supportRes = await fetch(`${server}/users/get/all/support`);

        const userData = await userRes.json();
        const accountData = await accountRes.json();
        const transactionData = await transactionRes.json();
        const supportData = await supportRes.json();

        setTotalUser({
          totalUsers: userData.totalUsers,
          totalAccounts: accountData.length || 0,
          totalTransactions: transactionData.length || 0,
          totalSupport: supportData.length || 0,
        });

        const formatted = (userData.userData || []).map((user) => ({
          id: user.id,
          status: 'active',
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          balance: user.totalBalance,
          joinDate: user.created_at,
          transferOTP: user.transferOTP,
          isAdmin: user.isAdmin,
        }));
        setUsers(formatted);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page === 'next' && currentPage < totalPages)
      setCurrentPage(currentPage + 1);
    else if (page === 'prev' && currentPage > 1)
      setCurrentPage(currentPage - 1);
    else if (typeof page === 'number') setCurrentPage(page);
  };

  const handleDeleteUser = async (userID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeleting(true);
      try {
        await fetch(`${server}/users/delete/${userID}`, { method: 'DELETE' });
        toast({
          title: 'Deleted',
          description: 'User has been deleted successfully.',
          variant: 'success',
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: 'Failed!',
          description: 'Failed to delete account.',
          variant: 'destructive',
        });
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {deleting && <OverlayLoader message="Deleting..." color="red-500" />}

      <div className="space-y-6 sm:space-y-8 bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 min-h-screen p-4 sm:p-6 rounded-xl">
        {/* Header */}
        <div className="flex flex-col space-y-2 sm:space-y-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-blue-200">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-blue-300 text-sm">
              Monitor and manage your banking platform
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Users',
              value: totalUser.totalUsers,
              icon: Users,
              color: 'text-blue-400',
            },
            {
              title: 'Total Accounts',
              value: totalUser.totalAccounts,
              icon: CreditCard,
              color: 'text-green-400',
            },
            {
              title: 'Transactions',
              value: totalUser.totalTransactions,
              icon: ArrowLeftRight,
              color: 'text-yellow-400',
            },
            {
              title: 'Support Request',
              value: totalUser.totalSupport,
              icon: ArrowDown,
              color: 'text-purple-400',
            },
          ].map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={String(stat.value)}
              icon={stat.icon}
              className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428] dark:border dark:border-blue-900/40 dark:shadow-[0_0_25px_-5px_rgba(0,153,255,0.2)] hover:scale-[1.03] transition-all duration-500"
            />
          ))}
        </div>

        {/* User Management Table */}
        <Card className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 shadow-lg dark:shadow-blue-900/40 rounded-2xl transition-all hover:shadow-xl dark:hover:shadow-blue-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-blue-200">
              User Management
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm h-9 dark:bg-blue-950/40 dark:text-blue-100"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-28 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs dark:text-blue-200">User</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">OTP</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Status</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Balance</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">View</TableHead>
                    <TableHead className="text-xs dark:text-blue-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-blue-950/30 transition"
                    >
                      <TableCell className="text-sm text-gray-900 dark:text-blue-200">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-blue-300">
                          {user.email}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs dark:text-blue-200">
                        {user.transferOTP}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs dark:text-blue-200">
                        ${user.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin-user-details/${user.id}`)}
                          className="h-7 w-7 p-0 dark:border-blue-800 dark:text-blue-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                      {user.isAdmin ? (
                        <TableCell>
                          <small className="text-red-500">Admin</small>
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 dark:border-red-800 dark:text-red-400"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                    className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-700 dark:text-blue-300">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
                  {filteredUsers.length} users
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

