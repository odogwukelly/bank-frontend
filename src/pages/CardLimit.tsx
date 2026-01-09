import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type LimitChange = {
  id: number;
  date: string;
  cardNumber: string;
  type: 'daily' | 'monthly';
  previous: number;
  updated: number;
  status: 'applied' | 'pending' | 'failed';
};

export default function CardLimit() {
  const [cards] = useState([
    { id: 1, label: '****1234' },
    { id: 2, label: '****5678' },
    { id: 3, label: '****9012' },
  ]);

  const [selectedCard, setSelectedCard] = useState<string>(cards[0].label);
  const [dailyLimit, setDailyLimit] = useState<number>(50000);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(500000);
  const [tempDaily, setTempDaily] = useState(String(dailyLimit));
  const [tempMonthly, setTempMonthly] = useState(String(monthlyLimit));
  const [isSaving, setIsSaving] = useState(false);

  const [changes, setChanges] = useState<LimitChange[]>([
    {
      id: 1,
      date: new Date().toISOString(),
      cardNumber: '****1234',
      type: 'daily',
      previous: 30000,
      updated: 50000,
      status: 'applied',
    },
    {
      id: 2,
      date: new Date().toISOString(),
      cardNumber: '****5678',
      type: 'monthly',
      previous: 300000,
      updated: 500000,
      status: 'applied',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(changes.length / itemsPerPage));

  const pagedChanges = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return changes.slice(start, start + itemsPerPage);
  }, [changes, currentPage]);

  const formatCurrency = (value: number) => value.toLocaleString();

  const handleApplyLimits = async () => {
    const parsedDaily = Number(tempDaily);
    const parsedMonthly = Number(tempMonthly);
    if (parsedDaily > parsedMonthly) {
      toast({ title: 'Error', description: 'Daily limit cannot exceed monthly limit', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));

    setDailyLimit(parsedDaily);
    setMonthlyLimit(parsedMonthly);
    setChanges([
      {
        id: Date.now(),
        date: new Date().toISOString(),
        cardNumber: selectedCard,
        type: 'daily',
        previous: dailyLimit,
        updated: parsedDaily,
        status: 'applied',
      },
      ...changes,
    ]);
    toast({ title: 'Success', description: 'Limits updated successfully!' });
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-blue-200">
              Card Limit Settings
            </h1>
            <p className="text-gray-600 dark:text-blue-300 text-sm">
              Manage your daily and monthly card limits
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedCard} onValueChange={setSelectedCard}>
              <SelectTrigger className="w-full sm:w-40 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cards.map((c) => (
                  <SelectItem key={c.id} value={c.label}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">
              <ArrowLeftRight className="h-4 w-4 mr-1" />
              Preset
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428]">
            <CardContent className="py-3">
              <p className="text-xs text-gray-500 dark:text-blue-300">Daily Limit</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-200">
                ${formatCurrency(dailyLimit)}
              </h3>
            </CardContent>
          </Card>
          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428]">
            <CardContent className="py-3">
              <p className="text-xs text-gray-500 dark:text-blue-300">Monthly Limit</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-200">
                ${formatCurrency(monthlyLimit)}
              </h3>
            </CardContent>
          </Card>
          <Card className="dark:bg-gradient-to-br dark:from-[#000428] dark:via-[#001f3f] dark:to-[#000428]">
            <CardContent className="py-3">
              <p className="text-xs text-gray-500 dark:text-blue-300">Status</p>
              <Badge className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs">
                Active
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card className="dark:bg-blue-950/30 dark:border-blue-900/30">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-blue-200">
              Adjust Card Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-1">
                <label className="text-sm text-gray-700 dark:text-blue-200">Daily Limit ($)</label>
                <Input
                  value={tempDaily}
                  onChange={(e) => setTempDaily(e.target.value)}
                  className="dark:bg-blue-950/40 dark:text-blue-100 h-10 text-sm"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm text-gray-700 dark:text-blue-200">Monthly Limit ($)</label>
                <Input
                  value={tempMonthly}
                  onChange={(e) => setTempMonthly(e.target.value)}
                  className="dark:bg-blue-950/40 dark:text-blue-100 h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                onClick={handleApplyLimits}
                className="bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {isSaving ? 'Updating...' : 'Update Limits'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setTempDaily(String(dailyLimit))}
                className="text-sm"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Changes */}
        <Card className="dark:bg-blue-950/30 dark:border-blue-900/30">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-blue-200">
              Recent Limit Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {pagedChanges.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border-b border-gray-200 dark:border-blue-900/30"
                >
                  <div>
                    <p className="text-sm font-medium dark:text-blue-100">
                      {c.cardNumber} ({c.type})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-blue-300">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm dark:text-blue-100">
                    ${formatCurrency(c.previous)} → ${formatCurrency(c.updated)}{' '}
                    <Badge className="ml-2 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs">
                      {c.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm dark:text-blue-300">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-blue-600 dark:text-blue-400 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-blue-300">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, changes.length)} of {changes.length}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
