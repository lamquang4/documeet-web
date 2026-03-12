import type { RoleResponse } from "../types/type";

export const mockRoles: RoleResponse[] = [
  {
    roleId: "3",
    roleCode: "ADMIN",
    roleName: "Quản trị viên",
    maxSecurityLevel: 3,
  },
  {
    roleId: "1",
    roleCode: "LEADER",
    roleName: "Lãnh đạo",
    maxSecurityLevel: 2,
    description: "Lãnh đạo cấp cao",
  },
  {
    roleId: "2",
    roleCode: "OFFICER",
    roleName: "Cán bộ",
    maxSecurityLevel: 1,
    description: "Người dùng tham gia họp",
  },
];
