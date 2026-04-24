import { validateGovernmentId } from "../validateGovermentId";

export const loginRules = {
  governmentId: (v: string) => {
    if (!v.trim()) return "Số định danh cá nhân không được để trống";
    if (!validateGovernmentId(v)) return "Số định danh cá nhân không hợp lệ";
    return "";
  },

  password: (v: string) => {
    if (!v.trim()) return "Mật khẩu không được để trống";
    return "";
  },
};
