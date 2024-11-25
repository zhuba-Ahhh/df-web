import { Link } from 'react-router-dom';
import { Image } from 'antd';

const Navbar = () => {
  return (
    <ul className="navbar bg-base-100 text-base-content fixed top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 shadow-sm p-3 bg-background/95 supports-[backdrop-filter]:bg-background/40">
      <li>
        <Link to="/" className="text-2xl font-bold">
          <Image
            height={20}
            preview={false}
            src="https://game.gtimg.cn/images/dfm/cp/a20240906fab/s1_logo.png"
          ></Image>
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
