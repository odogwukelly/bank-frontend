import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, Eye, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import cardData  from '@/userData/fetchData';
import Loader from '@/components/Loader';


export default function Cards() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState([
    {
      id: 0,
      name: '',
      type: '',
      number: '',
      expiryDate: '',
      status: '',
      frozen: false,
      spendingLimit: 1000,
      currentSpent: 245.67,
    },
  ]);


  const fetch = async () => {
    try {
      setLoading(true);
      const data = await cardData();
      setCards(data.formatted)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }

  }



  useEffect(() => {
    fetch()
  }, []);

  const toggleFreeze = (cardId: number) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, frozen: !card.frozen } : card
    ));
  };

  const getStatusBadge = (status: string, frozen: boolean) => {
    if (frozen) {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
          Frozen
        </Badge>
      );
    }
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
            Active
          </Badge>
        );
      case 'blocked':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">
            Blocked
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300 text-xs">
            Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'bg-gradient-to-r from-purple-600 to-blue-600';
      case 'debit':
        return 'bg-gradient-to-r from-blue-600 to-green-500';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  // Transactions (Paginated)
  const recentTransactions = [
    { id: 1, description: 'Amazon Purchase', amount: -45.99, date: '2024-01-10', card: '****1234' },
    { id: 2, description: 'Gas Station', amount: -35.50, date: '2024-01-09', card: '****5678' },
    { id: 3, description: 'Grocery Store', amount: -89.24, date: '2024-01-08', card: '****1234' },
    { id: 4, description: 'Restaurant', amount: -67.80, date: '2024-01-07', card: '****5678' },
    { id: 5, description: 'Netflix Subscription', amount: -14.99, date: '2024-01-06', card: '****1234' },
    { id: 6, description: 'Utility Bill', amount: -100.00, date: '2024-01-05', card: '****9012' },
    { id: 7, description: 'Online Course', amount: -250.00, date: '2024-01-04', card: '****5678' },
    { id: 8, description: 'Spotify Premium', amount: -9.99, date: '2024-01-03', card: '****1234' },
  ];

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(recentTransactions.length / itemsPerPage);

  const paginatedTransactions = recentTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction: string | number) => {
    if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
    else if (typeof direction === 'number') setCurrentPage(direction);
  };

  const handleSettings = () => navigate("/settings");
  const handleViewCard = (card_id) => navigate(`/card-details/${card_id}`);
  const handleAddCard = () => navigate("/card-request");

  if (loading) {
      return (
        <DashboardLayout>
          <Loader message="Loading..." size="h-96" color="blue-500" />
        </DashboardLayout>
      );
    }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 min-h-screen p-4 sm:p-6 rounded-xl">

        {/* Header */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-blue-200">
              My Cards
            </h1>
            <p className="text-gray-600 dark:text-blue-300 text-sm sm:text-base">
              Manage your debit and credit cards
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-sm"
            onClick={handleAddCard}
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply for New Card
          </Button>
        </div>

        {/* Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="hover:shadow-xl transition-shadow dark:bg-blue-950/40 dark:border dark:border-blue-900/40 dark:shadow-[0_0_25px_-5px_rgba(0,153,255,0.2)]"
            >
              <CardContent className="p-5">
                <div className={`${getCardColor(card.type)} rounded-xl p-6 text-white mb-5`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm opacity-80">{card.name}</p>
                      <p className="text-lg sm:text-xl font-bold mt-1">{card.number}</p>
                    </div>
                    <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 opacity-90" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80">EXPIRES</p>
                      <p className="text-sm font-semibold">{card.expiryDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">{card.type.toUpperCase()}</p>
                      {getStatusBadge(card.status, card.frozen)}
                    </div>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-blue-200">Freeze Card</span>
                    <Switch
                      checked={card.frozen}
                      onCheckedChange={() => toggleFreeze(card.id)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30"
                      onClick={() => handleViewCard(card.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30"
                      onClick={handleSettings}
                    >
                      <Settings className="h-4 w-4 mr-1" /> Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Card Management Section */}
        <Card className="dark:bg-blue-950/40 dark:border dark:border-blue-900/40 dark:shadow-[0_0_20px_-5px_rgba(0,153,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-blue-200">
              Card Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid grid-cols-1 sm:grid-cols-2 dark:bg-blue-950/40">
                <TabsTrigger value="transactions" className="text-xs sm:text-sm dark:text-blue-200">
                  Recent Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="mt-5">
                <div className="space-y-3">
                  {paginatedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 transition"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-gray-900 dark:text-blue-100 text-sm sm:text-base truncate">
                            {transaction.description}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-blue-300">
                            {transaction.card} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-bold text-red-600 dark:text-red-400 text-sm sm:text-base">
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
