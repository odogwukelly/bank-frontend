import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const RecurringPayments = () => {
  const [limit, setLimit] = useState("");
  const [autoPay, setAutoPay] = useState(false);
  const [payments, setPayments] = useState([
    { id: 1, name: "Netflix", amount: "$5,00", date: "2025-11-10", status: "Active" },
    { id: 2, name: "Electricity Bill", amount: "$15,000", date: "2025-11-15", status: "Pending" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Limit set to:", limit);
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen px-4 py-8 md:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Recurring Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your automated bill payments and spending limits easily.
          </p>
        </div>

        {/* Form Card */}
        <Card className="rounded-2xl border dark:border-gray-800 shadow-md dark:bg-gray-900 bg-white">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Set Payment Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Enter spending limit ($)"
                className="flex-1 dark:bg-gray-800 dark:border-gray-700"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Set Limit
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Extra Space on Mobile */}
        <div className="block md:hidden h-4"></div>

        {/* Tabs Section */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="flex flex-wrap justify-center md:justify-start gap-2 dark:bg-gray-800 bg-gray-200 p-1 rounded-xl">
            <TabsTrigger value="active">Active Bills</TabsTrigger>
            <TabsTrigger value="pending">Pending Bills</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Active Bills */}
          <TabsContent value="active">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">Active Payments</CardTitle>
                <Button size="sm" variant="outline">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add New
                </Button>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b dark:border-gray-700">
                        <th className="py-2">Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Auto Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} className="border-b dark:border-gray-800">
                          <td className="py-2">{p.name}</td>
                          <td>{p.amount}</td>
                          <td>{p.date}</td>
                          <td>{p.status}</td>
                          <td>
                            <Switch checked={autoPay} onCheckedChange={setAutoPay} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border p-4 dark:border-gray-800 dark:bg-gray-800 bg-gray-100 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {p.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            p.status === "Active"
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Amount: <span className="font-medium">{p.amount}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Next Payment: <span className="font-medium">{p.date}</span>
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Auto Pay</span>
                        <Switch checked={autoPay} onCheckedChange={setAutoPay} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Bills (Placeholder) */}
          <TabsContent value="pending">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardContent className="p-6 text-gray-500 dark:text-gray-400">
                No pending bills at the moment.
              </CardContent>
            </Card>
          </TabsContent>

          {/* History (Placeholder) */}
          <TabsContent value="history">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardContent className="p-6 text-gray-500 dark:text-gray-400">
                No transaction history yet.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default RecurringPayments;
