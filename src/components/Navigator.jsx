import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

function Navigator() {
  return (
    <nav className="border-b bg-purple-600 px-5 py-3">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-4 px-12">
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                홈
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/debate">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                토론 게시판
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/findTeam">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                팀원 찾기
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default Navigator;