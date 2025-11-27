// [TEMP_UI_TEST] 백엔드 구현 전 주석처리
// eslint-disable-next-line no-unused-vars
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    content: '',
    writer: '',
    preferredPosition: ''
  });
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editRequest, setEditRequest] = useState({
    content: '',
    writer: '',
    preferredPosition: ''
  });

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      alert('삭제 기능은 백엔드 구현 후 사용 가능합니다.');
      // try {
      //   await teamApi.deletePost(id);
      //   alert('게시글이 삭제되었습니다.');
      //   navigate('/findTeam');
      // } catch (err) {
      //   alert('게시글 삭제에 실패했습니다.');
      //   console.error(err);
      // }
    }
  };

  // 요청 삭제 핸들러
  const handleRequestDelete = async (requestId) => {
    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리
    if (window.confirm('정말로 이 요청을 삭제하시겠습니까?')) {
      console.log('Delete request:', requestId);
      alert('삭제 기능은 백엔드 구현 후 사용 가능합니다.');
      // try {
      //   await teamApi.deleteRequest(id, requestId);
      //   const updatedRequests = await teamApi.getRequests(id);
      //   setRequests(updatedRequests);
      //   alert('요청이 삭제되었습니다.');
      // } catch (err) {
      //   alert('요청 삭제에 실패했습니다.');
      //   console.error(err);
      // }
    }
  };

  // 요청 수정 시작
  const handleRequestEditStart = (request) => {
    setEditingRequestId(request.id);
    setEditRequest({
      content: request.content,
      writer: request.writer,
      preferredPosition: request.preferredPosition
    });
  };

  // 요청 수정 취소
  const handleRequestEditCancel = () => {
    setEditingRequestId(null);
    setEditRequest({
      content: '',
      writer: '',
      preferredPosition: ''
    });
  };

  // 요청 수정 제출
  const handleRequestEditSubmit = async (requestId) => {
    if (!editRequest.content.trim() || !editRequest.writer.trim() || !editRequest.preferredPosition) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리
    console.log('Edit request:', requestId, editRequest);
    alert('수정 기능은 백엔드 구현 후 사용 가능합니다.');
    handleRequestEditCancel();
    // try {
    //   await teamApi.updateRequest(id, requestId, editRequest);
    //   const updatedRequests = await teamApi.getRequests(id);
    //   setRequests(updatedRequests);
    //   handleRequestEditCancel();
    //   alert('요청이 수정되었습니다.');
    // } catch (err) {
    //   alert('요청 수정에 실패했습니다.');
    //   console.error(err);
    // }
  };

  // 요청 작성
  const handleRequestSubmit = async () => {
    if (!newRequest.content.trim() || !newRequest.writer.trim() || !newRequest.preferredPosition) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리
    alert('요청 작성 기능은 백엔드 구현 후 사용 가능합니다.');
    setNewRequest({ content: '', writer: '', preferredPosition: '' });
    setShowRequestForm(false);
    // try {
    //   await teamApi.createRequest(id, newRequest);
    //   const updatedRequests = await teamApi.getRequests(id);
    //   setRequests(updatedRequests);
    //   setNewRequest({ content: '', writer: '', preferredPosition: '' });
    //   setShowRequestForm(false);
    //   alert('요청이 작성되었습니다.');
    // } catch (err) {
    //   alert('요청 작성에 실패했습니다.');
    //   console.error(err);
    // }
  };

  // 요청 수락 핸들러
  const handleAcceptRequest = async (requestId) => {
    if (window.confirm('이 요청을 수락하시겠습니까?')) {
      // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 - 더미 데이터로 시뮬레이션
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, isAccepted: true } : req
      ).sort((a, b) => b.isAccepted - a.isAccepted);
      
      const acceptedRequest = requests.find(req => req.id === requestId);
      const updatedAcceptedTags = [...(post.acceptedTags || []), acceptedRequest.preferredPosition];
      
      setRequests(updatedRequests);
      setPost({ ...post, acceptedTags: updatedAcceptedTags });
      alert('요청이 수락되었습니다. (UI 테스트용)');
      
      // try {
      //   await teamApi.acceptRequest(id, requestId);
      //   const [updatedPost, updatedRequests] = await Promise.all([
      //     teamApi.getPost(id),
      //     teamApi.getRequests(id)
      //   ]);
      //   setPost(updatedPost);
      //   setRequests(updatedRequests);
      //   alert('요청이 수락되었습니다.');
      // } catch (err) {
      //   alert('요청 수락에 실패했습니다.');
      //   console.error(err);
      // }
    }
  };

  // 데이터 Fetching
  useEffect(() => {
    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리 시작
    // const fetchData = async () => {
    //   try {
    //     setIsLoading(true);
    //     const [postData, requestsData] = await Promise.all([
    //       teamApi.getPost(id),
    //       teamApi.getRequests(id)
    //     ]);
    //     setPost(postData);
    //     setRequests(requestsData);
    //   } catch (err) {
    //     setError("게시글을 불러오는 데 실패했습니다.");
    //     console.error(err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // if (id) {
    //   fetchData();
    // }

    // 더미 데이터
    const dummyPost = {
      id: Number(id),
      title: "다이아 탑 라이너 구합니다!",
      content: "안녕하세요!\n\n현재 클래시 팀을 구성하고 있습니다.\n탑과 미드 포지션을 모집하고 있어요.\n\n티어: 다이아 이상\n시간대: 평일 저녁 9시 이후\n디스코드 필수\n\n관심있으신 분들은 요청 남겨주세요!",
      writer: "소환사1",
      tags: ["TOP", "MID"],
      acceptedTags: ["MID"],
      views: 120,
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    };

    const dummyRequests = [
      {
        id: 1,
        writer: "탑고인물",
        content: "다이아2 탑 라이너입니다. 주로 세트, 가렌 플레이합니다.",
        preferredPosition: "TOP",
        isAccepted: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      },
      {
        id: 2,
        writer: "미드신",
        content: "제드, 야스오 원챔입니다. 클래시 경험 많아요!",
        preferredPosition: "MID",
        isAccepted: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
      },
      {
        id: 3,
        writer: "탑라이너지망생",
        content: "플레1인데 실력은 다이아급입니다. 기회 주세요!",
        preferredPosition: "TOP",
        isAccepted: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: 4,
        writer: "탑챔프올줄암",
        content: "모든 탑 챔피언 가능합니다. 평일 저녁 시간 완벽하네요.",
        preferredPosition: "TOP",
        isAccepted: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
      }
    ];

    setPost(dummyPost);
    setRequests(dummyRequests);
    setIsLoading(false);
    // [TEMP_UI_TEST] 백엔드 구현 전 UI 테스트용 주석처리 끝
  }, [id]);

  // 수락된 포지션인지 확인
  const isPositionAccepted = (position) => {
    return post?.acceptedTags?.includes(position) || false;
  };

  // 사용 가능한 포지션 필터링 (수락되지 않은 포지션만)
  const availablePositions = post?.tags?.filter(tag => !isPositionAccepted(tag)) || [];

  if (isLoading) return <div className="p-12 text-center">로딩 중...</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-12 text-center">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 뒤로가기 및 수정/삭제 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate("/findTeam")}>
          ← 목록으로 돌아가기
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/findTeam/${id}/edit`)}
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

      {/* 게시글 헤더 및 내용 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`px-2 py-1 text-xs rounded-md font-bold ${
                      isPositionAccepted(tag)
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {tag}
                    {isPositionAccepted(tag) && ' ✓'}
                  </span>
                ))}
              </div>
              <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
              {post.status && (
                <div className="mt-2">
                  {post.status === "EXPIRED" && (
                    <span className="px-3 py-1 bg-gray-400 text-white text-sm rounded-md font-bold">만료됨</span>
                  )}
                  {post.status === "PENDING_EXPIRATION" && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-md font-bold">만료 대기</span>
                  )}
                </div>
              )}
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>작성자: {post.writer}</p>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              <p>조회수: {post.views}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 border-t space-y-4">
          <div className="min-h-[200px] whitespace-pre-wrap text-gray-800">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {/* 요청 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              요청 ({requests.length})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="text-purple-600 hover:bg-purple-50"
              disabled={availablePositions.length === 0}
            >
              {showRequestForm ? '취소' : '새 요청'}
            </Button>
          </div>
          {availablePositions.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">모든 포지션이 수락되어 요청을 작성할 수 없습니다.</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 새 요청 작성 폼 */}
            {showRequestForm && availablePositions.length > 0 && (
              <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">작성자</label>
                    <input
                      type="text"
                      value={newRequest.writer}
                      onChange={(e) => setNewRequest({...newRequest, writer: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="작성자 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">희망 포지션</label>
                    <ToggleGroup
                      type="single"
                      value={newRequest.preferredPosition}
                      onValueChange={(value) => setNewRequest({...newRequest, preferredPosition: value})}
                      className="flex-row justify-start gap-2"
                    >
                      {availablePositions.map((position) => (
                        <ToggleGroupItem
                          key={position}
                          value={position}
                          className="px-4 py-1 text-sm rounded-full data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                        >
                          {position}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">요청 내용</label>
                    <textarea
                      value={newRequest.content}
                      onChange={(e) => setNewRequest({...newRequest, content: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md resize-none"
                      rows="3"
                      placeholder="요청 내용을 입력하세요"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowRequestForm(false);
                        setNewRequest({ content: '', writer: '', preferredPosition: '' });
                      }}
                    >
                      취소
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleRequestSubmit}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      제출
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {requests.length === 0 ? (
              <p className="text-center text-gray-500 py-4">첫 번째 요청을 남겨보세요!</p>
            ) : (
              requests.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-4 rounded-lg ${
                    request.isAccepted ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50'
                  }`}
                >
                  {editingRequestId === request.id ? (
                    // 수정 모드
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1">작성자</label>
                        <input
                          type="text"
                          value={editRequest.writer}
                          onChange={(e) => setEditRequest({...editRequest, writer: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">희망 포지션</label>
                        <ToggleGroup
                          type="single"
                          value={editRequest.preferredPosition}
                          onValueChange={(value) => setEditRequest({...editRequest, preferredPosition: value})}
                          className="flex-row justify-start gap-2"
                        >
                          {[...availablePositions, request.preferredPosition].filter((v, i, a) => a.indexOf(v) === i).map((position) => (
                            <ToggleGroupItem
                              key={position}
                              value={position}
                              className="px-4 py-1 text-sm rounded-full data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                            >
                              {position}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">요청 내용</label>
                        <textarea
                          value={editRequest.content}
                          onChange={(e) => setEditRequest({...editRequest, content: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md resize-none"
                          rows="3"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRequestEditCancel}
                        >
                          취소
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleRequestEditSubmit(request.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          수정 완료
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{request.writer}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                            {request.preferredPosition}
                          </span>
                          {request.isAccepted && (
                            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-green-600 text-white">
                              <Check className="w-3 h-3" />
                              수락됨
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{request.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          {!request.isAccepted && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAcceptRequest(request.id)}
                                className="text-green-600 hover:bg-green-50 h-7 px-2 text-xs"
                              >
                                수락
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRequestEditStart(request)}
                                className="text-purple-600 hover:bg-purple-50 h-7 px-2 text-xs"
                              >
                                수정
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRequestDelete(request.id)}
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

export default TeamDetailPage;
