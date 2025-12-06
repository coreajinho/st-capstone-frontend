import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function FilterSection({ selectedPositions, onPositionsChange }) {
  const positions = ["TOP", "MID", "JUG", "BOT", "SUP"];

  return (
    <div className="space-y-4">
      {/* 포지션 필터 */}
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
    </div>
  );
}
