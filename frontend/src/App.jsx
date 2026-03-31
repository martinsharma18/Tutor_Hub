import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "./store/authSlice";
import LandingPage from "./pages/LandingPage";
import TeachersPage from "./pages/TeachersPage";
import VacanciesPage from "./pages/VacanciesPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterTeacherPage from "./pages/auth/RegisterTeacherPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
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
import AdminCreatePostPage from "./pages/admin/AdminCreatePostPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminTeacherDetailsPage from "./pages/admin/AdminTeacherDetailsPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";

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
      <Route path="/register/teacher" element={<RegisterTeacherPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
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
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
