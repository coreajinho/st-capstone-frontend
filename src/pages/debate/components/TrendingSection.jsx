import { debateApi } from "@/apis/debateApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function TrendingSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("VIEWS");
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 인기 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPopularPosts = async () => {
      setIsLoading(true);
      try {
        const data = await debateApi.getPopularPosts(activeTab);
        setTrendingPosts(data);
      } catch (error) {
        console.error('인기 게시글 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPosts();
  }, [activeTab]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex text-lg font-semibold items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          실시간 인기글
        </CardTitle>
        
        {/* 탭 버튼 */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("VIEWS")}
            className={activeTab === "VIEWS" ? "bg-purple-100 text-purple-700 border-purple-300" : ""}
          >
            조회수순
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("COMMENTS")}
            className={activeTab === "COMMENTS" ? "bg-purple-100 text-purple-700 border-purple-300" : ""}
          >
            <Gavel className="h-4 w-4 mr-1" />
            판결갯수순
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : (
        <div className="space-y-3">
          {trendingPosts.map((post, index) => (
              <div
                key={post.rank}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/debate/${post.id}`)}
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
                    <span>판결 {post.commentCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
