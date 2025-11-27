import { useState } from "react";
import { FilterSection } from "./components/FilterSection";
import { TeamList } from "./components/TeamList";

function FindTeamPage() {
  const [selectedPositions, setSelectedPositions] = useState([]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* 2-Column Grid Layout (왼쪽 필터, 중앙 게시글, 오른쪽 비어있음) */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px] gap-6 items-start">
          {/* 왼쪽: 필터 영역 (모바일에서는 숨김) */}
          <div className="hidden lg:block">
            <FilterSection 
              selectedPositions={selectedPositions}
              onPositionsChange={setSelectedPositions}
            />
          </div>
          
          {/* 가운데: 팀원찾기 게시글 목록 */}
          <TeamList selectedPositions={selectedPositions} />
          
          {/* 오른쪽: 빈 공간 (향후 확장 가능) */}
          <div className="hidden lg:block">
            {/* 빈 공간 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindTeamPage;
