import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FilterSection({ 
  selectedPositions, 
  onPositionsChange, 
  showMyPosts, 
  onShowMyPostsChange,
  showMyVotes,
  onShowMyVotesChange
}) {
  const positions = ["TOP", "MID", "JUG", "BOT", "SUP"];

  return (
    <div className="space-y-4">
      {/* 내 게시글/투표 필터 */}
      <Card>
        <CardContent className="pt-6 space-y-2">
          <Button
            className={`w-full ${showMyPosts ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={onShowMyPostsChange}
          >
            내 게시글
          </Button>
          <Button
            className={`w-full ${showMyVotes ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={onShowMyVotesChange}
          >
            내 투표
          </Button>
        </CardContent>
      </Card>

      {/* 포지션 필터 - 내 게시글 또는 내 투표 모드에서는 숨김 */}
      {!showMyPosts && !showMyVotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">포지션 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup 
              type="multiple" 
              value={selectedPositions}
              onValueChange={onPositionsChange}
              className="flex-col items-stretch gap-2"
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
