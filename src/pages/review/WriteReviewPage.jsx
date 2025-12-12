import { reviewApi } from '@/apis/reviewApi';
import { findTeamApi } from '@/apis/findTeamApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRatingInput } from '@/components/StarRatingInput';
import { ArrowLeft, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const postId = searchParams.get('postId');
  const mode = searchParams.get('mode'); // 'author' or 'requester'

  const [post, setPost] = useState(null);
  const [targets, setTargets] = useState([]);
  const [reviews, setReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      if (!postId || !mode) {
        setError('잘못된 접근입니다.');
        setIsLoading(false);
        return;
      }

      try {
        // 게시글 정보와 요청 목록 조회
        const postData = await findTeamApi.getPost(postId);
        setPost(postData);

        // 리뷰 대상자 추출
        let reviewTargets = [];
        
        if (mode === 'author') {
          // 게시글 작성자 입장: 수락된 요청자들을 대상으로
          const requestsData = await findTeamApi.getRequests(postId);
          reviewTargets = requestsData
            .filter(req => req.isAccepted)
            .map(req => ({
              username: req.writer,
              userId: req.writerId, // 백엔드에서 userId 제공 필요
            }));
        } else if (mode === 'requester') {
          // 요청자 입장: 게시글 작성자를 대상으로
          reviewTargets = [{
            username: postData.writer,
            userId: postData.writerId, // 백엔드에서 userId 제공 필요
          }];
        }

        setTargets(reviewTargets);

        // 각 대상자별 리뷰 초기화
        const initialReviews = {};
        reviewTargets.forEach(target => {
          initialReviews[target.username] = {
            revieweeId: target.userId,
            comment: '',
            skill: 0,
            cooperation: 0,
            mental: 0,
            manner: 0,
            canReview: true, // 일단 true로 설정, 실제로는 백엔드에서 확인 필요
          };
        });
        setReviews(initialReviews);

      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [postId, mode]);

  // 별점 변경 핸들러
  const handleRatingChange = (username, field, value) => {
    setReviews(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        [field]: value,
      },
    }));
  };

  // 코멘트 변경 핸들러
  const handleCommentChange = (username, value) => {
    setReviews(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        comment: value,
      },
    }));
  };

  // 총평 계산
  const calculateOverall = (review) => {
    const sum = review.skill + review.cooperation + review.mental + review.manner;
    return (sum / 4).toFixed(1);
  };

  // 유효성 검사
  const validateReviews = () => {
    for (const username in reviews) {
      const review = reviews[username];
      if (!review.canReview) continue;

      if (!review.comment.trim()) {
        alert(`${username}님에 대한 코멘트를 입력해주세요.`);
        return false;
      }

      if (review.skill === 0 || review.cooperation === 0 || 
          review.mental === 0 || review.manner === 0) {
        alert(`${username}님에 대한 모든 평가 항목을 입력해주세요. (최소 1점)`);
        return false;
      }
    }
    return true;
  };

  // 리뷰 제출
  const handleSubmit = async () => {
    if (!validateReviews()) return;

    setIsSubmitting(true);
    try {
      // 작성 가능한 리뷰들만 필터링
      const reviewsToSubmit = Object.values(reviews).filter(r => r.canReview);

      // 각 리뷰를 순차적으로 제출
      for (const review of reviewsToSubmit) {
        await reviewApi.createReview({
          revieweeId: review.revieweeId,
          comment: review.comment,
          skill: review.skill,
          cooperation: review.cooperation,
          mental: review.mental,
          manner: review.manner,
        });
      }

      alert('리뷰가 작성되었습니다.');
      navigate('/findTeam');

    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      
      // 409 에러 처리 (중복 리뷰)
      if (error.response?.status === 409) {
        alert('한 유저에게는 한 달에 한 번만 리뷰를 남길 수 있습니다.');
      } else {
        alert('리뷰 작성에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-10 text-red-600">{error}</div>
        <div className="text-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">리뷰 작성</h1>
            <p className="text-sm text-gray-600 mt-1">
              게시글: {post?.title}
            </p>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <p className="text-sm text-purple-900">
            • 각 항목은 1~5점으로 평가해주세요. (0점은 선택 불가)
          </p>
          <p className="text-sm text-purple-900">
            • 한 유저에게는 한 달에 한 번만 리뷰를 남길 수 있습니다.
          </p>
          <p className="text-sm text-purple-900">
            • 총평은 4가지 항목의 평균으로 자동 계산됩니다.
          </p>
        </CardContent>
      </Card>

      {/* 리뷰 카드들 */}
      {targets.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            리뷰 대상자가 없습니다.
          </CardContent>
        </Card>
      ) : (
        targets.map((target) => {
          const review = reviews[target.username];
          
          // 이미 리뷰한 경우
          if (!review?.canReview) {
            return (
              <Card key={target.username} className="bg-gray-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    {target.username}
                  </p>
                  <p className="text-gray-500">이미 리뷰했습니다</p>
                </CardContent>
              </Card>
            );
          }

          // 리뷰 작성 카드
          return (
            <Card key={target.username}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{target.username}</span>
                  <span className="text-sm font-normal text-purple-600">
                    예상 총평: {calculateOverall(review)}점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 평가 항목들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 실력 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      실력
                    </label>
                    <StarRatingInput
                      value={review.skill}
                      onChange={(value) => handleRatingChange(target.username, 'skill', value)}
                    />
                  </div>

                  {/* 협동 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      협동
                    </label>
                    <StarRatingInput
                      value={review.cooperation}
                      onChange={(value) => handleRatingChange(target.username, 'cooperation', value)}
                    />
                  </div>

                  {/* 멘탈 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      멘탈
                    </label>
                    <StarRatingInput
                      value={review.mental}
                      onChange={(value) => handleRatingChange(target.username, 'mental', value)}
                    />
                  </div>

                  {/* 매너 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      매너
                    </label>
                    <StarRatingInput
                      value={review.manner}
                      onChange={(value) => handleRatingChange(target.username, 'manner', value)}
                    />
                  </div>
                </div>

                {/* 코멘트 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    코멘트
                  </label>
                  <textarea
                    className="w-full min-h-[120px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="플레이어에 대한 평가를 자유롭게 작성해주세요."
                    value={review.comment}
                    onChange={(e) => handleCommentChange(target.username, e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* 제출 버튼 */}
      {targets.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              '작성 중...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                리뷰 작성 완료
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
