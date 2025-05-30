import { agentsNameMap } from 'common/const';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 定义菜单项类型
type MenuItem = {
  key: string;
  label: string;
  children?: MenuItem[];
};

const items: MenuItem[] = [
  {
    key: 'info',
    label: '我的',
  },
  {
    key: 'thread',
    label: '密码',
  },
  {
    key: 'collect',
    label: '收藏',
  },
  {
    key: 'week-report',
    label: '周报',
  },
  {
    key: 'agent',
    label: '干员',
    children: agentsNameMap,
  },
  {
    key: 'props',
    label: '道具',
    children: [
      { key: 'collection', label: '收集品' },
      {
        key: 'consume',
        label: '消耗品',
        // children: [
        //   {
        //     key: 'repair',
        //     label: '维修套件',
        //   },
        //   {
        //     key: 'drug',
        //     label: '药品',
        //   },
        //   {
        //     key: 'inject',
        //     label: '针剂',
        //   },
        // ],
      },
      { key: 'key', label: '钥匙' },
      { key: 'mandel', label: '曼德尔砖' },
    ],
  },
  {
    key: 'arms',
    label: '武器',
    children: [
      {
        key: 'gunRifle',
        label: '步枪',
      },
      {
        key: 'gunSMG',
        label: '冲锋枪',
      },
      {
        key: 'gunPistol',
        label: '手枪',
      },
      {
        key: 'gunLMG',
        label: '轻机枪',
      },
      {
        key: 'gunSniper',
        label: '狙击步枪',
      },
      {
        key: 'gunMP',
        label: '精确射手步枪',
      },
      {
        key: 'gunShotgun',
        label: '霰弹枪',
      },
    ],
  },
  {
    key: 'protect',
    label: '装备',
    children: [
      { key: 'helmet', label: '头盔' },
      { key: 'chest', label: '胸挂' },
      { key: 'armor', label: '护甲' },
      { key: 'bag', label: '背包' },
    ],
  },

  {
    key: 'acc',
    label: '配件',
    children: [
      {
        key: 'accForeGrip',
        label: '前握把',
      },
      {
        key: 'accFunctional',
        label: '功能性配件',
      },
      {
        key: 'accBackGrip',
        label: '后握把',
      },
      {
        key: 'accMagazine',
        label: '弹匣',
      },
      {
        key: 'accHandGuard',
        label: '护木',
      },
      {
        key: 'accMuzzle',
        label: '枪口',
      },
      {
        key: 'accStock',
        label: '枪托',
      },
      {
        key: 'accBarrel',
        label: '枪管',
      },
      {
        key: 'accScope',
        label: '瞄具',
      },
    ],
  },
  {
    key: 'secret',
    label: '特勤处',
    children: [
      { key: 'upgrade', label: '升级' },
      { key: 'making', label: '制造' },
    ],
  },
  {
    key: 'map',
    label: '资源地图',
    children: [{ key: 's1', label: '地图' }],
  },
];

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const pathnameArr = pathname.trim().replace(/^\//, '').split('/');
  const [activeKey, setActiveKey] = useState(
    pathnameArr.length > 0 && pathnameArr[pathnameArr.length - 1] !== ''
      ? pathnameArr[pathnameArr.length - 1]
      : 'info'
  );
  const renderMenu = (items: MenuItem[]) => (
    <ul className="menu bg-base-200 p-0 [&_li>*]:rounded-none">
      {items.map((item) => (
        <li
          key={item.key}
          onClick={() => {
            setActiveKey(item.key);
            navigate(`/${item.key}`);
          }}
        >
          <a className={`${activeKey === item.key ? 'active' : ''}`}>{item.label}</a>
          {item?.children && (
            <ul>
              {item.children.map(({ key, label, children }) => (
                <li
                  key={key}
                  onClick={(event) => {
                    setActiveKey(key);
                    navigate(`/${item.key}/${key}`);
                    event.stopPropagation();
                  }}
                >
                  <a className={`${activeKey === key ? 'active' : ''}`}>{label}</a>
                  {children && (
                    <ul>
                      {children.map(({ key: childrenKey, label: childrenLabel }) => (
                        <li
                          key={childrenKey}
                          onClick={(event) => {
                            setActiveKey(childrenKey);
                            navigate(`/${item.key}/${key}/${childrenKey}`);
                            event.stopPropagation();
                          }}
                        >
                          <a className={`${activeKey === key ? 'active' : ''}`}>{childrenLabel}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return renderMenu(items);
};

export default Menu;
