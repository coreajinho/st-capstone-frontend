import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/simpleLogo.png";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthProvider";

export function Header() {
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-purple-500 ">
      <div className="flex items-center justify-between h-full px-12 py-2 mx-auto">
        {/* 로고 영역 */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Fair.GG Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* 로그인/로그아웃 영역 */}
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">
              {user?.riotName}#{user?.riotTag}
            </span>
            <Button variant="outline" className="h-10 px-6" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        ) : (
          <Link to="/auth/login" state={{ from: location.pathname }}>
            <Button variant="outline" className="h-10 px-6">
              로그인
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}