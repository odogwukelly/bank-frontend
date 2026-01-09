import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const LoanStatus = () => {
  const [search, setSearch] = useState("");

  const loans = [
    {
      id: 1,
      type: "Personal Loan",
      amount: "$500,000",
      balance: "$200,000",
      dueDate: "2025-12-01",
      status: "Active",
    },
    {
      id: 2,
      type: "Business Loan",
      amount: "$2,000,000",
      balance: "$1,500,000",
      dueDate: "2026-02-15",
      status: "Pending",
    },
    {
      id: 3,
      type: "Car Loan",
      amount: "$1,200,000",
      balance: "$0",
      dueDate: "2024-08-20",
      status: "Completed",
    },
  ];

  const filteredLoans = loans.filter((loan) =>
    loan.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
    <div className="min-h-screen px-4 py-8 md:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Loan Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your active, pending, and completed loans with ease.
          </p>
        </div>

        {/* Search Section */}
        <Card className="rounded-2xl border dark:border-gray-800 shadow-md dark:bg-gray-900 bg-white">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Search Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by loan type..."
                className="flex-1 dark:bg-gray-800 dark:border-gray-700"
              />
              <Button className="w-full sm:w-auto">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Space on mobile */}
        <div className="block md:hidden h-4"></div>

        {/* Tabs Section */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="flex flex-wrap justify-center md:justify-start gap-2 dark:bg-gray-800 bg-gray-200 p-1 rounded-xl">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Active Loans */}
          <TabsContent value="active">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b dark:border-gray-700">
                        <th className="py-2">Type</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans
                        .filter((l) => l.status === "Active")
                        .map((loan) => (
                          <tr key={loan.id} className="border-b dark:border-gray-800">
                            <td className="py-2">{loan.type}</td>
                            <td>{loan.amount}</td>
                            <td>{loan.balance}</td>
                            <td>{loan.dueDate}</td>
                            <td>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">
                                {loan.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredLoans
                    .filter((l) => l.status === "Active")
                    .map((loan) => (
                      <div
                        key={loan.id}
                        className="rounded-xl border p-4 dark:border-gray-800 dark:bg-gray-800 bg-gray-100 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {loan.type}
                          </h3>
                          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Amount: <span className="font-medium">{loan.amount}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Balance: <span className="font-medium">{loan.balance}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Due Date: <span className="font-medium">{loan.dueDate}</span>
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Loans */}
          <TabsContent value="pending">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardContent className="p-6 text-gray-500 dark:text-gray-400">
                You have 1 pending loan application.
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Loans */}
          <TabsContent value="completed">
            <Card className="rounded-2xl border dark:border-gray-800 dark:bg-gray-900 bg-white">
              <CardContent className="p-6 text-gray-500 dark:text-gray-400">
                All previous loans have been settled successfully.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default LoanStatus;
