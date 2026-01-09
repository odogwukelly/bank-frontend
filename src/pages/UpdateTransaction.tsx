import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import server from "@/server";
import Loader from "@/components/Loader";

export default function UpdateTransaction() {
    const navigate = useNavigate()
    const { user_id, transaction_id } = useParams()
    const [accounts, setAccounts] = useState([]);
    const [updateTransaction, setUpdateTransaction] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        date: "",
        type: "",
        category: "",
        account: "",
        status: "pending",
        notes: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${server}/users/get/${user_id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Failed to fetch user data');

                const data = await res.json();

                setAccounts(
                    (data.userAccount || []).map((acc) => ({
                        id: acc.id,
                        name: acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase(),
                        type: acc.accountType,
                        balance: acc.accountBalance,
                        accountNumber: '****' + acc.accountNumber.slice(-4),
                        status: acc.status ? 'Active' : 'Inactive',
                    }))
                );
                const transactionRes = await fetch(`${server}/users/transaction/get-transaction/${transaction_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!transactionRes.ok) {
                    throw new Error("Failed to fetch transaction data");
                }
                const transactionData = await transactionRes.json();
                setFormData({
                    ...formData,
                    description: transactionData.title,
                    notes: transactionData.desc,
                    amount: transactionData.amount,
                    date: new Date(transactionData.created_at).toISOString().split("T")[0],
                    type: transactionData.type,
                    category: transactionData.category,
                    status: transactionData.status,
                    account: transactionData.accountID
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        };
        fetchUserData();
    }, [user_id]);

    const handleSubmit = async () => {
        setUpdateTransaction(true)
        try {
            const payload = {
                amount: formData.amount,
                status: formData.status,
                type: formData.type,
                title: formData.description,
                category: formData.category,
                desc: formData.notes,
                created_at: formData.date
            }
            const res = await fetch(`${server}/users/transaction/${transaction_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                toast({
                    title: "failed to create transaction",
                    description: err.detail || "Try again",
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Success",
                description: "Transaction Updated successfully!",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Network error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setUpdateTransaction(false)
        }
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
            <div className="space-y-4 sm:space-y-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin-user-details/${user_id}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                {/* Header */}
                <div className="flex flex-col space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Update Transaction</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Record updated payment, deposit, or transfer</p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Update Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description">Title </Label>
                                    <Input
                                        id="description"
                                        placeholder="e.g., Grocery Store, Salary Deposit"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min={0}
                                        placeholder="e.g., 250.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Transaction Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="credit">Credit</SelectItem>
                                            <SelectItem value="debit">Debit</SelectItem>
                                            <SelectItem value="transfer">Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        placeholder="e.g., Food, Bills, Income"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="account" className="text-sm sm:text-base">Select Account *</Label>
                                    <Select value={formData.account}
                                        onValueChange={(value) => setFormData({ ...formData, account: value })}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select source account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (

                                                <SelectItem key={account.id} value={account.id}>
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-sm sm:text-base">{account.name} Account</span>
                                                        <span className="text-xs sm:text-sm text-gray-600 ml-2">${account.balance.toLocaleString()}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Description</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Brief Details about this transaction..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="text-sm sm:text-base"
                                    onClick={handleSubmit}
                                >
                                    {updateTransaction ? (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                {/* Spinner */}
                                                <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                                                {/* Text */}
                                                <span className="text-sm sm:text-base font-medium text-gray-200 animate-pulse">
                                                    Updating...
                                                </span>
                                            </div>

                                        </>
                                    ) : ("Update Transaction")}

                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
