import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function ProfileCard({ summonerData, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {/* 소환사 아이콘 */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 bg-gray-200">
              {summonerData?.profileIconId ? (
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${summonerData.profileIconId}.png`}
                  alt="소환사 아이콘"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
            {/* 레벨 표시 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {summonerData?.summonerLevel || 0}
            </div>
          </div>

          {/* 소환사명 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {summonerData?.name || '소환사명'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              #{summonerData?.tagLine || 'KR1'}
            </p>
          </div>

          {/* 전적 갱신 버튼 */}
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '갱신 중...' : '전적 갱신'}
          </Button>

          {/* 기본 정보 */}
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">최근 업데이트</span>
              <span className="font-medium text-gray-900">
                {summonerData?.lastUpdated 
                  ? new Date(summonerData.lastUpdated).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
