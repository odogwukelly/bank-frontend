import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Wallet, PiggyBank, CreditCard, Building2 } from "lucide-react";
import server from "@/server";
import { useUserData } from "@/hooks/userData";
import Loader from "@/components/Loader";

export default function CreateAccount() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [accountType, setAccountType] = useState("");
    const [accountName, setAccountName] = useState("");
    const [initialDeposit, setInitialDeposit] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const API_URL = server
    const { userData, refreshUserData } = useUserData()
    const [loading, setLoading] = useState(false);


    const accountTypes = [
        { value: "checking", label: "Checking Account", icon: Wallet, description: "For everyday transactions" },
        { value: "savings", label: "Savings Account", icon: PiggyBank, description: "Earn interest on your balance" },
        // { value: "credit", label: "Credit Account", icon: CreditCard, description: "Access to credit line" },
        { value: "business", label: "Business Account", icon: Building2, description: "For business operations" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true)
            if (!userData?.id) {
                toast({
                    title: "Unauthorized",
                    description: "Please log in again to request an account.",
                    variant: "destructive",
                });
                return;
            }

            const payload = {
                accountName: accountName,
                accountType: accountType,
                userID: userData.id,
                accountBalance: parseFloat(initialDeposit),
                status: true
            };

            console.log("Payload:", payload);

            const res = await fetch(`${API_URL}/users/account/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Response:", res.status, data);

            if (!res.ok) {
                throw new Error(data.detail || "Failed to request account");
            }

            refreshUserData();

            toast({
                title: "Account Requested!",
                description: `Your ${accountType} account request is under review and will be approved within 24hrs.`,
                variant: "success"
            });

            setTimeout(() => navigate("/accounts"), 1500);
        } catch (error: any) {
            console.error("Error requesting account:", error);
            toast({
                title: "Error",
                description: error.message || "Something went wrong while requesting the account.",
                variant: "destructive",
            });
        } finally {
            setLoading(false)
        }
    };



    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/accounts")}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Accounts
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Request New Account</CardTitle>
                        <CardDescription>
                            Request a new account to manage your finances
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Account Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="accountType">Account Type *</Label>
                                <Select value={accountType} onValueChange={setAccountType} required>
                                    <SelectTrigger id="accountType">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center gap-2">
                                                    <type.icon className="h-4 w-4" />
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Selected Account Type Info */}
                            {accountType && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {accountTypes
                                        .filter((type) => type.value === accountType)
                                        .map((type) => (
                                            <Card key={type.value} className="bg-muted/50">
                                                <CardContent className="pt-6">
                                                    <type.icon className="h-8 w-8 mb-2 text-primary" />
                                                    <h3 className="font-semibold mb-1">{type.label}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {type.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            )}

                            {/* Account Name */}
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Name *</Label>
                                <Input
                                    id="accountName"
                                    placeholder="e.g., My Primary Checking"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Give your account a memorable name
                                </p>
                            </div>

                            {/* Account Features */}
                            {accountType && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Account Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature1" defaultChecked />
                                            <Label htmlFor="feature1" className="text-sm font-normal">
                                                Online banking access
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature3" defaultChecked />
                                            <Label htmlFor="feature3" className="text-sm font-normal">
                                                Email notifications
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature4" defaultChecked />
                                            <Label htmlFor="feature4" className="text-sm font-normal">
                                                SMS alerts
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/accounts")}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button disabled={!accountType} type="submit" className="flex-1" >
                                    {loading ? (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                {/* Spinner */}
                                                <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                                                {/* Text */}
                                                <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                                                    Creating...
                                                </span>
                                            </div>

                                        </>
                                    ) : ("Create Account")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}


export function CreateAccountByID() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user_id } = useParams();
    const [accountType, setAccountType] = useState("");
    const [accountName, setAccountName] = useState("");
    const [initialDeposit, setInitialDeposit] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const API_URL = server
    const { userData, refreshUserData } = useUserData()
    const [loading, setLoading] = useState(false);


    const accountTypes = [
        { value: "checking", label: "Checking Account", icon: Wallet, description: "For everyday transactions" },
        { value: "savings", label: "Savings Account", icon: PiggyBank, description: "Earn interest on your balance" },
        // { value: "credit", label: "Credit Account", icon: CreditCard, description: "Access to credit line" },
        { value: "business", label: "Business Account", icon: Building2, description: "For business operations" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true)
            if (!userData?.id) {
                toast({
                    title: "Unauthorized",
                    description: "Please log in again to create an account.",
                    variant: "destructive",
                });
                return;
            }

            const payload = {
                accountName: accountName,
                accountType: accountType,
                userID: user_id,
                accountBalance: parseFloat(initialDeposit),
                status: true
            };

            console.log("Payload:", payload);

            const res = await fetch(`${API_URL}/users/account/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Response:", res.status, data);

            if (!res.ok) {
                throw new Error(data.detail || "Failed to create account");
            }

            refreshUserData();

            toast({
                title: "Account Created!",
                description: `Your ${accountType} account has been created successfully.`,
                variant: "success"
            });

            setTimeout(() => navigate(`/admin-user-details/${user_id}`), 1500);
        } catch (error: any) {
            console.error("Error creating account:", error);
            toast({
                title: "Error",
                description: error.message || "Something went wrong while creating the account.",
                variant: "destructive",
            });
        } finally {
            setLoading(false)
        }
    };



    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/admin-user-details/${user_id}`)}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                   
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Account</CardTitle>
                        <CardDescription>
                            Open a new account to manage your finances
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Account Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="accountType">Account Type *</Label>
                                <Select value={accountType} onValueChange={setAccountType} required>
                                    <SelectTrigger id="accountType">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center gap-2">
                                                    <type.icon className="h-4 w-4" />
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Selected Account Type Info */}
                            {accountType && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {accountTypes
                                        .filter((type) => type.value === accountType)
                                        .map((type) => (
                                            <Card key={type.value} className="bg-muted/50">
                                                <CardContent className="pt-6">
                                                    <type.icon className="h-8 w-8 mb-2 text-primary" />
                                                    <h3 className="font-semibold mb-1">{type.label}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {type.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            )}

                            {/* Account Name */}
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Name *</Label>
                                <Input
                                    id="accountName"
                                    placeholder="e.g., My Primary Checking"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Give your account a memorable name
                                </p>
                            </div>

                            {/* Account Features */}
                            {accountType && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Account Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature1" defaultChecked />
                                            <Label htmlFor="feature1" className="text-sm font-normal">
                                                Online banking access
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature3" defaultChecked />
                                            <Label htmlFor="feature3" className="text-sm font-normal">
                                                Email notifications
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature4" defaultChecked />
                                            <Label htmlFor="feature4" className="text-sm font-normal">
                                                SMS alerts
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/accounts")}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button disabled={!accountType} type="submit" className="flex-1" >
                                    {loading ? (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                {/* Spinner */}
                                                <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                                                {/* Text */}
                                                <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                                                    Creating...
                                                </span>
                                            </div>

                                        </>
                                    ) : ("Create Account")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}


