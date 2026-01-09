import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import handleLogout from "../logOut";
import appName from "@/appName";

const menuItems = [
  { title: "Features", url: "/features" },
  { title: "Login", url: "/login" },
  { title: "Get Started", url: "/register", highlight: true },
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Menu when token exists (logged in)
  const menuItemsIfTokenExist = [
    { title: "Features", url: "/features" },
    { title: "Dashboard", url: "/dashboard", highlight: true },
  ];

  const handleLogoutClick = () => {
    handleLogout();
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-80 p-0 bg-gradient-to-br from-white to-blue-50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-blue-100 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base">FF</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                    {appName}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-auto p-6">
              <nav className="space-y-3">
                {token ? (
                  <>
                    {menuItemsIfTokenExist.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`block px-5 py-4 rounded-xl transition-all duration-300 font-semibold ${item.highlight
                            ? "bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                            : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md"
                          }`}
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-base">{item.title}</span>
                      </Link>
                      
                    ))}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full text-left px-5 py-4 rounded-xl bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-red-600 hover:shadow-md font-semibold transition-all duration-300  bg-gradient-to-r from-blue-600 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Logout
                    </button>


                  </>
                ) : (
                  <>
                    {menuItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`block px-5 py-4 rounded-xl transition-all duration-300 font-semibold ${item.highlight
                            ? "bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                            : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md"
                          }`}
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-base">{item.title}</span>
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}





// import { useState } from 'react';
// import { Menu, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Link } from 'react-router-dom';
// import handleLogout from '../logOut';

// const menuItems = [
//   { title: "Features", url: "/features" },
//   { title: "Login", url: "/login" },
//   { title: "Get Started", url: "/register", highlight: true }
// ];
// const menuItemsIfTokenExist = [
//   { title: "Features", url: "/features" },
//   { title: "Logout", url: {handleLogout} },
//   { title: "Dashboard", url: "/dashboard", highlight: true }
// ];

// export function HamburgerMenu() {
//   const [open, setOpen] = useState(false);
//   const token = localStorage.getItem("token");


//   return (
//     <div className="md:hidden">
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetTrigger asChild>
//           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//             <Menu className="h-4 w-4" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="right" className="w-80 p-0 bg-gradient-to-br from-white to-blue-50">
//           <div className="flex flex-col h-full">
//             <div className="p-6 border-b border-blue-100 bg-white/50 backdrop-blur-sm">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
//                     <span className="text-white font-bold text-base">FF</span>
//                   </div>
//                   <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">FinFlow</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex-1 overflow-auto p-6">
//               <nav className="space-y-3">
//                 {token ? (
//                   <>{menuItemsIfTokenExist.map((item) => (
//                     <Link
//                       key={item.title}
//                       to={item.url}
//                       className={`block px-5 py-4 rounded-xl transition-all duration-300 font-semibold ${item.highlight
//                           ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
//                           : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md'
//                         }`}
//                       onClick={() => setOpen(false)}
//                     >
//                       <span className="text-base">{item.title}</span>
//                     </Link>
//                   ))}</>
//                 ) : (
//                   <>{menuItems.map((item) => (
//                     <Link
//                       key={item.title}
//                       to={item.url}
//                       className={`block px-5 py-4 rounded-xl transition-all duration-300 font-semibold ${item.highlight
//                           ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
//                           : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md'
//                         }`}
//                       onClick={() => setOpen(false)}
//                     >
//                       <span className="text-base">{item.title}</span>
//                     </Link>
//                   ))}</>
//                 )}

//               </nav>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }
