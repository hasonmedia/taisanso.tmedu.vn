import Login from "../src/pages/auth/Login";
import ForgotPassword from "../src/pages/auth/ForgotPassword";
import ResetPassword from "../src/pages/auth/ResetPassword";
import SimpleResetPassword from "../src/pages/auth/SimpleResetPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./context/ProtectedRoute.jsx";
import RootLayout from "../src/components/root/RootLayout"
// Employee
import EmployeeLayout from "../src/components/user/EmployeeLayout";
import Home from "./pages/employee/Home";
import UserGuide from "./pages/admin/UserGuide";
// Manager
import ManagerLayout from "../src/components/manager/ManagerLayout";
import DashboardManager from "./pages/manager/DashboardManager";
import MyAsset from "../src/pages/manager/MyAsset";
import RequestAsset from "../src/pages/manager/RequestAsset";
import AssignAsset from "../src/pages/manager/AssignAsset";

// Admin
import Profile from "./components/Profile";
import AdminLayout from "../src/components/admin/AdminLayout"
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AssetManager from "../src/pages/admin/AssetManager";
import UserManager from "../src/pages/admin/QuanLyTaiKhoan/TaiKhoan";
import AssetCategoryManagement from "../src/pages/admin/BrandManagement";

import ApproveRequest from "../src/pages/admin/ApproveRequests";
import ActivityHistory from "../src/pages/admin/ActivityHistory";
import ExpiryNotification from "../src/pages/admin/ExpiryNotification";
import ReportStats from "../src/pages/admin/ReportStats";
import PersonalLog from "../src/pages/admin/PersonalLog";
import AssetLoginInfo from "../src/pages/admin/AssetLoginInfo";
import DepartmentManager from "./pages/admin/DepartmentManager";
import AssetList from "./pages/admin/AssetList";
import AssetExpiryWarning from "./pages/admin/AssetExpiryWarning";
import SSOCallback from "./pages/auth/SSOCallback";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/simple-reset" element={<SimpleResetPassword />} />
      <Route path="/" element={<Login />} />
      <Route path="/api/sso/callback" element={<SSOCallback />} />
      <Route
        path="/user-guide"
        element={
          <ProtectedRoute allowedRoles={1}>
            <RootLayout>
              <UserGuide />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={[0, 1]}>
            <AdminLayout>
              <Profile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/profile"
        element={
          <ProtectedRoute allowedRoles={2}>
            <ManagerLayout>
              <Profile />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={3}>
            <EmployeeLayout>
              <Profile />
            </EmployeeLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/root/dashboard"
        element={
          <ProtectedRoute allowedRoles={0}>
            <RootLayout>
              <DashboardAdmin />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <DashboardAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/quan-ly-tai-san"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <AssetManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/quan-ly-nguoi-dung"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <UserManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/quan-ly-danh-muc-tai-san"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <AssetCategoryManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/quan-ly-danh-muc-tai-san/:idDanhMucTaiSan"
        element={
          <ProtectedRoute allowedRoles={[0, 1]}>
            <AdminLayout>
              <AssetList />
            </AdminLayout>
          </ProtectedRoute>} />


      <Route
        path="/dashboard/quan-ly-phong-ban"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <DepartmentManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/phe-duyet-yeu-cau"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <ApproveRequest />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/lich-su-hoat-dong"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <ActivityHistory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/thong-bao-het-han"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <ExpiryNotification />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tai-san-sap-het-han"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <AssetExpiryWarning />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/cap-tai-san-truc-tiep"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <ReportStats />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/nhat-ky-ca-nhan"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <PersonalLog />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/thong-tin-dang-nhap-tai-san"
        element={
          <ProtectedRoute allowedRoles={1}>
            <AdminLayout>
              <AssetLoginInfo />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard_manager"
        element={
          <ProtectedRoute allowedRoles={2}>
            <ManagerLayout>
              <DashboardManager />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-asset"
        element={
          <ProtectedRoute allowedRoles={2}>
            <ManagerLayout>
              <RequestAsset />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset-manager"
        element={
          <ProtectedRoute allowedRoles={2}>
            <ManagerLayout>
              <MyAsset />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assign-asset"
        element={
          <ProtectedRoute allowedRoles={2}>
            <ManagerLayout>
              <AssignAsset />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={3}>
            <EmployeeLayout>
              <Home />
            </EmployeeLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
