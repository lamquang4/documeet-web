export const loginRules = {
  governmentId: (v: string) => {
    if (!v.trim()) return "Số định danh cá nhân không được để trống";
    return "";
  },

  password: (v: string) => {
    if (!v.trim()) return "Mật khẩu không được để trống";
    return "";
  },
};
