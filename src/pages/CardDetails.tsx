import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Lock, Bell, Shield, Eye, EyeOff, Copy, Check } from 'lucide-react';
import server from '@/server';
import Loader from '@/components/Loader';

export default function CardDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { card_id } = useParams()
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');


  const [showFullNumber, setShowFullNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);


  // Card settings state
  const [settings, setSettings] = useState({
    frozen: false,
    contactlessEnabled: true,
    onlinePayments: true,
    internationalTransactions: false,
    notifications: {
      transactions: true,
      declines: true,
      monthlyStatement: false,
    },
    spendingLimit: 1000,
  });

  const [card, setCard] = useState(
    {
      id: 0,
      name: "",
      type: "",
      number: "",
      maskedNumber: "",
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      status: "",
      issuedDate: '',
      currentSpent: 0,
    }
  );


  useEffect(() => {
    const cardDataByID = async () => {
      setLoading(true)
      try {
        const cardByIdRes = await fetch(`${server}/users/card/${card_id}`);

        if (!cardByIdRes.ok) throw new Error('Failed to fetch card data');

        const data = await cardByIdRes.json();

        const cardData = {
          id: data.id,
          name: data.cardName,
          type: data.cardType,
          number: data.cardNumber.slice(0,4) + "-" + data.cardNumber.slice(4,7) + "-" + data.cardNumber.slice(7,11) + "-" + data.cardNumber.slice(11),
          maskedNumber: "****" + data.cardNumber.slice(-4),
          expiryDate: data.expiresAt.slice(2, 4) + "/" + data.expiresAt.slice(5, 7),
          cvv: data.cvv,
          cardHolder: userData?.fullName,
          status: data.status ? "Active" : "Inactive",
          issuedDate: new Date (data.created_at).toLocaleDateString('en-CA'),
          currentSpent: 245.67,
        }

        setCard(cardData)

      } catch (err) {
        console.error('❌ Error fetching card:', err);
      } finally{
        setLoading(false)
      }
    };
    cardDataByID()
  }, []);


  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(card.number.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const recentActivity = [
    { id: 1, description: 'Amazon Purchase', amount: -45.99, date: '2024-01-10', status: 'completed' },
    { id: 2, description: 'Gas Station', amount: -35.50, date: '2024-01-09', status: 'completed' },
    { id: 3, description: 'Grocery Store', amount: -89.24, date: '2024-01-08', status: 'completed' },
  ];


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
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/manage-cards')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">{card.name}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{card.maskedNumber}</p>
            </div>
          </div>
          <Badge className={settings.frozen ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
            {settings.frozen ? 'Frozen' : card.status}
          </Badge>
        </div>

        {/* Card Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className={`${getCardColor(card.type)} rounded-xl p-8 text-white shadow-xl`}>
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-sm opacity-80 mb-2">Card Holder</p>
                    <p className="text-xl font-bold capitalize">{card.cardHolder}</p>
                  </div>
                  <CreditCard className="h-10 w-10 opacity-80" />
                </div>
                <div className="mb-8">
                  <p className="text-sm opacity-80 mb-2">Card Number</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-mono font-bold tracking-wider">
                      {showFullNumber ? card.number : `**** **** **** ${card.maskedNumber.slice(-4)}`}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setShowFullNumber(!showFullNumber)}
                    >
                      {showFullNumber ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handleCopyCardNumber}
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-80">VALID THRU</p>
                    <p className="text-lg font-semibold">{card.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">CVV</p>
                    <p className="text-lg font-semibold">{showFullNumber ? card.cvv : '***'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">{card.type.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {/* <div className="grid grid-cols-2 gap-3 mt-6">
                <Button variant="outline" className="w-full" onClick={() => navigate('/transfer')}>
                  Make Payment
                </Button> */}
                {/* <Button variant="outline" className="w-full">
                  Report Lost/Stolen
                </Button> */}
              {/* </div> */}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div>
                <p className="text-sm text-gray-600">Monthly Spending</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${settings.spendingLimit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ${card.currentSpent.toFixed(2)} spent this month
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(card.currentSpent / settings.spendingLimit) * 100}%` }}
                  />
                </div>
              </div> */}
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Card Type</p>
                <p className="font-medium capitalize">{card.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issued Date</p>
                <p className="font-medium">{card.issuedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-medium">{card.expiryDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
                <TabsTrigger value="security">Security</TabsTrigger>
                {/* <TabsTrigger value="limits">Limits & Controls</TabsTrigger> */}
                {/* <TabsTrigger value="activity">Recent Activity</TabsTrigger> */}
              </TabsList>

              <TabsContent value="security" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Lock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Freeze Card</p>
                          <p className="text-sm text-gray-600">Temporarily block all transactions</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.frozen}
                        onCheckedChange={(checked) => setSettings({ ...settings, frozen: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Contactless Payments</p>
                          <p className="text-sm text-gray-600">Enable tap-to-pay functionality</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.contactlessEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, contactlessEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Online Payments</p>
                          <p className="text-sm text-gray-600">Allow e-commerce transactions</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.onlinePayments}
                        onCheckedChange={(checked) => setSettings({ ...settings, onlinePayments: checked })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="limits" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Spending Controls</h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label htmlFor="spending-limit">Monthly Spending Limit</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-semibold">$</span>
                        <Input
                          id="spending-limit"
                          type="number"
                          value={settings.spendingLimit}
                          onChange={(e) => setSettings({ ...settings, spendingLimit: parseFloat(e.target.value) })}
                          className="max-w-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">International Transactions</p>
                        <p className="text-sm text-gray-600">Allow purchases outside your country</p>
                      </div>
                      <Switch
                        checked={settings.internationalTransactions}
                        onCheckedChange={(checked) => setSettings({ ...settings, internationalTransactions: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Transaction Alerts</p>
                          <p className="text-sm text-gray-600">Get notified for each transaction</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.transactions}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, transactions: checked }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Declined Transactions</p>
                          <p className="text-sm text-gray-600">Alerts for declined purchases</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.declines}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, declines: checked }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="space-y-3">
                  {recentActivity.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
