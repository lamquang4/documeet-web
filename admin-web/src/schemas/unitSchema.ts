// schemas/unitSchema.ts
import { z } from "zod";

export const createUnitSchema = z.object({
  unitCode: z.string().trim().min(1, "Mã đơn vị không được để trống"),
  unitName: z.string().trim().min(1, "Tên đơn vị không được để trống"),
  userIds: z.array(z.string()),
});

export type CreateUnitData = z.infer<typeof createUnitSchema>;

export const updateUnitSchema = z.object({
  unitCode: z.string().trim().min(1, "Mã đơn vị không được để trống"),
  unitName: z.string().trim().min(1, "Tên đơn vị không được để trống"),
  status: z
    .string()
    .min(1, "Tình trạng đơn vị không được để trống")
    .refine((v) => ["ACTIVE", "INACTIVE"].includes(v), {
      message: "Tình trạng không hợp lệ",
    }),
  userIds: z.array(z.string()),
});

export type UpdateUnitData = z.infer<typeof updateUnitSchema>;
