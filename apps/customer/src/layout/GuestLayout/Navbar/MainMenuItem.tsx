import { DownOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarLink } from '@nero/query-api-service';

export interface MainMenuItemProps {
  item: NavbarLink;
  depth: number;
}

const MainMenuItem: React.FC<MainMenuItemProps> = (props: MainMenuItemProps) => {
  const [dropdown, setDropdown] = useState(false);
  const { item, depth } = props;
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false);
  };

  return (
    <li
      className="navbar__list-item"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.children.length > 0 ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {item.title}{' '}
            {depth > 0 ? <span>&raquo;</span> : <DownOutlined style={{ fontSize: '9px' }} />}
          </button>
          <ul
            className={`dropdown ${depth > 0 ? 'dropdown-submenu' : ''}  ${dropdown ? 'show' : ''}`}
          >
            {item.children.map((submenu, index) => (
              <MainMenuItem item={submenu} key={index} depth={depth + 1} />
            ))}
          </ul>
        </>
      ) : (
        <>
          {item.link_to ? (
            <Link to={`/${item.link_to.slug}`}>{item.title}</Link>
          ) : (
            <a>{item.title}</a>
          )}
        </>
      )}
    </li>
  );
};

export { MainMenuItem };
