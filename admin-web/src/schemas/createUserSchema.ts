import { z } from "zod";
import { validateGovernmentId } from "../utils/validation/validateGovermentId";
import { validatePhone } from "../utils/validation/validatePhone";
import { validatePassword } from "../utils/validation/validatePassword";

export const createUserSchema = z
  .object({
    governmentId: z
      .string()
      .trim()
      .min(1, "Số định danh cá nhân không được để trống")
      .refine(validateGovernmentId, "Số định danh cá nhân không hợp lệ"),
    fullName: z
      .string()
      .trim()
      .min(1, "Họ tên không được để trống")
      .min(2, "Họ tên phải từ 2 đến 100 ký tự")
      .max(100, "Họ tên phải từ 2 đến 100 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Số điện thoại không được để trống")
      .refine(validatePhone, "Số điện thoại không hợp lệ"),
    unitId: z.string().trim().min(1, "Đơn vị không được để trống"),
    roleId: z.string().trim().min(1, "Chức vụ không được để trống"),
    passwordHash: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .refine(validatePassword, "Mật khẩu không hợp lệ"),
    repasswordHash: z.string().min(1, "Mật khẩu nhập lại không được để trống"),
  })
  .refine((data) => data.passwordHash === data.repasswordHash, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["repasswordHash"],
  });

export type CreateUserData = z.infer<typeof createUserSchema>;
