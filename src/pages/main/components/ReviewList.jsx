import { reviewApi } from "@/apis/reviewApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

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

export function ReviewList({ 
  summonerName, 
  tagLine, 
  isLoading: initialLoading = false 
}) {
  const [reviewData, setReviewData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(initialLoading);

  // 리뷰 데이터 로딩
  useEffect(() => {
    const loadReviews = async () => {
      if (!summonerName || !tagLine) return;
      
      try {
        setIsLoading(true);
        const data = await reviewApi.getSummonerReviews(summonerName, tagLine, currentPage);
        setReviewData(data);
      } catch (error) {
        console.error('리뷰 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [summonerName, tagLine, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        리뷰를 불러오는 중...
      </div>
    );
  }

  if (!reviewData || reviewData.totalReviews === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        아직 작성된 리뷰가 없습니다.
      </div>
    );
  }

  const { statistics, reviews } = reviewData;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">받은 리뷰</h2>

      {/* 통계 카드 */}
      {statistics && (
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">
                {statistics.overallAverage.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                총 ({statistics.totalReviews}개의 리뷰)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-8 pr-4 border-r-2 border-gray-300">
                <span className="text-sm font-medium text-gray-700">실력</span>
                <StarRating score={statistics.averageSkill} />
              </div>
              <div className="flex items-center gap-8 pl-4">
                <span className="text-sm font-medium text-gray-700">협동</span>
                <StarRating score={statistics.averageCooperation} />
              </div>
              <div className="flex items-center gap-8 pr-4 border-r-2 border-gray-300">
                <span className="text-sm font-medium text-gray-700">멘탈</span>
                <StarRating score={statistics.averageMental} />
              </div>
              <div className="flex items-center gap-8 pl-4">
                <span className="text-sm font-medium text-gray-700">매너</span>
                <StarRating score={statistics.averageManner} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 리뷰 목록 */}
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {/* 리뷰 작성자 및 날짜 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {review.reviewerName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                    <p className="text-xs text-gray-500">{formatTime(review.createdAt)}</p>
                  </div>
                </div>
                
                {/* 총평 표시 */}
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    {review.overallRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">총평</div>
                </div>
              </div>

              {/* 평점 */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y-2 border-gray-300">
                <div className="flex items-center gap-8 pr-3 border-r-2 border-gray-300">
                  <span className="text-sm text-gray-600">실력</span>
                  <StarRating score={review.skill || 0} />
                </div>
                <div className="flex items-center gap-8 pl-3">
                  <span className="text-sm text-gray-600">협동</span>
                  <StarRating score={review.cooperation || 0} />
                </div>
                <div className="flex items-center gap-8 pr-3 border-r-2 border-gray-300">
                  <span className="text-sm text-gray-600">멘탈</span>
                  <StarRating score={review.mental || 0} />
                </div>
                <div className="flex items-center gap-8 pl-3">
                  <span className="text-sm text-gray-600">매너</span>
                  <StarRating score={review.manner || 0} />
                </div>
              </div>

              {/* 리뷰 내용 */}
              {review.comment && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 페이지네이션 */}
      {reviewData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600">
            {currentPage + 1} / {reviewData.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={reviewData.isLast}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
