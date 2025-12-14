import { TierRangeSlider } from "@/components/TierRangeSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

export function FilterSection({ 
  selectedPositions, 
  onPositionsChange, 
  showMyPosts, 
  onShowMyPostsChange,
  showMyRequests,
  onShowMyRequestsChange,
  onApplyTierFilter
}) {
  const positions = ["TOP", "MID", "JUG", "BOT", "SUP"];
  
  const [matchType, setMatchType] = useState("ALL");
  const [tierRange, setTierRange] = useState([
    { tier: "IRON", division: "IV", lp: 0 },
    { tier: "DIAMOND", division: "I", lp: 99 },
  ]);

  const handleApplyFilter = () => {
    if (onApplyTierFilter) {
      onApplyTierFilter({
        matchType: matchType === "ALL" ? undefined : matchType,
        tierRange,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 내 게시글 필터 */}
      <Card>
        <CardContent className="pt-6 space-y-2">
          <Button
            className={`w-full ${showMyPosts ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={onShowMyPostsChange}
          >
            내 게시글
          </Button>
          <Button
            className={`w-full ${showMyRequests ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={onShowMyRequestsChange}
          >
            내 요청
          </Button>
        </CardContent>
      </Card>

      {/* 티어 및 매치 타입 필터 - 내 게시글 또는 내 요청 모드에서는 숨김 */}
      {!showMyPosts && !showMyRequests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">티어 필터</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 매치 타입 선택 */}
            <div>
              <label className="text-sm font-medium mb-2 block">매치 종류</label>
              <Select value={matchType} onValueChange={setMatchType}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">전체</SelectItem>
                    <SelectItem value="SOLO_RANK">🏆 솔로랭크</SelectItem>
                    <SelectItem value="FLEX_RANK">🎮 자유랭크</SelectItem>
                    <SelectItem value="OTHER_MODES">⚔️ 기타 모드</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 티어 범위 슬라이더 */}
            <div>
              <label className="text-sm font-medium mb-2 block">티어 범위</label>
              <TierRangeSlider
                matchType={matchType}
                minBoundary={{ tier: "IRON", division: "IV", lp: 0 }}
                maxBoundary={{ tier: "DIAMOND", division: "I", lp: 99 }}
                value={tierRange}
                onChange={setTierRange}
              />
            </div>

            {/* 필터 적용 버튼 */}
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleApplyFilter}
            >
              필터 적용
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 포지션 필터 - 내 게시글 또는 내 요청 모드에서는 숨김 */}
      {!showMyPosts && !showMyRequests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">포지션 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup 
              type="multiple" 
              value={selectedPositions}
              onValueChange={onPositionsChange}
              className="flex flex-col items-stretch gap-2"
            >
              {positions.map((position) => (
                <ToggleGroupItem
                  key={position}
                  value={position}
                  className="w-full justify-center data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  {position}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
