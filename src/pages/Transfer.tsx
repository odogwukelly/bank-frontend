


import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, Clock, Users, CheckCircle, XCircle, Info, Hourglass } from 'lucide-react';
import server from '@/server';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import SetTransferPinModal from '@/components/SetPin';
import Loader from '@/components/Loader';
import OverlayLoader from '@/components/OverlayLoader';
import generateTransactionId from '@/components/generateTxnID';

const storedData = JSON.parse(localStorage.getItem("userData"));

export default function Transfer() {
  const [loading, setLoading] = useState(true);
  const [confirmTransfer, setConfirmTransfer] = useState(false);

  
  const [step, setStep] = useState(1);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccountType: '',
    toAccountNumber: '',
    toAccountRouting: '',
    toAccountName: '',
    toAccountAddress: '',
    transferID: generateTransactionId(),
    amount: '',
    pin: '',
    description: '',
    selectedAccount: '',
    transferType: 'Immediate Transfer'
  });
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate()
  const [approveAccount, setApproveAccount] = useState({
    allowTransfer: false,
    allowValidation: false,
    errorMsg: "",
    TransferOtp: "",
    duration: "",
    hasSetPin: true,
  });



  useEffect(() => {
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
          allowValidation: userData.allowValidation,
          allowTransfer: userData.allowTransfer,
          errorMsg: userData.errorMsg,
          TransferOtp: userData.transferOTP,
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


  const account = [
    { id: '1', name: 'Checking' },
    { id: '2', name: 'Savings' },
    // { id: '3', name: 'Credit' },
    { id: '4', name: 'Business' }
  ];
  const handleNext = () => {
    if (step === 1) {
      if (transferData.fromAccount) {
        const accountID = Number(transferData.fromAccount);

        // find the matching account
        const selectedAccount = accounts.find(acc => acc.id === accountID);

        if (selectedAccount) {
          const bal = selectedAccount.balance;
          setTransferData({ ...transferData, selectedAccount: bal });
        } else {
          console.error("Account not found!");
        }
      }
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleTransfer = async () => {
    setConfirmTransfer(true)
    setTimeout(async () => {
      try {
        // future implementation
      } catch (error) {
        console.log(error)
      } finally {
        setConfirmTransfer(false)
      }
      setStep(4);
    }, 5000);
  };
  const handleTransferError = () => {
    // Handle transfer logic here
    setStep(5);
  };
  const handleTransferError2 = () => {
    // Handle transfer logic here
    setStep(6);
  };
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && e.target.nextElementSibling instanceof HTMLInputElement) {
      e.target.nextElementSibling.focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index]) {
      // Move to previous input when pressing backspace on empty field
      if (e.currentTarget.previousElementSibling instanceof HTMLInputElement) {
        e.currentTarget.previousElementSibling.focus();
      }
    }
  };
  const handleSubmit = () => {

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast({
        title: "Failed!",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return
    }
    if (otpCode === approveAccount.TransferOtp) {
      setConfirmTransfer(true)
      setTimeout(() => {
        
        try {
          handleTransferError2()
        } catch (error) {
          console.log(error)
        }finally{
          setConfirmTransfer(false)
        }
      }, 5000);
    }
    if (otpCode !== approveAccount.TransferOtp) {
      toast({
        title: "Failed!",
        description: "Invalid Transfer Validation OTP Code",
        variant: "destructive",
      });
    }
  };
  const userHasPin = approveAccount.hasSetPin;


  const handleConfirmPin = async () => {
    const enteredPin = transferData.pin?.toString();
    const savedPin = storedData.pin?.toString();
    // 1️⃣ Check if PIN is provided
    if (!enteredPin) {
      toast({
        title: "Missing PIN",
        description: "Please enter your 4-digit transfer PIN.",
        variant: "destructive",
      });
      return;
    }

    // 2️⃣ Validate format (must be exactly 4 digits)
    if (!/^\d{4}$/.test(enteredPin)) {
      toast({
        title: "Invalid PIN Format",
        description: "PIN must be exactly 4 numeric digits.",
        variant: "destructive",
      });
      return;
    }

    // 3️⃣ Compare with stored PIN
    if (enteredPin !== savedPin) {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is not correct.",
        variant: "destructive",
      });
      return;
    }
    // 4️⃣ Success → proceed with transfer
    await handleTransfer();
  };



  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 bg-white text-gray-900 min-h-screen p-4 rounded-lg dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:text-gray-100">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-blue-200">Transfer Money</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base dark:text-blue-300">Send money quickly and securely</p>
        </div>

        <SetTransferPinModal userHasPin={userHasPin} />

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 mb-6 sm:mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                {step > stepNumber ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-8 sm:w-12 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300 dark:bg-blue-900/30'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card className="bg-gray-50 border border-gray-200 text-gray-900 shadow-lg dark:bg-transparent dark:border-blue-900/30 dark:shadow-blue-900/40 dark:rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl text-gray-900 dark:text-blue-200">
                <ArrowLeftRight className="h-5 w-5 mr-2" />
                Select Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="fromAccountType" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">From Account</Label>
                  <Select value={transferData.fromAccount} onValueChange={(value) =>
                    setTransferData({ ...transferData, fromAccount: value })
                  }>
                    <SelectTrigger className="mt-2 bg-white text-gray-900 border border-gray-300 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20">
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
                  <Label htmlFor="toAccountNumber" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Recipient Account Number</Label>
                  <Input
                    type="text"
                    className="mt-2 bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                    placeholder="e.g ( 123-456-78910 )"
                    value={transferData.toAccountNumber}
                    onChange={(e) =>
                      setTransferData({ ...transferData, toAccountNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="toAccount" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Recipient Account Type</Label>
                  <Select value={transferData.toAccountType} onValueChange={(value) =>
                    setTransferData({ ...transferData, toAccountType: value })
                  }>
                    <SelectTrigger className="mt-2 bg-white text-gray-900 border border-gray-300 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20">
                      <SelectValue placeholder="Select destination account type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 dark:bg-blue-950/10 dark:text-blue-200">
                      {account.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm sm:text-base">{account.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="toAccountName" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Recipient Account Name</Label>
                  <Input
                    type="text"
                    className="mt-2 bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                    placeholder="e.g ( John Doe )"
                    value={transferData.toAccountName}
                    onChange={(e) =>
                      setTransferData({ ...transferData, toAccountName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="toAccountRouting" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Recipient Routing Number</Label>
                  <Input
                    type="text"
                    className="mt-2 bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                    placeholder="e.g ( 987-654-321 )"
                    value={transferData.toAccountRouting}
                    onChange={(e) =>
                      setTransferData({ ...transferData, toAccountRouting: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="toAccountAddress" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Recipient Address ( Optional )</Label>
                  <Input
                    type="text"
                    className="mt-2 bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                    placeholder="e.g ( 123 Country Street, State )"
                    value={transferData.toAccountAddress}
                    onChange={(e) =>
                      setTransferData({ ...transferData, toAccountAddress: e.target.value })
                    }
                  />
                </div>

              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={
                    !transferData.fromAccount ||
                    !transferData.toAccountType ||
                    !/^\d{9,15}$/.test(transferData.toAccountNumber.trim()) ||
                    !/^\d{6,15}$/.test(transferData.toAccountRouting.trim()) ||
                    !(transferData.toAccountName.trim())
                  }
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="bg-gray-50 border border-gray-200 text-gray-900 shadow-lg dark:bg-transparent dark:border-blue-900/30 dark:shadow-blue-900/40 dark:rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-blue-200">Transfer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="amount" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Amount ( USD )</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    className="mt-2 text-sm sm:text-base bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                  />
                  <small className='pt-2 text-gray-500 dark:text-blue-300'>Account balance: <span className='text-blue-600 dark:text-blue-400'><strong>${Number(transferData.selectedAccount || 0).toLocaleString()}</strong></span></small>
                </div>

                <div>
                  <Label htmlFor="transferType" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Transfer Type</Label>
                  <Select value={transferData.transferType} onValueChange={(value) =>
                    setTransferData({ ...transferData, transferType: value })
                  }>
                    <SelectTrigger className="mt-2 bg-white text-gray-900 border border-gray-300 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20">
                      <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 dark:bg-blue-950/10 dark:text-blue-200">
                      <SelectItem value="Immediate Transfer">Immediate Transfer</SelectItem>
                      <SelectItem value="Scheduled Transfer">Scheduled Transfer</SelectItem>
                      <SelectItem value="Recurring Transfer">Recurring Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm sm:text-base text-gray-900 dark:text-blue-200">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={transferData.description}
                  onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                  className="mt-2 text-sm sm:text-base bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto dark:border-blue-900/30 dark:text-blue-200">
                  Back
                </Button>
                <Button onClick={handleNext} disabled={
                  !transferData.amount ||
                  transferData.amount > transferData.selectedAccount ||
                  transferData.amount <= "0"}
                  className="w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Step 3 */}
        {step === 3 && (
          <Card className="bg-gray-50 border border-gray-200 text-gray-900 shadow-lg dark:bg-transparent dark:border-blue-900/30 dark:shadow-blue-900/40 dark:rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-blue-200">Review & Confirm</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Transfer Summary */}
              <div className="bg-gray-100 p-4 sm:p-6 rounded-lg dark:bg-blue-950/10">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base dark:text-blue-200">
                  Transfer Summary
                </h3>
                <div className="space-y-3">
                  <hr className="border-gray-300 dark:border-blue-900/20" />
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">From:</span>
                    <span className="font-medium dark:text-blue-200">
                      {accounts.find(acc => acc.id === transferData.fromAccount)?.name} Account
                    </span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Recipient Number:</span>
                    <span className="font-medium dark:text-blue-200">{transferData.toAccountNumber}</span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Recipient Routing:</span>
                    <span className="font-medium dark:text-blue-200">{transferData.toAccountRouting}</span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Recipient Name:</span>
                    <span className="font-medium capitalize dark:text-blue-200">
                      {transferData.toAccountName}
                    </span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Total Amount:</span>
                    <span className="font-bold text-lg sm:text-xl text-blue-600 dark:text-blue-400">
                      ${Number(transferData.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Transfer Type:</span>
                    <span className="font-medium dark:text-blue-200">{transferData.transferType}</span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Transaction ID:</span>
                    <span className="font-medium dark:text-blue-200">{transferData.transferID}</span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  {transferData.description && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-500 dark:text-blue-300">Description:</span>
                      <span className="font-small dark:text-blue-200">
                        {transferData.description[0].toUpperCase() +
                          transferData.description.slice(1).toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PIN Verification Section */}
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 dark:bg-blue-950/5 dark:border-blue-900/20">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base dark:text-blue-200">
                  Enter Transfer PIN
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm dark:text-blue-300">
                  For security reasons, please enter your 4-digit transfer PIN to confirm this transaction.
                </p>

                <Input
                  type="password"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  value={transferData.pin || ""}
                  onChange={(e) =>
                    setTransferData({ ...transferData, pin: e.target.value })
                  }
                  className="w-full sm:w-1/2 bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20 dark:placeholder-blue-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto border-gray-300 text-gray-900 dark:border-blue-900/30 dark:text-blue-200"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmPin}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={!transferData.pin}
                >
                  {confirmTransfer ? (
                    <div className="flex items-center space-x-2">
                      {/* Spinner */}
                      <span className="inline-block w-5 h-5 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                      {/* Text */}
                      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-blue-200 animate-pulse">
                        Processing...
                      </span>
                    </div>
                  ) : ("Confirm Transfer")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <Card className="bg-gray-50 border border-gray-200 text-gray-900 shadow-lg dark:bg-transparent dark:border-blue-900/30 dark:shadow-blue-900/40">
            {approveAccount.allowTransfer === false ? (
              <CardContent className="text-center py-8 sm:py-12">
                <XCircle className="h-16 w-16 sm:h-20 sm:w-20 text-red-500 mx-auto mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2 sm:mb-4 dark:text-red-400">
                  Transfer Failed!
                </h2>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-2">
                  <strong>
                    <p className="text-red-500 mb-6 sm:mb-8 text-sm sm:text-base">
                      {approveAccount.errorMsg}.
                    </p>
                  </strong>
                </div>

                {approveAccount.allowValidation === true ? (
                  <legend className="text-black-600 dark:text-black-400">
                    Click <button onClick={handleTransferError}><em className='text-blue-600'>here</em></button> to validate your transfer
                  </legend>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-2">
                    <strong>
                      <small>Please contact <button onClick={() => navigate("/support")}><em className='text-blue-500'>support</em></button> if the error persist.</small>
                    </strong>
                  </div>
                )}
              </CardContent>
            ) : (
              <CardContent className="text-center py-8 sm:py-12">
                <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2 sm:mb-4 dark:text-green-400">Transfer Successful!</h2>
                <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base dark:text-blue-300">
                  Your transfer of ${transferData.amount} has been processed successfully.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto text-gray-900 border border-gray-300 dark:text-blue-200 dark:border-blue-900/30">
                    Return To Dashboard
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <Card className="bg-gray-50 border border-gray-200 text-gray-900 shadow-lg dark:bg-transparent dark:border-blue-900/30 dark:shadow-blue-900/40">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-center text-gray-900 dark:text-blue-200">
                Transfer Verification
              </CardTitle>
              <p className="text-gray-500 text-sm sm:text-base text-center mt-1 dark:text-blue-300">
                Enter the 6-digit verification code sent to you from the Support Team.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8">
              <div className="bg-gray-100 p-4 sm:p-6 rounded-lg text-center dark:bg-blue-950/10">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base dark:text-blue-200">
                  Transaction Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">From Account:</span>
                    <span className="font-medium dark:text-blue-200">
                      {accounts.find((acc) => acc.id === transferData.fromAccount)?.name} Account
                    </span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Recipient:</span>
                    <span className="font-medium capitalize dark:text-blue-200">
                      {transferData.toAccountName}
                    </span>
                  </div>
                  <hr className="border-gray-300 dark:border-blue-900/20" />

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-500 dark:text-blue-300">Amount:</span>
                    <span className="font-bold text-lg sm:text-xl text-blue-600 dark:text-blue-400">
                      ${Number(transferData.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* OTP Input Section */}
              <div className="text-center space-y-4">
                <Label htmlFor="otp" className="text-gray-900 font-medium text-sm sm:text-base dark:text-blue-200">
                  Enter OTP Code
                </Label>

                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-10 sm:w-12 h-10 sm:h-12 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-950/5 dark:text-blue-200 dark:border-blue-900/20"
                    />
                  ))}
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-2 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto border-gray-300 text-gray-900 dark:border-blue-900/30 dark:text-blue-200">
                  Back
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  onClick={handleSubmit}
                  disabled={otp.join("").length < 6}
                >
                  {confirmTransfer ? (
                    <div className="flex items-center space-x-2">
                      {/* Spinner */}
                      <span className="inline-block w-5 h-5 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                      {/* Text */}
                      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-blue-200 animate-pulse">
                        Processing...
                      </span>
                    </div>
                  ) : ("Verify OTP")}
                  
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <Card className="max-w-md mx-auto shadow-lg border border-gray-200 bg-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30">
            <CardHeader className="text-center">
              <Hourglass className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse dark:text-blue-400" />
              <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-300">
                Transaction Under Review
              </CardTitle>
              <p className="text-gray-500 text-sm sm:text-base mt-2 dark:text-blue-300">
                Your transaction is currently under review and will be processed within{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">{approveAccount.duration}</span>.
              </p>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:bg-blue-950/10 dark:border-blue-900/20">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2 dark:text-blue-400">
                  <Info className="h-5 w-5" />
                  <span className="font-medium text-sm sm:text-base">Security Check in Progress</span>
                </div>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed dark:text-blue-300">
                  We’re verifying the details of your transfer for compliance and security purposes.
                  You’ll receive a notification once it’s completed.
                </p>
              </div>

              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 w-full sm:w-auto rounded-lg transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );



}
