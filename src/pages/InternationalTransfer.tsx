import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRightLeft, Hourglass, Info } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import server from "@/server";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export default function InternationalTransfer() {

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientBank: "",
    recipientCountry: "",
    swiftCode: "",
    accountNumber: "",
    amount: "",
    description: "",
    fromAccount: ''
  });

  const [approveAccount, setApproveAccount] = useState({
    duration: "",
    hasSetPin: false
  });
  const [accounts, setAccounts] = useState([]);


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const fetchUserData = async () => {
      try {
        const userId = storedData?.id;
        if (!userId) return;

        const accountRes = await fetch(`${server}/users/get/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!accountRes.ok) {
          throw new Error("Failed to fetch account data");
        }

        const data = await accountRes.json();

        const userData = data.userData

        setApproveAccount({
          ...approveAccount,
          duration: userData.reviewDuration,
          hasSetPin: userData.hasSetPin === true ? true : false
        })


        const accountsArray = data.userAccount || [];


        const formatted = accountsArray.map((acc) => ({
          id: acc.id,
          name: acc.accountType
            ? acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase()
            : "Unknown",
          balance: acc.accountBalance,
          number: "****" + acc.accountNumber.slice(-4),
        }));

        setAccounts(formatted);
      } catch (error) {
        console.error("Error fetching account data:", error);
        setAccounts([]);
      } finally {
        setLoading(false)
      }
    };
    fetchUserData();
  }, []);


  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: `International transfer initiated successfully!.`,
        variant: "success"
      });
      navigate("/review")
    }, 2000);
  };



  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-green-50 dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 p-4 sm:p-6 lg:p-10">
        <Card className="max-w-3xl mx-auto bg-white/80 dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/40 shadow-lg dark:shadow-blue-900/40 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:shadow-xl dark:hover:shadow-blue-800/50">
          <CardHeader className="pb-4 border-b border-gray-200 dark:border-blue-900/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-950/40">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-blue-200">
                  International Bank Transfer
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-blue-300">
                  Send money across borders securely and fast.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <Label className="text-sm sm:text-base text-gray-900 dark:text-blue-200">From Account</Label>
                  <Select value={formData.fromAccount} onValueChange={(value) =>
                    setFormData({ ...formData, fromAccount: value })
                  }>
                    <SelectTrigger className="bg-white text-gray-900 border border-gray-300 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20">
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 dark:bg-blue-950/10 dark:text-blue-200">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm sm:text-base">{account.name} ({account.number})</span>
                            <span className="text-xs sm:text-sm text-gray-500 ml-2 dark:text-blue-300">${account.balance.toLocaleString()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>



                <div>
                  <Label className="text-sm dark:text-blue-200">Recipient Name</Label>
                  <Input
                    name="recipientName"
                    placeholder="Enter recipient's full name"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                    className="dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>

                <div>
                  <Label className="text-sm dark:text-blue-200">Recipient Bank</Label>
                  <Input
                    name="recipientBank"
                    placeholder="Enter recipient’s bank name"
                    value={formData.recipientBank}
                    onChange={handleChange}
                    required
                    className="dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>

                <div>
                  <Label className="text-sm dark:text-blue-200">Country</Label>
                  <Input
                    name="recipientCountry"
                    placeholder="Enter country"
                    value={formData.recipientCountry}
                    onChange={handleChange}
                    required
                    className="dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>

                <div>
                  <Label className="text-sm dark:text-blue-200">SWIFT/BIC Code</Label>
                  <Input
                    name="swiftCode"
                    placeholder="Enter SWIFT or BIC code"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    required
                    className="dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>

                <div>
                  <Label className="text-sm dark:text-blue-200">Account Number / IBAN</Label>
                  <Input
                    name="accountNumber"
                    placeholder="Enter account number or IBAN"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className="dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>

                <div>
                  <Label className="text-sm dark:text-blue-200">Amount (USD)</Label>
                  <Input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm dark:text-blue-200">Description</Label>
                <Input
                  name="description"
                  placeholder="Enter transfer note (optional)"
                  value={formData.description}
                  onChange={handleChange}
                  className="dark:bg-blue-950/40 dark:text-blue-100"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Send International Transfer</span>
                  </>
                )}
              </Button>
            </form>



          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
