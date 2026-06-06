import Image from "../ui/Image";
import OtpForm from "./OtpForm";
import LoginForm from "./LoginForm";
import { useState } from "react";
function AuthContainer() {
  const [showOtp, setShowOtp] = useState<boolean>(false);
  return (
    <section className="bg-[#F1F4F9] w-full">
      <div className="flex justify-center items-center h-screen px-[15px]">
        <div className="relative bg-white rounded-lg shadow-md border border-gray-300 max-w-[850px] w-full h-[500px]">
          <div className="h-full grid grid-cols-1 md:grid-cols-2 items-center">
            {showOtp ? (
              <OtpForm />
            ) : (
              <LoginForm onRequireMfa={() => setShowOtp(true)} />
            )}

            <div className="hidden md:block border-l-2 border-gray-200 md:px-2">
              <Image
                src={"/assets/hero1.webp"}
                alt={""}
                className={"w-auto"}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthContainer;
