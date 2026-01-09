import { useEffect, useState } from "react";
import {
  Bell, Search, User, LogOut, Settings, Moon, Sun, Menu, Headphones,
  Home, CreditCard, ArrowLeftRight, Clock, Calendar, UserCog,
  ChevronDown, ChevronUp, ChevronRight,
  Briefcase,
  Landmark,
  ArrowDown,
  ArrowDownUp,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import handleLogout from "../logOut";
import appName from "@/appName";

export function TopNavbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

    useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

   const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const complexMenu = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    {title: "Accounts", url: "/accounts", icon: CreditCard},
    {
      title: "Transfers", icon: ArrowLeftRight, sub: [
        { title: "Send Money", url: "/transfer" },
        { title: "Bank to Bank", url: "/transfer-bank-to-bank" },
        { title: "International", url: "/transfer-international" },
      ]
    },
    {
      title: "Payments", icon: Clock, sub: [
        { title: "Bills & Utilities", url: "/bills-and-utilities" },
        { title: "Recurring Payments", url: "/recurring-payments" },
      ]
    },
    {
      title: "Cards", icon: CreditCard, sub: [
        { title: "Manage Cards", url: "/manage-cards" },
        { title: "Card Requests", url: "/card-request" },
        { title: "Card Limits", url: "/card-limit" },
      ]
    },
    {
      title: "Loans", icon: Landmark, sub: [
        { title: "Apply for Loan", url: "/apply-loan" },
        { title: "Loan Status", url: "/loan-status" },
        { title: "Repayments", url: "/loan-repayment" },
      ]
    },
    {
      title: "Transactions", icon: ArrowDownUp, sub: [
        { title: "Transaction History", url: "/transactions" },
        
      ]
    },
    {
      title: "Settings", icon: Settings, sub: [
        { title: "Profile", url: "/profile" },
        { title: "Security", url: "/settings" },
      ]
    },
    { title: "Contact Support", url: "/support", icon: Headphones },
    { title: "FAQ", url: "/faq", icon: Calendar },
  ];

  return (
    <header className="h-14 sm:h-16 border-b border-gray-200 dark:border-blue-900 bg-white dark:bg-[#050812] flex items-center justify-between px-3 sm:px-4 md:px-6 transition-all duration-300">
      {/* Left Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden md:block">
          <SidebarTrigger />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-blue-400">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72 sm:w-80 p-0 bg-white dark:bg-[#050812] border-r border-gray-200 dark:border-blue-900 flex flex-col justify-between transition-all duration-300"
            >
              <div className="overflow-auto">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-blue-900 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-700 to-blue-400 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">FB</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-blue-100">{appName}</span>
                </div>

                {/* Sidebar Menus */}
                <SidebarContent className="px-4 py-3">
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-blue-400 uppercase tracking-wider mb-3">
                      Banking
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {complexMenu.map((menu) => (
                          <div key={menu.title} className="overflow-hidden">
                            {menu.sub ? (
                              // 🔽 Dropdown parent
                              <SidebarMenuButton
                                onClick={() => toggleDropdown(menu.title)}
                                className={`w-full flex justify-between items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-300
      hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
      ${openDropdown === menu.title ? "bg-blue-100 dark:bg-blue-950/60 text-blue-400 border-l-2 border-blue-500" : ""}
    `}
                              >
                                <div className="flex items-center space-x-3">
                                  <menu.icon className="h-5 w-5" />
                                  <span className="font-medium">{menu.title}</span>
                                </div>
                                {openDropdown === menu.title ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </SidebarMenuButton>
                            ) : (
                              // 🔗 Direct link item
                              <Link
                                to={menu.url}
                                className="w-full flex items-center justify-between space-x-3 rounded-lg px-3 py-2.5 transition-all duration-300
      hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                              >
                                <div className="flex items-center space-x-3">
                                  <menu.icon className="h-5 w-5" />
                                  <span className="font-medium">{menu.title}</span>
                                </div>
                              </Link>
                            )}


                            {/* Dropdown Animation */}
                            {menu.sub && (
                              <div
                                className={`ml-9 border-l border-blue-900/30 pl-3 mt-1 overflow-hidden transition-all duration-500 ease-in-out
                                  ${openDropdown === menu.title ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                                `}
                              >
                                {menu.sub.map((item) => (
                                  <Link
                                    key={item.title}
                                    to={item.url}
                                    className="block py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:translate-x-1 transition-all"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  {userData?.isAdmin && (
                    <SidebarGroup>
                      <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-blue-400 uppercase tracking-wider mb-3">
                        Administration
                      </SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                      hover:bg-red-50 hover:text-red-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                      ${location.pathname === "/admin"
                                  ? "bg-red-50 text-red-600 border-r-2 border-red-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 shadow-lg"
                                  : ""
                                }`}
                            >
                              <Link to="/admin">
                                <UserCog className="h-5 w-5" />
                                <span className="font-medium">Admin Panel</span>
                              </Link>
                            </SidebarMenuButton>

                            <SidebarMenuButton
                              asChild
                              className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                      hover:bg-red-50 hover:text-red-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                      ${location.pathname === "/reply-email"
                                  ? "bg-red-50 text-red-600 border-r-2 border-red-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 shadow-lg"
                                  : ""
                                }`}
                            >
                              <Link to="/reply-email">
                                <Mail className="h-5 w-5" />
                                <span className="font-medium">Send Mail</span>
                              </Link>
                            </SidebarMenuButton>

                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  )}
                </SidebarContent>
              </div>

              {/* Fixed Bottom User Section */}
              <div className="border-t border-gray-200 dark:border-blue-900 p-4 flex items-center justify-between bg-white/60 dark:bg-[#0a0e18]/80 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 border border-blue-700">
                    <AvatarImage src={userData?.profileUrl || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {userData?.firstName?.[0]?.toUpperCase() || ""}
                      {userData?.lastName?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-blue-100">{userData?.firstName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Settings & Profile</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate("/settings")}
                  className="h-8 w-8 text-gray-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 h-8 w-8 p-0 transition"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full border border-gray-300 dark:border-blue-800 hover:border-blue-500 transition-all"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.profileUrl || "/placeholder.svg"} alt="user" />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {userData?.firstName?.[0]?.toUpperCase() || ""}
                  {userData?.lastName?.[0]?.toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-52 bg-white dark:bg-[#050812] border border-gray-200 dark:border-blue-900 rounded-xl shadow-lg"
            align="end"
          >
            <DropdownMenuLabel className="border-b border-gray-200 dark:border-blue-900 pb-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-blue-200">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userData?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
