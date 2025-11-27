import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// 별점 표시 컴포넌트 (읽기 전용)
function StarRating({ score, maxScore = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(maxScore)].map((_, index) => {
        const fillPercent = Math.min(Math.max(score - index, 0), 1) * 100;
        return (
          <div key={index} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 fill-gray-300" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 시간 포맷팅 헬퍼 함수
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000 / 60; // 분 단위 차이

  if (diff < 60) return `${Math.floor(diff)}분 전`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`;
  return date.toLocaleDateString('ko-KR');
};

export function ReviewList({ reviews = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        리뷰를 불러오는 중...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        아직 작성된 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">받은 리뷰</h2>
      
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {/* 리뷰 작성자 및 날짜 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {review.writer?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.writer}</p>
                    <p className="text-xs text-gray-500">{formatTime(review.createdAt)}</p>
                  </div>
                </div>
                
                {/* 매칭 정보 (옵션) */}
                {review.matchType && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {review.matchType}
                  </span>
                )}
              </div>

              {/* 평점 */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">실력</span>
                  <StarRating score={review.skillRating || 0} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">협동</span>
                  <StarRating score={review.teamworkRating || 0} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">멘탈</span>
                  <StarRating score={review.mentalRating || 0} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">매너</span>
                  <StarRating score={review.mannerRating || 0} />
                </div>
              </div>

              {/* 리뷰 내용 */}
              {review.content && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              )}

              {/* 게임 정보 (옵션) */}
              {review.gameInfo && (
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  {review.gameInfo.champion && (
                    <span>챔피언: {review.gameInfo.champion}</span>
                  )}
                  {review.gameInfo.position && (
                    <span>포지션: {review.gameInfo.position}</span>
                  )}
                  {review.gameInfo.result && (
                    <span className={review.gameInfo.result === 'WIN' ? 'text-blue-600' : 'text-red-600'}>
                      {review.gameInfo.result === 'WIN' ? '승리' : '패배'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
