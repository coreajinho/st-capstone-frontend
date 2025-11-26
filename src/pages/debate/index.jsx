import { useState } from "react";
import { DebateList } from "./components/DebateList";
import { FilterSection } from "./components/FilterSection";
import { TrendingSection } from "./components/TrendingSection";

function DebatePage() {
  const [selectedPositions, setSelectedPositions] = useState([]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px] gap-6 items-start">
          {/* 왼쪽: 정렬 영역 (모바일에서는 숨김) */}
          <div className="hidden lg:block">
            <FilterSection 
              selectedPositions={selectedPositions}
              onPositionsChange={setSelectedPositions}
            />
          </div>
          
          {/* 가운데: 토론게시글 목록 */}
          <DebateList selectedPositions={selectedPositions} />
          
          {/* 오른쪽: 실시간 인기글 (모바일에서는 숨김) */}
          <div className="hidden lg:block">
            <TrendingSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebatePage;
