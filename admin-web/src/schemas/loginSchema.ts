import { z } from "zod";
import { validateGovernmentId } from "../utils/validation/validateGovermentId";

export const loginSchema = z.object({
  governmentId: z
    .string()
    .trim()
    .min(1, "Số định danh cá nhân không được để trống")
    .refine(validateGovernmentId, "Số định danh cá nhân không hợp lệ"),
  password: z.string().trim().min(1, "Mật khẩu không được để trống"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
