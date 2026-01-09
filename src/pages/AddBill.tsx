import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function AddBill() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [billData, setBillData] = useState({
    name: '',
    company: '',
    amount: '',
    dueDate: '',
    category: '',
    frequency: 'monthly',
    autoPayEnabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Bill Added Successfully",
      description: `${billData.name} has been added to your bills.`,
    });
    
    navigate('/bills');
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/bills')}
            className="mt-1 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Add New Bill</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Set up a new bill for tracking and payment</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="space-y-1 sm:space-y-2">
            <CardTitle className="text-lg sm:text-xl">Bill Information</CardTitle>
            <CardDescription className="text-sm">Enter the details of your new bill</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Bill Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Electric Bill"
                    value={billData.name}
                    onChange={(e) => setBillData({ ...billData, name: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm sm:text-base">Company/Provider *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., City Power Company"
                    value={billData.company}
                    onChange={(e) => setBillData({ ...billData, company: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm sm:text-base">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={billData.amount}
                    onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm sm:text-base">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={billData.dueDate}
                    onChange={(e) => setBillData({ ...billData, dueDate: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm sm:text-base">Category *</Label>
                  <Select value={billData.category} onValueChange={(value) => setBillData({ ...billData, category: value })}>
                    <SelectTrigger id="category" className="text-sm sm:text-base">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="communications">Communications</SelectItem>
                      <SelectItem value="subscriptions">Subscriptions</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-sm sm:text-base">Payment Frequency *</Label>
                  <Select value={billData.frequency} onValueChange={(value) => setBillData({ ...billData, frequency: value })}>
                    <SelectTrigger id="frequency" className="text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Enable Auto Pay</p>
                    <p className="text-xs sm:text-sm text-gray-600">Automatically pay this bill on due date</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={billData.autoPayEnabled}
                  onChange={(e) => setBillData({ ...billData, autoPayEnabled: e.target.checked })}
                  className="h-5 w-5 flex-shrink-0"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/bills')}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                  Add Bill
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
