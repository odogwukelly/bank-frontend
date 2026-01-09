import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const LoanRepayment = () => {
  const [amount, setAmount] = useState("");
  const [repayments] = useState([
    { id: 1, date: "2025-10-05", amount: "$500", status: "Successful" },
    { id: 2, date: "2025-09-05", amount: "$3,000", status: "Successful" },
    { id: 3, date: "2025-08-05", amount: "$600", status: "Pending" },
  ]);

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Repaying $", amount);
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen px-4 py-8 md:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Loan Repayment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your loan repayments with ease.
          </p>
        </div>

        {/* Loan Summary */}
        <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Loan</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">$4,100</h3>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">$3,500</h3>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">$600</h3>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Due Date</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">5 June 2025</h3>
            </div>
          </CardContent>
        </Card>

        {/* Repayment Form */}
        <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Make a Repayment</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleRepay}
              className="flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <Input
                type="number"
                placeholder="Enter amount ($)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 dark:bg-gray-800 dark:border-gray-700"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Repay Now
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Extra spacing on small screen */}
        <div className="block md:hidden h-4"></div>

        {/* Tabs for Repayment History */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="flex flex-wrap justify-center md:justify-start gap-2 dark:bg-gray-800 bg-gray-200 p-1 rounded-xl">
            <TabsTrigger value="recent">Recent Payments</TabsTrigger>
            <TabsTrigger value="all">All Payments</TabsTrigger>
          </TabsList>

          {/* Recent Payments */}
          <TabsContent value="recent">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Repayment History</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b dark:border-gray-700">
                        <th className="py-2">Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repayments.map((r) => (
                        <tr key={r.id} className="border-b dark:border-gray-800">
                          <td className="py-2">{r.date}</td>
                          <td>{r.amount}</td>
                          <td>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                r.status === "Successful"
                                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {repayments.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border p-4 dark:border-gray-800 dark:bg-gray-800 bg-gray-100 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {r.date}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            r.status === "Successful"
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Amount Paid: <span className="font-medium">{r.amount}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Payments Placeholder */}
          <TabsContent value="all">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardContent className="p-6 text-gray-500 dark:text-gray-400">
                No additional payment records available.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default LoanRepayment;
