import { z } from "zod";

export const createUnitSchema = z.object({
  unitCode: z.string().trim().min(1, "Mã đơn vị không được để trống"),
  unitName: z.string().trim().min(1, "Tên đơn vị không được để trống"),
  userIds: z.array(z.string()),
});

export type CreateUnitData = z.infer<typeof createUnitSchema>;
