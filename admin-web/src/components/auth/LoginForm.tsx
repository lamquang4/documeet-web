import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useLogin } from "../../hooks/queries/useAuth";
import Overplay from "../ui/Overplay";
import Loading from "../ui/Loading";
import { getDeviceIMEI } from "../../utils/deviceUtil";
import { loginRules } from "../../utils/validation/rules/loginRules";
import { useFormValidation } from "../../hooks/useFromValidation";
import FieldError from "../ui/FieldError";
import { useNavigate } from "react-router-dom";

type Props = {
  onRequireMfa: () => void;
};

function LoginForm({ onRequireMfa }: Props) {
  const navigate = useNavigate();
  const [data, setData] = useState({ governmentId: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { errors, handleBlur, clearError, validateAll } = useFormValidation(
    data,
    loginRules,
  );

  const login = useLogin({
    onRequireMfa,
    onSuccess: () => navigate("/account/profile", { replace: true }),
  });
  const isLoading = login.isPending;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    clearError(name as keyof typeof data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    const deviceIMEI = await getDeviceIMEI();

    login.mutate({
      governmentId: data.governmentId.trim(),
      password: data.password.trim(),
      deviceIMEI: deviceIMEI,
    });
  };

  return (
    <>
      <div className="w-full px-4 sm:px-8 bg-white">
        <h1 className="relative text-center uppercase mb-6">Đăng nhập</h1>

        <form className="space-y-[15px]" onSubmit={handleSubmit}>
          <div className="space-y-[5px]">
            <Label htmlFor="governmentId" required>
              Số định danh cá nhân
            </Label>

            <Input
              type="text"
              id="governmentId"
              name="governmentId"
              value={data.governmentId}
              onChange={handleChange}
              onBlur={(e) => handleBlur("governmentId", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300"
              placeholder="Nhập số định danh cá nhân"
              error={errors.governmentId}
            />
            <FieldError message={errors.governmentId} />
          </div>

          <div className="space-y-[5px]">
            <Label htmlFor="password" required>
              Mật khẩu
            </Label>

            <div className="relative">
              <Input
                type={!showPassword ? "password" : "text"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                onBlur={(e) => handleBlur("password", e.target.value)}
                placeholder="Nhập mật khẩu"
                className="block w-full px-3 pr-12 py-2 border border-gray-300"
                error={errors.password}
              />

              <Button
                type="button"
                className="absolute hover-scale right-3 top-1/2 -translate-y-1/2 text-neutral"
                onClick={toggleShowPassword}
              >
                {!showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </Button>
            </div>

            <FieldError message={errors.password} />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full hover-scale bg-primary text-white font-semibold rounded-sm px-5 py-2.5 text-center mt-6"
          >
            Đăng nhập
          </Button>
        </form>
      </div>

      {isLoading && (
        <Overplay>
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white">Vui lòng chờ trong giây lát ...</h4>
        </Overplay>
      )}
    </>
  );
}

export default LoginForm;
