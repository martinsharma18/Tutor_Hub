import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "./store/authSlice";
import LandingPage from "./pages/LandingPage";
import TeachersPage from "./pages/TeachersPage";
import VacanciesPage from "./pages/VacanciesPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterParentPage from "./pages/auth/RegisterParentPage";
import RegisterTeacherPage from "./pages/auth/RegisterTeacherPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ParentDashboardPage from "./pages/parent/ParentDashboardPage";
import CreatePostPage from "./pages/parent/CreatePostPage";
import ParentPostsPage from "./pages/parent/ParentPostsPage";
import ParentApplicationsPage from "./pages/parent/ParentApplicationsPage";
import ParentDemoRequestsPage from "./pages/parent/ParentDemoRequestsPage";
import ParentSearchPage from "./pages/parent/ParentSearchPage";
import ParentMessagesPage from "./pages/parent/ParentMessagesPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import TeacherApplicationsPage from "./pages/teacher/TeacherApplicationsPage";
import TeacherDemoRequestsPage from "./pages/teacher/TeacherDemoRequestsPage";
import TeacherPaymentsPage from "./pages/teacher/TeacherPaymentsPage";
import TeacherMessagesPage from "./pages/teacher/TeacherMessagesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import PendingPostsPage from "./pages/admin/PendingPostsPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import TeacherApprovalPage from "./pages/admin/TeacherApprovalPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/teachers" element={<TeachersPage />} />
      <Route path="/vacancies" element={<VacanciesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/parent" element={<RegisterParentPage />} />
      <Route path="/register/teacher" element={<RegisterTeacherPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/parent"
            element={<ProtectedRoute roles={["Parent"]}><ParentDashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/parent/create-post"
            element={<ProtectedRoute roles={["Parent"]}><CreatePostPage /></ProtectedRoute>}
          />
          <Route
            path="/parent/posts"
            element={<ProtectedRoute roles={["Parent"]}><ParentPostsPage /></ProtectedRoute>}
          />
          <Route
            path="/parent/applications"
            element={<ProtectedRoute roles={["Parent"]}><ParentApplicationsPage /></ProtectedRoute>}
          />
          <Route
            path="/parent/demo"
            element={<ProtectedRoute roles={["Parent"]}><ParentDemoRequestsPage /></ProtectedRoute>}
          />
          <Route
            path="/parent/search"
            element={<ProtectedRoute roles={["Parent"]}><ParentSearchPage /></ProtectedRoute>}
          />
          <Route
            path="/parent/messages"
            element={<ProtectedRoute roles={["Parent"]}><ParentMessagesPage /></ProtectedRoute>}
          />

          <Route
            path="/teacher"
            element={<ProtectedRoute roles={["Teacher"]}><TeacherDashboardPage /></ProtectedRoute>}
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
            path="/admin"
            element={<ProtectedRoute roles={["Admin"]}><AdminDashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/settings"
            element={<ProtectedRoute roles={["Admin"]}><AdminSettingsPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/pending-posts"
            element={<ProtectedRoute roles={["Admin"]}><PendingPostsPage /></ProtectedRoute>}
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
            path="/admin/analytics"
            element={<ProtectedRoute roles={["Admin"]}><AnalyticsPage /></ProtectedRoute>}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

