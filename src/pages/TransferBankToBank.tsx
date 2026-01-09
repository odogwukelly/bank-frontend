import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import server from '@/server';
import Loader from '@/components/Loader';
import OverlayLoader from '@/components/OverlayLoader';
import generateTransactionId from '@/components/generateTxnID';

type Bank = { code: string; name: string };

export default function TransferBankToBank() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [accounts, setAccounts] = useState([{
    id: '',
    name: '',
    number: '',
    balance: 0,
    currency: '$',
  }]);

  // Replace this with real user/account data fetched from server or context
  const [fromAccount, setFromAccount] = useState({
    id: '',
    name: '',
    number: '',
    balance: 0,
    currency: '$',
  });

  // form fields
  const [fromAccountId, setFromAccountId] = useState("1");
  const [toBank, setToBank] = useState<string>('');
  const [toBankName, setToBankName] = useState({
    account_id: "",
    fullName: "",
    accountBalance: 0,
    user_id: ""
  });
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // keep as string for input
  const [reference, setReference] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>(''); // optional
  const [confirming, setConfirming] = useState(false);

  // UI / data
  const [banks, setBanks] = useState<Bank[]>([]);
  const [feePercent, setFeePercent] = useState<number>(0.0055); // 0.5% default
  const [flatFee, setFlatFee] = useState<number>(0); // ₦50 flat
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const storedData = JSON.parse(localStorage.getItem("userData"));


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = storedData?.id;
        if (!userId) return;

        const accountRes = await fetch(`${server}/users/account/?user_id=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!accountRes.ok) {
          throw new Error("Failed to fetch account data");
        }

        const data = await accountRes.json();
        const accountsArray = data || [];

        const formatted = accountsArray.map((acc) => ({
          id: acc.id,
          name: acc.accountType
            ? acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase()
            : "Unknown",
          balance: acc.accountBalance,
          number: acc.accountNumber,
          currency: '$'
          // number: acc.accountNumber,
        }));


        setFromAccount({
          ...fromAccount,
          id: accountsArray[0].id,
          name: accountsArray[0].accountType ? accountsArray[0].accountType[0].toUpperCase() + accountsArray[0].accountType.slice(1).toLowerCase()
            : "Unknown",
          balance: accountsArray[0].accountBalance,
          number: accountsArray[0].accountNumber,
          currency: '$'
        });
        setAccounts(formatted)
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false)
      }
    };

    async function fetchMeta() {
      try {
        // Example static banks list; you can fetch from your server if available
        setBanks([
          { code: '001', name: 'Savings Account' },
          { code: '044', name: 'Business Account' },
          { code: '011', name: 'Checking Account' },
        ]);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
    fetchMeta();
  }, []);

  // helpers
  const parseAmount = (v: string) => {
    // remove commas, spaces; allow decimal
    const cleaned = v.replace(/,/g, '').trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  };

  const computeFee = (amt: number) => {
    if (!Number.isFinite(amt) || amt <= 0) return 0;
    return Math.max(0, Math.round((amt * feePercent) + flatFee));
  };

  const computeTotal = (amt: number) => {
    return amt + computeFee(amt);
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // validation
  const validate = () => {
    const errors: Record<string, string> = {};
    // if (!toBank) errors.toBank = 'Please select recipient bank.';
    if (!toAccount || toAccount.trim().length < 6) errors.toAccount = 'Enter a valid account number.';
    const amt = parseAmount(amount);
    if (Number.isNaN(amt) || amt <= 0) errors.amount = 'Enter a valid amount.';
    if (amt > fromAccount.balance) errors.amount = 'Insufficient funds.';
    // optional: verify account number format per bank using server side
    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceed = async () => {
    if (!validate()) {
      toast({
        title: 'Check form',
        description: 'Please fix errors before proceeding.',
        variant: 'destructive'
      });
      return;
    }
    const res = await fetch(`${server}/users/account/number/${toAccount}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const err = await res.json(); // <-- FIXED
      toast({
        title: "Invalid Details",
        description: err.detail || "Invalid Account Details",
        variant: "destructive",
      });
      return;
    }

    const data = await res.json();

    const userRes = await fetch(`${server}/users/get/${data.userID}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!userRes.ok) {
      const err = await userRes.json(); // <-- FIXED
      toast({
        title: "Invalid Details",
        description: err.detail || "Failed to fetch Account Details",
        variant: "destructive",
      });
      return;
    }

    const userData = await userRes.json();

    setToBankName({ ...toBankName, user_id: userData.userData.id, fullName: userData.userData.fullName, account_id: data.id, accountBalance: data.accountBalance })

    setToBank(data.accountType)
    setConfirming(true);
    // window.scrollTo({ top: 0, behavior: 'smooth' })
    window.scrollTo(0, document.documentElement.scrollHeight);



  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      const payload = {
        fromAccountId,
        toBank,
        toAccount,
        amount: parseAmount(amount),
        reference,
        // scheduleDate: scheduleDate || null,
      };

      const txnToPayload = {
        userID: toBankName.user_id,
        accountID: toBankName.account_id,
        amount: Number(amtNumber),
        status: "completed",
        type: "credit",
        title: payload.reference || "",
        category: `Bank Transfer Deposit`,
        desc: `Transfer to ${toBank} Account `,
      };

      let updatedAmount = toBankName.accountBalance;

      if (payload.amount > 0) {
        updatedAmount = Number(toBankName.accountBalance) + payload.amount;
      }

      const updateBalance = { accountBalance: updatedAmount };

      const accountRes = await fetch(`${server}/users/account/${toBankName.account_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBalance),
      });

      if (!accountRes.ok) {
        const err = await accountRes.json(); // <-- FIXED
        toast({
          title: "Failed to update account",
          description: err.detail || "Try again",
          variant: "destructive",
        });
        return;
      }

      // ---- create transaction ----
      const txnRes = await fetch(`${server}/users/transaction/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txnToPayload),
      });

      if (!txnRes.ok) {
        const err = await txnRes.json();
        toast({
          title: "Failed to create transaction",
          description: err.detail || "Try again",
          variant: "destructive",
        });
        return;
      }



      if (payload.fromAccountId && payload.amount > 0) {

        const accRes = await fetch(`${server}/users/account/${fromAccountId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!accRes.ok) {
        const err = await accRes.json(); 
        toast({
          title: "Failed to get account",
          description: err.detail || "Try again",
          variant: "destructive",
        });
        return;
      }

        const account = await accRes.json();
        const updateAmount = (account.accountBalance - total);

        const updateBalance = { accountBalance: updateAmount };

        const txnFromPayload = {
          userID: userData.id,
          accountID: fromAccountId,
          amount: Number(total),
          status: "completed",
          type: "transfer",
          title: payload.reference || "",
          category: "Bank Transfer",
          desc: `Transfer from ${fromAccount.name} Account `,
        };

        const accountRes = await fetch(`${server}/users/account/${fromAccountId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateBalance),
        });

        if (!accountRes.ok) {
          const err = await accountRes.json(); // <-- FIXED
          toast({
            title: "Failed to update account",
            description: err.detail || "Try again",
            variant: "destructive",
          });
          return;
        }

        // ---- create transaction ----
        const txnRes = await fetch(`${server}/users/transaction/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(txnFromPayload),
        });

        if (!txnRes.ok) {
          const err = await txnRes.json();
          toast({
            title: "Failed to create transaction",
            description: err.detail || "Try again",
            variant: "destructive",
          });
          return;
        }
      }

      // Replace endpoint with your real transfer API
      // const res = await fetch(`${server}/users/account/number/${toAccount}`, {
      //   method: 'Get',
      //   headers: { 'Content-Type': 'application/json' }
      // });

      // if (!res.ok) {
      //   const err = await res.json().catch(() => ({}));
      //   throw new Error(err.detail || 'Transfer failed');
      // }

      // const data = await res.json();

      // setToBank(data.accountType)
      setSuccessMessage('Transfer submitted successfully.');
      toast({ title: 'Success', description: 'Transfer submitted.', variant: 'success' });
      // reset form lightly
      setToBank('');
      setToAccount('');
      setAmount('');
      setReference('');
      setScheduleDate('');
      setConfirming(false);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Transfer failed', description: err.message || 'Network error', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading transfer..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }

  const amtNumber = parseAmount(amount);
  const fee = Number.isFinite(amtNumber) ? computeFee(amtNumber) : 0;
  const total = Number.isFinite(amtNumber) ? computeTotal(amtNumber) : 0;

  const handleSelectAccount = (accountId) => {
    const account = accounts.find(a => a.id === accountId);
    setFromAccount(account);
    setFromAccountId(accountId)
  };

  const validAccounts = accounts.filter(
    (acc) => acc && acc.id && acc.id !== ""
  );



  return (
    <DashboardLayout>
      {submitting && <OverlayLoader message="Processing transfer..." color="red-500" />}

      <div className="space-y-6 sm:space-y-8 bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 transition-all duration-500 min-h-screen p-4 sm:p-6 rounded-xl">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-blue-200 mb-2">
            Bank to Bank Transfer
          </h1>
          <p className="text-sm text-gray-600 dark:text-blue-300 mb-6">
            Send money to any bank. Light and dark theme ready.
          </p>

          <Card className="rounded-2xl shadow-md dark:shadow-blue-900/40">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-blue-200">Transfer details</CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* From account (readonly) */}
              <div className="mb-[50px] grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">


                <div className="sm:col-span-2">
                  <Label>From account</Label>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-blue-200">{fromAccount.name}</div>
                      <div className="text-sm text-gray-500 dark:text-blue-300">{fromAccount.number}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-blue-300">Available</div>
                      <div className="font-semibold text-gray-900 dark:text-blue-200">
                        {fromAccount.currency} {formatCurrency(fromAccount.balance)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <Label>Transfer type</Label>
                  <div className="mt-1">
                    <Badge className="bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200">Immediate</Badge>
                  </div>
                </div>
              </div>

              <Label>From Account</Label>
              <Select
                value={fromAccount?.id ?? undefined}
                onValueChange={handleSelectAccount}
              >
                <SelectTrigger className="h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>

                <SelectContent>
                  {validAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} Account
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* To bank / account */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"> */}
              {/* <div className="sm:col-span-1">
                  <Label>To bank</Label>
                  <Select value={toBank} onValueChange={(v) => setToBank(v)}>
                    <SelectTrigger className="w-full h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((b) => (
                        <SelectItem key={b.code} value={b.name}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errorMap.toBank && <p className="text-xs text-red-500 mt-1">{errorMap.toBank}</p>}
                </div> */}

              <div className="sm:col-span-2">
                <Label>Recipient account number</Label>
                <Input
                  placeholder="0123456789"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value.replace(/\s/g, ''))}
                  className="mt-1 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100"
                />
                {errorMap.toAccount && <p className="text-xs text-red-500 mt-1">{errorMap.toAccount}</p>}
              </div>
              {/* </div> */}

              {/* Amount / reference */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-1">
                  <Label>Amount ({fromAccount.currency})</Label>
                  <Input
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      // allow numbers, decimal and commas for thousand separators while typing
                      const v = e.target.value.replace(/[^0-9.,]/g, '');
                      setAmount(v);
                    }}
                    className="mt-1 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100"
                    inputMode="decimal"
                  />
                  {errorMap.amount && <p className="text-xs text-red-500 mt-1">{errorMap.amount}</p>}
                </div>

                <div className="sm:col-span-2">
                  <Label>Reference (optional)</Label>
                  <Input
                    placeholder="Payment reference or note"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="mt-1 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div>
              </div>

              {/* Schedule & fee summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                {/* <div className="sm:col-span-1">
                  <Label>Schedule date (optional)</Label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="mt-1 h-9 text-sm dark:bg-blue-950/40 dark:text-blue-100"
                  />
                </div> */}

                <div className="sm:col-span-2">
                  <div className="border rounded-lg p-3 bg-gray-50 dark:bg-blue-950/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-blue-300">Estimated fee</div>
                      <div className="font-medium text-gray-900 dark:text-blue-200">
                        {fromAccount.currency} {formatCurrency(fee)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600 dark:text-blue-300">Total</div>
                      <div className="font-semibold text-gray-900 dark:text-blue-200">
                        {fromAccount.currency} {formatCurrency(total)}
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-blue-300">
                      Fee: {(feePercent * 100).toFixed(2)}% {/* + {fromAccount.currency} {flatFee} */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    onClick={handleProceed}
                  >
                    Review & Continue
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setToBank(''); setToAccount(''); setAmount(''); setReference(''); setScheduleDate('');
                      setErrorMap({});
                    }}
                  >
                    Reset
                  </Button>
                </div>

                <div className="w-full sm:w-auto text-sm text-gray-700 dark:text-blue-300 text-center sm:text-right">
                  <div>You are sending from <strong>{fromAccount.name}</strong></div>
                </div>
              </div>

              {/* Confirmation panel */}
              {confirming && (
                <div className="mt-3 border rounded-lg p-4 bg-white dark:bg-blue-950/20">
                  <h3 className="font-semibold text-gray-900 dark:text-blue-200">Confirm transfer</h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-blue-300">
                    <div>To: <strong className='capitalize' >{banks.find(b => b.code === toBank)?.name || toBank} Account</strong></div>
                    <div>Account: <strong>{toAccount}</strong></div>
                    <div>Recipient Name: <strong className='capitalize'>{toBankName.fullName}</strong></div>
                    <div>Amount: <strong>{fromAccount.currency} {formatCurrency(amtNumber || 0)}</strong></div>
                    <div>Fee: <strong>{fromAccount.currency} {formatCurrency(fee)}</strong></div>
                    <div>Total: <strong>{fromAccount.currency} {formatCurrency(total)}</strong></div>
                    <div>Reference: <strong>{reference || ''}</strong></div>
                    <div>Transaction ID: <strong>{generateTransactionId()}</strong></div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      Confirm & Send
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirming(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mt-3 text-sm text-green-700 dark:text-green-300">
                  {successMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
