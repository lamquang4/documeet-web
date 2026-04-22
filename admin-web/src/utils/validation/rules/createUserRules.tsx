import { validateEmail } from "../validateEmail";
import { validateGovernmentId } from "../validateGovermentId";
import { validatePassword } from "../validatePassword";
import { validatePhone } from "../validatePhone";
import { validateSize } from "../validateSize";

export const createUserRules = {
  governmentId: (v: string) => {
    if (!v.trim()) return "Số định danh cá nhân không được để trống";
    if (!validateGovernmentId(v)) return "Số định danh cá nhân không hợp lệ";
    return "";
  },

  fullName: (v: string) => {
    if (!v.trim()) return "Họ tên không được để trống";
    if (!validateSize(v.trim(), 2, 100))
      return "Họ tên phải từ 2 đến 100 ký tự";
    return "";
  },

  email: (v: string) => {
    if (!v.trim()) return "Email không được để trống";
    if (!validateEmail(v)) return "Email không hợp lệ";
    return "";
  },

  phoneNumber: (v: string) => {
    if (!v.trim()) return "Số điện thoại không được để trống";
    if (!validatePhone(v)) return "Số điện thoại không hợp lệ";
    return "";
  },

  unitId: (v: string) => {
    if (!v) return "Đơn vị không được để trống";
    return "";
  },

  roleId: (v: string) => {
    if (!v) return "Chức vụ không được để trống";
    return "";
  },

  passwordHash: (v: string) => {
    if (!v) return "Mật khẩu không được để trống";
    if (!validatePassword(v)) return "Mật khẩu không hợp lệ";
    return "";
  },

  repasswordHash: (v: string, allValues: { passwordHash: string }) => {
    if (!v) return "Mật khẩu nhập lại không được để trống";
    if (v !== allValues.passwordHash) return "Mật khẩu nhập lại không khớp";
    return "";
  },
};
