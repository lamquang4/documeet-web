import { useState } from "react";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useLogin } from "../../hooks/queries/useAuth";
import toast from "react-hot-toast";
import Overplay from "../ui/Overplay";
import Loading from "../ui/Loading";
import { getDeviceId } from "../../utils/deviceUtil";
type Props = {
  onRequireMfa: () => void;
};

function LoginForm({ onRequireMfa }: Props) {
  const [data, setData] = useState({ governmentId: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const login = useLogin({ onRequireMfa });
  const isLoading = login.isPending;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.governmentId.trim()) {
      toast.error("Số định danh cá nhân không được để trống");
      return;
    }

    if (!data.password.trim()) {
      toast.error("Mật khẩu không được để trống");
      return;
    }

    const deviceIMEI = await getDeviceId();

    login.mutate(
      {
        governmentId: data.governmentId.trim(),
        password: data.password.trim(),
        deviceId: deviceIMEI,
      },
      {
        onSuccess: () => {
          setData({
            governmentId: "",
            password: "",
          });
        },
      },
    );
  };

  return (
    <>
      <div className="w-full px-4 sm:px-8 bg-white">
        <h1 className="relative text-center uppercase mb-6">Đăng nhập</h1>

        <form className="space-y-[15px]" onSubmit={handleSubmit}>
          <div className="space-y-[5px]">
            <Label htmlFor="" className="block text-[0.9rem] font-medium">
              Số định danh cá nhân
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="governmentId"
              value={data.governmentId}
              onChange={handleChange}
              className="text-[0.9rem] block w-full px-3 py-2 outline-none border border-gray-300"
              placeholder="Nhập số định danh cá nhân"
              required
            />
          </div>

          <div className="space-y-[5px]">
            <Label htmlFor="" className="block text-[0.9rem] font-medium">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Input
                type={!showPassword ? "password" : "text"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="text-[0.9rem] block w-full px-3 pr-12 py-2 outline-none border border-gray-300"
                required
              />

              <Button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={toggleShowPassword}
              >
                {!showPassword ? (
                  <HiOutlineEye size={22} />
                ) : (
                  <HiOutlineEyeOff size={22} />
                )}
              </Button>
            </div>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-[0.9rem] text-white focus:outline-none font-semibold rounded-sm px-5 py-2.5 text-center mt-6"
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
