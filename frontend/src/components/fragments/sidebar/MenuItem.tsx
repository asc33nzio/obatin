import Link from "next/link";
import { usePathname } from 'next/navigation'
import { MenuItem as MenuItemType } from "@/constants/menu-items";
import { MenuItemContainer, MenuItems } from "@/styles/elements/MenuItem.styles";
import MenuItemsList from "./MenuItemList";
import ExpandIcon from "./ExpandIcon";
import { useState } from "react";

type MenuItemProps = {
  menuItem: MenuItemType,
};

export default function MenuItem({
  menuItem: { name, icon: Icon, url, depth, subItems },
}: MenuItemProps) {
  const [isExpanded, toggleExpanded] = useState(false);

  const router = usePathname();
  const selected = router === url;
  const isNested = subItems && subItems?.length > 0;

  const onClick = () => {
    toggleExpanded((prev) => !prev);
  };

  return (
    <>
      <MenuItemContainer className={selected ? "selected" : ""} $depth={depth}>
        <Link href={url} passHref>
          <MenuItems>
            <Icon />
            <span>{name}</span>
          </MenuItems>
        </Link>
        {isNested ? (
          <ExpandIcon isExpanded={isExpanded} handleClick={onClick} />
        ) : null}
      </MenuItemContainer>
      {isExpanded && isNested ? <MenuItemsList options={subItems} /> : null}
    </>
  );
}