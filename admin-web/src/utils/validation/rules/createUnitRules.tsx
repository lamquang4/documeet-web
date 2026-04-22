export const createUnitRules = {
  unitCode: (v: string) => {
    if (!v.trim()) return "Mã đơn vị không được để trống";
    return "";
  },

  unitName: (v: string) => {
    if (!v.trim()) return "Tên đơn vị không được để trống";
    return "";
  },
};
