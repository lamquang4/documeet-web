import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useLogin } from "../../hooks/queries/useAuth";
import Overplay from "../ui/Overplay";
import Loading from "../ui/Loading";
import FieldError from "../ui/FieldError";
import { getDeviceData } from "../../utils/deviceUtil";
import { loginSchema, type LoginFormData } from "../../schemas/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
interface Props {
  onRequireMfa: () => void;
}

function LoginForm({ onRequireMfa }: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      governmentId: "",
      password: "",
    },
  });

  const login = useLogin({
    onRequireMfa,
  });
  const isLoading = login.isPending;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormData) => {
    const deviceData = await getDeviceData();

    login.mutate({
      governmentId: data.governmentId.trim(),
      password: data.password.trim(),
      ...deviceData,
    });
  };

  return (
    <>
      <div className="w-full px-[15px] md:px-[30px] bg-white">
        <h1 className="relative text-center uppercase mb-6">Đăng nhập</h1>

        <form className="space-y-[15px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-[5px]">
            <Label htmlFor="governmentId" required>
              Số định danh cá nhân
            </Label>

            <Input
              type="text"
              id="governmentId"
              className="block w-full px-3 py-2 border border-gray-300"
              placeholder="Nhập số định danh cá nhân"
              error={errors.governmentId?.message}
              {...register("governmentId")}
            />
            <FieldError message={errors.governmentId?.message} />
          </div>

          <div className="space-y-[5px]">
            <Label htmlFor="password" required>
              Mật khẩu
            </Label>

            <div className="relative">
              <Input
                type={!showPassword ? "password" : "text"}
                id="password"
                placeholder="Nhập mật khẩu"
                className="block w-full px-3 pr-12 py-2 border border-gray-300"
                error={errors.password?.message}
                {...register("password")}
              />

              <Button
                type="button"
                className="absolute hover-scale right-3 top-1/2 -translate-y-1/2 text-neutral"
                onClick={toggleShowPassword}
              >
                {!showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </Button>
            </div>

            <FieldError message={errors.password?.message} />
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
        <Overplay className="xl:hidden">
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white">Vui lòng chờ trong giây lát ...</h4>
        </Overplay>
      )}
    </>
  );
}

export default LoginForm;
