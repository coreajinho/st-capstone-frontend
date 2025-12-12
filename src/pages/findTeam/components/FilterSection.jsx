import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FilterSection({ 
  selectedPositions, 
  onPositionsChange, 
  showMyPosts, 
  onShowMyPostsChange,
  showMyRequests,
  onShowMyRequestsChange
}) {
  const positions = ["TOP", "MID", "JUG", "BOT", "SUP"];

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
