import { memo } from "react";
import Image from "../../ui/Image";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import { useLogout } from "../../../hooks/queries/useAuth";
import { CircleUserRound, DoorOpen } from "lucide-react";
import { useGetMe } from "../../../hooks/queries/useUsers";

interface Props {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

function ProfileMenu({ menuOpen, onToggleMenu }: Props) {
  const { data: accountRes } = useGetMe();
  const account = accountRes?.data;

  const logout = useLogout();
  const isLoading = logout.isPending;
  return (
    <>
      {account && (
        <div
          className="relative"
          onMouseOver={onToggleMenu}
          onMouseOut={onToggleMenu}
        >
          <div className="flex cursor-pointer items-center gap-2">
            <div className="w-[34px] h-[34px] p-1 rounded-full border border-gray-300 overflow-hidden">
              <Image
                src="/assets/user.png"
                alt=""
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <p className="font-medium">{account.fullName}</p>
          </div>

          {menuOpen && (
            <div
              className={`absolute top-full right-0 max-w z-20 bg-white shadow-md rounded-md border border-gray-200 transition-all duration-100 origin-top`}
            >
              <p className="border-b p-3 border-gray-300 max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium">
                Xin chào, {account.fullName}
              </p>

              <Link
                to={"/account/profile"}
                className="block hover:bg-gray-100 p-3 whitespace-nowrap"
              >
                <div className="flex items-center gap-2 font-medium">
                  <CircleUserRound size={18} />
                  <p>Tài khoản</p>
                </div>
              </Link>

              <Button
                onClick={() => logout.mutate()}
                disabled={isLoading}
                className="w-full hover:bg-gray-100 p-3 text-danger whitespace-nowrap"
              >
                <div className="flex items-center gap-2 font-medium">
                  <DoorOpen size={18} />
                  <p>Thoát</p>
                </div>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default memo(ProfileMenu);
