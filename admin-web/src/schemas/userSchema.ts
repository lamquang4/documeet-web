import { z } from "zod";
import {
  validateGovernmentId,
  validatePassword,
  validatePhone,
} from "../utils/validators";

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

export const updateUserSchema = z.object({
  governmentId: z
    .string()
    .trim()
    .min(1, "Số định danh cá nhân không được để trống")
    .refine(validateGovernmentId, "Số định danh phải gồm đúng 12 chữ số"),
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
  status: z
    .string()
    .min(1, "Tình trạng không được để trống")
    .refine((v) => ["ACTIVE", "LOCKED", "DISABLED"].includes(v), {
      message: "Tình trạng không hợp lệ",
    }),
  passwordHash: z
    .string()
    .optional()
    .refine(
      (v) => !v || validatePassword(v),
      "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt",
    ),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
