import type { UnitResponse } from "../types/type";

export const mockUnits: UnitResponse[] = [
  {
    unitId: "unit-001",
    unitCode: "BO_CA",
    unitName: "Bộ Công An",
    level: 1,
    status: "ACTIVE",
  },
  {
    unitId: "unit-002",
    parent: {
      parentId: "unit-001",
      parentName: "Bộ Công An",
    },
    unitCode: "C_CNTT",
    unitName: "Cục Công nghệ thông tin",
    level: 2,
    status: "ACTIVE",
  },
  {
    unitId: "unit-003",
    parent: {
      parentId: "unit-002",
      parentName: "Cục Công nghệ thông tin",
    },
    unitCode: "P_HTKT",
    unitName: "Phòng Hạ tầng kỹ thuật",
    level: 3,
    status: "INACTIVE",
  },
];
