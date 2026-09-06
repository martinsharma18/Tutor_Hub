import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "./store/authSlice";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TeachersPage from "./pages/TeachersPage";
import VacanciesPage from "./pages/VacanciesPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterTeacherPage from "./pages/auth/RegisterTeacherPage";
import RegisterParentPage from "./pages/auth/RegisterParentPage";
import RegisterChoicePage from "./pages/auth/RegisterChoicePage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";
import CookiePolicyPage from "./pages/legal/CookiePolicyPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import RealtimeProvider from "./components/RealtimeProvider";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ParentDashboardPage from "./pages/parent/ParentDashboardPage";
import ParentCreatePostPage from "./pages/parent/ParentCreatePostPage";
import ParentPostsPage from "./pages/parent/ParentPostsPage";
import ParentApplicationsPage from "./pages/parent/ParentApplicationsPage";
import ParentDemoRequestsPage from "./pages/parent/ParentDemoRequestsPage";
import ParentPaymentsPage from "./pages/parent/ParentPaymentsPage";
import ParentMessagesPage from "./pages/parent/ParentMessagesPage";
import ParentTuitionsPage from "./pages/parent/ParentTuitionsPage";
import ParentInvoicesPage from "./pages/parent/ParentInvoicesPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
import TeacherApplicationsPage from "./pages/teacher/TeacherApplicationsPage";
import TeacherDemoRequestsPage from "./pages/teacher/TeacherDemoRequestsPage";
import TeacherPaymentsPage from "./pages/teacher/TeacherPaymentsPage";
import TeacherMessagesPage from "./pages/teacher/TeacherMessagesPage";
import TeacherAssignmentsPage from "./pages/teacher/TeacherAssignmentsPage";
import TeacherEarningsPage from "./pages/teacher/TeacherEarningsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import TeacherApprovalPage from "./pages/admin/TeacherApprovalPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import AdminCreatePostPage from "./pages/admin/AdminCreatePostPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminTeacherDetailsPage from "./pages/admin/AdminTeacherDetailsPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminAuditLogPage from "./pages/admin/AdminAuditLogPage";
import AdminLookupsPage from "./pages/admin/AdminLookupsPage";
import AdminInboxPage from "./pages/admin/AdminInboxPage";
import AdminPlacementsPage from "./pages/admin/AdminPlacementsPage";
import AdminInvoicesPage from "./pages/admin/AdminInvoicesPage";

const App = () => {
  const dispatch = useAppDispatch();

  // Initialize auth state from localStorage on app mount
  // This ensures persisted auth state is loaded immediately
  useEffect(() => {
    try {
      dispatch(initializeAuth());
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  }, [dispatch]);

  return (
    <RealtimeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterChoicePage />} />
        <Route path="/register/teacher" element={<RegisterTeacherPage />} />
        <Route path="/register/parent" element={<RegisterParentPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Available to every signed-in role — data export and account deletion. */}
            <Route path="/account" element={<AccountSettingsPage />} />

            <Route
              path="/teacher"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherDashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/profile"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherProfilePage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/applications"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherApplicationsPage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/demo"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherDemoRequestsPage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/payments"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherPaymentsPage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/messages"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherMessagesPage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/assignments"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherAssignmentsPage /></ProtectedRoute>}
            />
            <Route
              path="/teacher/earnings"
              element={<ProtectedRoute roles={["Teacher"]}><TeacherEarningsPage /></ProtectedRoute>}
            />

            <Route
              path="/parent"
              element={<ProtectedRoute roles={["Parent"]}><ParentDashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/create-post"
              element={<ProtectedRoute roles={["Parent"]}><ParentCreatePostPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/posts"
              element={<ProtectedRoute roles={["Parent"]}><ParentPostsPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/posts/:postId/applications"
              element={<ProtectedRoute roles={["Parent"]}><ParentApplicationsPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/demo"
              element={<ProtectedRoute roles={["Parent"]}><ParentDemoRequestsPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/payments"
              element={<ProtectedRoute roles={["Parent"]}><ParentPaymentsPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/messages"
              element={<ProtectedRoute roles={["Parent"]}><ParentMessagesPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/tuitions"
              element={<ProtectedRoute roles={["Parent"]}><ParentTuitionsPage /></ProtectedRoute>}
            />
            <Route
              path="/parent/invoices"
              element={<ProtectedRoute roles={["Parent"]}><ParentInvoicesPage /></ProtectedRoute>}
            />

            <Route
              path="/admin"
              element={<ProtectedRoute roles={["Admin"]}><AdminDashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/create-post"
              element={<ProtectedRoute roles={["Admin"]}><AdminCreatePostPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/posts"
              element={<ProtectedRoute roles={["Admin"]}><AdminPostsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/settings"
              element={<ProtectedRoute roles={["Admin"]}><AdminSettingsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute roles={["Admin"]}><UserManagementPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/teachers"
              element={<ProtectedRoute roles={["Admin"]}><TeacherApprovalPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/teachers/:id"
              element={<ProtectedRoute roles={["Admin"]}><AdminTeacherDetailsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/analytics"
              element={<ProtectedRoute roles={["Admin"]}><AnalyticsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/applications"
              element={<ProtectedRoute roles={["Admin"]}><AdminApplicationsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/audit-log"
              element={<ProtectedRoute roles={["Admin"]}><AdminAuditLogPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/lookups"
              element={<ProtectedRoute roles={["Admin"]}><AdminLookupsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/inbox"
              element={<ProtectedRoute roles={["Admin"]}><AdminInboxPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/placements"
              element={<ProtectedRoute roles={["Admin"]}><AdminPlacementsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/invoices"
              element={<ProtectedRoute roles={["Admin"]}><AdminInvoicesPage /></ProtectedRoute>}
            />
          </Route>
        </Route>

      </Routes>
      <Toaster position="top-right" />
    </RealtimeProvider>
  );
};

export default App;
