import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Accounts from './pages/Accounts';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Bills from './pages/Bills';
import Cards from './pages/Cards';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import VerifyOtp from './pages/VerifyOtp';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { Toaster } from "@/components/ui/toaster";
import AccountDetails from './pages/AccountDetails';
import CreateAccount, { CreateAccountByID } from './pages/CreateAccount';
import Settings from './pages/Settings';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CardDetails from './pages/CardDetails';
import ContactSupport from './pages/ContactSupport';
import UserDetails from './pages/AdminUserDetail';
import AdminAccountDetails from './pages/AdminAccountDetails';
import EditProfile from './pages/EditProfile';
import UpdateAccount from './pages/AdminUpdateAccount';
import FAQ from './pages/FAQ';
import TransferSetting from './pages/TransferSetting';
import CreateTransaction from './pages/CreateTransaction';
import UpdateTransaction from './pages/UpdateTransaction';
import AdminSupportView from './pages/AdminSupportView';
import { useAutoLogout } from './hooks/useAutoLogOut';
import ScrollToTop from './ScrollTop';
import TransferBankToBank from './pages/TransferBankToBank';
import InternationalTransfer from './pages/InternationalTransfer';
import SavingsAccount from './pages/SavingsAccount';
import BusinessAccount from './pages/BusinessAccount';
import CheckingAccount from './pages/CheckingAccount';
import CreditAccountPage from './pages/CreditAccount';
import BillsAndUtilities from './pages/BillsAndUtils';
import RecurringPayments from './pages/ReoccuringPayment';
import CardRequest from './pages/CardRequest';
import CardLimit from './pages/CardLimit';
import ApplyLoan from './pages/ApplyLoan';
import LoanStatus from './pages/LoanStatus';
import LoanRepayment from './pages/LoanRepayment';
import ReviewPage from './pages/ReviewPage';
import TawkToChat from './components/tawk';
import AdminReplyEmail from './pages/AdminReplyEmail';

 

function App() {
  useAutoLogout();
  return (
    
    <Router>
      <ScrollToTop />
      <TawkToChat />
      <Routes>

        {/* User Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {/* User Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/account-details/:account_id" element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
        <Route path="/create-account" element={<ProtectedRoute><CreateAccount /></ProtectedRoute>} />
        <Route path="/create-account/:user_id" element={<ProtectedRoute><CreateAccountByID /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
        <Route path="/loan-repayment" element={<ProtectedRoute><LoanRepayment /></ProtectedRoute>} />
        <Route path="/loan-status" element={<ProtectedRoute><LoanStatus /></ProtectedRoute>} />
        <Route path="/apply-loan" element={<ProtectedRoute><ApplyLoan /></ProtectedRoute>} />
        <Route path="/card-limit" element={<ProtectedRoute><CardLimit /></ProtectedRoute>} />
        <Route path="/card-details/:card_id" element={<ProtectedRoute><CardDetails /></ProtectedRoute>} />
        <Route path="/card-request" element={<ProtectedRoute><CardRequest /></ProtectedRoute>} />
        <Route path="/manage-cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
        <Route path="/recurring-payments" element={<ProtectedRoute><RecurringPayments /></ProtectedRoute>} />
        <Route path="/bills-and-utilities" element={<ProtectedRoute><BillsAndUtilities /></ProtectedRoute>} />
        <Route path="/credit-account" element={<ProtectedRoute><CreditAccountPage /></ProtectedRoute>} />
        <Route path="/account-checking" element={<ProtectedRoute><CheckingAccount /></ProtectedRoute>} />
        <Route path="/business-account" element={<ProtectedRoute><BusinessAccount /></ProtectedRoute>} />
        <Route path="/account-savings" element={<ProtectedRoute><SavingsAccount /></ProtectedRoute>} />
        <Route path="/transfer-international" element={<ProtectedRoute><InternationalTransfer /></ProtectedRoute>} />
        <Route path="/transfer-bank-to-bank" element={<ProtectedRoute><TransferBankToBank /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Protected Routes */}
        <Route path="/reply-email" element={<AdminProtectedRoute><AdminReplyEmail /></AdminProtectedRoute>} />
        <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
        <Route path="/admin-support-view/:user_id" element={<AdminProtectedRoute><AdminSupportView /></AdminProtectedRoute>} />
        <Route path="/create-transaction/:user_id" element={<AdminProtectedRoute><CreateTransaction /></AdminProtectedRoute>} />
        <Route path="/edit-transaction/:transaction_id/:user_id" element={<AdminProtectedRoute><UpdateTransaction /></AdminProtectedRoute>} />
        <Route path="/admin-transfer-settings/:user_id" element={<AdminProtectedRoute><TransferSetting /></AdminProtectedRoute>} />
        <Route path="/admin-edit-user/:user_id" element={<AdminProtectedRoute><EditProfile /></AdminProtectedRoute>} />
        <Route path="/admin-user-details/:user_id" element={<AdminProtectedRoute><UserDetails /></AdminProtectedRoute>} />
        <Route path="/admin-update-account/:account_id/:user_id" element={<AdminProtectedRoute><UpdateAccount /></AdminProtectedRoute>} />
        <Route path="/admin-account-details/:account_id/:user_id" element={<AdminProtectedRoute><AdminAccountDetails /></AdminProtectedRoute>} />

      </Routes>
      {/* Global toast renderer */}
      <Toaster />
    </Router>
  );
}

export default App;
