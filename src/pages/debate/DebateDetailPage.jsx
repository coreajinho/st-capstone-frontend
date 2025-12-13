import { debateApi } from "@/apis/debateApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";
import { useAuth } from "@/contexts/AuthProvider";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DebateDetailPage() {
  const { id } = useParams(); // URL에서 id 파라미터 추출
  const navigate = useNavigate();
  const { user } = useAuth();

  // 상태 관리
  const [post, setPost] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJudgementForm, setShowJudgementForm] = useState(false);
  const [newJudgement, setNewJudgement] = useState({
    content: '',
    debateSide: 'PLAYER_1'
  });
  const [editingJudgementId, setEditingJudgementId] = useState(null);
  const [editJudgement, setEditJudgement] = useState({
    content: '',
    debateSide: 'PLAYER_1'
  });

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await debateApi.deletePost(id);
        alert('게시글이 삭제되었습니다.');
        navigate('/debate');
      } catch (err) {
        alert('게시글 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  // 판결 삭제 핸들러
  const handleJudgementDelete = async (judgementId) => {
    if (window.confirm('정말로 이 판결을 삭제하시겠습니까?')) {
      try {
        await debateApi.deleteComment(id, judgementId);
        
        // 판결 목록과 투표 현황 동시 새로고침
        const [updatedComments, updatedVoteResult] = await Promise.all([
          debateApi.getComments(id),
          debateApi.getVoteResult(id)
        ]);
        
        setComments(updatedComments);
        setVoteResult(updatedVoteResult);
        alert('판결이 삭제되었습니다.');
      } catch (err) {
        alert('판결 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  // 판결 수정 시작 핸들러
  const handleJudgementEditStart = (judgement) => {
    setEditingJudgementId(judgement.id);
    setEditJudgement({
      content: judgement.content,
      debateSide: judgement.debateSide
    });
  };

  // 판결 수정 취소 핸들러
  const handleJudgementEditCancel = () => {
    setEditingJudgementId(null);
    setEditJudgement({
      content: '',
      debateSide: 'PLAYER_1'
    });
  };

  // 판결 수정 제출 핸들러
  const handleJudgementEditSubmit = async (judgementId) => {
    if (!editJudgement.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      await debateApi.updateComment(id, judgementId, {
        ...editJudgement,
        writerId: user?.id,
        debatePostId: Number(id)
      });
      
      // 판결 목록과 투표 현황 동시 새로고침
      const [updatedComments, updatedVoteResult] = await Promise.all([
        debateApi.getComments(id),
        debateApi.getVoteResult(id)
      ]);
      
      setComments(updatedComments);
      setVoteResult(updatedVoteResult);
      
      // 수정 모드 종료
      handleJudgementEditCancel();
      alert('판결이 수정되었습니다.');
    } catch (err) {
      alert('판결 수정에 실패했습니다.');
      console.error(err);
    }
  };

  // 판결 작성 핸들러
  const handleJudgementSubmit = async () => {
    if (!newJudgement.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      await debateApi.createComment(id, {
        ...newJudgement,
        writerId: user?.id,
        debatePostId: Number(id)
      });
      
      // 판결 목록과 투표 현황 동시 새로고침
      const [updatedComments, updatedVoteResult] = await Promise.all([
        debateApi.getComments(id),
        debateApi.getVoteResult(id)
      ]);
      
      setComments(updatedComments);
      setVoteResult(updatedVoteResult);
      
      // 폼 초기화 및 닫기
      setNewJudgement({ content: '', debateSide: 'PLAYER_1' });
      setShowJudgementForm(false);
      alert('판결이 작성되었습니다.');
    } catch (err) {
      alert('판결 작성에 실패했습니다.');
      console.error(err);
    }
  };

  // 데이터 Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 병렬 요청으로 성능 최적화 (Promise.all)
        const [postData, voteData, commentsData] = await Promise.all([
          debateApi.getPost(id),
          debateApi.getVoteResult(id),
          debateApi.getComments(id)
        ]);

        setPost(postData);
        setVoteResult(voteData);
        setComments(commentsData);
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // 로딩 및 에러 상태 처리
  if (isLoading) return <div className="p-12 text-center">로딩 중...</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-12 text-center">게시글을 찾을 수 없습니다.</div>;

  // 상태별 배지 정보
  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE':
        return { variant: 'active', text: '진행중' };
      case 'PENDING':
        return { variant: 'pending', text: '연장전' };
      case 'EXPIRED':
        return { variant: 'expired', text: '종료' };
      default:
        return { variant: 'default', text: '진행중' };
    }
  };

  // 남은 시간 계산
  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expire = new Date(expiresAt);
    const diff = expire - now;
    
    if (diff <= 0) return '만료됨';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}일 ${hours % 24}시간 남음`;
    }
    
    return `${hours}시간 ${minutes}분 남음`;
  };

  const statusInfo = getStatusBadge(post.debateStatus);
  const timeRemaining = getTimeRemaining(post.expiresAt);
  const isExpired = post.debateStatus === 'EXPIRED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. 뒤로가기 및 수정 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate("/debate")}>
          ← 목록으로 돌아가기
        </Button>
        {!isExpired && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/debate/${id}/edit`)}
              className="text-purple-600 hover:bg-purple-50"
            >
              수정
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-50"
            >
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* 토론 상태 및 시간 정보 */}
      <Card className={isExpired ? 'bg-gray-50' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={statusInfo.variant} className="text-base px-4 py-1">
                {statusInfo.text}
              </Badge>
              {post.debateStatus === 'PENDING' && post.totalExtensionTimeHours > 0 && (
                <span className="text-sm text-orange-600 font-medium">
                  ⏰ 연장전 진행 중 (총 {post.totalExtensionTimeHours}시간 연장됨)
                </span>
              )}
            </div>
            {timeRemaining && !isExpired && (
              <div className="text-sm font-medium text-gray-700">
                {timeRemaining}
              </div>
            )}
            {isExpired && (
              <div className="text-sm font-medium text-gray-500">
                토론이 종료되었습니다
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. 게시글 헤더 및 내용 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-bold">
                    {tag}
                  </span>
                ))}
              </div>
              <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>작성자: {post.writer}</p>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              <p>조회수: {post.views}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 border-t space-y-4">
          {/* 비디오 플레이어 */}
          {post.videoUrl && (
            <div className="mb-6">
              <VideoPlayer videoUrl={post.videoUrl} />
            </div>
          )}
          
          {/* 게시글 내용 */}
          <div className="min-h-[200px] whitespace-pre-wrap text-gray-800">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {/* 3. 투표 현황 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>실시간 투표 현황</CardTitle>
        </CardHeader>
        <CardContent>
          {voteResult && (
            <div className="space-y-2">
              <div className="flex justify-between font-bold mb-2">
                <span className="text-blue-600">
                  {post.writer} ({voteResult.player1Percent.toFixed(1)}%)
                </span>
                <span className="text-red-600">
                  {post.coWriter || '상대방'} ({voteResult.player2Percent.toFixed(1)}%)
                </span>
              </div>
              {/* 커스텀 프로그레스 바 */}
              <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-500 h-full transition-all duration-1000"
                  style={{ width: `${voteResult.player1Percent}%` }}
                />
                <div 
                  className="bg-red-500 h-full transition-all duration-1000"
                  style={{ width: `${voteResult.player2Percent}%` }}
                />
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                총 {voteResult.totalCount}명 참여
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. 판결 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              판결 ({comments.length})
            </CardTitle>
            {!isExpired && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowJudgementForm(!showJudgementForm)}
                className="text-purple-600 hover:bg-purple-50"
              >
                {showJudgementForm ? '취소' : '새 판결'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isExpired && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center text-gray-600">
              토론이 종료되어 더 이상 투표하실 수 없습니다.
            </div>
          )}
          <div className="space-y-4">
            {/* 새 판결 작성 폼 */}
            {showJudgementForm && (
              <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">입장 선택</label>
                    <select
                      value={newJudgement.debateSide}
                      onChange={(e) => setNewJudgement({...newJudgement, debateSide: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="PLAYER_1">{post.writer}</option>
                      <option value="PLAYER_2">{post.coWriter || '상대방'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">판결 내용</label>
                    <textarea
                      value={newJudgement.content}
                      onChange={(e) => setNewJudgement({...newJudgement, content: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md resize-none"
                      rows="3"
                      placeholder="판결을 입력하세요"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowJudgementForm(false);
                        setNewJudgement({ content: '', debateSide: 'PLAYER_1' });
                      }}
                    >
                      취소
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleJudgementSubmit}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      제출
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">첫 번째 판결을 남겨보세요!</p>
            ) : (
              comments.map((judgement) => (
                <div key={judgement.id} className="p-4 bg-gray-50 rounded-lg">
                  {editingJudgementId === judgement.id ? (
                    // 수정 모드
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1">입장 선택</label>
                        <select
                          value={editJudgement.debateSide}
                          onChange={(e) => setEditJudgement({...editJudgement, debateSide: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="PLAYER_1">{post.writer}</option>
                          <option value="PLAYER_2">{post.coWriter || '상대방'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">판결 내용</label>
                        <textarea
                          value={editJudgement.content}
                          onChange={(e) => setEditJudgement({...editJudgement, content: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md resize-none"
                          rows="3"
                          placeholder="판결을 입력하세요"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleJudgementEditCancel}
                        >
                          취소
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleJudgementEditSubmit(judgement.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          수정 완료
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">{judgement.writer}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          judgement.debateSide === 'PLAYER_1' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {judgement.debateSide === 'PLAYER_1' ? post.writer : (post.coWriter || '상대방')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{judgement.content}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {new Date(judgement.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJudgementEditStart(judgement)}
                            className="text-purple-600 hover:bg-purple-50 h-7 px-2 text-xs"
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJudgementDelete(judgement.id)}
                            className="text-red-600 hover:bg-red-50 h-7 px-2 text-xs"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DebateDetailPage;