
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, Plus, Search, Zap, Wifi, Car, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Bills() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const upcomingBills = [
    {
      id: 1,
      name: 'Electric Bill',
      company: 'City Power Company',
      amount: 89.45,
      dueDate: '2024-01-15',
      status: 'pending',
      icon: Zap,
      category: 'Utilities'
    },
    {
      id: 2,
      name: 'Internet Bill',
      company: 'Fiber Net',
      amount: 59.99,
      dueDate: '2024-01-18',
      status: 'pending',
      icon: Wifi,
      category: 'Utilities'
    },
    {
      id: 3,
      name: 'Car Insurance',
      company: 'Auto Insurance Co',
      amount: 125.00,
      dueDate: '2024-01-20',
      status: 'scheduled',
      icon: Car,
      category: 'Insurance'
    },
    {
      id: 4,
      name: 'Rent',
      company: 'Property Management',
      amount: 1200.00,
      dueDate: '2024-02-01',
      status: 'scheduled',
      icon: Home,
      category: 'Housing'
    }
  ];

  const paidBills = [
    {
      id: 5,
      name: 'Phone Bill',
      company: 'Mobile Carrier',
      amount: 45.00,
      paidDate: '2024-01-05',
      status: 'paid',
      icon: Wifi,
      category: 'Communications'
    },
    {
      id: 6,
      name: 'Gas Bill',
      company: 'Gas Company',
      amount: 67.22,
      paidDate: '2024-01-03',
      status: 'paid',
      icon: Zap,
      category: 'Utilities'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Scheduled</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 text-xs">Paid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 text-xs">Overdue</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  const handleAddBill =()=>{
    navigate("/add-bill")
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bill Payments</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your bills and payments</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* <Button variant="outline" className="text-sm">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminders
            </Button> */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-sm"
            onClick={handleAddBill}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Due</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600 mt-1">
                  ${upcomingBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-600">This Month Paid</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1">
                  ${paidBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming Bills</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-1">{upcomingBills.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Auto Pay Active</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bills Management */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Bills & Payments</CardTitle>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming</TabsTrigger>
                <TabsTrigger value="paid" className="text-xs sm:text-sm">Paid</TabsTrigger>
                {/* <TabsTrigger value="recurring" className="text-xs sm:text-sm hidden sm:block">Auto Pay</TabsTrigger> */}
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4 sm:mt-6">
                <div className="space-y-3 sm:space-y-4">
                  {upcomingBills.map((bill) => {
                    const IconComponent = bill.icon;
                    const daysUntil = getDaysUntilDue(bill.dueDate);
                    return (
                      <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base">{bill.name}</p>
                              {getStatusBadge(bill.status)}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">{bill.company}</p>
                            <p className="text-xs text-gray-500">
                              Due: {bill.dueDate} ({daysUntil} days)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                          <p className="text-lg sm:text-xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
                          <div className="flex space-x-2">
                            {/* <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Schedule
                            </Button> */}
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                              Pay Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="paid" className="mt-4 sm:mt-6">
                <div className="space-y-3 sm:space-y-4">
                  {paidBills.map((bill) => {
                    const IconComponent = bill.icon;
                    return (
                      <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base">{bill.name}</p>
                              {getStatusBadge(bill.status)}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">{bill.company}</p>
                            <p className="text-xs text-gray-500">Paid: {bill.paidDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                          <p className="text-lg sm:text-xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
                          {/* <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                            View Receipt
                          </Button> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="recurring" className="mt-4 sm:mt-6">
                <div className="text-center py-8 sm:py-12">
                  <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">Set up automatic payments for your bills</p>
                  <Button className="mt-4">Enable Auto Pay</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
