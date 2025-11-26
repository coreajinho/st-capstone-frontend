import logo from "@/assets/images/simpleLogo.png";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-purple-500 ">
      <div className="flex items-center justify-between h-full px-12 py-2 mx-auto">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Fair.GG Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* 로그인 버튼 */}
        <Button variant="outline" className="h-10 px-6">
          로그인
        </Button>
      </div>
    </header>
  );
}