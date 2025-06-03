import { Link } from 'react-router-dom';
import { MapIcon } from 'assets/svg/MapIcon';
import { SettingIcon } from 'assets/svg/SettingIcon';
import { useAppContext } from 'contexts/AppProvider';
import { MenuFoldIcon } from './icons/MenuFoldIcon';
import { ThreadIcon } from 'assets/svg/Thread';
import { CollectIcon } from './icons/CollectIcon';
import { WeekReportIcon } from './icons/WeekReportIcon';

const Navbar = () => {
  const context = useAppContext();
  return (
    <ul className="navbar bg-base-100 text-base-content fixed top-0 z-30 flex h-16 w-full justify-between bg-opacity-90 backdrop-blur transition-shadow duration-100 shadow-sm p-3 px-6 bg-background/95 supports-[backdrop-filter]:bg-background/40">
      <li>
        <button
          onClick={context?.toggleMenu}
          className="p-2 hover:bg-theme-primary rounded-lg transition-colors mr-1"
        >
          <MenuFoldIcon
            className={`w-6 h-6 text-gray-200 transition-transform ${
              context?.isMenuCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
        <Link to="/" className="text-2xl font-bold mr-1 p-2">
          <img
            alt="logo"
            style={{ height: 24 }}
            src="https://game.gtimg.cn/images/dfm/favicon.ico"
          ></img>
        </Link>
        <Link to="/week-report" className="text-2xl font-bold">
          <button className="p-2 hover:bg-theme-primary rounded-lg mr-1">
            <WeekReportIcon className={`w-6 h-6 text-gray-200`} />
          </button>
        </Link>
        <Link to="/collect" className="text-2xl font-bold">
          <button className="p-2 hover:bg-theme-primary rounded-lg mr-1">
            <CollectIcon className={`w-6 h-6 text-gray-200`} />
          </button>
        </Link>
      </li>
      <li>
        <Link to="/thread" className="text-2xl font-bold">
          <ThreadIcon />
        </Link>
        <Link to="/map" className="text-2xl font-bold ml-4">
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
