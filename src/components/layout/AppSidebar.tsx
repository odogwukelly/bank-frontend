import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  CreditCard,
  ArrowLeftRight,
  Clock,
  Settings,
  User,
  Calendar,
  UserCog,
  Headphones,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Briefcase,
  Landmark,
  ShieldCheck,
  ArrowDownUp,
  Mail,
} from "lucide-react";
import appName from "@/appName";

export function AppSidebar() {
  const location = useLocation();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const navigate = useNavigate();

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const dropdowns = [
    // {
    //   title: "Accounts",
    //   icon: CreditCard,
    //   items: [
    //     { name: "All Accounts", url: "/accounts" },
    //     { name: "Savings Account", url: "/account-savings" },
    //     { name: "Business Account", url: "/business-account" },
    //     { name: "Checking Account", url: "/account-checking" },
    //     { name: "Credit Account", url: "/credit-account" },
    //   ],
    // },
    {
      title: "Transfers",
      icon: ArrowLeftRight,
      items: [
        { name: "Send Money", url: "/transfer" },
        { name: "Bank to Bank", url: "/transfer-bank-to-bank" },
        { name: "International", url: "/transfer-international" },
      ],
    },
    {
      title: "Payments",
      icon: DollarSign,
      items: [
        { name: "Bills & Utilities", url: "/bills-and-utilities" },
        { name: "Recurring Payments", url: "/recurring-payments" },
      ],
    },
    {
      title: "Cards",
      icon: CreditCard,
      items: [
        { name: "Manage Cards", url: "/manage-cards" },
        { name: "Card Requests", url: "/card-request" },
        { name: "Card Limits", url: "/card-limit" },
      ],
    },
    {
      title: "Loans",
      icon: Landmark,
      items: [
        { name: "Apply for Loan", url: "/apply-loan" },
        { name: "Loan Status", url: "/loan-status" },
        { name: "Repayments", url: "/loan-repayment" },
      ],
    },
    {
      title: "Transactions",
      icon: ArrowDownUp,
      items: [
        { name: "Transaction History", url: "/transactions" },
        
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      items: [
        { name: "Profile", url: "/profile" },
        { name: "Security", url: "/settings" },
      ],
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200 dark:border-blue-900 dark:bg-[#0b0f19] transition-all duration-300">
      {/* Header */}
      <SidebarHeader className="border-b border-gray-200 dark:border-blue-900 p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">FB</span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-blue-100">
            {appName}
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-blue-400 uppercase tracking-wider mb-3">
            Banking
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard (Static) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                    hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                    ${
                      location.pathname === "/dashboard"
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 shadow-lg"
                        : ""
                    }`}
                >
                  <Link to="/dashboard">
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                    hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                    ${
                      location.pathname === "/accounts"
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 shadow-lg"
                        : ""
                    }`}
                >
                  <Link to="/accounts">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Accounts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Dropdowns */}
              {dropdowns.map((menu) => (
                <div key={menu.title} className="overflow-hidden">
                  <SidebarMenuButton
                    onClick={() => toggleDropdown(menu.title)}
                    className={`w-full flex justify-between items-center space-x-3 transition-all duration-300 rounded-xl
                      hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                      ${
                        openDropdown === menu.title
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-r-2 border-blue-500"
                          : ""
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <menu.icon className="h-5 w-5" />
                      <span className="font-medium">{menu.title}</span>
                    </div>
                    {openDropdown === menu.title ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>

                  {/* Dropdown Items */}
                  <div
                    className={`ml-9 border-l border-blue-800/30 pl-3 mt-1 transition-all duration-300 ease-in-out overflow-hidden ${
                      openDropdown === menu.title ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {menu.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.url}
                        className={`block py-1.5 text-sm rounded-md transition-all duration-200 
                          hover:text-blue-600 hover:translate-x-1 dark:hover:text-blue-300
                          ${
                            location.pathname === item.url
                              ? "text-blue-600 dark:text-blue-300 font-semibold"
                              : "text-gray-700 dark:text-gray-400"
                          }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Support & FAQ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                    hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                    ${
                      location.pathname === "/support"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                        : ""
                    }`}
                >
                  <Link to="/support">
                    <Headphones className="h-5 w-5" />
                    <span className="font-medium">Contact Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                    hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400
                    ${
                      location.pathname === "/faq"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                        : ""
                    }`}
                >
                  <Link to="/faq">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">FAQ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
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
                      ${
                        location.pathname === "/admin"
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
                      ${
                        location.pathname === "/reply-email"
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

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200 dark:border-blue-900 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`w-full justify-start space-x-3 transition-all duration-300 rounded-xl
                hover:bg-gray-50 dark:hover:bg-blue-950/40
                ${
                  location.pathname === "/profile"
                    ? "bg-gray-50 dark:bg-blue-950/60 text-blue-500 shadow-lg"
                    : ""
                }`}
            >
              <Link to="/profile">
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
