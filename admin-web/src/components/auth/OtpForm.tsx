import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import Overplay from "../ui/Overplay";
import { useVerifyOtp } from "../../hooks/queries/useOtp";
import { cookieUtil } from "../../utils/cookieUtil";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import {
  validateOtp,
  validateOtpDigit,
} from "../../utils/validation/validationOtp";

const OTP_LENGTH = 6;
const OTP_EXPIRE_SECONDS = 5 * 60; // 5 phút

function OtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRE_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtp = useVerifyOtp();
  const isLoading = verifyOtp.isPending;

  // Đếm ngược
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!validateOtpDigit(value)) return; // chỉ nhận số

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // chỉ lấy 1 ký tự
    setOtp(newOtp);

    // Tự động focus ô tiếp theo
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!validateOtp(pasted, OTP_LENGTH)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);

    inputRefs.current[OTP_LENGTH - 1]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (!validateOtp(otpValue, OTP_LENGTH)) {
      toast.error("OTP không hợp lệ");
      return;
    }

    verifyOtp.mutate({
      mfaToken: cookieUtil.get("mfaToken") ?? "",
      otp: otpValue,
    });
  };

  return (
    <>
      <div className="w-full px-4 sm:px-8 bg-white space-y-4">
        <h1 className="relative text-center uppercase">Xác thực OTP</h1>

        <p className="text-center text-neutral">
          Vui lòng nhập mã OTP vừa gửi đến email
        </p>

        <form className="space-y-[20px]" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-[10px]">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={otp[index]}
                required
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-[50px] h-[50px] text-center text-[0.95rem] font-semibold border rounded-md outline-none transition-colors
                          ${digit ? "border-success text-success" : "border-gray-300"}
                          focus:border-success`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                toast("OTP đã gửi");
              }}
              disabled={timeLeft > 0}
              className={` text-[0.9rem] font-medium ${timeLeft <= 0 ? "text-success" : "text-neutral"}`}
            >
              Gửi lại mã
            </Button>

            {timeLeft > 0 ? (
              <span className="text-neutral">
                Mã sẽ hết hạn trong{" "}
                <span className="text-danger font-medium">
                  {formatTime(timeLeft)}
                </span>
              </span>
            ) : (
              <span className="text-danger font-medium">Mã OTP đã hết hạn</span>
            )}
          </div>

          <Button
            disabled={
              isLoading ||
              !validateOtp(otp.join(""), OTP_LENGTH) ||
              timeLeft <= 0
            }
            type="submit"
            className="w-full bg-success text-[0.9rem] text-white focus:outline-none font-semibold rounded-sm px-5 py-2.5 text-center"
          >
            Xác nhận
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

export default OtpForm;
