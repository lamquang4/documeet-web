export const roleRules = {
  roleCode: (v: string) => {
    if (!v.trim()) return "Mã chức vụ không được để trống";
    return "";
  },
  roleName: (v: string) => {
    if (!v.trim()) return "Tên chức vụ không được để trống";
    return "";
  },
  description: (v: string) => {
    if (!v.trim()) return "Mô tả không được để trống";
    return "";
  },
};
