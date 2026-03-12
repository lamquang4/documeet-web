import { memo, useState, type ReactNode } from "react";
import Overplay from "../ui/Overplay";
import Image from "../ui/Image";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { LuHistory } from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

type MenuChild = {
  label: string;
  path: string;
};

type MenuItemBase = {
  icon: ReactNode;
  label: string;
};

type MenuItemWithChildren = MenuItemBase & {
  key: string;
  children: MenuChild[];
  path?: never;
};

type MenuItemSingle = MenuItemBase & {
  path: string;
  children?: never;
  key?: never;
};

type MenuItem = MenuItemWithChildren | MenuItemSingle;

type MenuGroup = {
  title?: string;
  items: MenuItem[];
};

function MenuSide({ menuOpen, onToggleMenu }: Props) {
  const location = useLocation();
  const pathname = location.pathname;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuData: MenuGroup[] = [
    {
      title: "Người dùng",
      items: [
        {
          icon: <FiUsers size={20} />,
          label: "Người dùng",
          path: "/users",
        },
        {
          icon: <TbCategoryPlus size={20} />,
          label: "Chức vụ",
          key: "3a",
          children: [
            { label: "Danh sách chức vụ", path: "/roles" },
            { label: "Thêm chức vụ", path: "/role/add-role" },
          ],
        },
      ],
    },
    {
      title: "Đơn vị",
      items: [
        {
          icon: <HiOutlineOfficeBuilding size={20} />,
          label: "Đơn vị",
          key: "3b",
          children: [
            { label: "Danh sách đơn vị", path: "/units" },
            { label: "Thêm đơn vị", path: "/unit/add-unit" },
          ],
        },
      ],
    },
    {
      title: "Hệ thống",
      items: [
        {
          icon: <HiOutlineDevicePhoneMobile size={20} />,
          label: "Thiết bị đăng ký",
          path: "/devices",
        },
        {
          icon: <LuHistory size={20} />,
          label: "Nhật ký",
          path: "/logs",
        },
      ],
    },
  ];

  const toggleOpen = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      <nav
        className={` ${menuOpen ? "left-0" : "left-[-100%]"} 
        ${
          menuOpen ? "xl:translate-x-[-100%] xl:p-0 xl:w-0" : "xl:translate-x-0"
        } custom-scroll fixed border top-0 h-screen w-[320px] pb-5 bg-white transition-all duration-350 ease-in-out z-100 xl:sticky overflow-y-auto border-b border-gray-200`}
      >
        <div className="mb-[20px] flex justify-center sticky top-0 bg-white px-3.5 py-4.5">
          <Image
            source={"/assets/logo.png"}
            alt=""
            className="w-[80px]"
            loading="eager"
          />
        </div>
        <ul className="flex flex-col gap-[15px] font-semibold px-3.5">
          {menuData.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-[10px]">
              {group.title && <p className="  uppercase">{group.title}</p>}
              {group.items.map((item, index) => (
                <li key={index}>
                  {item.children ? (
                    <>
                      <div
                        onClick={() => toggleOpen(item.key)}
                        className={`${
                          openMenus[item.key] ||
                          item.children.some((child) => pathname === child.path)
                            ? "text-primary"
                            : "hover:bg-gray-100"
                        } rounded-lg p-3 w-full cursor-pointer flex justify-between items-center`}
                      >
                        <p className="font-medium flex items-center gap-[10px]">
                          {item.icon} {item.label}
                        </p>
                        <button>
                          {openMenus[item.key] ||
                          item.children.some(
                            (child) => pathname === child.path,
                          ) ? (
                            <IoIosArrowDown size={18} />
                          ) : (
                            <IoIosArrowUp size={18} />
                          )}
                        </button>
                      </div>
                      <ul
                        className={`max-h-0 overflow-hidden invisible transition-all duration-600 ease-in-out pl-[25px] ${
                          openMenus[item.key] ||
                          item.children.some((child) => pathname === child.path)
                            ? "max-h-fit visible"
                            : ""
                        }`}
                      >
                        {item.children.map((child, childIndex) => (
                          <li
                            key={childIndex}
                            className={`rounded-lg w-full cursor-pointer my-[5px] ${
                              pathname === child.path
                                ? "text-white bg-primary"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Link
                              to={child.path}
                              className="text-[0.9rem] font-medium p-3"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`${
                        pathname === item.path
                          ? "text-white bg-primary"
                          : "hover:bg-gray-100"
                      } rounded-lg p-3 w-full cursor-pointer flex justify-between items-center`}
                    >
                      <p className="font-medium flex items-center gap-[10px]">
                        {item.icon} {item.label}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </div>
          ))}
        </ul>
      </nav>

      {menuOpen && <Overplay onClose={onToggleMenu} />}
    </>
  );
}

export default memo(MenuSide);
