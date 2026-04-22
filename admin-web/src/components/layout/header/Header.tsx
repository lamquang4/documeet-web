import ProfileMenu from "./ProfileMenu";
import { useCallback, useState } from "react";
import Button from "../../ui/Button";
import { Maximize, Menu } from "lucide-react";

type Props = {
  onToggleMenu: () => void;
};

function Header({ onToggleMenu }: Props) {
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  const toggleProfileMenu = useCallback(() => {
    setProfileMenuOpen((prev) => !prev);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  return (
    <>
      <header className="sticky top-0 z-10 flex w-full bg-white border-b-gray-200 items-center border-b">
        <div className="w-full flex justify-between items-center sm:px-[20px] py-3.5 px-[15px]">
          <Button
            onClick={onToggleMenu}
            className="w-8.5 h-8.5 hover-scale rounded-lg border border-gray-200 justify-center items-center flex"
          >
            <Menu size={18} />
          </Button>

          <div className="flex gap-[15px] sm:gap-[20px] items-center">
            <Button
              onClick={handleFullscreen}
              className="w-8.5 h-8.5 hover-scale rounded-lg border border-gray-200 justify-center items-center flex relative"
            >
              <Maximize size={18} />
            </Button>

            <ProfileMenu
              onToggleMenu={toggleProfileMenu}
              menuOpen={profileMenuOpen}
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
