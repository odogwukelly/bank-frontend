
// import { Card, CardContent } from '@/components/ui/card';
// import { LucideIcon } from 'lucide-react';

// interface StatCardProps {
//   title: string;
//   value: string;
//   change?: string;
//   changeType?: 'positive' | 'negative' | 'neutral';
//   icon: LucideIcon;
//   iconColor?: string;
//   className?: string; 
// }

// export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-blue-600' }: StatCardProps) {
//   const getChangeColor = () => {
//     switch (changeType) {
//       case 'positive':
//         return 'text-green-600';
//       case 'negative':
//         return 'text-red-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   return (
//     <Card className="hover:shadow-lg transition-shadow duration-300">
//       <CardContent className="p-4 sm:p-6">
//         <div className="flex items-center justify-between">
//           <div className="min-w-0 flex-1">
//             <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
//             <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
//             {change && (
//               <p className={`text-xs sm:text-sm mt-1 ${getChangeColor()} truncate`}>
//                 {change}
//               </p>
//             )}
//           </div>
//           <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 ml-3`}>
//             <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { Card } from "@/components/ui/card";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  changeType,
  icon: Icon,
  iconColor,
  className,
}: StatCardProps) {
  const changeTextColor =
    changeType === "positive"
      ? "text-green-500"
      : changeType === "negative"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <Card
      className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl transition-all duration-500 border border-transparent dark:border-blue-900/40 shadow-md hover:shadow-xl dark:hover:shadow-blue-800/40 ${className}`}
    >
      {/* Light glow animation */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-blue-300">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-blue-100 mt-1">
            {value}
          </h3>
          <p className={`text-xs mt-1 ${changeTextColor}`}>
            {changeType === "positive"
              ? "↑ Increased"
              : changeType === "negative"
              ? "↓ Decreased"
              : ""}
          </p>
        </div>

        <div
          className={`${iconColor} bg-gray-100 dark:bg-blue-950/40 p-3 rounded-full shadow-inner transform transition-transform duration-500 hover:scale-110`}
        >
          <Icon className="h-5 w-5 icon-pulse" />
        </div>
      </div>
    </Card>
  );
}
