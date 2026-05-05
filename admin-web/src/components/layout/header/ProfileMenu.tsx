import { memo } from "react";
import Image from "../../ui/Image";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import { useLogout } from "../../../hooks/queries/useAuth";
import { CircleUserRound, DoorOpen } from "lucide-react";
import { useGetMe } from "../../../hooks/queries/useUsers";

type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

function ProfileMenu({ menuOpen, onToggleMenu }: Props) {
  const { data: accountRes } = useGetMe();
  const account = accountRes?.data;

  const logout = useLogout();
  const isLoading = logout.isPending;
  return (
    <>
      {account && (
        <div
          className="text-[0.9rem] relative group font-medium"
          onMouseOver={onToggleMenu}
          onMouseOut={onToggleMenu}
        >
          <div className="flex cursor-pointer items-center gap-[6px]">
            <div className="w-[30px] rounded-full border border-gray-300 p-1">
              <Image
                source={"/assets/owner.png"}
                alt={""}
                className="w-full"
                loading="eager"
              />
            </div>
            <p>{account.fullName}</p>
          </div>

          {menuOpen && (
            <div
              className={`absolute top-full right-0 w-[185px] z-20 bg-white shadow-md rounded-md border border-gray-200 transition-all duration-100 origin-top`}
            >
              <p className="border-b p-2.5 border-gray-300 max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
                Xin chào, {account.fullName}
              </p>

              <Link
                to={"/account/profile"}
                className="block hover:bg-gray-100 px-3 py-3.5"
              >
                <div className="flex items-center gap-[8px]">
                  <CircleUserRound size={18} />
                  <p>Tài khoản</p>
                </div>
              </Link>

              <Button
                onClick={() => logout.mutate()}
                disabled={isLoading}
                className="w-full block hover:bg-gray-100 px-3 py-3.5 text-danger"
              >
                <div className="flex items-center gap-[8px] font-normal">
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
