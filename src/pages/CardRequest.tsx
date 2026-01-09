import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CardRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    accountNumber: "",
    cardType: "",
    cardDesign: "",
    delivery: "",
    address: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Card Request Submitted:", formData);
    alert("Card request submitted successfully!");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-700 flex items-center justify-center">
        <Card className="w-full max-w-lg bg-white/70 dark:bg-blue-950/40 backdrop-blur-md border border-blue-200/50 dark:border-blue-900/40 shadow-lg dark:shadow-blue-900/40 rounded-2xl p-6 sm:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-blue-200">
              Request a New Card
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-blue-300 mt-1">
              Fill in your details to request your bank card
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-blue-200">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 dark:bg-blue-950/40 dark:text-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-blue-200">
                  Account Number
                </label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => handleChange("accountNumber", e.target.value)}
                  placeholder="Enter your account number"
                  className="mt-1 dark:bg-blue-950/40 dark:text-blue-100"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-200">
                    Card Type
                  </label>
                  <Select
                    value={formData.cardType}
                    onValueChange={(v) => handleChange("cardType", v)}
                  >
                    <SelectTrigger className="mt-1 dark:bg-blue-950/40 dark:text-blue-100">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="virtual">Virtual Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-200">
                    Card Design
                  </label>
                  <Select
                    value={formData.cardDesign}
                    onValueChange={(v) => handleChange("cardDesign", v)}
                  >
                    <SelectTrigger className="mt-1 dark:bg-blue-950/40 dark:text-blue-100">
                      <SelectValue placeholder="Choose design" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-blue-200">
                  Delivery Option
                </label>
                <Select
                  value={formData.delivery}
                  onValueChange={(v) => handleChange("delivery", v)}
                >
                  <SelectTrigger className="mt-1 dark:bg-blue-950/40 dark:text-blue-100">
                    <SelectValue placeholder="Select delivery option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch">Pick up at branch</SelectItem>
                    <SelectItem value="home">Deliver to home address</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.delivery === "home" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-200">
                    Delivery Address
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter your address"
                    className="mt-1 dark:bg-blue-950/40 dark:text-blue-100"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 dark:bg-blue-800 dark:hover:bg-blue-700"
              >
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
