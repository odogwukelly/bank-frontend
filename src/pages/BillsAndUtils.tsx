import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Lightbulb, Droplet, Wifi } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function BillsAndUtilities() {
  const [selectedService, setSelectedService] = useState('electricity')
  const [formData, setFormData] = useState({
    provider: '',
    accountNumber: '',
    amount: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = () => {
    if (!formData.provider || !formData.accountNumber || !formData.amount) {
      alert('Please fill in all fields before proceeding.')
      return
    }
    alert(`Payment of $${formData.amount} for ${selectedService} to ${formData.provider} successful!`)
    setFormData({ provider: '', accountNumber: '', amount: '' })
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 px-3 sm:px-6 py-6 rounded-xl">
        
        {/* Header */}
        <div className="flex flex-col space-y-2 sm:space-y-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-blue-200 text-center sm:text-left">
              Bills & Utilities
            </h1>
            <p className="text-gray-600 dark:text-blue-300 text-xs sm:text-sm text-center sm:text-left">
              Pay your electricity, water, internet, and TV subscriptions easily.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedService} onValueChange={setSelectedService} className="space-y-6">
          
          {/* Tabs list */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-transparent">
            <TabsTrigger value="electricity" className="flex items-center justify-center gap-2 py-2 text-xs sm:text-sm dark:text-blue-200">
              <Lightbulb className="h-4 w-4" /> Electricity
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center justify-center gap-2 py-2 text-xs sm:text-sm dark:text-blue-200">
              <Droplet className="h-4 w-4" /> Water
            </TabsTrigger>
            <TabsTrigger value="internet" className="flex items-center justify-center gap-2 py-2 text-xs sm:text-sm dark:text-blue-200">
              <Wifi className="h-4 w-4" /> Internet
            </TabsTrigger>
            <TabsTrigger value="tv" className="flex items-center justify-center gap-2 py-2 text-xs sm:text-sm dark:text-blue-200">
              <CreditCard className="h-4 w-4" /> TV
            </TabsTrigger>
          </TabsList>

          {/* Add mobile spacing before the form */}
          <div className="mt-3 sm:m-8"></div>

          {/* Payment Form */}
          <TabsContent value={selectedService}>
            <Card className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30 shadow-lg dark:shadow-blue-900/40 rounded-2xl transition-all hover:shadow-xl dark:hover:shadow-blue-800/50 p-3 sm:p-5">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-blue-200 text-center sm:text-left">
                  {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)} Payment
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-blue-300">Select Provider</label>
                    <Select
  onValueChange={(val) => handleChange('provider', val)}
  value={formData.provider}
>
  <SelectTrigger className="w-full mt-1 dark:bg-blue-950/40 dark:text-blue-100">
    <SelectValue placeholder="Choose provider" />
  </SelectTrigger>

  <SelectContent>

    {/* Electricity */}
    <SelectItem value="ConEdison">Con Edison</SelectItem>
    <SelectItem value="PGE">PG&E</SelectItem>
    <SelectItem value="DukeEnergy">Duke Energy</SelectItem>
    <SelectItem value="SoCalEdison">Southern California Edison</SelectItem>
    <SelectItem value="FloridaPowerLight">Florida Power & Light</SelectItem>

    {/* Gas */}
    <SelectItem value="SoCalGas">SoCal Gas</SelectItem>
    <SelectItem value="PeoplesGas">Peoples Gas</SelectItem>

    {/* Water */}
    <SelectItem value="AmericanWater">American Water</SelectItem>
    <SelectItem value="AquaAmerica">Aqua America</SelectItem>

    {/* Internet */}
    <SelectItem value="ComcastXfinity">Xfinity Internet</SelectItem>
    <SelectItem value="ATTFiber">AT&T Fiber</SelectItem>
    <SelectItem value="VerizonFios">Verizon Fios</SelectItem>
    <SelectItem value="SpectrumInternet">Spectrum Internet</SelectItem>
    <SelectItem value="CoxInternet">Cox Communications</SelectItem>

    {/* Cable / TV */}
    <SelectItem value="DirectTV">DirectTV</SelectItem>
    <SelectItem value="DishNetwork">Dish Network</SelectItem>

    {/* Mobile */}
    <SelectItem value="VerizonWireless">Verizon Wireless</SelectItem>
    <SelectItem value="ATTMobility">AT&T Mobile</SelectItem>
    <SelectItem value="TMobile">T-Mobile</SelectItem>
    <SelectItem value="MintMobile">Mint Mobile</SelectItem>

    {/* Subscriptions */}
    <SelectItem value="Netflix">Netflix</SelectItem>
    <SelectItem value="Hulu">Hulu</SelectItem>
    <SelectItem value="PrimeVideo">Amazon Prime Video</SelectItem>
    <SelectItem value="DisneyPlus">Disney+</SelectItem>
    <SelectItem value="Spotify">Spotify</SelectItem>

  </SelectContent>
</Select>

                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-blue-300">Account / Meter Number</label>
                    <Input
                      placeholder="Enter number"
                      value={formData.accountNumber}
                      onChange={(e) => handleChange('accountNumber', e.target.value)}
                      className="mt-1 dark:bg-blue-950/40 dark:text-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 dark:text-blue-300">Amount ($)</label>
                    <Input
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      className="mt-1 dark:bg-blue-950/40 dark:text-blue-100"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <div className="flex justify-center sm:justify-end mt-4">
                  <Button
                    onClick={handlePayment}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg dark:bg-blue-800 dark:hover:bg-blue-700"
                  >
                    Pay Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
