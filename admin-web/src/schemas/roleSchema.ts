import { z } from "zod";

export const roleSchema = z.object({
  roleCode: z.string().trim().min(1, "Mã chức vụ không được để trống"),
  roleName: z.string().trim().min(1, "Tên chức vụ không được để trống"),
  description: z.string().trim().min(1, "Mô tả không được để trống"),
});

export type RoleFormData = z.infer<typeof roleSchema>;
