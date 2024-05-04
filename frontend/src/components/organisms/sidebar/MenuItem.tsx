import {
  MenuItemContainer,
  MenuItems,
} from '@/styles/organisms/sidebar/MenuItem.styles';
import { usePathname } from 'next/navigation';
import { MenuItem as MenuItemType } from '@/constants/menu-items';
import { useState } from 'react';
import Link from 'next/link';
import MenuItemsList from './MenuItemList';
import ExpandIcon from './ExpandIcon';

type MenuItemProps = {
  menuItem: MenuItemType;
  handler?: () => void;
};

export default function MenuItem({
  menuItem: { name, icon: Icon, url, depth, subItems },
  handler,
}: MenuItemProps) {
  const [isExpanded, toggleExpanded] = useState(false);

  const router = usePathname();
  const selected = router === url;
  const isNested = subItems && subItems?.length > 0;

  const handleSidebarToggle = () => {
    toggleExpanded((prev) => !prev);
  };

  return (
    <>
      <MenuItemContainer
        className={selected ? 'selected' : ''}
        $depth={depth}
        onClick={handler}
      >
        <Link href={url} passHref>
          <MenuItems>
            <Icon />
            <span>{name}</span>
          </MenuItems>
        </Link>
        {isNested ? (
          <ExpandIcon
            isExpanded={isExpanded}
            handleClick={handleSidebarToggle}
          />
        ) : null}
      </MenuItemContainer>
      {isExpanded && isNested ? <MenuItemsList options={subItems} /> : null}
    </>
  );
}
