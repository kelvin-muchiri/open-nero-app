import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { NavbarLink } from '@nero/query-api-service';

interface MeanMenuItemProps {
  item: NavbarLink;
  openSubmenus: string[];
  toggleSubmenu: (e: React.MouseEvent<HTMLAnchorElement>, key: string) => void;
}

const MeanMenuItem: React.FC<MeanMenuItemProps> = (props: MeanMenuItemProps) => {
  const { item, openSubmenus, toggleSubmenu } = props;
  const nodeRef = useRef(null);

  return !item.children.length ? (
    <li>
      {item.link_to ? <Link to={`/${item.link_to.slug}`}>{item.title}</Link> : <a>{item.title}</a>}
    </li>
  ) : (
    <li>
      {item.link_to ? <Link to={`/${item.link_to.slug}`}>{item.title}</Link> : <a>{item.title}</a>}
      <CSSTransition
        in={openSubmenus.indexOf(item.id) >= 0}
        timeout={300}
        classNames="meanmenu-list-transition"
        nodeRef={nodeRef}
        unmountOnExit
      >
        <ul ref={nodeRef}>
          {item.children.map((submenu) => (
            <MeanMenuItem
              key={`${item.id}-${submenu.id}`}
              item={submenu}
              openSubmenus={openSubmenus}
              toggleSubmenu={toggleSubmenu}
            />
          ))}
        </ul>
      </CSSTransition>
      <a
        className="mean-expand"
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          toggleSubmenu(e, item.id);
        }}
      >
        {openSubmenus.indexOf(item.id) >= 0 ? '-' : '+'}
      </a>
    </li>
  );
};

export { MeanMenuItem };
