import type { RoleResponse } from "../types/type";

export const mockRoles: RoleResponse[] = [
  {
    roleId: "3",
    roleCode: "ADMIN",
    roleName: "Quản trị viên",
  },
  {
    roleId: "1",
    roleCode: "LEADER",
    roleName: "Lãnh đạo",
    description: "Lãnh đạo cấp cao",
  },
  {
    roleId: "2",
    roleCode: "OFFICER",
    roleName: "Cán bộ",
    description: "Người dùng tham gia họp",
  },
];
