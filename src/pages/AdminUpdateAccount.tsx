import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Wallet, PiggyBank, CreditCard, Building2 } from "lucide-react";
import server from "@/server";
import { useUserData } from "@/hooks/userData";
import Loader from "@/components/Loader";
import OverlayLoader from "@/components/OverlayLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UpdateAccount() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [initialDeposit, setInitialDeposit] = useState({
        amount: "",
        created_at: "",
        approvedAccount: ""
    })
    const API_URL = server
    const { account_id, user_id } = useParams()


    useEffect(() => {
        const getAccount = async () => {
            try {
                const res = await fetch(`${API_URL}/users/account/${account_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                const accounntData = await res.json();

                setInitialDeposit({
                    ...initialDeposit,
                    amount: accounntData.accountBalance,
                    approvedAccount: accounntData.approvedAccount ? "approved" : "notApproved",
                    created_at: accounntData.created_at ? new Date(accounntData.created_at).toLocaleDateString('en-CA') : ""
                })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getAccount()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true)
        try {
            if (!account_id || !user_id) {
                toast({
                    title: "Unauthorized",
                    description: "Account or User ID is required",
                    variant: "destructive",
                });
                return;
            }

            const selectedDate = new Date(initialDeposit.created_at);
            const withTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                new Date().getHours(),
                new Date().getMinutes(),
                new Date().getSeconds()
            );

            const payload = {
                userID: user_id,
                accountBalance: parseFloat(initialDeposit.amount),
                created_at: withTime.toISOString() || null,
                approvedAccount: initialDeposit.approvedAccount === "approved" ? true : false
            };


            const userAccount = await fetch(`${API_URL}/users/account/?user_id=${user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const userAccdata = await userAccount.json();


            if (userAccdata[0].id === Number(account_id) && payload.approvedAccount === true) {


                payload.accountBalance = 10
                const txnPayload = {
                    userID: user_id,
                    accountID: account_id,
                    amount: Number(payload.accountBalance),
                    status: "completed",
                    type: "credit",
                    title: "Welcome bonus",
                    category: "Bonus",
                    desc: `New Account Bonus`,
                };

                // ---- create transaction ----
                const txnRes = await fetch(`${server}/users/transaction/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(txnPayload),
                });

                if (!txnRes.ok) {
                    return;
                }


            }






            const res = await fetch(`${API_URL}/users/account/${account_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Response:", res.status, data);

            if (!res.ok) {
                throw new Error(data.detail || "Failed to update account");
            }

            toast({
                title: "Account Updated!",
                description: `Account updated successfully.`,
                variant: "success"
            });
            navigate(`/admin-account-details/${account_id}/${user_id}`)

        } catch (error: any) {
            console.error("Error updating account:", error);
            toast({
                title: "Error",
                description: error.message || "Something went wrong while updating the account.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false)
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
            {updating && <OverlayLoader message="Updating..." color="red-500" />}
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/admin-account-details/${account_id}/${user_id}`)}
                    className="mb-2"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Update Account</CardTitle>
                        <CardDescription>Update User Account Balance and Created Date</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {/* Initial Deposit */}

                                <div className="space-y-2">
                                    <Label htmlFor="type">Approve Account</Label>
                                    <Select
                                        value={initialDeposit.approvedAccount}
                                        onValueChange={(value) => setInitialDeposit({ ...initialDeposit, approvedAccount: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={initialDeposit.approvedAccount} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="notApproved">Not Approved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="initialDeposit">Amount (USD)</Label>
                                    <Input
                                        id="initialDeposit"
                                        type="number"
                                        placeholder="0"
                                        value={initialDeposit.amount}
                                        onChange={(e) => setInitialDeposit({ ...initialDeposit, amount: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="createdAt">Date Created</Label>
                                    <Input
                                        id="createdAt"
                                        type="date"
                                        placeholder="0"
                                        value={initialDeposit.created_at}
                                        onChange={(e) => setInitialDeposit({ ...initialDeposit, created_at: e.target.value })}
                                        required
                                        min="0"
                                        step="1"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="flex-1" >
                                    Update
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}


