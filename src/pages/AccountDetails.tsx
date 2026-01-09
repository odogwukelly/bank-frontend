import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, TrendingUp, CreditCard, PiggyBank, Search } from 'lucide-react';
import server from '@/server';
import { toast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

export default function AccountDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const accountId = searchParams.get('id') || '1';
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [account, setAccount] = useState({
        id: "",
        name: '',
        type: '',
        balance: "",
        accountNumber: '',
        status: '',
        fullAccountNumber: '',
        routingNumber: '',
        branch: '',
        accountOpenedDate: '',
    });
    const { account_id, user_id } = useParams()
    const API_URL = server

    useEffect(() => {
        const fetchAccountById = async () => {
            if (account_id) {
                try {
                    const res = await fetch(`${API_URL}/users/account/${account_id}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!res.ok) throw new Error("Failed to fetch accounts");

                    const data = await res.json();

                    // ✅ Update state and local storage with the latest user data
                    setAccount({
                        id: data.id,
                        name: data.accountName[0].toUpperCase() + data.accountName.slice(1).toLowerCase(),
                        type: data.accountType,
                        balance: data.accountBalance,
                        accountNumber: "****" + data.accountNumber.slice(-4),
                        status: data.status ? 'Active' : 'Inactive',
                        fullAccountNumber: data.accountNumber,
                        routingNumber: data.routingNumber,
                        branch: "",
                        accountOpenedDate: new Date(data.created_at).toLocaleDateString('en-CA')
                    });
                } catch (err) {
                    console.error("❌ Error fetching accounts:", err);

                } finally {
                    setLoading(false)
                }
            }
        }
        fetchAccountById()
    }, []);



    const handleDeleteUser = async () => {
        if (window.confirm("Are you sure you want to proceed with deleting this user account?")) {
            setDeleting(true)
            try {
                await fetch(`${server}/users/account/${account_id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                toast({
                    title: "Deleted",
                    description: `User account has been deleted successfully.`,
                    variant: "success"
                });

                navigate(`/accounts`)

            } catch (error) {
                console.error("Error deleting this user account", error);
                toast({
                    title: "failed!",
                    description: `Failed to delete account.`,
                    variant: "destructive"
                });
            } finally{
                setDeleting(false)
            }
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <Loader message="Loading..." size="h-96" color="blue-500" />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout >
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/accounts')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">{account.name}</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">{account.accountNumber}</p>
                        </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 w-fit">
                        {account.status}
                    </Badge>
                </div>

                {/* Account Overview Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="lg:col-span-2">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">Available Balance</p>
                                    <p className="text-4xl font-bold text-gray-900 mt-1">
                                        ${account.balance.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button className="w-full"
                                    onClick={() => navigate("/transfer")}
                                >
                                    Transfer Money
                                </Button>
                                <Button variant="destructive" className="w-full"
                                    onClick={handleDeleteUser}
                                >
                                    {deleting ? (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                {/* Spinner */}
                                                <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                                                {/* Text */}
                                                <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                                                    Deleting...
                                                </span>
                                            </div>

                                        </>
                                    ) : ("Delete Account")}
                                    
                                    </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-600">Account Type</p>
                                <p className="font-medium capitalize">{account.type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Full Account Number</p>
                                <p className="font-medium">{account.fullAccountNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Routing Number</p>
                                <p className="font-medium">{account.routingNumber}</p>
                            </div>
                            {/* <div>
                                <p className="text-xs text-gray-600">Branch</p>
                                <p className="font-medium">{account.branch}</p>
                            </div> */}
                            <div>
                                <p className="text-xs text-gray-600">Opened</p>
                                <p className="font-medium">{account.accountOpenedDate}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </DashboardLayout>
    );
}
