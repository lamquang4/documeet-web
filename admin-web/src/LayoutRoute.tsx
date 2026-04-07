import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserListPage from "./pages/UserListPage";
import EditUserPage from "./pages/EditUserPage";
import AccountPage from "./pages/AccountPage";
import RoleListPage from "./pages/RoleListPage";
import EditRolePage from "./pages/EditRolePage";
import AddRolePage from "./pages/AddRolePage";
import UnitListPage from "./pages/UnitListPage";
import EditUnitPage from "./pages/EditUnitPage";
import AddUnitPage from "./pages/AddUnitPage";
import DeviceListPage from "./pages/DeviceListPage";
import AddUserPage from "./pages/AddUserPage";

function LayoutRoute() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/account/profile" element={<AccountPage />} />

      <Route path="/user/add-user" element={<AddUserPage />} />
      <Route path="/users" element={<UserListPage />} />
      <Route path="/user/edit-user/:id" element={<EditUserPage />} />

      <Route path="/roles" element={<RoleListPage />} />
      <Route path="/role/add-role" element={<AddRolePage />} />
      <Route path="/role/edit-role/:id" element={<EditRolePage />} />

      <Route path="/units" element={<UnitListPage />} />
      <Route path="/unit/add-unit" element={<AddUnitPage />} />
      <Route path="/unit/edit-unit/:id" element={<EditUnitPage />} />

      <Route path="/devices" element={<DeviceListPage />} />
    </Routes>
  );
}

export default LayoutRoute;
