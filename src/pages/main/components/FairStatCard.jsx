import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

// 별점 표시 컴포넌트
function StarRating({ score, maxScore = 5 }) {
  return (
    <div className="flex gap-1">
      {[...Array(maxScore)].map((_, index) => {
        const fillPercent = Math.min(Math.max(score - index, 0), 1) * 100;
        return (
          <div key={index} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-gray-300 fill-gray-300" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FairStatCard({ fairStats, hasUserAccount = false }) {
  // fairStats가 없거나 user 계정이 없는 경우 (가입되지 않은 사용자)
  const isUnregistered = !hasUserAccount || !fairStats;

  return (
    <Card className={`h-full ${isUnregistered ? 'bg-gray-50 opacity-60' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-purple-600">
          Fair Stat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isUnregistered ? (
          // 가입되지 않은 사용자 메시지
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-center">
              가입된 사용자가 아닙니다.
            </p>
          </div>
        ) : (
          <>
            {/* 판결 이력 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">판결 이력</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {fairStats?.totalJudgments || 0}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">참여한 판결</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {fairStats?.wonJudgments || 0}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">승리한 판결</div>
                </div>
              </div>
            </div>

            {/* 리뷰 평균 스탯 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">리뷰 평균 스탯</h3>
              <div className="space-y-3">
                {/* 실력 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 w-16">실력</span>
                  <div className="flex-1 ml-3">
                    <StarRating score={fairStats?.skillRating || 0} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2 w-8">
                    {(fairStats?.skillRating || 0).toFixed(1)}
                  </span>
                </div>

                {/* 협동 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 w-16">협동</span>
                  <div className="flex-1 ml-3">
                    <StarRating score={fairStats?.teamworkRating || 0} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2 w-8">
                    {(fairStats?.teamworkRating || 0).toFixed(1)}
                  </span>
                </div>

                {/* 멘탈 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 w-16">멘탈</span>
                  <div className="flex-1 ml-3">
                    <StarRating score={fairStats?.mentalRating || 0} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2 w-8">
                    {(fairStats?.mentalRating || 0).toFixed(1)}
                  </span>
                </div>

                {/* 매너 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 w-16">매너</span>
                  <div className="flex-1 ml-3">
                    <StarRating score={fairStats?.mannerRating || 0} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2 w-8">
                    {(fairStats?.mannerRating || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* 리뷰 개수 */}
              <div className="text-center pt-2 border-t">
                <span className="text-xs text-gray-500">
                  총 {fairStats?.totalReviews || 0}개의 리뷰
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
