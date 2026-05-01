import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserListPage from "./pages/UserListPage";
import UpdateUserPage from "./pages/UpdateUserPage";
import AccountPage from "./pages/AccountPage";
import RoleListPage from "./pages/RoleListPage";
import UpdateRolePage from "./pages/UpdateRolePage";
import CreateRolePage from "./pages/CreateRolePage";
import UnitListPage from "./pages/UnitListPage";
import UpdateUnitPage from "./pages/UpdateUnitPage";
import CreateUnitPage from "./pages/CreateUnitPage";
import DeviceListPage from "./pages/DeviceListPage";
import CreateUserPage from "./pages/CreateUserPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function LayoutRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route
        path="/account/profile"
        element={
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UserListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <PrivateRoute>
            <CreateUserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/edit/:id"
        element={
          <PrivateRoute>
            <UpdateUserPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <RoleListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/roles/create"
        element={
          <PrivateRoute>
            <CreateRolePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/roles/edit/:id"
        element={
          <PrivateRoute>
            <UpdateRolePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/units"
        element={
          <PrivateRoute>
            <UnitListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/units/create"
        element={
          <PrivateRoute>
            <CreateUnitPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/units/edit/:id"
        element={
          <PrivateRoute>
            <UpdateUnitPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/devices"
        element={
          <PrivateRoute>
            <DeviceListPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default LayoutRoute;
