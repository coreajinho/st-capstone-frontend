import { debateApi } from "@/apis/debateApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DebateDetailPage() {
  const { id } = useParams(); // URL에서 id 파라미터 추출
  const navigate = useNavigate();

  // 상태 관리
  const [post, setPost] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    writer: '',
    debateSide: 'PLAYER_1'
  });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editComment, setEditComment] = useState({
    content: '',
    writer: '',
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

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await debateApi.deleteComment(id, commentId);
        
        // 댓글 목록과 투표 현황 동시 새로고침
        const [updatedComments, updatedVoteResult] = await Promise.all([
          debateApi.getComments(id),
          debateApi.getVoteResult(id)
        ]);
        
        setComments(updatedComments);
        setVoteResult(updatedVoteResult);
        alert('댓글이 삭제되었습니다.');
      } catch (err) {
        alert('댓글 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  // 댓글 수정 시작 핸들러
  const handleCommentEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditComment({
      content: comment.content,
      writer: comment.writer,
      debateSide: comment.debateSide
    });
  };

  // 댓글 수정 취소 핸들러
  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditComment({
      content: '',
      writer: '',
      debateSide: 'PLAYER_1'
    });
  };

  // 댓글 수정 제출 핸들러
  const handleCommentEditSubmit = async (commentId) => {
    if (!editComment.content.trim() || !editComment.writer.trim()) {
      alert('내용과 작성자를 모두 입력해주세요.');
      return;
    }

    try {
      await debateApi.updateComment(id, commentId, {
        ...editComment,
        debatePostId: Number(id)
      });
      
      // 댓글 목록과 투표 현황 동시 새로고침
      const [updatedComments, updatedVoteResult] = await Promise.all([
        debateApi.getComments(id),
        debateApi.getVoteResult(id)
      ]);
      
      setComments(updatedComments);
      setVoteResult(updatedVoteResult);
      
      // 수정 모드 종료
      handleCommentEditCancel();
      alert('댓글이 수정되었습니다.');
    } catch (err) {
      alert('댓글 수정에 실패했습니다.');
      console.error(err);
    }
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.content.trim() || !newComment.writer.trim()) {
      alert('내용과 작성자를 모두 입력해주세요.');
      return;
    }

    try {
      await debateApi.createComment(id, {
        ...newComment,
        debatePostId: Number(id)
      });
      
      // 댓글 목록과 투표 현황 동시 새로고침
      const [updatedComments, updatedVoteResult] = await Promise.all([
        debateApi.getComments(id),
        debateApi.getVoteResult(id)
      ]);
      
      setComments(updatedComments);
      setVoteResult(updatedVoteResult);
      
      // 폼 초기화 및 닫기
      setNewComment({ content: '', writer: '', debateSide: 'PLAYER_1' });
      setShowCommentForm(false);
      alert('댓글이 작성되었습니다.');
    } catch (err) {
      alert('댓글 작성에 실패했습니다.');
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. 뒤로가기 및 수정 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate("/debate")}>
          ← 목록으로 돌아가기
        </Button>
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
      </div>

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
                <span className="text-blue-600">PLAYER 1 ({voteResult.player1Percent.toFixed(1)}%)</span>
                <span className="text-red-600">PLAYER 2 ({voteResult.player2Percent.toFixed(1)}%)</span>
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

      {/* 4. 댓글 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              댓글 ({comments.length})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="text-purple-600 hover:bg-purple-50"
            >
              {showCommentForm ? '취소' : '새 댓글'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 새 댓글 작성 폼 */}
            {showCommentForm && (
              <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">작성자</label>
                    <input
                      type="text"
                      value={newComment.writer}
                      onChange={(e) => setNewComment({...newComment, writer: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="작성자 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">입장 선택</label>
                    <select
                      value={newComment.debateSide}
                      onChange={(e) => setNewComment({...newComment, debateSide: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="PLAYER_1">PLAYER 1</option>
                      <option value="PLAYER_2">PLAYER 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">댓글 내용</label>
                    <textarea
                      value={newComment.content}
                      onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md resize-none"
                      rows="3"
                      placeholder="댓글을 입력하세요"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment({ content: '', writer: '', debateSide: 'PLAYER_1' });
                      }}
                    >
                      취소
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleCommentSubmit}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      제출
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">첫 번째 댓글을 남겨보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  {editingCommentId === comment.id ? (
                    // 수정 모드
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1">작성자</label>
                        <input
                          type="text"
                          value={editComment.writer}
                          onChange={(e) => setEditComment({...editComment, writer: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="작성자 이름을 입력하세요"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">입장 선택</label>
                        <select
                          value={editComment.debateSide}
                          onChange={(e) => setEditComment({...editComment, debateSide: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="PLAYER_1">PLAYER 1</option>
                          <option value="PLAYER_2">PLAYER 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">댓글 내용</label>
                        <textarea
                          value={editComment.content}
                          onChange={(e) => setEditComment({...editComment, content: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md resize-none"
                          rows="3"
                          placeholder="댓글을 입력하세요"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCommentEditCancel}
                        >
                          취소
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleCommentEditSubmit(comment.id)}
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
                        <span className="font-semibold text-sm">{comment.writer}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          comment.debateSide === 'PLAYER_1' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {comment.debateSide}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentEditStart(comment)}
                            className="text-purple-600 hover:bg-purple-50 h-7 px-2 text-xs"
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentDelete(comment.id)}
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