import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';

export default function ApplyCard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [applicationData, setApplicationData] = useState({
    cardType: 'credit',
    cardTier: 'standard',
    annualIncome: '',
    employmentStatus: '',
    monthlyExpenses: '',
    purpose: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Application Submitted",
      description: "We'll review your application and get back to you within 3-5 business days.",
    });
    
    navigate('/cards');
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cards')}
            className="mt-1 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Apply for New Card</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Complete your card application in just a few steps</p>
          </div>
        </div>

        {/* Card Type Selection */}
        <Card>
          <CardHeader className="space-y-1 sm:space-y-2">
            <CardTitle className="text-lg sm:text-xl">Choose Your Card Type</CardTitle>
            <CardDescription className="text-sm">Select the type of card you'd like to apply for</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={applicationData.cardType} onValueChange={(value) => setApplicationData({ ...applicationData, cardType: value })}>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <label htmlFor="credit" className="cursor-pointer">
                  <div className={`p-4 sm:p-6 border-2 rounded-lg transition-colors ${applicationData.cardType === 'credit' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <RadioGroupItem value="credit" id="credit" />
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      <span className="font-semibold text-base sm:text-lg">Credit Card</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 ml-7 sm:ml-9">Build credit, earn rewards, and enjoy flexible payment options</p>
                  </div>
                </label>

                <label htmlFor="debit" className="cursor-pointer">
                  <div className={`p-4 sm:p-6 border-2 rounded-lg transition-colors ${applicationData.cardType === 'debit' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <RadioGroupItem value="debit" id="debit" />
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      <span className="font-semibold text-base sm:text-lg">Debit Card</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 ml-7 sm:ml-9">Spend directly from your account with no credit checks required</p>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Card Tier Selection (for Credit Cards) */}
        {applicationData.cardType === 'credit' && (
          <Card>
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="text-lg sm:text-xl">Select Card Tier</CardTitle>
              <CardDescription className="text-sm">Choose the card that best fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div
                  onClick={() => setApplicationData({ ...applicationData, cardTier: 'standard' })}
                  className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-colors ${applicationData.cardTier === 'standard' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Standard</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Perfect for everyday use</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 1% cashback</li>
                    <li>• $0 annual fee</li>
                    <li>• Purchase protection</li>
                  </ul>
                </div>

                <div
                  onClick={() => setApplicationData({ ...applicationData, cardTier: 'gold' })}
                  className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-colors ${applicationData.cardTier === 'gold' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Gold</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Enhanced rewards & benefits</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 2% cashback</li>
                    <li>• $95 annual fee</li>
                    <li>• Travel insurance</li>
                  </ul>
                </div>

                <div
                  onClick={() => setApplicationData({ ...applicationData, cardTier: 'platinum' })}
                  className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-colors ${applicationData.cardTier === 'platinum' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Platinum</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Premium perks & exclusive access</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 3% cashback</li>
                    <li>• $195 annual fee</li>
                    <li>• Concierge service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Form */}
        <Card>
          <CardHeader className="space-y-1 sm:space-y-2">
            <CardTitle className="text-lg sm:text-xl">Financial Information</CardTitle>
            <CardDescription className="text-sm">Help us understand your financial situation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome" className="text-sm sm:text-base">Annual Income *</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="0"
                    value={applicationData.annualIncome}
                    onChange={(e) => setApplicationData({ ...applicationData, annualIncome: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus" className="text-sm sm:text-base">Employment Status *</Label>
                  <Select value={applicationData.employmentStatus} onValueChange={(value) => setApplicationData({ ...applicationData, employmentStatus: value })}>
                    <SelectTrigger id="employmentStatus" className="text-sm sm:text-base">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses" className="text-sm sm:text-base">Monthly Expenses *</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    placeholder="0"
                    value={applicationData.monthlyExpenses}
                    onChange={(e) => setApplicationData({ ...applicationData, monthlyExpenses: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm sm:text-base">Primary Card Purpose *</Label>
                  <Select value={applicationData.purpose} onValueChange={(value) => setApplicationData({ ...applicationData, purpose: value })}>
                    <SelectTrigger id="purpose" className="text-sm sm:text-base">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Expenses</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="emergencies">Emergencies</SelectItem>
                      <SelectItem value="credit-building">Credit Building</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>Note:</strong> Your application will be reviewed within 3-5 business days. 
                  We may contact you for additional information if needed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/cards')}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
