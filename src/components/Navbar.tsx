import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { MapIcon } from 'assets/svg/MapIcon';
import { SettingIcon } from 'assets/svg/SettingIcon';
import { useContext } from 'react';
import { Context } from 'App';
import { MenuFoldIcon } from './icons/MenuFoldIcon';

const Navbar = () => {
  const context = useContext(Context);
  return (
    <ul className="navbar bg-base-100 text-base-content fixed top-0 z-30 flex h-16 w-full justify-between bg-opacity-90 backdrop-blur transition-shadow duration-100 shadow-sm p-3 px-6 bg-background/95 supports-[backdrop-filter]:bg-background/40">
      <li>
        <button
          onClick={context?.toggleMenu}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors mr-4"
        >
          <MenuFoldIcon
            className={`w-6 h-6 text-gray-200 transition-transform ${
              context?.isMenuCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
        <Link to="/" className="text-2xl font-bold">
          <Image
            height={20}
            preview={false}
            src="https://game.gtimg.cn/images/dfm/cp/a20240906fab/s1_logo.png"
          ></Image>
        </Link>
      </li>
      <li>
        <Link to="/map" className="text-2xl font-bold">
          <MapIcon />
        </Link>
        <Link to="/setting" className="text-2xl font-bold ml-4">
          <SettingIcon />
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
