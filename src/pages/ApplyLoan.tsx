import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const ApplyLoan = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    loanAmount: "",
    purpose: "",
    duration: "",
    income: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Loan Application Submitted:", formData);
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4 py-8 md:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Apply for a Loan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Fill out the form below to apply for a personal or business loan.
          </p>
        </div>

        {/* Application Form */}
        <Card className="rounded-2xl border dark:border-gray-800 shadow-md dark:bg-gray-900 bg-white">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Loan Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 mt-1"
                />
              </div>

              {/* Loan Amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount ($)</label>
                <Input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleChange("loanAmount", e.target.value)}
                  placeholder="Enter amount you wish to borrow"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 mt-1"
                />
              </div>

              {/* Loan Purpose */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Purpose of Loan</label>
                <Textarea
                  value={formData.purpose}
                  onChange={(e) => handleChange("purpose", e.target.value)}
                  placeholder="Describe the purpose of the loan"
                  rows={3}
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 mt-1"
                />
              </div>

              {/* Loan Duration */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Duration</label>
                <Select onValueChange={(value) => handleChange("duration", value)}>
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="18">18 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Income */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Income ($)</label>
                <Input
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleChange("income", e.target.value)}
                  placeholder="Enter your monthly income"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700 mt-1"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ApplyLoan;
