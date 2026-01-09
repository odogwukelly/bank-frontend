import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, User, MessageSquare, RefreshCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import server from "@/server";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";

interface SupportTicket {
    id: number;
    userID: number;
    email: string;
    mobile: string;
    category: string;
    subject: string;
    message: string;
    created_at: string;
}

export default function AdminSupportView() {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteSupport, setDeleteSupport] = useState(false);
    const { user_id } = useParams()


    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${server}/users/get/support/${user_id}`);
            if (!res.ok) {
                throw new Error("Failed to fetch complaints");
            }
            const data = await res.json();
            setTickets(data);
        } catch (err: any) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const navigate = useNavigate()


    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to proceed with deleting this user complaint?")) {
            setDeleteSupport(true)
            try {
                await fetch(`${server}/users/delete/support/${user_id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                toast({
                    title: "Deleted",
                    description: `User complaint deleted successfully.`,
                    variant: "success"
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);


            } catch (error) {
                console.error("Error deleting this user complaint", error);
                toast({
                    title: "failed!",
                    description: `Failed to delete complaint.`,
                    variant: "destructive"
                });
            } finally{
                setDeleteSupport(false)
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto ">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin-user-details/${user_id}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Complaints</h1>
                    <Button onClick={fetchTickets} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading && "animate-spin"}`} />
                        Refresh
                    </Button>
                </div>

                {loading ? (
                    <Loader message="Loading..." size="h-96" color="blue-500" />
                ) : tickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No complaints submitted yet.</p>
                ) : (
                    <ScrollArea className="h-[70vh] rounded-md border p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-blue-500 capitalize" />
                                            {ticket.subject ? ticket.subject[0].toUpperCase() + ticket.subject.slice(1) : ""}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-gray-500 capitalize">
                                            <span className="text-gray-600"><strong>Category:</strong></span> {ticket.category} <strong className="text-black"> • </strong>{new Date(ticket.created_at).toLocaleString('en-CA')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <hr />
                                        <p className="text-sm text-gray-700">{ticket.message ? ticket.message[0].toUpperCase() + ticket.message.slice(1) : ""}</p>
                                        <hr />
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3 text-gray-500" />
                                                <span>User ID: {ticket.userID}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3 text-gray-500" />
                                                <span>{ticket.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3 text-gray-500" />
                                                <span>{ticket.mobile || "N/A"}</span>
                                            </div>
                                        </div>
                                        <hr />
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2 text-xs"
                                            onClick={() => {
                                                navigator.clipboard.writeText(ticket.email);
                                                toast({
                                                    title: "Email Copied!",
                                                    description: `${ticket.email}`,
                                                    variant: "success"
                                                });
                                            }}
                                        >
                                            Copy Email
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full mt-2 text-xs"
                                            onClick={handleDelete}
                                        >
                                            {deleteSupport ? (
                                                <>
                                                    <div className="flex items-center space-x-2">
                                                        {/* Spinner */}
                                                        <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                                                        {/* Text */}
                                                        <span className="text-sm sm:text-base font-medium text-gray-200 animate-pulse">
                                                            Deleting...
                                                        </span>
                                                    </div>

                                                </>
                                            ) : ("Delete")}

                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </DashboardLayout>
    );
}
