import logo from "@/assets/images/simpleLogo.png";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-[12.5vh]">
      <div className="max-w-[1500px] mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* 로고 영역 */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Fair.GG Logo"
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold text-[#95049a]">Fair.GG</h1>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex items-center">
            <Button variant="outline" className="h-10 px-6">
              로그인
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}