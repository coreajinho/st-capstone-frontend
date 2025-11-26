import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, TrendingUp } from "lucide-react";
import { useState } from "react";

export function TrendingSection() {
  const [activeTab, setActiveTab] = useState("views");

  const trendingPosts = [
    { rank: 1, title: "페이커의 역대 최고 플레이 TOP 10", votes: 324, views: 5420 },
    { rank: 2, title: "T1 vs GenG 결승전 하이라이트", votes: 298, views: 4890 },
    { rank: 3, title: "챔피언 티어 순위 (최신판)", votes: 267, views: 3845 },
    { rank: 4, title: "초보자가 꼭 알아야 할 10가지", votes: 245, views: 3521 },
    { rank: 5, title: "롤드컵 우승 예측", votes: 223, views: 3210 },
    { rank: 6, title: "정글러 캐리하는 법", votes: 198, views: 2876 },
    { rank: 7, title: "신규 스킨 출시 소식", votes: 187, views: 2645 },
    { rank: 8, title: "LCK 봄 시즌 전망", votes: 165, views: 2398 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          실시간 인기글
        </CardTitle>
        
        {/* 탭 버튼 */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("views")}
            className={activeTab === "views" ? "bg-purple-100 text-purple-700 border-purple-300" : ""}
          >
            조회수순
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("votes")}
            className={activeTab === "votes" ? "bg-purple-100 text-purple-700 border-purple-300" : ""}
          >
            <Gavel className="h-4 w-4 mr-1" />
            판결갯수순
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {trendingPosts
            .sort((a, b) => 
              activeTab === "views" ? b.views - a.views : b.votes - a.votes
            )
            .map((post, index) => (
              <div
                key={post.rank}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* 순위 */}
                <div
                  className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                    index < 3
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>

                {/* 제목 및 통계 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 mb-1">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>조회 {post.views.toLocaleString()}</span>
                    <span>·</span>
                    <span>판결 {post.votes}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
