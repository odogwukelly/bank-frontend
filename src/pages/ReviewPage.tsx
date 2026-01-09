import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Hourglass, Info } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

 const ReviewPage = () => {
    const navigate = useNavigate()
    const duration = "24 hours"
    return <DashboardLayout>
      <Card className="max-w-md mx-auto shadow-lg border border-gray-200 bg-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 dark:border-blue-900/30">
        <CardHeader className="text-center">
          <Hourglass className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse dark:text-blue-400" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-300">
            Transaction Under Review
          </CardTitle>
          <p className="text-gray-500 text-sm sm:text-base mt-2 dark:text-blue-300">
            Your transaction is currently under review and will be processed within{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">{duration}</span>.
          </p>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:bg-blue-950/10 dark:border-blue-900/20">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2 dark:text-blue-400">
              <Info className="h-5 w-5" />
              <span className="font-medium text-sm sm:text-base">Security Check in Progress</span>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed dark:text-blue-300">
              We’re verifying the details of your transfer for compliance and security purposes.
              You’ll receive a notification once it’s completed.
            </p>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 w-full sm:w-auto rounded-lg transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>

  }

export default ReviewPage
