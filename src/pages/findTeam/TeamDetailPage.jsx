import { findTeamApi } from "@/apis/findTeamApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthProvider";
import { Check, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [newRequestContent, setNewRequestContent] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingPosition, setEditingPosition] = useState("");

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData, requestsData] = await Promise.all([
          findTeamApi.getPost(id),
          findTeamApi.getRequests(id),
        ]);
        setPost(postData);
        setRequests(requestsData);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 요청 등록
  const handleCreateRequest = async () => {
    if (!newRequestContent.trim()) {
      alert("요청 내용을 입력해주세요.");
      return;
    }
    if (!selectedPosition) {
      alert("희망 포지션을 선택해주세요.");
      return;
    }

    try {
      await findTeamApi.createRequest(id, {
        content: newRequestContent,
        writer: user?.username,
        writerId: user?.id,
        desiredTag: selectedPosition,
      });
      const updatedRequests = await findTeamApi.getRequests(id);
      setRequests(updatedRequests);
      setNewRequestContent("");
      setSelectedPosition("");
    } catch (error) {
      console.error("요청 등록 실패:", error);
      alert("요청 등록에 실패했습니다.");
    }
  };

  // 요청 수정 시작
  const startEditRequest = (request) => {
    setEditingRequestId(request.id);
    setEditingContent(request.content);
    setEditingPosition(request.desiredTag);
  };

  // 요청 수정 저장
  const handleUpdateRequest = async (requestId) => {
    if (!editingContent.trim()) {
      alert("요청 내용을 입력해주세요.");
      return;
    }
    if (!editingPosition) {
      alert("희망 포지션을 선택해주세요.");
      return;
    }

    try {
      await findTeamApi.updateRequest(id, requestId, {
        content: editingContent,
        writer: user?.username,
        writerId: user?.id,
        desiredTag: editingPosition,
      });
      const updatedRequests = await findTeamApi.getRequests(id);
      setRequests(updatedRequests);
      setEditingRequestId(null);
      setEditingContent("");
      setEditingPosition("");
    } catch (error) {
      console.error("요청 수정 실패:", error);
      alert("요청 수정에 실패했습니다.");
    }
  };

  // 요청 삭제
  const handleDeleteRequest = async (requestId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await findTeamApi.deleteRequest(id, requestId);
      const updatedRequests = await findTeamApi.getRequests(id);
      setRequests(updatedRequests);
    } catch (error) {
      console.error("요청 삭제 실패:", error);
      alert("요청 삭제에 실패했습니다.");
    }
  };

  // 요청 수락
  const handleAcceptRequest = async (requestId) => {
    try {
      await findTeamApi.toggleAcceptance(id, requestId);
      const [updatedPost, updatedRequests] = await Promise.all([
        findTeamApi.getPost(id),
        findTeamApi.getRequests(id),
      ]);
      setPost(updatedPost);
      setRequests(updatedRequests);
    } catch (error) {
      console.error("요청 수락 실패:", error);
      alert("요청 수락에 실패했습니다.");
    }
  };

  // 요청 수락 취소
  const handleCancelAcceptRequest = async (requestId) => {
    try {
      await findTeamApi.toggleAcceptance(id, requestId);
      const [updatedPost, updatedRequests] = await Promise.all([
        findTeamApi.getPost(id),
        findTeamApi.getRequests(id),
      ]);
      setPost(updatedPost);
      setRequests(updatedRequests);
    } catch (error) {
      console.error("요청 수락 취소 실패:", error);
      alert("요청 수락 취소에 실패했습니다.");
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await findTeamApi.deletePost(id);
      navigate("/findTeam");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 시간 포맷팅
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000 / 60;

    if (diff < 60) return `${Math.floor(diff)}분 전`;
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`;
    if (diff < 60 * 24 * 7) return `${Math.floor(diff / 60 / 24)}일 전`;
    if (diff < 60 * 24 * 30) return `${Math.floor(diff / 60 / 24 / 7)}주 전`;
    if (diff < 60 * 24 * 365) return `${Math.floor(diff / 60 / 24 / 30)}달 전`;
    return `${Math.floor(diff / 60 / 24 / 365)}년 전`;
  };

  // 포지션별로 요청 필터링 - acceptedTags는 Map 객체
  const getAvailablePositions = () => {
    if (!post) return [];
    return post.tags.filter(
      (tag) => !post.acceptedTags || !post.acceptedTags[tag]
    );
  };

  if (isLoading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || "게시글을 찾을 수 없습니다."}</p>
        <Button
          className="mt-4"
          onClick={() => navigate("/findTeam")}
        >
          목록으로
        </Button>
      </div>
    );
  }

  const availablePositions = getAvailablePositions();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 게시글 내용 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {(user?.id === post.writerId || user?.role === 'ADMIN') && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/findTeam/${id}/edit`)}
                >
                  수정
                </Button>
                <Button variant="destructive" onClick={handleDeletePost}>
                  삭제
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>{post.writer}</span>
            <span>{formatTime(post.createdAt)}</span>
            <span>조회 {post.views}</span>
            {post.status === "PENDING" && post.pendingExpirationAt && (
              <span className="text-orange-600 font-medium">
                매칭 예정: {new Date(post.pendingExpirationAt).toLocaleString('ko-KR')}
              </span>
            )}
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              {post.tags.map((tag, index) => {
                const isAccepted = post.acceptedTags && post.acceptedTags[tag];
                return (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      isAccepted
                        ? "bg-gray-300 text-gray-600"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {tag}
                    {isAccepted && " ✓"}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* 요청 작성 폼 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            팀원 요청하기
          </h2>

          {availablePositions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              현재 모든 포지션이 수락되어 요청을 등록할 수 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  희망 포지션
                </label>
                <ToggleGroup
                  type="single"
                  value={selectedPosition}
                  onValueChange={(value) => setSelectedPosition(value || "")}
                  className="justify-start"
                >
                  {availablePositions.map((position) => (
                    <ToggleGroupItem key={position} value={position} className="px-6">
                      {position}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md"
                placeholder="요청 내용을 입력하세요"
                value={newRequestContent}
                onChange={(e) => setNewRequestContent(e.target.value)}
              />

              <div className="flex justify-end">
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleCreateRequest}
                >
                  요청 등록
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 요청 목록 */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          요청 목록 ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              아직 요청이 없습니다.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className={request.isAccepted ? "border-2 border-green-600 bg-green-50" : ""}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base">{request.writer}</span>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                          request.isAccepted
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {request.desiredTag}
                      </span>
                      {request.isAccepted && (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <Check className="h-4 w-4" />
                          수락됨
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {formatTime(request.createdAt)}
                      </span>
                      {!request.isAccepted ? (
                        <>
                          {(user?.id === request.writerId || user?.role === 'ADMIN') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditRequest(request)}
                              >
                                수정
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                삭제
                              </Button>
                            </>
                          )}
                          {(user?.id === post.writerId || user?.role === 'ADMIN') && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              수락
                            </Button>
                          )}
                        </>
                      ) : (
                        (user?.id === post.writerId || user?.role === 'ADMIN') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-50"
                            onClick={() => handleCancelAcceptRequest(request.id)}
                          >
                            수락 취소
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  {editingRequestId === request.id ? (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          희망 포지션
                        </label>
                        <ToggleGroup
                          type="single"
                          value={editingPosition}
                          onValueChange={(value) => setEditingPosition(value || "")}
                          className="justify-start"
                        >
                          {availablePositions.map((position) => (
                            <ToggleGroupItem
                              key={position}
                              value={position}
                              className="px-6"
                            >
                              {position}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>

                      <textarea
                        className="w-full min-h-[100px] p-3 border rounded-md"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />

                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRequestId(null);
                            setEditingContent("");
                            setEditingPosition("");
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleUpdateRequest(request.id)}
                        >
                          저장
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-gray-700">
                      {request.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={() => navigate("/findTeam")}>
          목록으로
        </Button>
      </div>
    </div>
  );
}
